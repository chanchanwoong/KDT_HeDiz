import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { classNames } from 'primereact/utils';
import { authAxios } from 'api/AxiosAPI';
import { Panel } from 'primereact/panel';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';

function MyReview() {
  const [products, setProducts] = useState([]);

  ///// 리뷰 목록을 받아오기 위한 axios 요청 (get)
  useEffect(() => {
    authAxios()
      .get(`mypage/review/${localStorage.getItem('cust_seq')}`)
      // .get(`mypage/review/1`)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, [setProducts]);

  ///// 리뷰 삭제를 위한 axios 요청 (delete)
  const deleteReview = (product) => {
    authAxios()
      .delete(`mypage/review/${product.review_seq}`)
      .then((response) => {
        console.log('리뷰 삭제 성공');
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.review_seq !== product.review_seq)
        );
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  };
  ////////////////////////// 목록 생성을 위한 템플릿
  const itemTemplate = (product, index) => {
    return (
      <div
        className='col-12'
        key={product.review_seq}
      >
        <div
          className={classNames(
            'flex flex-column xl:flex-row xl:align-items-start p-4 gap-4',
            {
              'border-top-1 surface-border': index !== 0,
            }
          )}
        >
          <img
            className='w-3 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
            src={product.review_photo}
            alt={product.review_photo}
          />
          <div className='flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4'>
            <div className='flex flex-column align-items-center sm:align-items-start gap-3'>
              <div className='text-2xl font-bold text-900'>
                {product.review_nickname}
              </div>
              <span>{product.review_date}</span>
              <div className='flex align-items-center gap-3'>
                <span className='flex align-items-center gap-2'>
                  <span className='font-semibold'>{product.style_name}</span>
                </span>
              </div>
              <Rating
                value={product.review_score}
                readOnly
                cancel={false}
              ></Rating>
              <span>{product.review_content}</span>
            </div>
          </div>
          <Button onClick={() => deleteReview(product)}>리뷰 삭제</Button>
        </div>
      </div>
    );
  };

  const listTemplate = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return <div>아직 리뷰가 없습니다. 리뷰를 작성해보세요</div>;
    }

    let list = items.map((product, index) => {
      return itemTemplate(product, index);
    });

    return <div className='grid grid-nogutter'>{list}</div>;
  };

  return (
    <Panel header='내 리뷰'>
      <div className='card'>
        <DataView
          value={products}
          listTemplate={listTemplate}
        />
      </div>
    </Panel>
  );
}

export default MyReview;
