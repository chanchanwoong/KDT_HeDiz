package com.charmd.hediz.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("ReviewDTO")
public class ReviewDTO {
    private int review_seq;
    private int shop_seq;
    private int reserv_seq;
    private BigDecimal review_score;
    private String review_content;
    private String review_photo;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date review_date;
    private String review_reply;

    // join column
    private String cust_name;
    private String staff_nickname;
    private String style_name;
    private String shop_name;

}