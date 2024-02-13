package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.DashboardDAO;
import com.charmd.hediz.dto.DashboardDTO;
import com.charmd.hediz.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service("DashboardService")
public class DashboardServiceImpl implements DashboardService {
    @Autowired
    DashboardDAO dao;
    @Override
    public List<DashboardDTO> countByReservationStatusPerDay(int shop_seq) {
        return dao.countByReservationStatusPerDay(shop_seq);
    }

    @Override
    public List<DashboardDTO> salesLastSixMonths(int shop_seq) {
        return dao.salesLastSixMonths(shop_seq);
    }

    @Override
    public List<DashboardDTO> customerVisitStatus(int shop_seq) {
        return dao.customerVisitStatus(shop_seq);
    }
}
