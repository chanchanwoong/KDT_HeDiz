package com.charmd.hediz.dao;

import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.dto.ReviewDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MypageDAO {
    @Autowired
    SqlSessionTemplate session;

    public CustomerDTO findMypage(int cust_seq){
        return session.selectOne("com.config.MypageMapper.findMypage", cust_seq);
    }
    public List<ReservationDTO> reservation(int cust_seq){
        return session.selectList("com.config.MypageMapper.reservation", cust_seq);
    }
    public int updateMypage(CustomerDTO customerDto){
        return session.update("com.config.MypageMapper.updateMypage", customerDto);
    }
    public List<ReviewDTO> review(int cust_seq){
        return session.selectList("com.config.MypageMapper.review", cust_seq);
    }
    public int reviewWrite(ReviewDTO reviewDto){
        return session.insert("com.config.MypageMapper.reviewWrite", reviewDto);
    }
}
