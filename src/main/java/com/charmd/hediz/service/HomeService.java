package com.charmd.hediz.service;

import com.charmd.hediz.dto.HairshopDTO;

import java.util.List;

public interface HomeService {
    public List<HairshopDTO> findAllHairshop();
//    public List<HairshopDTO> findHairshopWithFilter(HashMap<String, String> filterMap);
//    public List<HairshopDTO> findHairshopUsingKeyword(String keyword);
}
