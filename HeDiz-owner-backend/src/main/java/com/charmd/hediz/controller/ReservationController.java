package com.charmd.hediz.controller;

import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.dto.ReviewDTO;
import com.charmd.hediz.service.ReservationService;
import com.charmd.hediz.service.ReviewService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Api
@RestController
@CrossOrigin("*")
@RequestMapping("/reservation")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReviewService reviewService;

    /*
     * 전체 예약 (/reservation)
     * */
    // 전체 예약 데이터 조회
    @GetMapping("total/{shop_seq}")
    public ResponseEntity<?> total(@PathVariable("shop_seq") int shopSeq) {
        List<ReservationDTO> reservationList;
        reservationList = reservationService.reservationFindAll(shopSeq);
        return ResponseEntity.ok().body(reservationList);
    }

    // 예약 상태 변경
    @PutMapping("{reserv_seq}/{reserv_stat}")
    public ResponseEntity<?> reservStatChange(@PathVariable("reserv_seq") int reserv_seq, @PathVariable("reserv_stat") int reserv_stat) {
        HashMap<String, Integer> reservSeqAndStatMap = new HashMap<>();
        reservSeqAndStatMap.put("reserv_seq", reserv_seq);
        reservSeqAndStatMap.put("reserv_stat", reserv_stat);
        boolean isChanged = false;
        // 기존 reserv_stat 값이 0인 경우에만 바뀌게 처리
        if(reservationService.getReservStat(reserv_seq) == 0) {
            isChanged = reservationService.reservStatChange(reservSeqAndStatMap);
        }
        return ResponseEntity.ok().body(isChanged);
    }

    /*
     * 리뷰 관리 (/review)
     * */
    // 전체 리뷰 조회
    @GetMapping("review/{shop_seq}")
    public ResponseEntity<?> reviewFindAll(@PathVariable("shop_seq") int shopSeq) {
        List<ReviewDTO> reviewList;
        reviewList = reviewService.reviewFindAll(shopSeq);
        return ResponseEntity.ok().body(reviewList);
    }

    // 특정 리뷰 답글달기
    @PutMapping("review")
    public ResponseEntity<?> reviewUpdate(@RequestBody ReviewDTO reviewData) {
        int n = reviewService.reviewUpdate(reviewData);
        return ResponseEntity.ok().body(n == 1);
    }

    // 특정 리뷰 삭제
    @DeleteMapping("review/{review_seq}")
    public ResponseEntity<?> reviewDelete(@PathVariable("review_seq") int reviewSeq) {
        int n = reviewService.reviewDelete(reviewSeq);
        return ResponseEntity.ok().body(n == 1);
    }

    /*
     * 알림 서비스 (/alarm)
     * */
}
