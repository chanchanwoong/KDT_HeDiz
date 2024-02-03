package com.charmd.hediz.service;

import com.charmd.hediz.dto.ReservationDTO;

import java.util.List;

public interface ReservationService {
    public List<ReservationDTO> currentReservation(int cust_seq);
    public int cancelReservation(int reserv_seq, String receipt_id);
    public List<String> sendCToken(List<Integer> standByCustList);
}
