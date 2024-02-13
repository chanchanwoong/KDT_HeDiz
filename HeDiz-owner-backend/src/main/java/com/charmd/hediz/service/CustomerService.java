package com.charmd.hediz.service;

import com.charmd.hediz.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {
    public List<CustomerDTO> allCustomerSelect(String shopName);
}
