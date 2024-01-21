package com.charmd.hediz.controller;

import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.dto.ReservationDTO;
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
    @PostMapping("")
    public ResponseEntity<?> findMypage(@RequestBody CustomerDTO customerDto){
        customerDto = mypageService.findMypage(customerDto);
        return ResponseEntity.ok().body(customerDto);
    }

    // 내 예약 정보 조회
    @PostMapping("reservation")
    public ResponseEntity<?> reservation(@RequestBody ReservationDTO reservationDto){
        System.out.println("받은 reservationDTO > " + reservationDto);
        List<ReservationDTO> reservationList = mypageService.reservation(reservationDto);
        return ResponseEntity.ok().body(reservationList);
    }

    // 내 정보 수정
    @PutMapping("")
    public ResponseEntity<?> updateMypage(@RequestBody CustomerDTO customerDto){
        int n = mypageService.updateMypage(customerDto);
        return ResponseEntity.ok().body(customerDto);
    }

    // 예약 삭제
}
