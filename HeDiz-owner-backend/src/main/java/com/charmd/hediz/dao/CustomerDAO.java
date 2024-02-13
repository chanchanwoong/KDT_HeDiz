package com.charmd.hediz.dao;

import com.charmd.hediz.dto.CustomerDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomerDAO {

    @Autowired
    SqlSessionTemplate session;

    public List<CustomerDTO> allCustomerSelect(String shopName){
        return session.selectList("com.config.CustomerMapper.allCustomerSelect", shopName);
    }

}
