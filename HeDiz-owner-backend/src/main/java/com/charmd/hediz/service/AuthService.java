package com.charmd.hediz.service;

import com.charmd.hediz.dto.HairshopDTO;

import java.util.HashMap;

public interface AuthService {
    public void signUp(HairshopDTO hairshopDto);
    public int duplicateCheck(String shopId);
    public HairshopDTO getUserById(String shopId);
    public String findId(String shopRegister);
    public int checkPassword(HashMap<String, String> shopIdAndNameMap);
    public int changePassword(HashMap<String, String> shopPwMap);

}
