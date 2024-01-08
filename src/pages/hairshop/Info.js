import { BreadCrumb } from 'primereact/breadcrumb';

function Info() {
  const items = [{ label: '미용실 관리' }, { label: '미용실 정보' }];
  const home = { icon: 'pi pi-home', url: '/hairshop' };

  return (
    <>
      <BreadCrumb
        model={items}
        home={home}
      />
      <section></section>
    </>
  );
}

export default Info;
