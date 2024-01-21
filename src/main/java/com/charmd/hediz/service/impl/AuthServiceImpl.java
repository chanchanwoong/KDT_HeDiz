package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.AuthDAO;
import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("authService")
public class AuthServiceImpl implements AuthService {
    @Autowired
    AuthDAO dao;
    @Override
    public CustomerDTO getUserById(String cust_id) {
        return dao.getUserById(cust_id);
    }

    @Override
    public void signUp(CustomerDTO customerDto) {
        dao.signUp(customerDto);
    }

    @Override
    public int duplicateCheck(String cust_id) {
        return dao.duplicateCheck(cust_id);
    }
}
