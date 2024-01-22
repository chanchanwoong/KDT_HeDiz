package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.ReservationDAO;
import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("ReservationService")
public class ReservationServiceImpl implements ReservationService {
    @Autowired
    ReservationDAO dao;
    @Override
    public List<ReservationDTO> currentReservation(int cust_seq) {
        return dao.currentReservation(cust_seq);
    }

    @Override
    public int deleteReservation(int reserv_seq) {
        return dao.deleteReservation(reserv_seq);
    }
}
