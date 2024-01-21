package com.charmd.hediz.service;

import com.charmd.hediz.dto.CustomerDTO;

public interface AuthService {
    public CustomerDTO getUserById(String cust_id);
    public void signUp(CustomerDTO customerDto);
    public int duplicateCheck(String cust_id);
}
