package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.StaffDAO;
import com.charmd.hediz.dto.StaffDTO;
import com.charmd.hediz.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service("staffService")
public class StaffServiceImpl implements StaffService {
    @Autowired
    StaffDAO dao;

    @Override
    public List<StaffDTO> staffFindAll(int shopSeq) {
        return dao.staffFindAll(shopSeq);
    }

    @Override
    public int staffUpdate(StaffDTO putData) {
        return dao.staffUpdate(putData);
    }

    @Override
    public int staffAdd(StaffDTO postData) {
        return dao.staffAdd(postData);
    }

    @Override
    public int staffDelete(int staff_seq) {
        return dao.staffDelete(staff_seq);
    }

}
