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
        // id 값
        String id = signInMap.get("cust_id");
        String pw = signInMap.get("cust_pw");
        //사용자 인증정보 저장
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(id, pw);
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        int custSeq = authService.getUserById(id).getCust_seq();
        String custName = authService.getUserById(id).getCust_name();
        String jwt = jwtUtil.createToken(id, custSeq, custName);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(tokenKey, "Bearer+" + jwt);
        return new ResponseEntity<>(new TokenDTO("Bearer+" + jwt, custSeq, custName), httpHeaders, HttpStatus.OK);
    }

    // 회원가입
    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody CustomerDTO customerDto) {
        String newPw = new BCryptPasswordEncoder().encode(customerDto.getCust_pw());
        customerDto.setCust_pw(newPw);
        authService.signUp(customerDto);
        return ResponseEntity.ok().body(customerDto);
    }

    // 회원가입_ID 중복 확인
    @PostMapping("/duplicate-check")
    public ResponseEntity<?> duplicateCheck(@RequestBody HashMap<String, String> IdMap) {
        String cust_id = IdMap.get("cust_id");
        if (cust_id == null || cust_id.trim().isEmpty()) {
            return ResponseEntity.ok().body(false);
        }
        int n = authService.duplicateCheck(cust_id);
        System.out.println("id 개수 : " + n);
        return ResponseEntity.ok().body(n == 0);
    }

    // cust_id 찾기
    // 이름, 전화번호 입력
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody HashMap<String, String> custNameAndPhoneMap) {
        String id = authService.findId(custNameAndPhoneMap);
        return ResponseEntity.ok().body(id);
    }

    // cust_id, shop_name을 통해 계정있는지 확인
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@RequestBody HashMap<String, String> custIdAndNameMap) {
        int n = authService.checkPassword(custIdAndNameMap);
        return ResponseEntity.ok().body(n == 1);
    }

    // 비밀번호 변경
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody HashMap<String, String> custPwMap) {
        String newPw = new BCryptPasswordEncoder().encode(custPwMap.get("cust_pw"));
        custPwMap.put("cust_pw", newPw);
        int n = authService.changePassword(custPwMap);
        if (n == 1) return ResponseEntity.ok().body(n);
        else return ResponseEntity.ok().body(n);
    }
}
