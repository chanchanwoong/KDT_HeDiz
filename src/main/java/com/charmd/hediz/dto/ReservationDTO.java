package com.charmd.hediz.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
//@JsonInclude(JsonInclude.Include.NON_NULL)
@Alias("ReservationDTO")
public class ReservationDTO {
    private int reserv_seq;
    private int style_seq;
    private int cust_seq;
    private int shop_seq;
    private String reserv_request;

    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate reserv_date;
    @JsonFormat(pattern = "HH:mm:ss", timezone = "Asia/Seoul")
    private LocalTime reserv_time;
    private int reserv_stat;
    private int staff_seq;

    // join column
    private String cust_name;
    private String staff_nickname;
    private String style_name;
    private String cust_phone;
    private String shop_image;
    private String shop_name;
    private int style_price;
    @JsonFormat(pattern = "HH:mm:ss", timezone = "Asia/Seoul")
    private LocalTime style_time;
    @JsonFormat(pattern = "HH:mm:ss", timezone = "Asia/Seoul")
    private LocalTime reserv_end_time;
    @JsonFormat(pattern = "HH:mm:ss", timezone = "Asia/Seoul")
    private LocalTime shop_start;
    @JsonFormat(pattern = "HH:mm:ss", timezone = "Asia/Seoul")
    private LocalTime shop_end;
    private String staff_intro;
    @JsonFormat(pattern = "HH:mm:ss", timezone = "Asia/Seoul")
    private LocalTime hope_style_time;
}
