
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/product.css';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '@/services/products.service';
import { CategoryService } from '@/services/category.service';
import { InputText } from 'primereact/inputtext';
import { Product, Category } from '@/models';
import { formatCurrency, handleImageError } from '@/utils/common';
import erroImage from '@/images/error.jpg';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import ProductDialog from './ProductDialog';
import { HandleApi } from '@/services/handleApi';
import { Image } from 'primereact/image';
import { FileUploadState } from '@/models';
import { linkImageGG } from '@/utils/common';

let emptyProduct: Product = {
  TenMon: '',
  IDMon: 0,
  IDLoaiMon: 0,
  DVTMon: '',
  DonGiaBanLe: 0,
  DonGiaBanSi: 0,
  DonGiaVon: 0,
  SoLuongTonKho: 0,
  ThoiGianBH: 0,
  Deleted: false,
  GhiChu: '',
  Image: '',
  modifyDate: null,
  createDate: null
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productChange, setProductChange] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>(emptyProduct);
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
      command: () => toggleActiveProduct(selectedProduct as Product)
    }
  ];

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  const emptyImage: FileUploadState = {
    files: [new File([], "")],
  }

  const [fileImage, setFileImage] = useState<FileUploadState>({
    files: [],
  });

  useEffect(() => {
    getProducts();
    getCategory();
  }, [productChange]);

  const getProducts = () => {
    setLoading(true);
    HandleApi(ProductService.getProducts(), null).then((result) => {
      if (result.status === 200) {
        setProducts(result.data);
      }
      setLoading(false)
    });
  }

  const getCategory = () => {
    HandleApi(CategoryService.getCategories(), null).then((result) => {
      if (result.status === 200) {
        setCategories(result.data);
      }
      setLoading(false)
    });
  }

  const addProduct = (product: Product) => {
    setSelectedProduct(emptyProduct);
    setDialogVisible(true);
  };

  const editProduct = (product: Product) => {
    setSelectedProduct(product);
    setDialogVisible(true);
  };

  const toggleActiveProduct = (product: Product) => {
    HandleApi(ProductService.toggleActiveProduct(product.IDMon), toast).then(() => {
      getProducts();
    });
  };

  const bodyTonKho = (rowData: Product) => {
    const stockClassName = classNames(
      'border-circle border-black w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm'
      , {
        'bg-red-100 text-red-900': rowData.SoLuongTonKho <= 10,
        'bg-blue-100 text-blue-900': rowData.SoLuongTonKho > 10 && rowData.SoLuongTonKho < 25,
        'bg-teal-100 text-teal-900': rowData.SoLuongTonKho > 26
      });

    return <div className={stockClassName}>{rowData.SoLuongTonKho}</div>;
  };

  const bodyImage = (rowData: Product) => {
    return (
      <Image src={linkImageGG + rowData.Image ?? erroImage} onError={handleImageError}
        alt={rowData.TenMon} width="100" preview />
    )
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
          <Button label="Thêm" icon="pi pi-plus" className="p-button-success ml-3"
            onClick={() => addProduct(selectedProduct as Product)} />
        </span>
        <Button label="Nhập Excel" icon="pi pi-file-import" className="p-button-help"
          onClick={() => {
            toast.current?.show({ severity: 'info', summary: 'Thông báo', detail: 'Tính năng đang phát triển' });
          }}
        />
      </div>
    );
  };

  const bodyLoaiMon = (rowData: Product) => {
    return (
      <>
        {categories.map((category: Category) => {
          if (category.IDLoaiMon === rowData.IDLoaiMon) {
            return category.TenLoai;
          }
        })}
      </>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={products}
        header={renderHeader()}
        rowClassName={rowClassName}
        onContextMenu={(e) => cm.current?.show(e.originalEvent)}
        contextMenuSelection={selectedProduct ? selectedProduct : undefined}
        onContextMenuSelectionChange={(e: any) => { setSelectedProduct(e.value) }}
        paginator rows={15} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedProduct}
        onSelectionChange={(e: any) => { setSelectedProduct(e.value) }} dataKey="IDMon"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["TenMon", "DVTMon", "GhiChu"]} emptyMessage="Không có dữ liệu"
      >
        <Column field="IDMon" filter header="Id" ></Column>
        <Column field="IDLoaiMon" filter header="Loại" body={bodyLoaiMon} ></Column>
        <Column field="TenMon" header="Tên" style={{ width: '15%' }}></Column>
        <Column field="Image" header="Hình ảnh" body={bodyImage} style={{ width: '5%' }}></Column>
        <Column field="DVTMon" filter header="ĐVT" ></Column>
        <Column field="DonGiaVon" filter header="Giá vốn" body={(rowData: Product) => <>{formatCurrency(rowData.DonGiaVon)}</>} sortable ></Column>
        <Column field="DonGiaBanLe" filter header="Giá lẻ" body={(rowData: Product) => <>{formatCurrency(rowData.DonGiaBanLe)}</>} sortable ></Column>
        <Column field="DonGiaBanSi" filter header="Giá sỉ" body={(rowData: Product) => <>{formatCurrency(rowData.DonGiaBanSi)}</>} sortable ></Column>
        <Column field="SoLuongTonKho" header="Tồn kho" body={bodyTonKho} sortable ></Column>
        <Column field="ThoiGianBH" header="Bảo hành" sortable ></Column>
        <Column field="GhiChu" header="Ghi chú" ></Column>
      </DataTable>
      <ProductDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        idProduct={selectedProduct.IDMon}
        onProductChange={() => {
          setProductChange(!productChange)
        }} // refresh data
      />
    </div>
  );
}
