import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OrderDetail, Product } from "@/models";
import { formatCurrency, formatNumber } from "@/utils/common";
import { Divider } from "primereact/divider";

type typeProps = {
    dataOrderDetails: OrderDetail[],
    dataProducts: Product[],
    id: string
}

export default function OrderPrintComponent({ id, dataOrderDetails, dataProducts }: typeProps) {
    const _orderDetails = dataOrderDetails.filter((item) => !item.Deleted);
    const _products = dataProducts;
    const numberOrder = _orderDetails.length > 0 ? _orderDetails[0].IDHoaDon : 0;

    const bodyTenMon = (rowData: any) => {
        const product = _products.find((p) => p.IDMon === rowData.IDMon);
        return product?.TenMon || "";
    };

    const bodySoLuong = (rowData: OrderDetail) => {
        return formatNumber(rowData?.SoLuong);
    }
    const total = dataOrderDetails.reduce((total, item) => total + (item.TienSauCK ?? 0), 0);
    const datePrint = new Date().toLocaleString('vi-VN');

    return (
        <>
            <div className="card" id={id} style={{ display: 'none' }}>
                <DataTable value={_orderDetails} tableStyle={{ minWidth: '50rem' }} stripedRows>
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
                    <h3>Hóa đơn số {numberOrder}</h3>
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
