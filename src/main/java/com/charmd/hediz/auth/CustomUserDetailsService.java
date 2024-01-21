package com.charmd.hediz.auth;

import java.util.*;

import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private AuthService authService;

    @Override
    public UserDetails loadUserByUsername(String cust_id) throws UsernameNotFoundException {
//        HairshopDTO hairshopDto = authService.getUserById(shopId);
        CustomerDTO customerDto = authService.getUserById(cust_id);
        if (customerDto != null) {
            List<SimpleGrantedAuthority> list = new ArrayList<>();
            UserDetails userDetails = new org.springframework.security.core.userdetails
                    .User(customerDto.getCust_id(), customerDto.getCust_pw(), list);
            System.out.println("loadUserByUsername을 통해 가져온 pw" + customerDto.getCust_pw());
            return userDetails;
        } else {
            throw new UsernameNotFoundException(cust_id + " > 해당 ID는 데이터베이스에서 찾을 수 없습니다.");
        }
    }
}
