package com.charmd.hediz.controller;

import com.charmd.hediz.dto.HairshopDTO;
import com.charmd.hediz.dto.TokenDTO;
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
import org.springframework.web.bind.annotation.*;
import com.charmd.hediz.jwt.JwtUtil;

import java.util.HashMap;

@Api
@RestController
@CrossOrigin("*")
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

    @PostMapping("/sign-in")
    public ResponseEntity<TokenDTO> signIn(@RequestBody HashMap<String, String> signInMap) {
        System.out.println("로그인 페이지");
        // id 값
        String id = signInMap.get("shop_id");
        String pw = signInMap.get("shop_pw");
        //사용자 인증정보 저장
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(id, pw);
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        int shopSeq = authService.getUserById(id).getShop_seq();
        String shopName = authService.getUserById(id).getShop_name();
        String jwt = jwtUtil.createToken(id, shopSeq, shopName);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(tokenKey, "Bearer+" + jwt);
        return new ResponseEntity<>(new TokenDTO("Bearer+" + jwt, shopSeq, shopName), httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/duplicate-check")
    public ResponseEntity<?> duplicateCheck(@RequestBody HashMap<String, String> shopIdMap) {
        System.out.println("중복확인");
        String shopId = shopIdMap.get("shop_id");
        if (shopId == null || shopId.trim().isEmpty()) {
            return ResponseEntity.ok().body(false);
        }
        int n = authService.duplicateCheck(shopId);
        System.out.println("id 개수 : " + n);
        return ResponseEntity.ok().body(n == 0);
    }

    // 회원가입
    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@RequestBody HairshopDTO hairshopDto) {
        String newPw = new BCryptPasswordEncoder().encode(hairshopDto.getShop_pw());
        hairshopDto.setShop_pw(newPw);
        authService.signUp(hairshopDto);
        return ResponseEntity.ok().body(hairshopDto);
    }

    // ID 찾기
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody HashMap<String, String> shopRegisterMap) {
        String shopRegister = shopRegisterMap.get("shop_register");
        String id = authService.findId(shopRegister);
        return ResponseEntity.ok().body(id);
    }

    // shop_id, shop_name을 통해 계정있는지 확인
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@RequestBody HashMap<String, String> shopIdAndNameMap) {
        int n = authService.checkPassword(shopIdAndNameMap);
        return ResponseEntity.ok().body(n == 1);
    }

    // 비밀번호 변경
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody HashMap<String, String> shopPwMap) {
        String newPw = new BCryptPasswordEncoder().encode(shopPwMap.get("shop_pw"));
        shopPwMap.put("shop_pw", newPw);
        int n = authService.changePassword(shopPwMap);
        if (n == 1) return ResponseEntity.ok().body(n);
        else return ResponseEntity.ok().body(n);
    }
}