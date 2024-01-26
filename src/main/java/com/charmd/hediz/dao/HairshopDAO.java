package com.charmd.hediz.dao;

import com.charmd.hediz.dto.*;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Repository
public class HairshopDAO {
@Autowired
    SqlSessionTemplate session;
    public HairshopDTO findHairshop(int shop_seq){
        return session.selectOne("com.config.HairshopMapper.findHairshop", shop_seq);
    }
    public List<HairstyleDTO> findHairstyle(int shop_seq){
        return session.selectList("com.config.HairshopMapper.findHairstyle", shop_seq);
    }
    public HairstyleDTO findHairstyleInfor(HashMap<String, Integer> shopAndStyleMap){
        return session.selectOne("com.config.HairshopMapper.findHairstyleInfor", shopAndStyleMap);
    }
    public List<StaffDTO> findStaff(int shop_seq){
        return session.selectList("com.config.HairshopMapper.findStaff", shop_seq);
    }

    public List<ReviewDTO> findReview(int shop_seq){
        return session.selectList("com.config.HairshopMapper.findReview", shop_seq);
    }
    public List<ReservationDTO> reservationFilter(HashMap<String , Object> reservationFilterMap){
        return session.selectList("com.config.HairshopMapper.reservationFilter", reservationFilterMap);
    }
    public int reservation(ReservationDTO reservationDto){
        return session.insert("com.config.HairshopMapper.reservation", reservationDto);
    }
    public int payment(PaymentDTO paymentDto){
        return session.insert("com.config.HairshopMapper.payment", paymentDto);
    }
}
