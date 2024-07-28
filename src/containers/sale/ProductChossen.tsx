
import { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import erroImage from '@/images/error.jpg';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { formatCurrency, generateLinkGoogleImage, handleImageError, priceOptions } from '@/utils/common';
import { ChossenProduct, ResultsType, emptyResults } from './Sale';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

type Props = {
  chosenProducts: ChossenProduct[];
  results: ResultsType;
  setResults: (results: ResultsType) => void;
  setChosenProducts: (products: ChossenProduct[]) => void;
  deleteChosenProduct: (products: ChossenProduct) => void;

}

export default function ProductChossen({ chosenProducts, setChosenProducts, deleteChosenProduct, setResults }: Props) {
  const [selectedItem, setSelectedItem] = useState<ChossenProduct>();

  const toast = useRef<Toast>(null);

  useEffect(() => {
    renderChosseProducts();
  }, [chosenProducts]);

  const renderChosseProducts = () => {
    for (let i = 0; i < chosenProducts.length; i++) {
      const _chosenProduct = chosenProducts[i];
      const moneyBeforeDiscount = _chosenProduct.Number * (_chosenProduct.Price ?? 0);
      const moneyDiscount = moneyBeforeDiscount * (_chosenProduct.Discount / 100);
      const moneyAfterDiscount = moneyBeforeDiscount - moneyDiscount;

      _chosenProduct.MoneyBeforeDiscount = moneyBeforeDiscount;
      _chosenProduct.MoneyDiscount = moneyDiscount;
      _chosenProduct.MoneyAfterDiscount = moneyAfterDiscount;
    }
  };

  const bodyImage = (rowData: ChossenProduct) => {
    const src = generateLinkGoogleImage(rowData.Image) ?? erroImage;
    return (
      <Image src={src} onError={handleImageError}
        alt={rowData?.TenMon} width="100" preview />
    )
  };

  const bodyRowTotal = (rowData: ChossenProduct) => {
    return <>{formatCurrency(rowData?.MoneyAfterDiscount)}</>;
  };

  const bodyRowDiscount = (rowData: ChossenProduct) => {
    return (
      <InputNumber value={rowData?.Discount} onChange={(e: any) => {
        const value = e.value < 0 ? 0 : e.value > 100 ? 100 : e.value;
        let _chosenProducts = [...chosenProducts];
        let index = _chosenProducts.findIndex((product) => product.IDMon === rowData.IDMon);
        if (index !== -1) {
          let newDataChossen = _chosenProducts[index];
          newDataChossen.Discount = value;
          setChosenProducts(_chosenProducts);
        }
      }} />
    )
  }

  const deleteProduct = (rowData: ChossenProduct) => {
    let index = chosenProducts.findIndex((product) => product.IDMon === rowData.IDMon);
    if (index !== -1) {
      chosenProducts.splice(index, 1);
      deleteChosenProduct(rowData);
      if (chosenProducts.length === 0) {
        setResults(emptyResults);
      }
    }
  };

  const bodyDelete = (rowData: ChossenProduct) => {
    return (
      <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"
        onClick={() => { deleteProduct(rowData) }}
      />
    )
  };

  const bodySoLuong = (rowData: ChossenProduct) => {
    return (
      <InputNumber value={rowData?.Number} onChange={(e: any) => {
        const value = e.value;
        if (value <= 0) {
          deleteProduct(rowData);
          return;
        }
        let _chosenProducts = [...chosenProducts];
        let index = _chosenProducts.findIndex((product) => product.IDMon === rowData.IDMon);
        if (index !== -1) {
          let newDataChossen = _chosenProducts[index];
          newDataChossen.Number = value;
          setChosenProducts(_chosenProducts);
        }
      }} />
    )
  };

  const bodyChosePrice = (rowData: ChossenProduct) => {
    const valuePrice = rowData.Price === rowData.DonGiaBanLe ? 'DonGiaBanLe' : 'DonGiaBanSi';
    return (
      <Dropdown
        value={valuePrice}
        options={priceOptions}
        optionLabel="label"
        onChange={(e: DropdownChangeEvent) => {
          let _chosenProducts = [...chosenProducts];
          let index = _chosenProducts.findIndex((product) => product.IDMon === rowData.IDMon);
          if (index !== -1) {
            let newDataChossen = _chosenProducts[index];
            const value = e.value;
            const price = value === 'DonGiaBanLe'
              ? newDataChossen.DonGiaBanLe
              : newDataChossen.DonGiaBanSi;

            newDataChossen.Price = price;
            setChosenProducts(_chosenProducts);
          }
        }} />
    );
  }

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable value={chosenProducts}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        scrollable scrollHeight="32vh"
        selectionMode="single" selection={selectedItem}
        onSelectionChange={(e: any) => { setSelectedItem(e.value) }} dataKey="IDMon"
        resizableColumns showGridlines columnResizeMode="expand"
        globalFilterFields={["TenMon", "DVTMon", "GhiChu"]} emptyMessage="Không có dữ liệu"
      >
        <Column field="IDMon" header="Id" hidden ></Column>
        <Column field="Index" header="STT" body={(rowData, { rowIndex }) => rowIndex + 1} ></Column>
        <Column field="TenMon" header="Tên" style={{ width: '15%' }}></Column>
        <Column field="Image" header="Hình ảnh" body={bodyImage} style={{ width: '5%' }}></Column>
        <Column field="DVTMon" header="ĐVT"></Column>
        <Column header="Chọn giá" body={bodyChosePrice} className='no-print' ></Column>
        <Column field="Price" header="Giá" body={(rowData: ChossenProduct) => <>{formatCurrency(rowData?.Price)}</>} ></Column>
        <Column field='SoLuong' header="Số lượng" body={bodySoLuong} ></Column>
        <Column field='Discount' header="Chiết khấu" body={bodyRowDiscount} ></Column>
        <Column field='MoneyAfterDiscount' header="Tổng" body={bodyRowTotal} ></Column>
        <Column body={bodyDelete} ></Column>
      </DataTable>
    </div>
  );
}
