package com.charmd.hediz.controller;

import com.charmd.hediz.dto.HairshopDTO;

import com.charmd.hediz.service.HomeService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
//    @GetMapping("{keyword}")
//    public ResponseEntity<?> findHairshopUsingKeyword(@PathVariable("keyword") String keyword) {
//        List<HairshopDTO> hairshopList = homeService.findHairshopUsingKeyword(keyword);
//        return ResponseEntity.ok().body(hairshopList);
//    }


}
