
import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Category, Product } from '@/models';
import { Toast } from 'primereact/toast';
import erroImage from '@/images/error.jpg';
import { FilterMatchMode } from 'primereact/api';
import { HandleApi } from '@/services/handleApi';
import { ProductService } from '@/services/products.service';
import { Image } from 'primereact/image';
import { formatCurrency, handleImageError, linkImageGG } from '@/utils/common';
import { classNames } from 'primereact/utils';
import { CategoryService } from '@/services/category.service';
import { ChossenProduct } from './Sale';

type Props = {
  chosenProducts: ChossenProduct[];
  setChosenProducts: (products: ChossenProduct[]) => void;
};

export default function ProductTable({ chosenProducts, setChosenProducts }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TenMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDLoaiMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DVTMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    GhiChu: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const toast = useRef<Toast>(null);

  useEffect(() => {
    getCategory();
    getProducts();
  }, []);

  const getCategory = () => {
    HandleApi(CategoryService.getCategories(), null).then((result) => {
      if (result.status === 200) {
        setCategories(result.data);
      }
    }).finally(() => { setLoading(false); });
  }

  const getProducts = () => {
    setLoading(true);
    HandleApi(ProductService.getProducts(), null).then((result) => {
      if (result.status === 200) {
        let _products = result.data;
        setProducts(_products)
      }
    }).finally(() => { setLoading(false); });
  }

  const handleProductSelect = (event: any) => {
    let product = event.data as Product;
    if (product) {
      let _product = chosenProducts.findIndex((item) => item.IDMon === product.IDMon);
      if (_product !== -1) {
        let _chosenProducts = [...chosenProducts];
        _chosenProducts[_product].Number += 1;
        const number = _chosenProducts[_product].Number;
        const discount = _chosenProducts[_product].Discount;
        _chosenProducts[_product].MoneyBeforeDiscount = number * _chosenProducts[_product].DonGiaBanLe;
        _chosenProducts[_product].MoneyDiscount = _chosenProducts[_product].MoneyBeforeDiscount * discount / 100;
        _chosenProducts[_product].MoneyAfterDiscount = _chosenProducts[_product].MoneyBeforeDiscount - _chosenProducts[_product].MoneyDiscount;
        setChosenProducts(_chosenProducts);
      } else {
        let newProduct = { ...product } as ChossenProduct;
        newProduct.Number = 1;
        newProduct.Discount = 0;
        newProduct.MoneyBeforeDiscount = newProduct.Number * newProduct.DonGiaBanLe;
        newProduct.MoneyDiscount = newProduct.MoneyBeforeDiscount * newProduct.Discount / 100;
        newProduct.MoneyAfterDiscount = newProduct.MoneyBeforeDiscount - newProduct.MoneyDiscount;
        setChosenProducts([...chosenProducts, newProduct]);
      }
    }
  }

  const bodyImage = (rowData: Product) => {
    return (
      <Image src={linkImageGG + rowData.Image ?? erroImage} onError={handleImageError}
        alt={rowData.TenMon} width="100" preview />
    )
  };

  const rowClassName = (data: Product) => (!data.Deleted ? '' : 'p-disabled');

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

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable value={products}
        header={renderHeader()}
        rowClassName={rowClassName}
        paginator rows={15} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="40vh"
        selectionMode="single" selection={selectedProduct}
        onSelectionChange={(e: any) => { setSelectedProduct(e.value) }} dataKey="IDMon"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["TenMon", "DVTMon", "GhiChu"]} emptyMessage="Không có dữ liệu"
        onRowDoubleClick={(e: any) => handleProductSelect(e)}
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
    </div>
  );
}
