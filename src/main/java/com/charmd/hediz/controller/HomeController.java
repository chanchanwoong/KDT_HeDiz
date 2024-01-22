package com.charmd.hediz.controller;

import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.dto.HairstyleDTO;
import com.charmd.hediz.dto.ReviewDTO;
import com.charmd.hediz.dto.StaffDTO;
import com.charmd.hediz.service.HomeService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Api
@RestController
@RequestMapping("/home")
public class HomeController {

    @Autowired
    private HomeService homeService;

    // 모든 미용실 조회
    // 필터 데이터를 가지고 적용해야 한다.
    @GetMapping("")
    public ResponseEntity<?> findAllHairshop() {
        List<HairshopDTO> hairshopList = homeService.findAllHairshop();
        return ResponseEntity.ok().body(hairshopList);
    }
    // 필터를 이용한 미용실 조회
//    @PostMapping("")
//    public ResponseEntity<?> findAllHairshop(@RequestBody HashMap<String, String> filterMap) {
//        System.out.println(filterMap);
//        // 필터 값이 null 인 경우, 모든 헤어샵 조회
//        if (filterMap.get("score_filter") == null && filterMap.get("tag_filter") == null) {
//            List<HairshopDTO> hairshopList = homeService.findAllHairshop();
//            return ResponseEntity.ok().body(hairshopList);
//        }
//        // 필터에 어떤 값이 있는 경우
//        else{
//            List<HairshopDTO> hairshopList = homeService.findHairshopWithFilter(filterMap);
//            return ResponseEntity.ok().body(hairshopList);
//        }
//    }

    // keyword를 이용해서 검색하기
    @GetMapping("{keyword}")
    public ResponseEntity<?> findHairshopUsingKeyword(@PathVariable("keyword") String keyword) {
        List<HairshopDTO> hairshopList = homeService.findHairshopUsingKeyword(keyword);
        return ResponseEntity.ok().body(hairshopList);
    }

    // 특정 미용실 정보 조회
    @GetMapping("hairshop/{shop_seq}")
    public ResponseEntity<?> findHairshop(@PathVariable("shop_seq") int shop_seq) {
        HairshopDTO hairshopDto = homeService.findHairshop(shop_seq);
        return ResponseEntity.ok().body(hairshopDto);
    }

    // 특정 미용실 헤어스타일 조회
    @GetMapping("hairshop/hairstyle/{shop_seq}")
    public ResponseEntity<?> findHairstyle(@PathVariable("shop_seq") int shop_seq) {
        List<HairstyleDTO> hairstyleList = homeService.findHairstyle(shop_seq);
        return ResponseEntity.ok().body(hairstyleList);
    }

    // 특정 미용실 헤어스타일 중 특정 헤어스타일 정보 조회
    @GetMapping("hairshop/hairstyle/{shop_seq}/{style_seq}")
    public ResponseEntity<?> findHairstyleInfor(@PathVariable("shop_seq") int shop_seq, @PathVariable("style_seq") int style_seq) {
        HashMap<String, Integer> shopAndStyleMap = new HashMap<>();
        shopAndStyleMap.put("shop_seq", shop_seq);
        shopAndStyleMap.put("style_seq", style_seq);
        HairstyleDTO hairstyleDto = homeService.findHairstyleInfor(shopAndStyleMap);
        return ResponseEntity.ok().body(hairstyleDto);
    }


    // 특정 미용실 직원 조회
    @GetMapping("hairshop/staff/{shop_seq}")
    public ResponseEntity<?> findStaff(@PathVariable("shop_seq") int shop_seq) {
        List<StaffDTO> staffList = homeService.findStaff(shop_seq);
        return ResponseEntity.ok().body(staffList);
    }

    // 특정 미용실 리뷰 조회
    @GetMapping("hairshop/review/{shop_seq}")
    public ResponseEntity<?> findReview(@PathVariable("shop_seq") int shop_seq) {
        List<ReviewDTO> reviewList = homeService.findReview(shop_seq);
        return ResponseEntity.ok().body(reviewList);
    }
}
