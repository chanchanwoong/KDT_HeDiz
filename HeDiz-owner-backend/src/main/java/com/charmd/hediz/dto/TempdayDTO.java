package com.charmd.hediz.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("TempdayDTO")
public class TempdayDTO {
    private int temp_seq;
    private int shop_seq;
    private int staff_seq;
    private String staff_nickname;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate temp_start;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate temp_end;
    private String temp_memo;
    private String shop_regular;
}

