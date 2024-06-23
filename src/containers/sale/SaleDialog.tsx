import { Dialog } from 'primereact/dialog';
import { ChossenProduct, ResultsType } from './Sale';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatCurrency, formatNumber } from '@/utils/common';
import { Button } from 'primereact/button';

type PropType = {
    visible: boolean,
    onClose: () => void,
    chosenProducts: ChossenProduct[];
    results: ResultsType;
    idOrderCreated: number;
};

export default function SaleDialog({ visible, onClose, chosenProducts, results, idOrderCreated }: PropType) {
    const HandClose = () => {
        onClose();
    };

    const handlePrint = () => {
        var content = document.getElementById("divcontents_SaleDialog");
        var pri = (document.getElementById("ifmcontentstoprint_SaleDialog") as HTMLIFrameElement)?.contentWindow;
        if (content && pri) {
            pri.document.open();
            pri.document.write(content.innerHTML);
            pri.document.close();
            pri.focus();
            pri.print();

            pri.onbeforeprint = () => {
                // Đặt hành động cần thực hiện trước khi mở hộp thoại in ở đây
                console.log("Print dialog opened");
            };

            pri.onafterprint = () => {
                // Đặt hành động cần thực hiện sau khi đóng hộp thoại in ở đây
                console.log("Print dialog closed");
            };
        }
    };

    const renderHeader = () => {
        return (
            <Button label="In" icon="pi pi-fw pi-print"
                className="p-button p-component p-button-primary ml-3"
                onClick={handlePrint} />
        );
    };

    return (
        <>
            <iframe id="ifmcontentstoprint_SaleDialog"
                style={{ display: 'none', height: '0px', width: '0px', position: 'absolute' }}>
            </iframe>

            <Dialog header={renderHeader()} visible={visible} style={{ minWidth: '35vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <div id='divcontents_SaleDialog'>
                    <div className="text-center">
                        <h3>Điện Nước Tâm Nhi - 0938729853</h3>
                        <p>Địa chỉ: 66/6A, Xã Xuân Thới Đông, Huyện Hóc Môn</p>
                    </div>
                    <h2 className="text-right">Hóa đơn bán hàng : {idOrderCreated}</h2>
                    <DataTable value={chosenProducts}
                        stripedRows sortMode="multiple" removableSort
                        tableStyle={{ width: '100%' }}
                        resizableColumns showGridlines columnResizeMode="expand" >
                        <Column field="IDMon" header="Id" hidden ></Column>
                        <Column field="TenMon" header="Tên" style={{ width: '15%' }}></Column>
                        <Column field="DonGiaBanLe" header="Giá" body={(rowData: ChossenProduct) => <>{formatCurrency(rowData?.DonGiaBanLe)}</>} ></Column>
                        <Column field='Number' header="Số lượng" body={(rowData: ChossenProduct) => <>{formatNumber(rowData?.Number)}</>} ></Column>
                        <Column field='MoneyAfterDiscount' header="Tổng" body={(rowData: ChossenProduct) => <>{formatCurrency(rowData?.MoneyAfterDiscount)}</>} ></Column>
                    </DataTable>
                    <div className="text-right mt-4">
                        <div>Ngày : {new Date().toLocaleString('vi-VN')}</div>
                        <h3>Tổng : {formatCurrency(results.MoneyAfterDiscount)}</h3>
                    </div>
                </div>
            </Dialog>
        </>
    )
}