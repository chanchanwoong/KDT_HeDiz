package com.charmd.hediz.dao;

import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.dto.HairstyleDTO;
import com.charmd.hediz.dto.ReviewDTO;
import com.charmd.hediz.dto.StaffDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class HomeDAO {
    @Autowired
    SqlSessionTemplate session;

    public List<HairshopDTO> findAllHairshop(){
        return session.selectList("com.config.HomeMapper.findAllHairshop");
    }
    public HairshopDTO findHairshop(int shop_seq){
        return session.selectOne("com.config.HomeMapper.findHairshop", shop_seq);
    }
    public List<HairstyleDTO> findHairstyle(int shop_seq){
        return session.selectList("com.config.HomeMapper.findHairstyle", shop_seq);
    }

    public List<StaffDTO> findStaff(int shop_seq){
        return session.selectList("com.config.HomeMapper.findStaff", shop_seq);
    }

    public List<ReviewDTO> findReview(int shop_seq){
        return session.selectList("com.config.HomeMapper.findReview", shop_seq);
    }
}
