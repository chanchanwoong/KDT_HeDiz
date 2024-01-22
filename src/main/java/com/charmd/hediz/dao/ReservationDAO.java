package com.charmd.hediz.dao;

import com.charmd.hediz.dto.ReservationDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReservationDAO {
    @Autowired
    SqlSessionTemplate session;
    public List<ReservationDTO> currentReservation(int cust_seq){
        return session.selectList("com.config.ReservationMapper.currentReservation", cust_seq);
    }
    public int deleteReservation(int reserv_seq){
        return session.delete("com.config.ReservationMapper.deleteReservation", reserv_seq);
    }
}
