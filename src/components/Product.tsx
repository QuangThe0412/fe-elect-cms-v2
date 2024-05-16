
import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '@/services/products.service';
import { InputText } from 'primereact/inputtext';
import { Product } from '@/models';
import { formatCurrency, handleImageError } from '@/utils/common';
import erroImage from '../assets/images/error.jpg';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IdMon: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
});
  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addProduct(selectedProduct as Product) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editProduct(selectedProduct as Product) },
    {
      label: !selectedProduct?.Deleted ? 'Tắt' : 'Bật',
      icon: 'pi pi-fw pi-power-off',
      command: () => removeProduct(selectedProduct as Product)
    }
  ];

  useEffect(() => {
    ProductService.getProducts().then(data => {
      setProducts(data.data)
      setLoading(false);
    });
  }, []);

  const addProduct = (product: Product) => {
    toast.current?.show({ severity: 'info', summary: 'Product Selected', detail: product.TenMon });
  };

  const editProduct = (product: Product) => {
    toast.current?.show({ severity: 'info', summary: 'Product Selected', detail: product.TenMon });
  };

  const removeProduct = (product: Product) => {
    // let _products = [...products];

    // _products = _products.filter((p) => p.IDMon !== product.IDMon);

    toast.current?.show({ severity: 'error', summary: 'Product Deleted', detail: !product.Deleted? 'Tắt' : 'Bật'});
    // setProducts(_products);
  };

  const bodyDonGiaVon = (rowData: Product) => {
    return formatCurrency(rowData.DonGiaVon);
  };

  const bodyDonGiaLe = (rowData: Product) => {
    return formatCurrency(rowData.DonGiaBanLe);
  };

  const bodyDonGiaBanSi = (rowData: Product) => {
    return formatCurrency(rowData.DonGiaBanSi);
  };

  const bodyTonKho = (rowData: Product) => {
    const stockClassName = classNames('border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm', {
      'bg-red-100 text-red-900': rowData.SoLuongTonKho <= 10,
      'bg-blue-100 text-blue-900': rowData.SoLuongTonKho > 10 && rowData.SoLuongTonKho < 25,
      'bg-teal-100 text-teal-900': rowData.SoLuongTonKho > 26
    });

    return <div className={stockClassName}>{rowData.SoLuongTonKho}</div>;
  };

  const bodyImage = (rowData: Product) => {
    return <img src={rowData.Image ?? erroImage} onError={handleImageError}
      alt={rowData.TenMon} style={{ width: '50%' }} />;
  };

  const rowClassName = (data: Product) => (!data.Deleted ? '' : 'bg-warning');
  
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
};

const renderHeader = () => {
  return (
      <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
          {/* <h4 className="m-0">Customers</h4> */}
          <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm" />
          </span>
      </div>
  );
};
  return (
    <div className="card" style={{ width: "99%" }}>
      <Toast ref={toast} />

      <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedProduct(null)} />
      <DataTable value={products}
      header={renderHeader()}
        rowClassName={rowClassName}
        onContextMenu={(e) => cm.current?.show(e.originalEvent)}
        contextMenuSelection={selectedProduct ? selectedProduct : undefined}
        onContextMenuSelectionChange={(e: any) => setSelectedProduct(e.value)}
        paginator rows={25} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="83vh"
        selectionMode="single" selection={selectedProduct}
        onSelectionChange={(e: any) => setSelectedProduct(e.value)} dataKey="IDMon"
        resizableColumns showGridlines columnResizeMode="expand"
      >
        <Column field="IDMon" header="Id" ></Column>
        <Column field="IDLoaiMon" header="Loại" ></Column>
        <Column field="TenMon" header="Tên" style={{ width: '15%' }}></Column>
        <Column field="Image" header="Hình ảnh" body={bodyImage} style={{ width: '10%' }}></Column>
        <Column field="DVTMon" header="ĐVT" ></Column>
        <Column field="DonGiaVon" header="Giá vốn" body={bodyDonGiaVon} sortable ></Column>
        <Column field="DonGiaBanLe" header="Giá lẻ" body={bodyDonGiaLe} sortable ></Column>
        <Column field="DonGiaBanSi" header="Giá sỉ" body={bodyDonGiaBanSi} sortable ></Column>
        <Column field="SoLuongTonKho" header="Tồn kho" body={bodyTonKho} sortable ></Column>
        <Column field="ThoiGianBH" header="Bảo hành" sortable ></Column>
        <Column field="GhiChu" header="Ghi chú" ></Column>
      </DataTable>
    </div>
  );
}
