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
    const numberOrder = _orderDetails.length > 0 ? _orderDetails[0].IDHoaDon : 0;

    const bodySoLuong = (rowData: OrderDetail) => {
        return formatNumber(rowData?.SoLuong);
    }
    const total = dataOrderDetails.reduce((total, item) => total + (item.TienSauCK ?? 0), 0);
    const datePrint = new Date().toLocaleString('vi-VN');

    return (
        <div className="card" id={id} style={{ display: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Hóa đơn số {numberOrder}</h3>
                <div>
                    <p>Ngày in: {datePrint}</p>
                </div>
            </div>
            <DataTable value={_orderDetails} tableStyle={{ minWidth: '50rem' }} stripedRows>
                <Column field="TenMon" header="Tên" style={{ width: '15%' }}></Column>
                <Column field="DonGia" header="Giá"
                    body={(rowData: OrderDetail) => <>{formatCurrency(rowData.DonGia)}</>}></Column>
                <Column field="SoLuong" header="SL" style={{ width: '15%' }} body={bodySoLuong}></Column>
                <Column field="ChietKhau" header="%" ></Column>
                <Column field="TienSauCK" header="Tổng"
                    body={(rowData: OrderDetail) => <>{formatCurrency(rowData.TienSauCK)}</>}></Column>
            </DataTable>
            <Divider type="solid" className='bg-danger' />
            <h3>Tổng cộng: {formatCurrency(total)}</h3>
        </div >
    );
}
