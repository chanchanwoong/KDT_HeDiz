import { useState, useEffect } from 'react';

import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';

import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { ProductService } from '../../service/ProduectService';

function Review() {
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState('grid');

  useEffect(() => {
    ProductService.getProducts().then((data) => setProducts(data.slice(0, 12)));
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
            alt={product.name}
          />
          <div className='flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4'>
            <div className='flex flex-column align-items-center sm:align-items-start gap-3'>
              <div className='text-2xl font-bold text-900'>{product.name}</div>
              <Rating
                value={product.rating}
                readOnly
                cancel={false}
              ></Rating>
              <div className='flex align-items-center gap-3'>
                <span className='flex align-items-center gap-2'>
                  <i className='pi pi-tag'></i>
                  <span className='font-semibold'>{product.category}</span>
                </span>
                <Tag
                  value={product.inventoryStatus}
                  severity={getSeverity(product)}
                ></Tag>
              </div>
            </div>
            <div className='flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2'>
              <span className='text-2xl font-semibold'>${product.price}</span>
              <Button
                icon='pi pi-shopping-cart'
                className='p-button-rounded'
                disabled={product.inventoryStatus === 'OUTOFSTOCK'}
              ></Button>
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
              <i className='pi pi-tag'></i>
              <span className='font-semibold'>{product.category}</span>
            </div>
            <Tag
              value={product.inventoryStatus}
              severity={getSeverity(product)}
            ></Tag>
          </div>
          <div className='flex flex-column align-items-center gap-3 py-5'>
            <img
              className='w-9 shadow-2 border-round'
              src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
              alt={product.name}
            />
            <div className='text-2xl font-bold'>{product.name}</div>
            <Rating
              value={product.rating}
              readOnly
              cancel={false}
            ></Rating>
          </div>
          <div className='flex align-items-center justify-content-between'>
            <span className='text-2xl font-semibold'>${product.price}</span>
            <Button
              icon='pi pi-shopping-cart'
              className='p-button-rounded'
              disabled={product.inventoryStatus === 'OUTOFSTOCK'}
            ></Button>
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
        header='{미용실 이름} 전체 별점'
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
                    <span className='font-bold text-primary text-4xl'>4.2</span>{' '}
                    / 5
                  </span>
                </div>
                <Rating
                  value={4.2}
                  readOnly
                  cancel={false}
                ></Rating>
              </div>
              <div className='flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2'>
                <span className='text-2xl font-semibold'>[00,000개]</span>
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
