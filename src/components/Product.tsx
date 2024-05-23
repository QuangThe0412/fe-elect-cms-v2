
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/product.css';
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
import { Button } from 'primereact/button';
import ProductDialog from './ProductDialog';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TenMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDLoaiMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DVTMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    GhiChu: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    ProductService.getProducts().then(data => {
      setProducts(data.data)
      setLoading(false);
    });
  }, []);

  const addProduct = (product: Product) => {
    setSelectedProduct(null);
    setDialogVisible(true);
  };

  const editProduct = (product: Product) => {
    setSelectedProduct(product);
    setDialogVisible(true);
  };

  const removeProduct = (product: Product) => {
    // let _products = [...products];

    // _products = _products.filter((p) => p.IDMon !== product.IDMon);

    toast.current?.show({ severity: 'error', summary: 'Product Deleted', detail: !product.Deleted ? 'Tắt' : 'Bật' });
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
        </span>
        <Button label="Nhập Excel" icon="pi pi-file-import" className="p-button-help"
          onClick={() => {
            toast.current?.show({ severity: 'info', summary: 'Product Selected', detail: 'Nhập' });
          }}
        />
      </div>
    );
  };

  const refreshProducts = () => {

  }

  const saveProduct = () => {
    console.log(selectedProduct);
    setSubmitted(true);

    if (selectedProduct?.TenMon?.trim() && selectedProduct?.DVTMon?.trim()
      && selectedProduct?.DonGiaBanSi > 0 && selectedProduct?.DonGiaVon > 0
      && selectedProduct?.DonGiaBanLe > 0 && selectedProduct?.SoLuongTonKho >= 0) {
      let _product = { ...selectedProduct };

      console.log(_product);

      if (_product.IDMon) {
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      } else {
        // _selectedProduct.id = createId();
        // _selectedProduct.image = 'product-placeholder.svg';
        toast.current?.show({ severity: 'error', summary: 'error', detail: 'Product Created', life: 3000 });
      }

    }
  };

  return (
    <div className="card" style={{ width: "99%" }}>
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={products}
        header={renderHeader()}
        rowClassName={rowClassName}
        onContextMenu={(e) => cm.current?.show(e.originalEvent)}
        contextMenuSelection={selectedProduct ? selectedProduct : undefined}
        onContextMenuSelectionChange={(e: any) => { setSelectedProduct(e.value) }}
        paginator rows={25} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedProduct}
        onSelectionChange={(e: any) => { setSelectedProduct(e.value) }} dataKey="IDMon"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["TenMon", "DVTMon", "GhiChu"]} emptyMessage="No product found."
      >
        <Column field="IDMon" filter header="Id" ></Column>
        <Column field="IDLoaiMon" filter header="Loại" ></Column>
        <Column field="TenMon" header="Tên" style={{ width: '15%' }}></Column>
        <Column field="Image" header="Hình ảnh" body={bodyImage} style={{ width: '10%' }}></Column>
        <Column field="DVTMon" filter header="ĐVT" ></Column>
        <Column field="DonGiaVon" filter header="Giá vốn" body={bodyDonGiaVon} sortable ></Column>
        <Column field="DonGiaBanLe" filter header="Giá lẻ" body={bodyDonGiaLe} sortable ></Column>
        <Column field="DonGiaBanSi" filter header="Giá sỉ" body={bodyDonGiaBanSi} sortable ></Column>
        <Column field="SoLuongTonKho" header="Tồn kho" body={bodyTonKho} sortable ></Column>
        <Column field="ThoiGianBH" header="Bảo hành" sortable ></Column>
        <Column field="GhiChu" header="Ghi chú" ></Column>
      </DataTable>
      <ProductDialog
        visible={dialogVisible}
        selectedProduct={selectedProduct as Product}
      />
    </div>
  );
}
