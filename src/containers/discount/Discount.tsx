
import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DiscountService } from '@/services/discount.service';
import { InputText } from 'primereact/inputtext';
import { Discount, TypeCustomer } from '@/models';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import { HandleApi } from '@/services/handleApi';
import { Button } from 'primereact/button';
import DiscountDialog from './DiscountDialog';
import { bodyDate } from '@/utils/common';
import { TypeCustomerService } from '@/services/typecustomer.service';
import DiscountDetailsDialog from './DiscountDetailsDialog';


let emptyDiscount: Discount = {
  IDKhuyenMai: 0,
  TenKhuyenMai: '',
  IdLoaiKH: null,
  TuNgay: new Date(),
  DenNgay: new Date(),
  createDate: null,
  modifyDate: null,
  createBy: null,
  modifyBy: null,
  Deleted: false,
};

export default function DiscountComponent() {
  const [discounts, setDiscount] = useState<Discount[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount>(emptyDiscount);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDKhuyenMai: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TenKhuyenMai: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IdLoaiKH: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TuNgay: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DenNgay: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [discountChange, setDiscountChange] = useState<boolean>(false);
  const [typeCustomers, setTypeCustomers] = useState<TypeCustomer[]>([]);

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addDiscount(selectedDiscount as Discount) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editDiscount(selectedDiscount as Discount) },
    { label: 'Chi tiết KM', icon: 'pi pi-fw pi-sitemap', command: () => detailsDiscount(selectedDiscount as Discount) },
    {
      label: !selectedDiscount?.Deleted ? 'Tắt' : 'Bật',
      icon: 'pi pi-fw pi-power-off',
      command: () => toggleActiveDiscount(selectedDiscount as Discount)
    }
  ];

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [dialogDetailsVisible, setDialogDetailsVisible] = useState<boolean>(false);

  useEffect(() => {
    getTypeCustomers();
    getDiscount();
  }, [discountChange]);

  const getDiscount = () => {
    setLoading(true);
    HandleApi(DiscountService.getDiscounts(), null).then((result) => {
      if (result.status === 200) {
        setDiscount(result.data)
      }
    }).finally(() => { setLoading(false); });
  }

  const getTypeCustomers = () => {
    setLoading(true);
    HandleApi(TypeCustomerService.getTypeCustomers(), null).then((result) => {
      if (result.status === 200) {
        let data = result.data;
        setTypeCustomers(data);
      }
    }).finally(() => { setLoading(false); });
  }

  const addDiscount = (discount: Discount) => {
    setSelectedDiscount(emptyDiscount);
    setDialogVisible(true);
  };

  const editDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setDialogVisible(true);
  };

  const toggleActiveDiscount = (discount: Discount) => {
    setLoading(true);
    HandleApi(DiscountService.toggleActiveDiscount(discount?.IDKhuyenMai), toast).then(() => {
      getDiscount();
    }).finally(() => { setLoading(false); });
  };

  const detailsDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    setDialogDetailsVisible(true);
  };

  const rowClassName = (data: Discount) => (!data.Deleted ? '' : 'bg-danger');

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'] = { value: value, matchMode: FilterMatchMode.CONTAINS };
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm" />
          <Button label="Thêm" icon="pi pi-plus" className="p-button-success ml-3"
            onClick={() => addDiscount(selectedDiscount as Discount)}
          />
        </span>
      </div>
    );
  };

  const bodyLoaiKH = (rowData: Discount) => {
    return (
      <>
        {typeCustomers?.map((typeCustomers: TypeCustomer) => {
          if (typeCustomers.IDLoaiKH === rowData.IdLoaiKH) {
            return typeCustomers.TenLoaiKH;
          }
        })}
      </>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={discounts}
        header={renderHeader()}
        rowClassName={rowClassName}
        onContextMenu={(e) => cm.current?.show(e.originalEvent)}
        contextMenuSelection={selectedDiscount ? selectedDiscount : undefined}
        onContextMenuSelectionChange={(e: any) => { setSelectedDiscount(e.value) }}
        paginator rows={15} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedDiscount}
        onSelectionChange={(e: any) => { setSelectedDiscount(e.value) }} dataKey="IDKhuyenMai"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["IDKhuyenMai", "TenKhuyenMai", "IdLoaiKH", "TuNgay", "DenNgay"]}emptyMessage="Không có dữ liệu"
      >
        <Column field="IDKhuyenMai" header="ID Khuyến Mãi"></Column>
        <Column field="TenKhuyenMai" header="Tên Khuyến Mãi"></Column>
        <Column field="IdLoaiKH" header="Loại khách hàng" body={bodyLoaiKH}></Column>
        <Column field="TuNgay" header="Từ Ngày" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="DenNgay" header="Đến Ngày" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
        {/* <Column field="createDate" header="Ngày Tạo" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column> */}
        {/* <Column field="modifyDate" header="Ngày Sửa" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column> */}
        {/* <Column field="createBy" header="Người Tạo"></Column> */}
        {/* <Column field="modifyBy" header="Người Sửa"></Column> */}

      </DataTable>
      <DiscountDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        idDiscount={selectedDiscount.IDKhuyenMai}
        onDiscountChange={() => {
          setDiscountChange(!discountChange)
        }} // refresh data
      />
      <DiscountDetailsDialog
        nameDiscount={selectedDiscount.TenKhuyenMai}
        visibleDiscountDetails={dialogDetailsVisible}
        onClose={() => { setDialogDetailsVisible(false) }}
        idDiscount={selectedDiscount.IDKhuyenMai}
      />
    </div>
  );
}
