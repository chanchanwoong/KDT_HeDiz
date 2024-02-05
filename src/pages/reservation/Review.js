import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
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
  const [replyModal, setReplyModal] = useState();
  const [userReview, setUserReview] = useState();
  const shop_seq = localStorage.getItem('shop_seq');

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
    authAxios()
      .get(`/reservation/review/` + shop_seq)
      .then((response) => {
        console.log('Auth Response:', response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Auth Error:', error);
      });
  }, []);

  const headerDataTemplate = () => {
    return (
      <div className='flex justify-content-between align-items-center'>
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
          <div className='flex flex-column sm:flex-row justify-content-between align-items-center flex-1 gap-4'>
            <div className='flex flex-column align-items-center sm:align-items-start gap-3 w-2'>
              <div>
                <div className='text-lg font-bold text-800 mb-1'>
                  {product.style_name}
                </div>
                <i className='pi pi-calendar mr-2'></i>
                <span>{product.reserv_date}</span>
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

            {product.review_photo && (
              <img
                className='w-2 shadow-2 block xl:block mx-auto border-round'
                src={product.review_photo}
                alt={product.cust_name}
              />
            )}
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
    <div className='card h-full'>
      <h2 className='flex align-items-center justify-content-between'>
        리뷰 관리
      </h2>
      <div>
        {products.length === 0 ? (
          <div className='text-center'>데이터가 없습니다.</div>
        ) : (
          <DataView
            value={products}
            itemTemplate={itemTemplate}
            paginator
            rows={4}
            header={headerDataTemplate()}
          />
        )}
      </div>
      <Dialog
        header='답글 달기'
        visible={replyModal}
        onHide={hideDialog}
        className='w-4'
      >
        <form onSubmit={handleFormSubmit}>
          <div className='flex flex-column gap-4'>
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
              autoResize
            />

            <Button
              label={product.review_reply ? '수정하기' : '등록하기'}
              onClick={hideDialog}
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}
export default Review;
