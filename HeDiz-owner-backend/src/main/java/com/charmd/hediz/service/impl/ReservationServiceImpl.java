package com.charmd.hediz.service.impl;

import com.charmd.hediz.dao.ReservationDAO;
import com.charmd.hediz.dto.ReservationDTO;
import com.charmd.hediz.service.ReservationService;
import kr.co.bootpay.Bootpay;
import kr.co.bootpay.model.request.Cancel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;

@Service("reservationService")
@Transactional
public class ReservationServiceImpl implements ReservationService {
    @Autowired
    ReservationDAO dao;

    @Override
    public List<ReservationDTO> reservationFindAll(int shopSeq) {
        return dao.reservationFindAll(shopSeq);
    }



    @Override
    public int getReservStat(int reserv_seq) {
        return dao.getReservStat(reserv_seq);
    }

    @Override
    @Transactional
    public boolean reservStatChange(HashMap<String, Integer> reservSeqAndStatMap) {
        // reserv_seq = 1, 방문 완료
        if (reservSeqAndStatMap.get("reserv_stat") == 1) {
            return dao.reservStatChange(reservSeqAndStatMap)==1;
        }
        // reserv_seq = 3, 노쇼인 상황
        // 90% 환불 처리, T_RESERVATION의 reserv_stat = 3으로 변경, T_PAYMENT의 pay_stat = 1로 변경
        else {
            int numberOfCancel = 0;
            int numberOfReservStat = 0;
            int numberOfPayStat = 0;
            // pay_price 조회
            int pay_price = dao.getPayPrice(reservSeqAndStatMap.get("reserv_seq"));
            // receipt_id 조회
            String receipt_id = dao.getReciptId(reservSeqAndStatMap.get("reserv_seq"));
            // receipt_id를 통해 결제취소 요청
            HashMap<String, Object> res = null;
            try {
                Bootpay bootpay = new Bootpay("65af183ce57a7e001b410f16", "McUesnjacysjVSlaFBsWJL/fZqD3GUcQq1v8SbXplzQ=");
                HashMap<String, Object> token = bootpay.getAccessToken();
                if (token.get("error_code") != null) { //failed
                    System.out.println("토큰 에러 발생");
                }
                Cancel cancel = new Cancel();
                cancel.receiptId = receipt_id;
                cancel.cancelUsername = "HeDiz";
                cancel.cancelMessage = "노쇼로 인한 예약 취소";
                cancel.cancelPrice = pay_price * 0.9;
                res = bootpay.receiptCancel(cancel);
                if (res.get("error_code") == null) { //success
                    numberOfCancel++;
                    System.out.println("receiptCancel success: " + res);
                    // reserv_stat = 3으로 변경
                    numberOfReservStat = dao.reservStatChange(reservSeqAndStatMap);
                    // pay_stat = 1 로 변경
                    numberOfPayStat = dao.changePayStat(reservSeqAndStatMap.get("reserv_seq"));
                } else {
                    System.out.println("receiptCancel false: " + res);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return numberOfCancel + numberOfReservStat + numberOfPayStat == 3;
        }
    }

    @Override
    public List<ReservationDTO> realtimeFindAll(int shopSeq) {
        return dao.realtimeFindAll(shopSeq);
    }
    @Override
    public List<ReservationDTO> realtimeFindCurrent(int shopSeq) {
        return dao.reservationFindCurrent(shopSeq);
    }

    @Override
    public int reservationUpdate(HashMap<String, Integer> reservationStatAndSeqMap) {
        return dao.reservationUpdate(reservationStatAndSeqMap);
    }

    @Override
    public ReservationDTO reservationFind(int reservSeq) {
        return dao.reservationFind(reservSeq);
    }
}
