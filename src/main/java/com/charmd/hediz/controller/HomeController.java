package com.charmd.hediz.controller;

import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.dto.HairstyleDTO;
import com.charmd.hediz.dto.ReviewDTO;
import com.charmd.hediz.dto.StaffDTO;
import com.charmd.hediz.service.HomeService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Api
@RestController
@RequestMapping("/home")
public class HomeController {

    @Autowired
    private HomeService homeService;

    // 모든 미용실 조회
    @GetMapping("")
    public ResponseEntity<?> findAllHairshop(){
        List<HairshopDTO> hairshopList = homeService.findAllHairshop();
        return ResponseEntity.ok().body(hairshopList);
    }

    // 특정 미용실 정보 조회
    @GetMapping("{shop_seq}")
    public ResponseEntity<?> findHairshop(@PathVariable("shop_seq") int shop_seq){
        HairshopDTO hairshopDto = homeService.findHairshop(shop_seq);
        return ResponseEntity.ok().body(hairshopDto);
    }

    // 특정 미용실 헤어스타일 조회
    @GetMapping("hairstyle/{shop_seq}")
    public ResponseEntity<?> findHairstyle(@PathVariable("shop_seq") int shop_seq){
        List<HairstyleDTO> hairstyleList = homeService.findHairstyle(shop_seq);
        return ResponseEntity.ok().body(hairstyleList);
    }

    // 특정 미용실 직원 조회
    @GetMapping("staff/{shop_seq}")
    public ResponseEntity<?> findStaff(@PathVariable("shop_seq") int shop_seq){
        List<StaffDTO> staffList = homeService.findStaff(shop_seq);
        return ResponseEntity.ok().body(staffList);
    }

    // 특정 미용실 리뷰 조회
    @GetMapping("review/{shop_seq}")
    public ResponseEntity<?> findReview(@PathVariable("shop_seq") int shop_seq){
        List<ReviewDTO> reviewList = homeService.findReview(shop_seq);
        return ResponseEntity.ok().body(reviewList);
    }

    //
}
