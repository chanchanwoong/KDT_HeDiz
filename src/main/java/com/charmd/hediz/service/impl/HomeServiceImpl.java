package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.HomeDAO;
import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("homeService")
public class HomeServiceImpl implements HomeService {
    @Autowired
    HomeDAO dao;
    @Override
    public List<HairshopDTO> findAllHairshop(int cust_seq) {
        return dao.findAllHairshop(cust_seq);
    }
}
