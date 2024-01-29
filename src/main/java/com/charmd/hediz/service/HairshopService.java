package com.charmd.hediz.service;

import com.charmd.hediz.dto.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

public interface HairshopService {
    public HairshopDTO findHairshop(int shop_seq);
    public List<HairstyleDTO> findHairstyle(int shop_seq);
    public HairstyleDTO findHairstyleInfor(HashMap<String, Integer> shopAndStyleMap);

    public List<StaffDTO> findAllStaff(int shop_seq);
    public StaffDTO findStaff(HashMap<String, Integer> shopSeqAndStaffSeqMap);
    public List<ReviewDTO> findReview(int shop_seq);
    public Map<Integer, TreeSet<LocalTime>> reservationFilter(HashMap<String, Object> reservationFilterMap);
    public PayinfoDTO getPayinfo(PayinfoDTO payinfoDto);
    public int reservation(PayinfoDTO payinfoDto);
}
