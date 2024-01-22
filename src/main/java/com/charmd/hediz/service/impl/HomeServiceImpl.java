package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.HomeDAO;
import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.dto.HairstyleDTO;
import com.charmd.hediz.dto.ReviewDTO;
import com.charmd.hediz.dto.StaffDTO;
import com.charmd.hediz.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service("homeService")
public class HomeServiceImpl implements HomeService {
    @Autowired
    HomeDAO dao;
    @Override
    public List<HairshopDTO> findAllHairshop() {
        return dao.findAllHairshop();
    }

    @Override
    public HairshopDTO findHairshop(int shop_seq) {
        return dao.findHairshop(shop_seq);
    }

    @Override
    public List<HairstyleDTO> findHairstyle(int shop_seq) {
        return dao.findHairstyle(shop_seq);
    }

    @Override
    public HairstyleDTO findHairstyleInfor(HashMap<String, Integer> shopAndStyleMap) {
        return dao.findHairstyleInfor(shopAndStyleMap);
    }

    @Override
    public List<StaffDTO> findStaff(int shop_seq) {
        return dao.findStaff(shop_seq);
    }

    @Override
    public List<ReviewDTO> findReview(int shop_seq) {
        return dao.findReview(shop_seq);
    }

    @Override
    public List<HairshopDTO> findHairshopUsingKeyword(String keyword) {
        return dao.findHairshopUsingKeyword(keyword);
    }
}
