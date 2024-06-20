
import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Product } from '@/models';
import { Toast } from 'primereact/toast';
import erroImage from '@/images/error.jpg';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { formatCurrency, handleImageError, linkImageGG } from '@/utils/common';
import { ChossenProduct } from './Sale';
import { InputNumber } from 'primereact/inputnumber';

type Props = {
  chosenProducts: ChossenProduct[];
  setChosenProducts: (products: ChossenProduct[]) => void;
  deleteChosenProduct: (products: ChossenProduct) => void;
}

export default function ProductChossen({ chosenProducts, setChosenProducts,deleteChosenProduct }: Props) {
  const [selectedItem, setSelectedItem] = useState<ChossenProduct>();

  const toast = useRef<Toast>(null);

  const bodyImage = (rowData: ChossenProduct) => {
    return (
      <Image src={linkImageGG + rowData?.Image ?? erroImage} onError={handleImageError}
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
          const moneyBeforeDiscount = newDataChossen.Number * newDataChossen.DonGiaBanLe;
          const moneyDiscount = moneyBeforeDiscount * (value / 100);
          const moneyAfterDiscount = moneyBeforeDiscount - moneyDiscount;
          
          newDataChossen.Discount = value;
          newDataChossen.MoneyBeforeDiscount = moneyBeforeDiscount;
          newDataChossen.MoneyDiscount = moneyDiscount;
          newDataChossen.MoneyAfterDiscount = moneyAfterDiscount;

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
          const moneyBeforeDiscount = value * newDataChossen.DonGiaBanLe;
          const moneyDiscount = moneyBeforeDiscount * (newDataChossen.Discount / 100);
          const moneyAfterDiscount = moneyBeforeDiscount - moneyDiscount;

          newDataChossen.Number = value;
          newDataChossen.MoneyBeforeDiscount = moneyBeforeDiscount;
          newDataChossen.MoneyDiscount = moneyDiscount;
          newDataChossen.MoneyAfterDiscount = moneyAfterDiscount;

          setChosenProducts(_chosenProducts);
        }
      }} />
    )
  };

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
        <Column field="DonGiaBanLe" header="Giá" body={(rowData: ChossenProduct) => <>{formatCurrency(rowData?.DonGiaBanLe)}</>} ></Column>
        <Column field='SoLuong' header="Số lượng" body={bodySoLuong} ></Column>
        <Column field='Discount' header="Chiết khấu" body={bodyRowDiscount} ></Column>
        <Column field='MoneyAfterDiscount' header="Tổng" body={bodyRowTotal} ></Column>
        <Column body={bodyDelete} ></Column>
      </DataTable>
    </div>
  );
}
