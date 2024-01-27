import { Bootpay } from '@bootpay/client-js';

export async function BootpayAPI({ payinfo }) {
  try {
    /////////// 부트페이에 요청 하는 API
    const response = await Bootpay.requestPayment({
      application_id: process.env.REACT_APP_BOOTPAY_API_KEY,
      // price: payinfo.stlye_price,
      price: 100,
      order_name: payinfo.style_name,
      order_id: 'TEST_ORDER_ID',
      tax_free: 0,
      user: {
        id: localStorage.getItem('cust_seq'),
        username: localStorage.getItem('cust_name'),
        phone: '01000000000',
        email: 'test@test.com',
      },
      items: [
        {
          id: 'item_id',
          name: payinfo.style_name,
          qty: 1,
          // price: payinfo.stlye_price,
          price: 100,
        },
      ],
      extra: {
        open_type: 'iframe',
        card_quota: '0,2,3',
        escrow: false,
      },
    });

    switch (response.event) {
      case 'issued':
        // 가상계좌 입금 완료 처리
        break;
      case 'done':
        console.log(response);
        break;
      case 'confirm':
        console.log(response.receipt_id);
        const confirmedData = await Bootpay.confirm();
        if (confirmedData.event === 'done') {
        }
        break;
    }
    return response; // 부트페이 API 호출이 완료되면 response 반환
  } catch (e) {
    // 예외 처리
    console.log(e.message);
    throw e; // 예외를 다시 던져서 호출한 쪽에서 처리할 수 있도록 함
  }
}
