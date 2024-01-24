package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.HairshopDAO;
import com.charmd.hediz.dto.*;
import com.charmd.hediz.service.HairshopService;
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
    public Map<String, Map<String, Set<LocalTime>>> reservationFilter(HashMap<String, Object> reservationFilterMap) {
        List<ReservationDTO> list = dao.reservationFilter(reservationFilterMap);
        System.out.println(list);
        Map<String, Map<String, Set<LocalTime>>> possibleTime = new HashMap<>();
        // 예약된 시간에서 제거
        for (ReservationDTO reservation : list) {
            String date = String.valueOf(reservation.getReserv_date());
            String staff = reservation.getStaff_nickname();
            if (!possibleTime.containsKey(staff)) {
                possibleTime.put(staff, new HashMap<>());
            }
            if (!possibleTime.get(staff).containsKey(date)) {
                Set<LocalTime> fullSet = new HashSet<>();
                LocalTime time = reservation.getShop_start();
                while (time.isBefore(reservation.getShop_end())) {
                    fullSet.add(time);
                    time = time.plusMinutes(30);
                }
                possibleTime.get(staff).put(date, fullSet);
            }
            LocalTime shop_start = reservation.getShop_start();
            LocalTime shop_end = reservation.getShop_end();
            LocalTime reserv_time = reservation.getReserv_time();
            LocalTime reserv_end_time = reservation.getReserv_end_time();
            Duration hope_style_time = Duration.ofHours(reservation.getHope_style_time().getHour()).plusMinutes(reservation.getHope_style_time().getMinute());
            LocalTime current_time = shop_start;
            while (current_time.plus(hope_style_time).compareTo(shop_end) <= 0) {
                if (current_time.compareTo(reserv_time) >= 0 && current_time.compareTo(reserv_end_time) < 0) {
                    possibleTime.get(staff).get(date).remove(current_time);
                } else if (current_time.plus(hope_style_time).compareTo(reserv_time) > 0 && current_time.plus(hope_style_time).compareTo(reserv_end_time) <= 0) {
                    possibleTime.get(staff).get(date).remove(current_time);
                }
                current_time = current_time.plusMinutes(30);  // 30분 단위로 검사합니다.
            }
        }
        // 마감 시간 이후의 시간을 제거
        for (ReservationDTO reservation : list) {
            String date = String.valueOf(reservation.getReserv_date());
            String staff = reservation.getStaff_nickname();
            LocalTime shop_end = reservation.getShop_end();
            Duration hope_style_time = Duration.ofHours(reservation.getHope_style_time().getHour()).plusMinutes(reservation.getHope_style_time().getMinute());

            Set<LocalTime> times = possibleTime.get(staff).get(date);
            times.removeIf(time -> time.plus(hope_style_time).compareTo(shop_end) > 0);
        }
//        for (String staff : possibleTime.keySet()) {
//            for (String date : possibleTime.get(staff).keySet()) {
//                System.out.println(staff + " - " + date + " - 가능한 시간: " + possibleTime.get(staff).get(date));
//            }
//        }
        System.out.println(possibleTime);
        return possibleTime;
    }


}
