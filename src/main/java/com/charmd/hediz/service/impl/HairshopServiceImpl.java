package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.HairshopDAO;
import com.charmd.hediz.dto.*;
import com.charmd.hediz.service.HairshopService;
import io.swagger.models.auth.In;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public List<StaffDTO> findStaff(int shop_seq) {
        return dao.findStaff(shop_seq);
    }

    @Override
    public List<ReviewDTO> findReview(int shop_seq) {
        return dao.findReview(shop_seq);
    }

    @Override
    public Map<Integer, TreeSet<LocalTime>> reservationFilter(HashMap<String, Object> reservationFilterMap) {
        List<ReservationDTO> list = dao.reservationFilter(reservationFilterMap);
        System.out.println(list);
        Map<Integer, TreeSet<LocalTime>> possibleTime = new HashMap<>();
        // 예약된 시간에서 제거
        for (ReservationDTO reservation : list) {
            int staff_seq = reservation.getStaff_seq();
            if (!possibleTime.containsKey(staff_seq)) {
                TreeSet<LocalTime> fullSet = new TreeSet<>();
                LocalTime time = reservation.getShop_start();
                while (time.isBefore(reservation.getShop_end())) {
                    fullSet.add(time);
                    time = time.plusMinutes(30);
                }
                possibleTime.put(staff_seq, fullSet);
            }
            if (reservation.getReserv_seq() != 0) {  // 예약이 있을 경우만 예약 시간을 제거합니다.
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
        System.out.println(possibleTime);
        return possibleTime;
    }

    @Override
    public int reservation(ReservationDTO reservationDto) {
        return dao.reservation(reservationDto);
    }

    @Override
    public int payment(PaymentDTO paymentDto) {
        return dao.payment(paymentDto);
    }
}
