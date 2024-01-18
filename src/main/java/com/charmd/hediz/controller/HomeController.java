package com.charmd.hediz.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//@Api
@RestController
@RequestMapping("/home")
public class HomeController {
    @GetMapping("dashboard")
    public String dashboard(){

        return "대시보드 페이지";
    }

}