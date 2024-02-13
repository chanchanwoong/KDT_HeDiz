package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.HairshopDAO;
import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.dto.TempdayDTO;
import com.charmd.hediz.service.HairshopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("hairshopService")
public class HairshopServiceImpl implements HairshopService{
    @Autowired
    HairshopDAO dao;

    @Override
    public HairshopDTO hairshopFind(int shop_seq) {
        return dao.hairshopFind(shop_seq);
    }

    @Override
    public int hairshopUpdate(HairshopDTO putData) {
        return dao.hairshopUpdate(putData);
    }

    @Override
    public List<TempdayDTO> shopTempdayFind(int shopSeq) {
        return dao.shopTempdayFind(shopSeq);
    }

    @Override
    public List<TempdayDTO> staffTempdayFind(int shopSeq) {
        return dao.staffTempdayFind(shopSeq);
    }

    @Override
    public int staffTempdayAdd(TempdayDTO postData) {
        return dao.staffTempdayAdd(postData);
    }

    @Override
    public int shopTempdayAdd(TempdayDTO postData) {
        return dao.shopTempdayAdd(postData);
    }

}
