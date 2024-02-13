package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.CustomerDAO;
import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("customerService")
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    CustomerDAO dao;

    @Override
    public List<CustomerDTO> allCustomerSelect(String shopName) {
        return dao.allCustomerSelect(shopName);
    }


}
