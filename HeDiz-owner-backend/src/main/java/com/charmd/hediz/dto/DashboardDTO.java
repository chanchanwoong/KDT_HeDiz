package com.charmd.hediz.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("DashboardDTO")
public class DashboardDTO {
    private int reserv_stat;
    private int count;
    private int count_stat_1;
    private int count_stat_2;
    private int count_stat_3;
    private int sales_amount;
    private String date;
}
