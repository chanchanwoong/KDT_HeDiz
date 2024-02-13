package com.charmd.hediz.service;

import com.charmd.hediz.dto.ReservationDTO;

import java.util.HashMap;
import java.util.List;

public interface ReservationService {
    public List<ReservationDTO> reservationFindAll(int shopSeq);

    public int getReservStat(int reserv_seq);
    public boolean reservStatChange(HashMap<String, Integer> reservSeqAndStatMap);
    public List<ReservationDTO> realtimeFindAll(int shopSeq);
    public List<ReservationDTO> realtimeFindCurrent(int shopSeq);
    public int reservationUpdate(HashMap<String, Integer> reservationStatAndSeqMap);
    public ReservationDTO reservationFind(int reservSeq);
}
