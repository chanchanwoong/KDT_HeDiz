package com.charmd.hediz.dao;

import com.charmd.hediz.dto.ReservationDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Repository
public class ReservationDAO {
    @Autowired
    SqlSessionTemplate session;

    public List<ReservationDTO> reservationFindAll(int shop_seq){
        return session.selectList("com.config.ReservationMapper.reservationFindAll",shop_seq);
    }

    public int getReservStat(int reserv_seq){
        return session.selectOne("com.config.ReservationMapper.getReservStat", reserv_seq);
    }

    public int reservStatChange(HashMap<String, Integer> reservSeqAndStatMap){
        return session.update("com.config.ReservationMapper.reservStatChange", reservSeqAndStatMap);
    }

    public int getPayPrice(int reserv_seq){
        return session.selectOne("com.config.ReservationMapper.getPayPrice", reserv_seq);
    }

    public String getReciptId(int reserv_seq){
        return session.selectOne("com.config.ReservationMapper.getReciptId", reserv_seq);
    }

    public int changePayStat(int reserv_seq){
        return session.update("com.config.ReservationMapper.changePayStat", reserv_seq);
    }

    public List<ReservationDTO> realtimeFindAll(int shop_seq){
        return session.selectList("com.config.ReservationMapper.realtimeFindAll",shop_seq);
    }
    public List<ReservationDTO> reservationFindCurrent(int shop_seq) {
        return session.selectList("com.config.ReservationMapper.realtimeFindCurrent",shop_seq);
    }

    public int reservationUpdate(HashMap<String, Integer> reservationStatAndSeqMap){
        return session.update("com.config.ReservationMapper.reservationUpdate", reservationStatAndSeqMap);
    }

    public ReservationDTO reservationFind(int reservSeq){
        return session.selectOne("com.config.ReservationMapper.reservationFind", reservSeq);
    }


}
