package com.charmd.hediz.controller;

import com.charmd.hediz.dto.*;

import com.charmd.hediz.service.HairshopService;
import com.charmd.hediz.service.HomeService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

@Api
@RestController
@CrossOrigin("*")
@RequestMapping("/")
public class HomeController {

    @Autowired
    private HomeService homeService;
    @Autowired
    private HairshopService hairshopService;

    // 모든 미용실 조회
    @GetMapping("")
    public ResponseEntity<?> findAllHairshop() {
        List<HairshopDTO> hairshopList = homeService.findAllHairshop();
        return ResponseEntity.ok().body(hairshopList);
    }

    // 특정 미용실 정보 조회
    @GetMapping("hairshop/{shop_seq}")
    public ResponseEntity<?> findHairshop(@PathVariable("shop_seq") int shop_seq) {
        HairshopDTO hairshopDto = hairshopService.findHairshop(shop_seq);
        return ResponseEntity.ok().body(hairshopDto);
    }

    // 특정 미용실 헤어스타일 조회
    @GetMapping("hairshop/{shop_seq}/hairstyle")
    public ResponseEntity<?> findHairstyle(@PathVariable("shop_seq") int shop_seq) {
        List<HairstyleDTO> hairstyleList = hairshopService.findHairstyle(shop_seq);
        return ResponseEntity.ok().body(hairstyleList);
    }

    // 특정 미용실 헤어스타일 중 특정 헤어스타일 정보 조회
    @GetMapping("/hairshop/{shop_seq}/hairstyle/{style_seq}")
    public ResponseEntity<?> findHairstyleInfor(@PathVariable("shop_seq") int shop_seq, @PathVariable("style_seq") int style_seq) {
        HashMap<String, Integer> shopAndStyleMap = new HashMap<>();
        shopAndStyleMap.put("shop_seq", shop_seq);
        shopAndStyleMap.put("style_seq", style_seq);
        HairstyleDTO hairstyleDto = hairshopService.findHairstyleInfor(shopAndStyleMap);
        return ResponseEntity.ok().body(hairstyleDto);
    }


    // 특정 미용실 직원 조회
    @GetMapping("/hairshop/{shop_seq}/staff")
    public ResponseEntity<?> findAllStaff(@PathVariable("shop_seq") int shop_seq) {
        List<StaffDTO> staffList = hairshopService.findAllStaff(shop_seq);
        return ResponseEntity.ok().body(staffList);
    }

    // 특정 직원 조회
    @GetMapping("hairshop/{shop_seq}/staff/{staff_seq}")
    public ResponseEntity<?> findStaff(@PathVariable("shop_seq") int shop_seq, @PathVariable("staff_seq") int staff_seq){
        HashMap<String, Integer> shopSeqAndStaffSeqMap = new HashMap<>();
        shopSeqAndStaffSeqMap.put("shop_seq", shop_seq);
        shopSeqAndStaffSeqMap.put("staff_seq", staff_seq);
        StaffDTO staffDto = hairshopService.findStaff(shopSeqAndStaffSeqMap);
        return ResponseEntity.ok().body(staffDto);
    }

    // 특정 미용실 리뷰 조회
    @GetMapping("/hairshop/{shop_seq}/review")
    public ResponseEntity<?> findReview(@PathVariable("shop_seq") int shop_seq) {
        List<ReviewDTO> reviewList = hairshopService.findReview(shop_seq);
        return ResponseEntity.ok().body(reviewList);
    }

    // 예약_날짜 눌렀을 때 예약 가능 시간 확인
    @GetMapping("/hairshop/reservation/{shop_seq}/{style_seq}/{day}")
    public ResponseEntity<?> reservationFilter(@PathVariable("shop_seq") int shop_seq, @PathVariable("style_seq") int style_seq, @PathVariable("day") String day) {
        HashMap<String, Object> reservationFilterMap = new HashMap<>();
        reservationFilterMap.put("shop_seq", shop_seq);
        reservationFilterMap.put("style_seq", style_seq);
        reservationFilterMap.put("day", day);
        // 예약된 정보
        Map<Integer, TreeSet<LocalTime>> possibleTime = hairshopService.reservationFilter(reservationFilterMap);
        return ResponseEntity.ok().body(possibleTime);
    }

    // 예약_날짜 누르고 예약하기 버튼을 누른 후 결제 정보 보여주는 API
    // 결제 금액은 cust_level에 따라 변화 필요
    @PostMapping("payinfo")
    public ResponseEntity<?> payinfo(@RequestBody PayinfoDTO payinfoDto) {
        payinfoDto = hairshopService.getPayinfo(payinfoDto);
        return ResponseEntity.ok().body(payinfoDto);
    }

    // 예약_최종 결제 후 결제 테이블과 예약 테이블에 저장
    // 예약인 경우 reserv_stat = 0, 대기인 경우 reserv_stat = 4로 입력받음
    @PostMapping("reservation")
    public ResponseEntity<?> reservation(@RequestBody PayinfoDTO payinfoDto) {
        System.out.println(payinfoDto);
        int n = 0;
        // 예약인 경우 결제와 예약 처리 진행
        if(payinfoDto.getReserv_stat() == 0){
            n = hairshopService.reservation(payinfoDto);
        }
        // 대기인 경우 결제는 없이, 예약만 진행
        // c_token 값 저장
        else{
            n = hairshopService.standBy(payinfoDto);
        }
        return ResponseEntity.ok().body(n==2);
    }
}
