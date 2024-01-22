import { Divider } from 'primereact/divider';
import ChangePassword from '../../components/common/ChangePassword';
import { Button } from 'primereact/button';
import { useState } from 'react';

function Mypage() {
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  const handlePasswordChangeButtonClick = () => {
    setShowChangePasswordDialog(true);
  };

  const handlePasswordChangeDialogHide = () => {
    setShowChangePasswordDialog(false);
  };

  return (
    <>
      <span className='font-bold text-3xl'>마이페이지</span>
      <div className='flex justify-content-between'>
        <span>{localStorage.getItem('cust_name')}님 안녕하세요</span>
        <Button onClick={handlePasswordChangeButtonClick}>전화번호 수정</Button>
      </div>
      <Divider />
      <div className='flex flex-column'>
        <span>내 리뷰</span>
        <span>내 예약 내역</span>
        <span>내 정보</span>
      </div>

      {/* Include the ChangePassword component and pass the necessary props */}
      <ChangePassword
        visible={showChangePasswordDialog}
        onHide={handlePasswordChangeDialogHide}
      />
    </>
  );
}

export default Mypage;
