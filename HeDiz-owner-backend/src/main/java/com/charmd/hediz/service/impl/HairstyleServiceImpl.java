package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.HairstyleDAO;
import com.charmd.hediz.dto.HairstyleDTO;
import com.charmd.hediz.service.HairstyleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("hairstyleService")
public class HairstyleServiceImpl implements HairstyleService {
    @Autowired
    HairstyleDAO dao;

    // hairstyle 관련 service
    @Override
    public List<HairstyleDTO> hairstyleFindAll(int shopSeq) {
        return dao.hairstyleFindAll(shopSeq);
    }

    @Override
    public int hairstyleAdd(HairstyleDTO postData) {
        return dao.hairstyleAdd(postData);
    }

    @Override
    public int hairstyleUpdate(HairstyleDTO putData) {
        return dao.hairstyleUpdate(putData);
    }

    @Override
    public int hairstyleDelete(int style_seq) {
        return dao.hairstyleDelete(style_seq);
    }
}
