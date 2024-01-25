package com.charmd.hediz.controller;

import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.service.ReservationService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api
@RestController
@RequestMapping("/reservation")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    // 예약 상황 조회 (작업 미시작 예약 조회)
    @GetMapping("{cust_seq}")
    public ResponseEntity<?> currentReservation(@PathVariable("cust_seq") int cust_seq){
        List<ReservationDTO> reservationList = reservationService.currentReservation(cust_seq);
        return ResponseEntity.ok().body(reservationList);
    }

    // 예약 상태 수정(reserv_stat = 0(예약 확정) -> reserv_stat = 2(예약 취소))
    @PutMapping("{reserv_seq}")
    public ResponseEntity<?> cancelReservation(@PathVariable("reserv_seq") int reserv_seq){
        int n = reservationService.cancelReservation(reserv_seq);
        return ResponseEntity.ok().body(n==1);
    }
}
