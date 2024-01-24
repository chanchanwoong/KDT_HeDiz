package com.charmd.hediz.service;

import com.charmd.hediz.dto.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

public interface HairshopService {
    public HairshopDTO findHairshop(int shop_seq);
    public List<HairstyleDTO> findHairstyle(int shop_seq);
    public HairstyleDTO findHairstyleInfor(HashMap<String, Integer> shopAndStyleMap);

    public List<StaffDTO> findStaff(int shop_seq);
    public List<ReviewDTO> findReview(int shop_seq);
    public List<ReservationDTO> reservationFilter(HashMap<String, Object> reservationFilterMap);
}
