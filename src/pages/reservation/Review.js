import { useState, useEffect } from 'react';
import axios from 'axios';

import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { Panel } from 'primereact/panel';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { authAxios } from 'api/AxiosAPI';

function Review() {
  let emptyProduct = {
    review_seq: 0,
    review_reply: null,
  };

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(emptyProduct);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState('');
  const [averageScore, setAverageScore] = useState();
  const [replyModal, setReplyModal] = useState();
  const [userReview, setUserReview] = useState();
  const token = localStorage.getItem('jwtauthtoken');
  const shop_seq = localStorage.getItem('shop_seq');

  const sortOptions = [
    { staff_name: 'Price High to Low', value: '!price' },
    { staff_name: 'Price Low to High', value: 'price' },
  ];

  const showDialog = () => {
    setReplyModal(true);
  };

  const hideDialog = () => {
    setReplyModal(false);
  };

  const onInputChange = (e, review_content) => {
    const val = (e.target && e.target.value) || '';
    setProduct({ ...product, [review_content]: val });
  };

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

  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const headerTemplate = () => {
    return (
      <div className='flex justify-content-between align-items-center'>
        <span>리뷰 관리</span>
        <div className='flex align-items-center gap-4'>
          <span className='flex align-items-end gap-2 font-normal text-xl'>
            <span className='font-bold text-primary'>
              {averageScore && averageScore.toFixed(1)}
            </span>{' '}
            / 5
          </span>
          <Rating
            value={averageScore || 0}
            readOnly
            cancel={false}
          ></Rating>
        </div>
      </div>
    );
  };

  const headerDataTemplate = () => {
    return (
      <div className='flex justify-content-between align-items-center'>
        <Dropdown
          options={sortOptions}
          value={sortKey}
          optionLabel='label'
          placeholder='Sort By Price'
          onChange={onSortChange}
          className='w-full sm:w-14rem'
        />
        <span className='text-lg font-semibold'>
          총 {products.length} 개의 리뷰가 있습니다.
        </span>
      </div>
    );
  };

  const findIndexByreview_seq = (review_seq) => {
    return products.findIndex((product) => product.review_seq === review_seq);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let _products = [...products];
    let _product = { ...product };

    try {
      if (product.review_seq) {
        const index = findIndexByreview_seq(product.review_seq);
        _products[index] = _product;
        console.log(_product);

        await authAxios()
          .put(`/reservation/review`, _product)
          .then((response) => {
            console.log('Auth Response:', response.data);
          })
          .catch((error) => {
            console.error('Auth Error:', error);
          });
        setProducts(_products);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      // Handle error as needed
    }
  };

  const itemTemplate = (product) => {
    return (
      <div className='col-12'>
        <div className='flex flex-column xl:flex-row p-4 gap-4'>
          <img
            className='w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round'
            alt={product.review_photo}
          />
          <div className='flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4'>
            <div className='flex flex-column align-items-center sm:align-items-start gap-3 w-2'>
              <div>
                <div className='text-lg font-bold text-800 mb-1'>
                  {product.style_name}
                </div>
                <i className='pi pi-calendar mr-2'></i>
                <span>{product.review_date}</span>
              </div>
              <div>
                <Rating
                  value={product.review_score}
                  readOnly
                  cancel={false}
                  className='mb-2'
                />
                <Tag
                  value={product.review_date}
                  icon='pi pi-pencil'
                  className='px-3'
                ></Tag>
              </div>
            </div>

            <div className='flex flex-column gap-2 w-4'>
              <span className='font-bold'>{product.cust_name}</span>
              <span>{product.review_content}</span>
            </div>

            <div className='flex flex-column gap-2 w-4'>
              <span className='font-bold'>{product.staff_nickname}</span>
              <span>
                {product.review_reply && product.review_reply}
                {!product.review_reply && (
                  <span className='text-indigo-400'>답글을 작성해주세요</span>
                )}
              </span>
            </div>

            <Button
              icon='pi pi-pencil'
              className='p-button-rounded'
              outlined
              onClick={() => {
                setUserReview(product.review_content);
                setProduct({ ...product, review_seq: product.review_seq });
                showDialog();
              }}
            ></Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Panel
      header={headerTemplate}
      className='flex-none'
    >
      <div className='card'>
        <DataView
          value={products}
          itemTemplate={itemTemplate}
          paginator
          rows={4}
          header={headerDataTemplate()}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </div>
      <Dialog
        header='답글 달기'
        visible={replyModal}
        onHide={hideDialog}
      >
        <form onSubmit={handleFormSubmit}>
          <div className='flex flex-column gap-4 ml-5'>
            <div className='p-inputgroup'>
              <span className='p-float-label'>
                <InputText
                  value={userReview}
                  disabled
                />
              </span>
            </div>

            <InputTextarea
              id='review_reply'
              value={product.review_reply}
              onChange={(e) => onInputChange(e, 'review_reply')}
              rows={5}
              cols={30}
              placeholder='답글을 입력하세요'
            />

            <Button
              label='수정하기'
              onClick={hideDialog}
            />
          </div>
        </form>
      </Dialog>
    </Panel>
  );
}
export default Review;
