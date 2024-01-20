package com.charmd.hediz.dao;

import com.charmd.hediz.dto.HairshopDTO;
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
}
