import React, { useEffect } from 'react';

const KakaoMapAPI = ({ hairshopLocation }) => {
  // hairshopLocation을 비구조화하여 개별적인 변수로 추출
  useEffect(() => {
    console.log(hairshopLocation);
    // Kakao 객체가 로드되었는지 확인
    if (window.kakao) {
      const container = document.getElementById('map');
      let options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      // geocoder.addressSearch를 useEffect 내에서 실행
      const geocoder = new window.kakao.maps.services.Geocoder();

      const callback = function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log(result);

          // 검색된 좌표로 options.center 업데이트
          options = {
            center: new window.kakao.maps.LatLng(result[0].y, result[0].x),
            level: 3,
          };
          var markerPosition = new window.kakao.maps.LatLng(
            result[0].y,
            result[0].x
          );

          // 마커를 생성합니다
          var marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });

          // 마커가 지도 위에 표시되도록 설정합니다
          marker.setMap(map);

          console.log(result[0].x, result[0].y);

          // 기존의 지도의 중심을 변경
          map.setCenter(options.center);
        }
      };

      geocoder.addressSearch(hairshopLocation, callback);
    }
  }, [hairshopLocation]);

  return (
    <div
      id='map'
      style={{ width: '100%', height: '100%' }}
    ></div>
  );
};

export default KakaoMapAPI;
