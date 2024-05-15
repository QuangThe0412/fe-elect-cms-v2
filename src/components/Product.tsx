
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '@/services/products.service';
import { Tag } from 'primereact/tag';
import { Product } from '@/models';
import { formatCurrency } from '@/utils/common';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product[] | null>(null);
  const [rowClick, setRowClick] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    ProductService.getProducts().then(data => {
      setProducts(data.data)
      setLoading(false);
    });
  }, []);

  const statusBodyTemplate = (rowData: Product) => {
    return rowData.Deleted === 0
      ? <Tag value={'Bật'} severity={'success'}></Tag>
      : <Tag value={'Tắt'} severity={'danger'}></Tag>;
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
    return rowData.SoLuongTonKho;
  };

  return (
    <div className="card" style={{ width: "99%" }}>
      <DataTable value={products}
        paginator rows={13} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading}
        selectionMode="single" selection={selectedProduct}
        onSelectionChange={(e: any) => setSelectedProduct(e.value)} dataKey="IDMon"
      >
        <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
        <Column field="IDMon" header="Id" ></Column>
        <Column field="IDLoaiMon" header="Loại" ></Column>
        <Column field="TenMon" header="Tên" style={{ width: '30%' }}></Column>
        <Column field="Image" header="Hình ảnh" ></Column>
        <Column field="DVTMon" header="ĐVT" ></Column>
        <Column field="DonGiaVon" header="Giá vốn" body={bodyDonGiaVon} sortable ></Column>
        <Column field="DonGiaBanLe" header="Giá lẻ" body={bodyDonGiaLe} sortable ></Column>
        <Column field="DonGiaBanSi" header="Giá sỉ" body={bodyDonGiaBanSi} sortable ></Column>
        <Column field="SoLuongTonKho" header="Tồn kho" body={bodyTonKho} sortable ></Column>
        <Column field="ThoiGianBH" header="Bảo hành" sortable ></Column>
        <Column field="Deleted" header="Trạng thái" body={statusBodyTemplate} ></Column>
        <Column field="GhiChu" header="Ghi chú" ></Column>
      </DataTable>
    </div>
  );
}
