package com.charmd.hediz.dao;

import com.charmd.hediz.dto.ReviewDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReviewDAO {
    @Autowired
    SqlSessionTemplate session;

    public List<ReviewDTO> reviewFindAll(int shop_seq){
        return session.selectList("com.config.ReservationMapper.reviewFindAll",shop_seq);
    }

    public ReviewDTO reviewFind(int review_seq){
        return session.selectOne("com.config.ReservationMapper.reviewFind", review_seq);
    }

    public int reviewUpdate(ReviewDTO reviewData){
        return session.update("com.config.ReservationMapper.reviewUpdate", reviewData);
    }

    public int reviewDelete(int review_seq){
        return session.delete("com.config.ReservationMapper.reviewDelete", review_seq);
    }
}
