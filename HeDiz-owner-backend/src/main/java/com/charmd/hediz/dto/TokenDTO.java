package com.charmd.hediz.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenDTO {

    private String jwtauthtoken;
    private int shop_seq;
    private String shop_name;
}
