package com.charmd.hediz.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@Alias("HairshopDTO")
public class HairshopDTO {
    private int shop_seq;
    private String shop_name;
//    private String shop_register;
//    private String shop_id;
//    private String shop_pw;
    private String shop_address;
    private String shop_intro;
    private String shop_image;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime shop_start;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime shop_end;
    private String shop_phone;
    private String shop_regular;
    private String shop_tag;

    // 별점 평균 및 개수
    private double avg_review_score;
    private int count_review;
}
