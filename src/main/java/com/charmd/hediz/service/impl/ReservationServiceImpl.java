package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.ReservationDAO;
import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.service.ReservationService;
import kr.co.bootpay.Bootpay;
import kr.co.bootpay.model.request.Cancel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

@Service("ReservationService")
public class ReservationServiceImpl implements ReservationService {
    @Autowired
    ReservationDAO dao;
    @Override
    public List<ReservationDTO> currentReservation(int cust_seq) {
        return dao.currentReservation(cust_seq);
    }

    @Override
    @Transactional
    public int cancelReservation(int reserv_seq, String receipt_id) {
        String extracted_text = receipt_id.replace("{", "").replace("}", ""); // 중괄호 제거
        String[] arr = extracted_text.split(":");  // 세미콜론 기준 문자열 나누기
        String result = arr[1].replaceAll("\"", ""); // 빈 문자열 "" 제거

        // receipt_id를 통해 결제취소 요청
        HashMap<String, Object> res = null;
        int numberOfCancel = 0;
        int numberOfReservStat = 0;
        int numberOfPayStat = 0;
        try {
            Bootpay bootpay = new Bootpay("65af183ce57a7e001b410f16", "McUesnjacysjVSlaFBsWJL/fZqD3GUcQq1v8SbXplzQ=");
            HashMap<String, Object> token = bootpay.getAccessToken();
            if (token.get("error_code") != null) { //failed
                System.out.println("토큰 에러 발생");
            }
            Cancel cancel = new Cancel();
            cancel.receiptId = result;
            cancel.cancelUsername = "HeDiz";
            cancel.cancelMessage = "예약 취소";
            res = bootpay.receiptCancel(cancel);
            if (res.get("error_code") == null) { //success
                System.out.println("receiptCancel success: " + res);
                numberOfCancel++;
                // reserv_stat을 0에서 2로 변경 && receipt_id를 "cancle" 변경
                numberOfReservStat = dao.changeReservStat(reserv_seq);
                // pay_stat : 0 -> 1
                numberOfPayStat = dao.changePayStat(reserv_seq);
            } else {
                System.out.println("receiptCancel false: " + res);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return numberOfCancel + numberOfReservStat + numberOfPayStat;
    }

    // 대기고객 중 가능한 cust_seq 필터링
    @Override
    public List<Integer> getStandByCustListUsingFilter(int reserv_seq) {
        return dao.getStandByCustListUsingFilter(reserv_seq);
    }

    @Override
    public List<String> getCToken(List<Integer> standByCustList) {
        return dao.getCToken(standByCustList);
    }

    @Override
    public int deleteStandBy(int reserv_seq) {
        return dao.deleteStandBy(reserv_seq);
    }
}
