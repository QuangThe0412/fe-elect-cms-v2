
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

  useEffect(() => {
    ProductService.getProducts().then(data => {
      console.log(data)
      setProducts(data.data)
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
        selectionMode="single" selection={selectedProduct}
        onSelectionChange={(e: any) => setSelectedProduct(e.value)} dataKey="IDMon"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="IDMon" header="Id" style={{ width: '7%' }}></Column>
        <Column field="IDLoaiMon" header="Loại" style={{ width: '7%' }}></Column>
        <Column field="TenMon" header="Tên" style={{ width: '30%' }}></Column>
        <Column field="Image" header="Hình ảnh" style={{ width: '7%' }}></Column>
        <Column field="DVTMon" header="ĐVT" style={{ width: '7%' }}></Column>
        <Column field="DonGiaVon" header="Giá vốn" body={bodyDonGiaVon} sortable style={{ width: '7%' }}></Column>
        <Column field="DonGiaBanLe" header="Giá lẻ" body={bodyDonGiaLe} sortable style={{ width: '7%' }}></Column>
        <Column field="DonGiaBanSi" header="Giá sỉ" body={bodyDonGiaBanSi} sortable style={{ width: '7%' }}></Column>
        <Column field="SoLuongTonKho" header="Tồn kho" body={bodyTonKho} sortable style={{ width: '7%' }}></Column>
        <Column field="ThoiGianBH" header="Bảo hành" sortable style={{ width: '7%' }}></Column>
        <Column field="Deleted" header="Trạng thái" body={statusBodyTemplate} style={{ width: '7%' }}></Column>
        <Column field="GhiChu" header="Ghi chú" style={{ width: '7%' }}></Column>
      </DataTable>
    </div>
  );
}
