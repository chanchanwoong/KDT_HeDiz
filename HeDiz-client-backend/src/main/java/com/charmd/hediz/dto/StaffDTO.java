package com.charmd.hediz.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Alias("StaffDTO")
public class StaffDTO {
    private int staff_seq;
    private String staff_name;
    private String staff_role;
    private String staff_image;
    private String staff_phone;
    private String staff_intro;
    private String staff_nickname;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private int shop_seq;
}
