package com.charmd.hediz.controller;

import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.dto.ReviewDTO;
import com.charmd.hediz.service.MypageService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api
@RestController
@RequestMapping("/mypage")
public class MypageController {
    @Autowired
    private MypageService mypageService;

    // 내 정보 조회
    @PostMapping("profile")
    public ResponseEntity<?> findMypage(@RequestBody CustomerDTO customerDto){
        customerDto = mypageService.findMypage(customerDto);
        return ResponseEntity.ok().body(customerDto);
    }

    // 내 예약 정보 조회
    @PostMapping("reservation")
    public ResponseEntity<?> reservation(@RequestBody ReservationDTO reservationDto){
        List<ReservationDTO> reservationList = mypageService.reservation(reservationDto);
        return ResponseEntity.ok().body(reservationList);
    }

    // 내 정보 수정
    @PutMapping("profile")
    public ResponseEntity<?> updateMypage(@RequestBody CustomerDTO customerDto){
        int n = mypageService.updateMypage(customerDto);
        return ResponseEntity.ok().body(customerDto);
    }

    // cust_seq에 따른 리뷰 조회
    @GetMapping("review/{cust_seq}")
    public ResponseEntity<?> review(@PathVariable("cust_seq") int cust_seq){
        List<ReviewDTO> reviewList = mypageService.review(cust_seq);
        return ResponseEntity.ok().body(reviewList);
    }

    // cust_seq에 따른 리뷰 작성
    @PostMapping("review")
    public ResponseEntity<?> reviewWrite(@RequestBody ReviewDTO reviewDto){
        int n = mypageService.reviewWrite(reviewDto);
        return ResponseEntity.ok().body(reviewDto);
    }
}
