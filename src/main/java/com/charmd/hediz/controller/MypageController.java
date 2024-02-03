package com.charmd.hediz.controller;

import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.dto.ReviewDTO;
import com.charmd.hediz.service.MypageService;
import com.charmd.hediz.service.ReservationService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Api
@RestController
@CrossOrigin("*")
@RequestMapping("/mypage")
public class MypageController {
    @Autowired
    private MypageService mypageService;
    @Autowired
    private ReservationService reservationService;

    // 내 정보 조회
    @GetMapping("profile/{cust_seq}")
    public ResponseEntity<?> findMypage(@PathVariable("cust_seq") int cust_seq) {
        CustomerDTO customerDto = mypageService.findMypage(cust_seq);
        return ResponseEntity.ok().body(customerDto);
    }

    // 내 예약 정보 조회
    @GetMapping("reservation/{cust_seq}")
    public ResponseEntity<?> reservation(@PathVariable("cust_seq") int cust_seq) {
        List<ReservationDTO> reservationList = mypageService.reservation(cust_seq);
        return ResponseEntity.ok().body(reservationList);
    }

    // 내 정보 수정
    @PutMapping("profile")
    public ResponseEntity<?> updateMypage(@RequestBody CustomerDTO customerDto) {
        int n = mypageService.updateMypage(customerDto);
        return ResponseEntity.ok().body(n == 1);
    }

    // cust_seq에 따른 리뷰 조회
    @GetMapping("review/{cust_seq}")
    public ResponseEntity<?> review(@PathVariable("cust_seq") int cust_seq) {
        List<ReviewDTO> reviewList = mypageService.review(cust_seq);
        return ResponseEntity.ok().body(reviewList);
    }

    // cust_seq에 따른 리뷰 작성
    @PostMapping("review")
    public ResponseEntity<?> reviewWrite(@RequestBody ReviewDTO reviewDto) {
        int n = 0;
        // reserv_stat = 1 (방문완료) 경우에만 리뷰 작성 가능하다.
        int reserv_stat = mypageService.getReservStat(reviewDto);

        if (reserv_stat == 1) {
            n = mypageService.reviewWrite(reviewDto);
        }
        return ResponseEntity.ok().body(n == 1);
    }

    // cust_seq에 따른 리뷰 수정
    @PutMapping("review")
    public ResponseEntity<?> reviewUpdate(@RequestBody ReviewDTO reviewDto) {
        int n = mypageService.reviewUpdate(reviewDto);
        return ResponseEntity.ok().body(n == 1);
    }

    // cust_seq에 따른 리뷰 삭제
    @DeleteMapping("review/{review_seq}")
    public ResponseEntity<?> reviewDelete(@PathVariable("review_seq") int review_seq) {
        int n = mypageService.reviewDelete(review_seq);
        return ResponseEntity.ok().body(n == 1);
    }

    // 예약 상황 조회 (작업 미시작 예약 조회)
    @GetMapping("realtime-reservation/{cust_seq}")
    public ResponseEntity<?> currentReservation(@PathVariable("cust_seq") int cust_seq) {
        List<ReservationDTO> reservationList = reservationService.currentReservation(cust_seq);
        return ResponseEntity.ok().body(reservationList);
    }

    // 예약 상태 수정
    // reserv_stat = 0(예약 확정) -> reserv_stat = 2(예약 취소)
    // pay_stat = 0(결제) -> 1(취소)
    // 대기 고객 필터링해서 대기 고객들의 cToken 값들 넘김
    @PutMapping("realtime-reservation/{reserv_seq}")
    public ResponseEntity<?> cancelReservation(@PathVariable("reserv_seq") int reserv_seq, @RequestBody String receipt_id) {
        int n = reservationService.cancelReservation(reserv_seq, receipt_id);
        List<Integer> standByCustList = new ArrayList<>();
        List<String> cTokenList = new ArrayList<>();
        // n이 3이면 대기 고객 필터링
        if(n==3) {
            standByCustList = reservationService.getStandByCustListUsingFilter(reserv_seq);
        }
        System.out.println("custList >> " + standByCustList);
        // cTokenList 조회
        cTokenList = reservationService.getCToken(standByCustList);
        return ResponseEntity.ok().body(cTokenList);
    }

}
