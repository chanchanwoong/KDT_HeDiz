import { useState, useEffect } from 'react';
import { Panel } from 'primereact/panel';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import axios from 'axios';

function Review() {
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [averageScore, setAverageScore] = useState();
  const token = localStorage.getItem('jwtauthtoken');
  const shop_seq = localStorage.getItem('shop_seq');
  useEffect(() => {
    axios
      .get('http://localhost:8080/reservation/review/' + shop_seq, {
        headers: { jwtauthtoken: token },
      })
      .then((response) => {
        console.log(response.data);
        setProducts(response.data);
        const totalScore = response.data.reduce(
          (sum, product) => sum + product.review_score,
          0
        );
        const averageScore = totalScore / response.data.length;
        setAverageScore(averageScore);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  };

  const listItem = (product) => {
    return (
      <div className='col-12'>
        <div className='flex flex-column xl:flex-row xl:align-items-start p-4 gap-4'>
          <img
            className='w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
            src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
            alt={product.review_photo}
          />
          <div className='flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4'>
            <div className='flex flex-column align-items-center sm:align-items-start gap-3'>
              <div className='text-2xl font-bold text-900'>
                {product.cust_name}
              </div>
              <Rating
                value={product.review_score}
                readOnly
                cancel={false}
              ></Rating>
              <div className='flex align-items-center gap-3'>
                <span className='flex align-items-center gap-2'>
                  <i className='pi pi-tag'></i>
                  <span className='font-semibold'>
                    {product.review_content}
                  </span>
                </span>
                <Tag
                  value={product.review_date}
                  severity={getSeverity(product)}
                ></Tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (product) => {
    return (
      <div className='col-12 sm:col-6 lg:col-12 xl:col-3 p-2'>
        <div className='p-4 border-1 surface-border surface-card border-round'>
          <div className='flex flex-wrap align-items-center justify-content-between gap-2'>
            <div className='flex align-items-center gap-2'>
              <span className='font-semibold'>{product.category}</span>
            </div>
            <Tag
              value={product.review_date}
              severity={getSeverity(product)}
            ></Tag>
          </div>
          <div className='flex flex-column align-items-center gap-3 py-5'>
            <img
              className='w-9 shadow-2 border-round'
              src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
              alt={product.name}
            />
            <div className='text-2xl font-bold'>{product.cust_name}</div>
            <Rating
              value={product.review_score}
              readOnly
              cancel={false}
            ></Rating>
          </div>
          <div className='flex align-items-center justify-content-between'>
            <span className='text-2xl font-semibold'>
              {product.review_content}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (product, layout) => {
    if (!product) {
      return;
    }

    if (layout === 'list') return listItem(product);
    else if (layout === 'grid') return gridItem(product);
  };

  const header = () => {
    return (
      <div className='flex justify-content-end'>
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value)}
        />
      </div>
    );
  };

  return (
    <>
      <Panel
        header='token에 담은 헤어샵 시퀀스로 이름 찾아서 출력'
        toggleable
      >
        <div className='col-6 p-0'>
          <div className='flex flex-column xl:flex-row xl:align-items-center gap-4'>
            <img
              className='w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
              src={`https://img.kr.news.samsung.com/kr/wp-content/uploads/2016/05/ss1.png`}
              alt='미용실 이미지'
            />
            <div className='flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4'>
              <div className='flex flex-column align-items-center sm:align-items-start gap-4'>
                <div className='text-2xl font-bold text-900'>
                  <span className='flex align-items-end gap-2 font-normal vertical-align-baseline'>
                    <span className='font-bold text-primary text-4xl'>
                      {averageScore && averageScore.toFixed(1)}
                    </span>{' '}
                    / 5
                  </span>
                </div>
                <Rating
                  value={averageScore || 0}
                  readOnly
                  cancel={false}
                ></Rating>
              </div>
              <div className='flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2'>
                <span className='text-2xl font-semibold'>
                  {products.length} 개의 리뷰가 있습니다.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Panel>
      <DataView
        value={products}
        itemTemplate={itemTemplate}
        layout={layout}
        header={header()}
      />
    </>
  );
}

export default Review;
