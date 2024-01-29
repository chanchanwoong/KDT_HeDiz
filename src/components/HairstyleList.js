import { Link } from 'react-router-dom';
import { formatNumberWithCommas, formatTime } from 'utils/util';
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';

function HairstyleList({ hairstyleList, shopSeq }) {
  // 카테고리 그룹화
  const groupedStyles = hairstyleList.reduce((groups, style) => {
    const groupName = style.cate_name || '기타';
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(style);
    return groups;
  }, {});

  return (
    <>
      {Object.entries(groupedStyles).map(([groupName, styles]) => (
        <div
          key={groupName}
          className='mb-6'
        >
          <p className='font-bold text-lg'>{groupName}</p>
          {styles.map((hairstyle) => (
            <div key={hairstyle.style_seq}>
              <Link
                to={`/hairshop/${shopSeq}/hairstyle/${hairstyle.style_seq}`}
              >
                <article className='flex justify-content-between gap-4 my-4'>
                  {/* <img
                  src={hairstyle.style_image}
                  alt={hairstyle.style_name}
                /> */}
                  <Image
                    src='https://primefaces.org/cdn/primereact/images/galleria/galleria10.jpg'
                    alt='Image'
                    className='w-4 flex-none'
                  />
                  <div className='flex-grow-1'>
                    <p className='font-bold my-2'>
                      {hairstyle.style_name}
                      <span className='text-color-secondary pl-2'>
                        ({formatTime(hairstyle.style_time)})
                      </span>
                    </p>
                    <p className='mt-0 mb-1'>
                      <span className='font-bold mr-2'>
                        {formatNumberWithCommas(hairstyle.style_price)}
                      </span>
                      <span>{hairstyle.style_gender}</span>
                    </p>
                    <p className='w-10 text-color-secondary text-sm m-0 mb-2'>
                      {hairstyle.style_intro}
                    </p>
                  </div>
                </article>
              </Link>
              <Divider />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default HairstyleList;
