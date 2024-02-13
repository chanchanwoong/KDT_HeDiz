package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.HomeDAO;
import com.charmd.hediz.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service("homeService")
public class HomeServiceImpl implements HomeService {
    @Autowired
    HomeDAO dao;

    @Override
    public int updatePassword(HashMap<String, Object> passwordMap) {
        return dao.updatePassword(passwordMap);
    }

    @Override
    public String getPw(int shopSeq) {
        return dao.getPw(shopSeq);
    }
}
