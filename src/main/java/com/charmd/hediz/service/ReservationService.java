package com.charmd.hediz.service;

import com.charmd.hediz.dto.ReservationDTO;

import java.util.List;

public interface ReservationService {
    public List<ReservationDTO> currentReservation(int cust_seq);
    public int deleteReservation(int reserv_seq);
}
