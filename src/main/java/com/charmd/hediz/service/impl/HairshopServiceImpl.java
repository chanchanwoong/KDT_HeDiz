package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.HairshopDAO;
import com.charmd.hediz.dto.*;
import com.charmd.hediz.service.HairshopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Service("hairshopService")
public class HairshopServiceImpl implements HairshopService {
    @Autowired
    HairshopDAO dao;
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
    public List<ReservationDTO> reservationFilter(HashMap<String , Object> reservationFilterMap) {
        return dao.reservationFilter(reservationFilterMap);
    }
}
