package com.charmd.hediz.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@Alias("CustomerDTO")
public class CustomerDTO {
    private int cust_seq;
    private String cust_name;
    private String cust_id;
    private String cust_pw;
    private String cust_phone;
    private int cust_visit;
    private int cust_gender;
    private int cust_level;
    // 집계함수 결과
    private int stat_cancel;
    private int stat_complete;
    private int stat_noshow;
}
