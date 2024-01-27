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

    // reserv_stat : 0 -> 2
    // receipt_id : 결제 영수증 id -> "cancel"
    // pay_stat : 0 -> 1
    @Override
    @Transactional
    public int cancelReservation(int reserv_seq, String receipt_id) {
        // receipt_id를 통해 결제취소 요청
        HashMap<String, Object> res = null;
        int numberOfCancel = 0;
        try {
            Bootpay bootpay = new Bootpay("65af183ce57a7e001b410f16", "McUesnjacysjVSlaFBsWJL/fZqD3GUcQq1v8SbXplzQ=");
            HashMap<String, Object> token = bootpay.getAccessToken();
            if (token.get("error_code") != null) { //failed
                System.out.println("토큰 에러 발생");
            }
            Cancel cancel = new Cancel();
            cancel.receiptId = receipt_id;
            cancel.cancelUsername = "HeDiz";
            cancel.cancelMessage = "예약 취소";
            res = bootpay.receiptCancel(cancel);
            numberOfCancel++;
            if (res.get("error_code") == null) { //success
                System.out.println("receiptCancel success: " + res);
            } else {
                System.out.println("receiptCancel false: " + res);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // reserv_stat을 0에서 2로 변경 && receipt_id를 "cancle" 변경
        int numberOfReservStat = dao.changeReservStat(reserv_seq);
        // pay_stat : 0 -> 1
        int numberOfPayStat = dao.changePayStat(reserv_seq);
        return numberOfCancel + numberOfReservStat + numberOfPayStat;
    }
}
