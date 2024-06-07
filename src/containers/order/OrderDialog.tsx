import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { OrderDetailsService } from '@/services/orderDetails.service';
import { OrderService } from '@/services/order.service';
import { Order, OrderDetail, Product } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { ProductService } from '@/services/products.service';
import { Button } from 'primereact/button';

type PropType = {
    idOrder: number,
    visible: boolean,
    onClose: () => void,
};

export default
    function OrderDialog({ visible, onClose, idOrder }: PropType) {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [changeDetailOrder, setChangeDetailOrder] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const productRes: Product[] = await getProducts();
            let _products = productRes.filter((x) => !x.Deleted);
            setProducts(_products);

            if (visible && idOrder > 0) {
                getOrderDetails().then((res) => {
                    let _orderDetails = res.filter((x) => !x.Deleted);
                    setOrderDetails(_orderDetails);
                });
            }
        };

        fetchData();
    }, [visible, changeDetailOrder]);

    const HandClose = () => {
        onClose();

    };

    const getOrderDetails = async () => {
        const res = await HandleApi(OrderService.getOrderDetailsByIdOrder(idOrder), null);
        let result = [] as OrderDetail[];
        if (res && res.status === 200) {
            result = res.data;
        }
        return result;
    };

    const getProducts = async () => {
        const res = await HandleApi(ProductService.getProducts(), null);
        let result = [] as Product[];
        if (res && res.status === 200) {
            result = res.data;
        }

        return result;
    };

    const textEditor = (options: ColumnEditorOptions) => {
        let value = options.rowData[options.field as keyof OrderDetail] as string;
        return <InputText type='number' value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback!(e.target.value)} />;
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        setLoading(true);
        // let _detailsDiscount = [...detailsDiscount];
        // let { index, newData } = e;

        // const updatedDiscount = { ...newData } as ExtendedDiscountDetails;
        // updatedDiscount.PhanTramKM = parseInt(updatedDiscount.PhanTramKM as any) || 0;

        // _detailsDiscount[index] = updatedDiscount;
        // let idDiscount = updatedDiscount.IDChiTietKM;

    };

    const bodyChonMon = (rowData: OrderDetail) => {
        return products.find((x) => x.IDMon === rowData.IDMon)?.TenMon;
    };

    const productEditor = (options: ColumnEditorOptions) => {
        const { rowIndex, rowData } = options;
        return (
            <Dropdown value={rowData.IDMon} options={products} optionLabel="TenMon" optionValue="IDMon"
                onChange={(e: DropdownChangeEvent) => {
                    const selectedProduct = e.value as Product;
                    const updatedData = [...orderDetails] as OrderDetail[];
                    const _updatedDataIndex = updatedData[rowIndex] as OrderDetail;

                    _updatedDataIndex.IDMon = selectedProduct.IDMon;
                    _updatedDataIndex.DonGia = selectedProduct.DonGiaBanLe;
                    _updatedDataIndex.SoLuong = 1;
                    _updatedDataIndex.ChietKhau = 0;
                    _updatedDataIndex.TienCK = 0;
                    _updatedDataIndex.TienChuaCK = selectedProduct.DonGiaBanLe;
                    _updatedDataIndex.TienSauCK = selectedProduct.DonGiaBanLe;

                    console.log(_updatedDataIndex);
                    setOrderDetails(updatedData);
                }}
            />
        );

    };

    const bodyTemplateButtonDeleted = (rowData: OrderDetail) => {
        return <Button icon='pi pi-trash' onClick={() => deleteRow(rowData?.IDChiTietHD)} />
    };

    const deleteRow = (IDChiTietHD: number) => {
        if (!IDChiTietHD) {
            let _orderDetails = [...orderDetails];
            _orderDetails.pop();
            setOrderDetails(_orderDetails);
        } else {
            setLoading(true);
            HandleApi(OrderDetailsService.toggleActiveOrderDetail(IDChiTietHD), toast).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setChangeDetailOrder(!changeDetailOrder);
                }
            });
            setLoading(false);
        }
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={idOrder ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ width: '95vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <DataTable value={orderDetails} editMode="row" loading={loading}
                    onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDChiTietHD" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="IDHoaDon" header="IDHoaDon" style={{ width: '5%' }}></Column>
                    <Column field="IDMon" body={bodyChonMon} header="Món"
                        editor={(options) => productEditor(options)} style={{ width: '20%', whiteSpace: 'wrap' }}></Column>
                    <Column field="SoLuong" header="Số lượng" editor={(options) => textEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="DonGia" header="Giá lẻ" style={{ width: '5%' }}></Column>
                    <Column field="TienChuaCK" header="Tiền chưa CK" style={{ width: '10%' }}></Column>
                    <Column field="ChietKhau" header="Chiết khấu" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                    <Column field="TienCK" header="Tiền CK" style={{ width: '10%' }}></Column>
                    <Column field="TienSauCK" header="Tiền đã CK" style={{ width: '10%' }}></Column>
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column body={bodyTemplateButtonDeleted} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </>
    )
}