import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { OrderDetailsService } from '@/services/orderDetails.service';
import { Order, OrderDetail } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

type PropType = {
    idOrder: number,
    visible: boolean,
    onClose: () => void,
};

export default
    function OrderDialog({ visible, onClose, idOrder }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

    useEffect(() => {
        if (visible && idOrder > 0) {
            getOrderDetails();
        }
    }, [visible]);

    const HandClose = () => {
        onClose();
        form.resetFields();
    };

    const getOrderDetails = () => {
        HandleApi(OrderDetailsService.getOrderDetail(idOrder) , null).then((res) => {
            if (res && res.status === 200) {
                setOrderDetails(res.data);
            }
        });
    };

    // const deleteRow = (ChiTietKM: number) => {
    //     if (!ChiTietKM) {
    //         return () => {
    //             let _detailsDiscount = [...detailsDiscount];
    //             _detailsDiscount.pop();
    //             setDetailsDiscount(_detailsDiscount);
    //         };
    //     }
    //     return () => {
    //         setLoading(true);
    //         HandleApi(DiscountDetailsService.deletedDiscountDetail(ChiTietKM), toast).then((res) => {
    //             if (res.status === 200) {
    //                 setChangeDetailDiscount(!changeDetailDiscount);
    //             }
    //             setLoading(false);
    //         });
    //     };
    // };

    // const bodyTemplateButtonDeleted = (rowData: ExtendedDiscountDetails) => {
    //     return <Button icon='pi pi-trash' onClick={deleteRow(rowData.IDChiTietKM)} />
    // };
    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={idOrder ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                {/* <DataTable value={detailsDiscount} editMode="row" loading={loading}
                    onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDChiTietKM" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="PhanTramKM" header="Phần trăm KM" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column body={bodyTemplateButtonDeleted} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable> */}
            </Dialog>
        </>
    )
}