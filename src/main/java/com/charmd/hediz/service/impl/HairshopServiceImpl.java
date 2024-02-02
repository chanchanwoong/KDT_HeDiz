package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.HairshopDAO;
import com.charmd.hediz.dto.*;
import com.charmd.hediz.service.HairshopService;
import io.swagger.models.auth.In;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service("hairshopService")
public class HairshopServiceImpl implements HairshopService {
    @Autowired
    HairshopDAO dao;

    @Override
    public HairshopDTO findHairshop(int shop_seq) {
        return dao.findHairshop(shop_seq);
    }

    @Override
    public List<HairstyleDTO> findHairstyle(int shop_seq) {
        return dao.findHairstyle(shop_seq);
    }

    @Override
    public HairstyleDTO findHairstyleInfor(HashMap<String, Integer> shopAndStyleMap) {
        return dao.findHairstyleInfor(shopAndStyleMap);
    }

    @Override
    public List<StaffDTO> findAllStaff(int shop_seq) {
        return dao.findAllStaff(shop_seq);
    }

    @Override
    public StaffDTO findStaff(HashMap<String, Integer> shopSeqAndStaffSeqMap) {
        return dao.findStaff(shopSeqAndStaffSeqMap);
    }

    @Override
    public List<ReviewDTO> findReview(int shop_seq) {
        return dao.findReview(shop_seq);
    }

    @Override
    public Map<Integer, TreeSet<LocalTime>> reservationFilter(HashMap<String, Object> reservationFilterMap) {
        Map<Integer, TreeSet<LocalTime>> possibleTime = new HashMap<>();
        // shop_seq, day를 가지고 T_TEMPDAY_SHOP 휴무일 필터링
        // 0이면 미용실 휴무일이 아님
        int isShopTempday = dao.isShopTempday(reservationFilterMap);

        // isShopTempday = 0이면 (미용실 휴무일이 아니면) 가능한 시간들 필터링
        if (isShopTempday == 0) {
            List<ReservationDTO> list = dao.reservationFilter(reservationFilterMap);
            // 예약된 시간에서 제거
            for (ReservationDTO reservation : list) {
                int staff_seq = reservation.getStaff_seq();
                // staff_seq, day를 가지고 T_TEMPDAY_STAFF 휴무일 필터링
                // 0이면 직원 휴무일이 아님
                HashMap<String, Object> staffSeqAndDayMap = new HashMap<>();
                staffSeqAndDayMap.put("staff_seq", staff_seq);
                staffSeqAndDayMap.put("day", reservationFilterMap.get("day"));
                int isStaffTempday = dao.isStaffTempday(staffSeqAndDayMap);

                // isStaffTempday == 0 인 경우(휴무일이 아닌 경우) 가능한 시간 필터링
                if (!possibleTime.containsKey(staff_seq)) {
                    TreeSet<LocalTime> fullSet = new TreeSet<>();
                    if(isStaffTempday == 0 ) {
                        LocalTime time = reservation.getShop_start();
                        while (time.isBefore(reservation.getShop_end())) {
                            fullSet.add(time);
                            time = time.plusMinutes(30);
                        }
                    }
                    possibleTime.put(staff_seq, fullSet);
                }
                if (isStaffTempday == 0 && reservation.getReserv_seq() != 0) {  // 예약이 있을 경우만 예약 시간을 제거합니다.
                    LocalTime shop_start = reservation.getShop_start();
                    LocalTime shop_end = reservation.getShop_end();
                    LocalTime reserv_time = reservation.getReserv_time();
                    LocalTime reserv_end_time = reservation.getReserv_end_time();
                    Duration hope_style_time = Duration.ofHours(reservation.getHope_style_time().getHour()).plusMinutes(reservation.getHope_style_time().getMinute());
                    LocalTime current_time = shop_start;
                    while (current_time.plus(hope_style_time).compareTo(shop_end) <= 0) {
                        if (current_time.compareTo(reserv_time) >= 0 && current_time.compareTo(reserv_end_time) < 0) {
                            possibleTime.get(staff_seq).remove(current_time);
                        } else if (current_time.plus(hope_style_time).compareTo(reserv_time) > 0 && current_time.plus(hope_style_time).compareTo(reserv_end_time) <= 0) {
                            possibleTime.get(staff_seq).remove(current_time);
                        }
                        current_time = current_time.plusMinutes(30);  // 30분 단위로 검사합니다.
                    }
                }
            }
            // 마감 시간 이후의 시간을 제거
            for (ReservationDTO reservation : list) {
                int staff_seq = reservation.getStaff_seq();
                LocalTime shop_end = reservation.getShop_end();
                Duration hope_style_time = Duration.ofHours(reservation.getHope_style_time().getHour()).plusMinutes(reservation.getHope_style_time().getMinute());

                TreeSet<LocalTime> times = possibleTime.get(staff_seq);
                times.removeIf(time -> time.plus(hope_style_time).compareTo(shop_end) > 0);
            }
        }
        return possibleTime;
    }

    @Override
    public PayinfoDTO getPayinfo(PayinfoDTO payinfoDto) {
        return dao.getPayinfo(payinfoDto);
    }

    @Override
    @Transactional
    // 예약인 경우는 결제 데이터, 예약 데이터 저장
    public int reservation(PayinfoDTO payinfoDto) {
        int numberOfReservation = 0;
        int numberOfPay = 0;
        System.out.println("넣기 전 payinfoDto > " + payinfoDto);

        // T_RESERVATION에 넣을 데이터 : style_seq, cust_seq, shop_seq, reserv_request,
        // reserv_date, reserv_time, reserv_stat(0으로 가야함), receipt_id, staff_seq
        numberOfReservation = dao.reservation(payinfoDto);

        // reserv_seq는 위 과정에서 나온 결과를 넣어야 함.
        int reserv_seq = dao.findReservSeq(payinfoDto);
        payinfoDto.setReserv_seq(reserv_seq);

        // T_payment에 넣은 데이터 : shop_seq, cust_seq, reserv_seq, pay_price, pay_date, pay_stat
        numberOfPay = dao.payment(payinfoDto);
        return numberOfReservation + numberOfPay;
    }

    // 대기인 경우는 예약 데이터만 저장
    @Override
    public int standBy(PayinfoDTO payinfoDto) {
        int numberOfReservation = 0;
        numberOfReservation = dao.reservation(payinfoDto);
        return numberOfReservation;
    }
}
