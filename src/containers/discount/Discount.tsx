
import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DiscountService } from '@/services/discount.service';
import { InputText } from 'primereact/inputtext';
import { Discount } from '@/models';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import { HandleApi } from '@/services/handleApi';
import { Button } from 'primereact/button';


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
  const [categories, setDiscount] = useState<Discount[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount>(emptyDiscount);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDLoaiMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TenLoai: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDNhomMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addDiscount(selectedDiscount as Discount) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editDiscount(selectedDiscount as Discount) },
    {
      label: !selectedDiscount?.Deleted ? 'Tắt' : 'Bật',
      icon: 'pi pi-fw pi-power-off',
      command: () => toggleActiveDiscount(selectedDiscount as Discount)
    }
  ];

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  useEffect(() => {
    getDiscount();
  }, []);

  const getDiscount = () => {
    HandleApi(DiscountService.getDiscounts(), null).then((result) => {
      if (result.status === 200) {
        setDiscount(result.data)
      }
      setLoading(false);
    });
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
    HandleApi(DiscountService.toggleActiveDiscount(discount?.IDKhuyenMai), toast).then(() => {
      getDiscount();
    });
  };

  const rowClassName = (data: Discount) => (!data.Deleted ? '' : 'bg-warning');

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

  const bodyNhomMon = (rowData: Discount) => {
    return (
      <>
        {/* {discountGroups?.map((discountGroups: DiscountGroup) => {
          if (discountGroups.IDNhomMon === rowData.IDNhomMon) {
            return discountGroups.TenNhom;
          }
        })} */}
      </>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={categories}
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
        onSelectionChange={(e: any) => { setSelectedDiscount(e.value) }} dataKey="IDLoaiMon"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["IDKhuyenMai", "TenKhuyenMai", "IdLoaiKH", "TuNgay", "DenNgay"]}
        emptyMessage="No discount found."
      >
        <Column field="IDKhuyenMai" header="ID Khuyến Mãi"></Column>
        <Column field="TenKhuyenMai" header="Tên Khuyến Mãi"></Column>
        <Column field="IdLoaiKH" header="ID Loại KH"></Column>
        <Column field="TuNgay" header="Từ Ngày"></Column>
        <Column field="DenNgay" header="Đến Ngày"></Column>
        <Column field="createDate" header="Ngày Tạo"></Column>
        <Column field="modifyDate" header="Ngày Sửa"></Column>
        <Column field="createBy" header="Người Tạo"></Column>
        <Column field="modifyBy" header="Người Sửa"></Column>

      </DataTable>
      {/* <DiscountDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        idDiscount={selectedDiscount.IDLoaiMon}
        onDiscountChange={() => {
          setDiscountChange(!discountChange)
        }} // refresh data
      /> */}
    </div>
  );
}
