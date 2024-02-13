package com.charmd.hediz.service;

import java.util.HashMap;

public interface HomeService {
    public int updatePassword(HashMap<String, Object> passwordMap);
    public String getPw(int shopSeq);
}
