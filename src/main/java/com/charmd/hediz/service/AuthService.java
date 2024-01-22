package com.charmd.hediz.service;

import com.charmd.hediz.dto.CustomerDTO;

import java.util.HashMap;

public interface AuthService {
    public CustomerDTO getUserById(String cust_id);
    public void signUp(CustomerDTO customerDto);
    public int duplicateCheck(String cust_id);
    public String findId(HashMap<String, String> custNameAndPhoneMap);
    public int checkPassword(HashMap<String, String> custIdAndNameMap);
    public int changePassword(HashMap<String, String> custPwMap);
}
