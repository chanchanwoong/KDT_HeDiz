package com.charmd.hediz.service;

import com.charmd.hediz.dto.DashboardDTO;

import java.util.List;

public interface DashboardService {
    public List<DashboardDTO> countByReservationStatusPerDay(int shop_seq);
    public List<DashboardDTO> salesLastSixMonths(int shop_seq);
    public List<DashboardDTO> customerVisitStatus(int shop_seq);

}
