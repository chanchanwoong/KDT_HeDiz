package com.charmd.hediz.controller;

import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.dto.TokenDTO;
import com.charmd.hediz.jwt.JwtUtil;
import com.charmd.hediz.service.AuthService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@Api
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManagerBuilder authenticationManagerBuilder;
    @Autowired
    JwtUtil jwtUtil;
    @Value("${jwt.name}")
    String tokenKey;

    @Autowired
    private AuthService authService;

    // 로그인
    @PostMapping("/sign-in")
    public ResponseEntity<TokenDTO> signIn(@RequestBody HashMap<String, String> signInMap) {
        System.out.println("입력 값 > " + signInMap);
        // id 값
        String id = signInMap.get("cust_id");
        String pw = signInMap.get("cust_pw");

        System.out.println(id + " " + pw);
        //사용자 인증정보 저장
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(id, pw);
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        int custSeq = authService.getUserById(id).getCust_seq();
        System.out.println("cust_seq > " + custSeq);
        String jwt = jwtUtil.createToken(id, custSeq);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(tokenKey, "Bearer+" + jwt);
        System.out.println("jwt > " + jwt);
        return new ResponseEntity<>(new TokenDTO("Bearer+" + jwt, custSeq), httpHeaders, HttpStatus.OK);
    }

    // 회원가입
    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody CustomerDTO customerDto) {
        System.out.println(customerDto);
        String newPw = new BCryptPasswordEncoder().encode(customerDto.getCust_pw());
        customerDto.setCust_pw(newPw);
        authService.signUp(customerDto);
        return ResponseEntity.ok().body(customerDto);
    }
}
