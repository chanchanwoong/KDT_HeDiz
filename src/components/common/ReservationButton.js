import { Button } from "primereact/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ReservationButton() {
    const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('jwtauthtoken'));

  const checkToken = (e) => {
    if (token) {
        navigate('reservation/reservation');
    } else {
        navigate('/auth/sign-in');
    }
  }

  return (
    <div
      className="sticky bottom-0 left-0 right-0 flex justify-content-center py-4"
      style={{ backgroundColor: 'primary' }}
    >
      <Button onClick={checkToken}>예약하기</Button>
    </div>
  );
}

export default ReservationButton;
