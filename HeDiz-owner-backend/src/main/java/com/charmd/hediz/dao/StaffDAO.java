package com.charmd.hediz.dao;

import com.charmd.hediz.dto.StaffDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

@Repository
public class StaffDAO {
    @Autowired
    SqlSessionTemplate session;

    public List<StaffDTO> staffFindAll(int shop_seq){
        return session.selectList("com.config.StaffMapper.staffFindAll", shop_seq);
    }
    public int staffUpdate(StaffDTO putData) {
        System.out.println("수정 데이터 >" + putData);
        return session.update("com.config.StaffMapper.staffUpdate", putData);
    }
    public int staffAdd(StaffDTO postData) {return session.insert("com.config.StaffMapper.staffAdd", postData);}
    public int staffDelete(int staff_seq){return session.delete("com.config.StaffMapper.staffDelete", staff_seq);}
}
