package com.charmd.hediz.controller;

import com.charmd.hediz.dto.*;
import com.charmd.hediz.service.HairshopService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Api
@RestController
@RequestMapping("/hairshop")
public class HairshopController {
    @Autowired
    private HairshopService hairshopService;

    // 특정 미용실 정보 조회
    @GetMapping("{shop_seq}")
    public ResponseEntity<?> findHairshop(@PathVariable("shop_seq") int shop_seq) {
        HairshopDTO hairshopDto = hairshopService.findHairshop(shop_seq);
        return ResponseEntity.ok().body(hairshopDto);
    }

    // 특정 미용실 헤어스타일 조회
    @GetMapping("hairstyle/{shop_seq}")
    public ResponseEntity<?> findHairstyle(@PathVariable("shop_seq") int shop_seq) {
        List<HairstyleDTO> hairstyleList = hairshopService.findHairstyle(shop_seq);
        return ResponseEntity.ok().body(hairstyleList);
    }

    // 특정 미용실 헤어스타일 중 특정 헤어스타일 정보 조회
    @GetMapping("hairstyle/{shop_seq}/{style_seq}")
    public ResponseEntity<?> findHairstyleInfor(@PathVariable("shop_seq") int shop_seq, @PathVariable("style_seq") int style_seq) {
        HashMap<String, Integer> shopAndStyleMap = new HashMap<>();
        shopAndStyleMap.put("shop_seq", shop_seq);
        shopAndStyleMap.put("style_seq", style_seq);
        HairstyleDTO hairstyleDto = hairshopService.findHairstyleInfor(shopAndStyleMap);
        return ResponseEntity.ok().body(hairstyleDto);
    }


    // 특정 미용실 직원 조회
    @GetMapping("staff/{shop_seq}")
    public ResponseEntity<?> findStaff(@PathVariable("shop_seq") int shop_seq) {
        List<StaffDTO> staffList = hairshopService.findStaff(shop_seq);
        return ResponseEntity.ok().body(staffList);
    }

    // 특정 미용실 리뷰 조회
    @GetMapping("review/{shop_seq}")
    public ResponseEntity<?> findReview(@PathVariable("shop_seq") int shop_seq) {
        List<ReviewDTO> reviewList = hairshopService.findReview(shop_seq);
        return ResponseEntity.ok().body(reviewList);
    }

    // 예약_날짜 눌렀을 때 예약 가능 시간 확인
    @GetMapping("reservation/{shop_seq}/{style_seq}/{day}")
    public ResponseEntity<?> reservationFilter(@PathVariable("shop_seq") int shop_seq, @PathVariable("style_seq") int style_seq, @PathVariable("day") String day) {
        HashMap<String, Object> reservationFilterMap = new HashMap<>();
        reservationFilterMap.put("shop_seq", shop_seq);
        reservationFilterMap.put("style_seq", style_seq);
        reservationFilterMap.put("day", day);
        // 예약된 정보
        Map<String, Map<String, Set<LocalTime>>> possibleTime = hairshopService.reservationFilter(reservationFilterMap);


        return ResponseEntity.ok().body(possibleTime);
    }

}
