package com.charmd.hediz.service;

import com.charmd.hediz.dto.StaffDTO;

import java.util.List;

public interface StaffService {
    public List<StaffDTO> staffFindAll(int shopSeq);
    public int staffUpdate(StaffDTO putData);
    public int staffAdd(StaffDTO postData);
    public int staffDelete(int staff_seq);
}
