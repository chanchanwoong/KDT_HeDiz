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
  const [staffReview, setStaffReview] = useState();
  const token = localStorage.getItem('jwtauthtoken');
  const shop_seq = localStorage.getItem('shop_seq');
  const shop_name = localStorage.getItem('shop_name');

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

  const header = () => {
    return (
      <Dropdown
        options={sortOptions}
        value={sortKey}
        optionLabel='label'
        placeholder='Sort By Price'
        onChange={onSortChange}
        className='w-full sm:w-14rem'
      />
    );
  };

  const findIndexByreview_seq = (review_seq) => {
    return products.findIndex((product) => product.review_seq === review_seq);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let _products = [...products];
    let _product = { ...product };
    const index = findIndexByreview_seq(_product.review_seq);
    _products[index] = _product;
    try {
      const response = await axios.put(
        `http://localhost:8080/reservation/review/${_product.review_seq}`,
        staffReview,

        {
          headers: {
            'Content-Type': 'application/json',
            jwtauthtoken: token,
          },
        }
      );
    } catch (error) {
      console.error('Error updating info:', error);
    }
  };

  const itemTemplate = (product) => {
    setUserReview(product.review_content);
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
                <div className=''>
                  {product.style_name}
                  <span style={{ fontSize: '14px' }}>
                    담당 디자이너: {product.staff_nickname}
                  </span>
                </div>
                <Rating
                  value={product.review_score}
                  readOnly
                  cancel={false}
                ></Rating>
              </div>

              <div className='flex align-items-center gap-3'>
                <span
                  style={{ fontSize: '25px' }}
                  className='font-semibold'
                >
                  {product.review_content}
                </span>
              </div>
              <div className='flex align-items-center gap-3'>
                <span className='font-semibold'>{product.cust_name}</span>
                <Tag value={product.review_date}></Tag>
              </div>
            </div>
            <div className='flex align-items-center gap-3'>
              <span className='font-semibold'>
                답글 : {product.review_reply}
              </span>
            </div>
            <Button
              icon='pi pi-pencil'
              className='p-button-rounded'
              onClick={() => {
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
    <Panel header='리뷰 관리'>
      <div className='card'>
        <DataView
          value={products}
          itemTemplate={itemTemplate}
          paginator
          rows={5}
          header={header()}
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
              value={staffReview}
              onChange={(e) => setStaffReview(e.target.value)}
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
