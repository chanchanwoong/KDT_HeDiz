package com.charmd.hediz.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("PayinfoDTO")
public class PayinfoDTO {
    private int style_seq;
    private String style_name;
    private int style_price;
    private int staff_seq;
    private int cust_seq;
    private String cust_phone;
    private int shop_seq;
    private String reserv_request;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate reserv_date;
    @JsonFormat(pattern = "HH:mm:ss", timezone = "Asia/Seoul")
    private LocalTime reserv_time;
    private int pay_price;
    private int reserv_stat;
    private String receipt_id;
    private int reserv_seq;
}
