import { Link } from 'react-router-dom';
import { formatDecimal, formatNumberWithCommas } from 'utils/util';
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';

function HairShopList({ hairshopList }) {
  return (
    <>
      {hairshopList.map((hairshop) => (
        <Link
          to={`/hairshop/${hairshop.shop_seq}`}
          key={hairshop.shop_seq}
        >
          <div>
            {/* <img
              src={hairshop.shop_image}
              alt={hairshop.shop_name}
            /> */}
            <Image
              src='https://primefaces.org/cdn/primereact/images/galleria/galleria7.jpg'
              alt='Image'
              width='100%'
              height='200px'
            />
            <p className='flex align-items-end justify-content-between mb-1'>
              <span className='font-bold text-lg'>{hairshop.shop_name}</span>
              <span>
                <i className='pi pi-star mr-1'></i>
                {formatDecimal(hairshop.avg_review_score)}
                <i className='pi pi-comment ml-3 mr-1'></i>
                {formatNumberWithCommas(hairshop.count_review)}
              </span>
            </p>
            <p className='text-color-secondary m-0'>{hairshop.shop_address}</p>
          </div>
          <Divider />
        </Link>
      ))}
    </>
  );
}

export default HairShopList;
