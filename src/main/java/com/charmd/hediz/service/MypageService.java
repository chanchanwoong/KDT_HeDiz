package com.charmd.hediz.service;

import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.dto.ReviewDTO;

import java.util.List;

public interface MypageService {
    public CustomerDTO findMypage(int cust_seq);
    public List<ReservationDTO> reservation(int cust_seq);
    public int updateMypage(CustomerDTO customerDto);
    public List<ReviewDTO> review(int cust_seq);
    public int reviewWrite(ReviewDTO reviewDto);
    public int reviewUpdate(ReviewDTO reviewDto);
    public int reviewDelete(int review_seq);
}
