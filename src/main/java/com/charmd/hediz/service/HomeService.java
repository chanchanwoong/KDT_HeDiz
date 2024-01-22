package com.charmd.hediz.service;

import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.dto.HairstyleDTO;
import com.charmd.hediz.dto.ReviewDTO;
import com.charmd.hediz.dto.StaffDTO;

import java.util.HashMap;
import java.util.List;

public interface HomeService {
    public List<HairshopDTO> findAllHairshop();
    public List<HairshopDTO> findHairshopWithFilter(HashMap<String, String> filterMap);
    public HairshopDTO findHairshop(int shop_seq);
    public List<HairstyleDTO> findHairstyle(int shop_seq);
    public HairstyleDTO findHairstyleInfor(HashMap<String, Integer> shopAndStyleMap);

    public List<StaffDTO> findStaff(int shop_seq);
    public List<ReviewDTO> findReview(int shop_seq);
    public List<HairshopDTO> findHairshopUsingKeyword(String keyword);
}
