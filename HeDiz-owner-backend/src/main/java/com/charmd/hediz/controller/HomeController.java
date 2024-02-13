package com.charmd.hediz.controller;

import com.charmd.hediz.dto.DashboardDTO;
import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.service.DashboardService;
import com.charmd.hediz.service.HomeService;
import com.charmd.hediz.service.ReservationService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Api
@RestController
@CrossOrigin("*")
@RequestMapping("/home")
public class HomeController {
    @Autowired
    private HomeService homeService;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private DashboardService dashboardService;

    /* 금일 예약상태별 카운트 개수 */
    @GetMapping("dashboard/today/{shop_seq}")
    public ResponseEntity<?> countByReservationStatusPerDay(@PathVariable("shop_seq") int shop_seq){
        List<DashboardDTO> dashboardList;
        dashboardList = dashboardService.countByReservationStatusPerDay(shop_seq);
        return ResponseEntity.ok().body(dashboardList);
    }

    /* 최근 6개월 매출 */
    @GetMapping("dashboard/summary/{shop_seq}")
    public ResponseEntity<?> salesLastSixMonths(@PathVariable("shop_seq") int shop_seq){
        List<DashboardDTO> dashboardList;
        dashboardList = dashboardService.salesLastSixMonths(shop_seq);
        return ResponseEntity.ok().body(dashboardList);
    }

    /* 고객 방문 현황 */
    @GetMapping("dashboard/week/{shop_seq}")
    public ResponseEntity<?> customerVisitStatus(@PathVariable("shop_seq") int shop_seq){
        List<DashboardDTO> dashboardList;
        dashboardList = dashboardService.customerVisitStatus(shop_seq);
        return ResponseEntity.ok().body(dashboardList);
    }

    // 현재 예약 상태 조회
    @GetMapping("realtime-reservation/{shop_seq}")
    public ResponseEntity<?> realtimeReservation(@PathVariable("shop_seq") int shopSeq){
        List<ReservationDTO> reservationList;
        reservationList = reservationService.realtimeFindAll(shopSeq);
        return ResponseEntity.ok().body(reservationList);
    }

    @GetMapping("realtime-reservation/{shop_seq}/current")
    public ResponseEntity<?> realtimeReservationCurrent(@PathVariable("shop_seq") int shopSeq){
        List<ReservationDTO> reservationList;
        reservationList = reservationService.realtimeFindCurrent(shopSeq);
        return ResponseEntity.ok().body(reservationList);
    }

    // 비밀번호 수정
    // shop_name, 수정 전 패스워드, 수정 후 패스워드 요청된다.
    @PostMapping("mypage/{shop_seq}")
    public ResponseEntity<?> mypage(@PathVariable("shop_seq") int shopSeq, @RequestBody HashMap<String, Object> passwordMap){
        passwordMap.put("shop_seq", shopSeq);
        // DB에서 실제 pw 가져오기
        String pw = homeService.getPw(shopSeq);
        // pw를 가지고 입력한 것과 비교(match)
        boolean matchPw = new BCryptPasswordEncoder().matches((CharSequence) passwordMap.get("before_password"), pw);
        // 일치한다면 비밀번호 변경
        if (matchPw){
            String afterPw = new BCryptPasswordEncoder().encode(passwordMap.get("after_password").toString());
            passwordMap.put("after_password", afterPw);
            int n = homeService.updatePassword(passwordMap);
            return ResponseEntity.ok().body(n==1);
        }else{
            return ResponseEntity.ok().body(false);
        }
    }
}