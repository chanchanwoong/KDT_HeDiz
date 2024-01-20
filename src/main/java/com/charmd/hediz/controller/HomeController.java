package com.charmd.hediz.controller;

import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.service.HomeService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Api
@RestController
@RequestMapping("/home")
public class HomeController {

    @Autowired
    private HomeService homeService;

    @GetMapping("")
    public ResponseEntity<?> findAllHairshop(){
        List<HairshopDTO> hairshopList = homeService.findAllHairshop();
        return ResponseEntity.ok().body(hairshopList);
    }

}
