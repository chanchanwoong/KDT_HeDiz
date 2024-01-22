package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.MypageDAO;
import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.dto.ReviewDTO;
import com.charmd.hediz.service.MypageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("mypageService")
public class MypageServiceImpl implements MypageService {
    @Autowired
    MypageDAO dao;
    @Override
    public CustomerDTO findMypage(CustomerDTO customerDto) {
        return dao.findMypage(customerDto);
    }

    @Override
    public List<ReservationDTO> reservation(ReservationDTO reservationDto) {
        return dao.reservation(reservationDto);
    }

    @Override
    public int updateMypage(CustomerDTO customerDto) {
        return dao.updateMypage(customerDto);
    }

    @Override
    public List<ReviewDTO> review(int cust_seq) {
        return dao.review(cust_seq);
    }

    @Override
    public int reviewWrite(ReviewDTO reviewDto) {
        return dao.reviewWrite(reviewDto);
    }
}
