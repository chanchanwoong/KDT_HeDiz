package com.charmd.hediz.controller;


import com.charmd.hediz.dto.CustomerDTO;
import com.charmd.hediz.service.CustomerService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api
@RestController
@CrossOrigin("*")
@RequestMapping("/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    // 모든 고객 조회
    @GetMapping("total/{shop_seq}")
    public ResponseEntity<?> allCustomerSelect(@PathVariable("shop_seq") String shopSeq){
        List<CustomerDTO> customerList;
        customerList = customerService.allCustomerSelect(shopSeq);
        return ResponseEntity.ok().body(customerList);
    }

}
