import React, { useRef } from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Order, OrderDetail, Product } from "@/models";
import { formatCurrency, formatNumber } from "@/utils/common";
import { Divider } from "primereact/divider";

type typeProps = {
    dataOrderDetails: OrderDetail[],
    dataProducts: Product[],
    id: string
}

export default function OrderPrintComponent({ id, dataOrderDetails, dataProducts }: typeProps) {
    const bodyTenMon = (rowData: any) => {
        const product = dataProducts.find((p) => p.IDMon === rowData.IDMon);
        return product?.TenMon || "";
    };

    const bodySoLuong = (rowData: OrderDetail) => {
        return formatNumber(rowData?.SoLuong);
    }
    const total = dataOrderDetails.reduce((total, item) => total + (item.TienSauCK ?? 0), 0);
    const datePrint = new Date().toLocaleString('vi-VN');

    return (
        <>
            <div className="card" id={id} style={{display:'none'}}>
                <DataTable value={dataOrderDetails} tableStyle={{ minWidth: '50rem' }}> stripedRows 
                    <Column field="Index" header="STT" body={(rowData, { rowIndex }) => rowIndex + 1} ></Column>
                    <Column field="IDMon" header="Món" body={bodyTenMon}
                        style={{ width: '20%', whiteSpace: 'normal' }} ></Column>
                    <Column field="SoLuong" header="SL" body={bodySoLuong}></Column>
                    <Column field="DonGia" header="Giá"
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.DonGia)}</>}></Column>
                    <Column field="ChietKhau" header="%" ></Column>
                    <Column field="TienSauCK" header="Tổng"
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.TienSauCK)}</>}></Column>

                </DataTable>
                <div className="p-d-flex p-jc-between">
                    <div>
                        <p>Ngày in: {datePrint}</p>
                    </div>
                    <div>
                        <p>Tổng cộng: {formatCurrency(total)}</p>
                    </div>
                </div>
            </div >
        </>
    );
}
