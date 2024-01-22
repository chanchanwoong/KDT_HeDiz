package com.charmd.hediz.dao;

import com.charmd.hediz.dto.CustomerDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;

@Repository
public class AuthDAO {
    @Autowired
    SqlSessionTemplate session;

    public CustomerDTO getUserById(String cust_id){
        return session.selectOne("com.config.AuthMapper.getUserById", cust_id);
    }
    public void signUp(CustomerDTO customerDto){
        session.insert("com.config.AuthMapper.signUp", customerDto);
    }
    public int duplicateCheck(String cust_id){
        return session.selectOne("com.config.AuthMapper.duplicateCheck", cust_id);
    }
    public String findId(HashMap<String, String> custNameAndPhoneMap){
        return session.selectOne("com.config.AuthMapper.findId", custNameAndPhoneMap);
    }
    public int checkPassword(HashMap<String, String> custIdAndNameMap){
        return session.selectOne("com.config.AuthMapper.checkPassword", custIdAndNameMap);
    }
    public int changePassword(HashMap<String, String> custPwMap){
        return session.update("com.config.AuthMapper.changePassword", custPwMap);
    }
}
