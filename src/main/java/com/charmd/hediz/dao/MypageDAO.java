package com.charmd.hediz.dao;

import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.dto.ReservationDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MypageDAO {
    @Autowired
    SqlSessionTemplate session;

    public CustomerDTO findMypage(CustomerDTO customerDto){
        return session.selectOne("com.config.MypageMapper.findMypage", customerDto);
    }
    public List<ReservationDTO> reservation(ReservationDTO reservationDto){
        return session.selectList("com.config.MypageMapper.reservation", reservationDto);
    }
    public int updateMypage(CustomerDTO customerDto){
        return session.update("com.config.MypageMapper.updateMypage", customerDto);
    }
}
