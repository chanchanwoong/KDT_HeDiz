import { formatNumberWithCommas, formatTime } from 'utils/util';
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';
import { Rating } from 'primereact/rating';

function ReviewList({ reviewList }) {
  return (
    <>
      {reviewList.map((review) => (
        <div key={review.review_seq}>
          <article className='flex align-items-start justify-content-between gap-3 my-4'>
            <img
              src={review.review_photo}
              alt={review.review_photo}
              className='w-4 flex-none'
            />
            {/* <Image
              src='https://primefaces.org/cdn/primereact/images/galleria/galleria8.jpg'
              alt='Image'
              className='w-4 flex-none'
            /> */}
            <div className='flex-grow-1'>
              <div className='flex align-items-start justify-content-between mt-0 mb-2'>
                <div className='flex flex-column'>
                  <p className='font-bold mt-0 mb-1'>{review.style_name}</p>
                  <p className='m-0 text-sm'>{review.staff_nickname}</p>
                </div>
                <div className='flex flex-column align-items-end'>
                  <Rating
                    value={review.review_score}
                    readOnly
                    cancel={false}
                    className='mb-1'
                  />
                  <p className='text-color-secondary text-xs m-0 mb-2'>
                    <span>{review.review_date} . </span>
                    <span>{review.cust_id}</span>
                  </p>
                </div>
              </div>
              <p className='mt-0 mb-2 text-sm'>{review.review_content}</p>
              {review.review_reply && (
                <p className='my-0 text-xs'>
                  <i
                    className='pi pi-comment mr-1'
                    style={{ position: 'relative', top: '2px' }}
                  ></i>
                  {review.review_reply}
                </p>
              )}
            </div>
          </article>
          <Divider />
        </div>
      ))}
    </>
  );
}

export default ReviewList;
