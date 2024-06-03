import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { DiscountDetailsService } from '@/services/discountDetails.service';
import { DiscountService } from '@/services/discount.service';
import { TypeCustomerService } from '@/services/typecustomer.service';
import { Discount, TypeCustomer } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';

type PropType = {
    idDiscount: number,
    visibleDiscountDetails: boolean,
    onClose: () => void,
};

export default function DiscountDetailsDialog({ visibleDiscountDetails, onClose, idDiscount }: PropType) {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [detailsDiscount, setDetailsDiscount] = useState<Discount[]>([]);


    useEffect(() => {
        if (visibleDiscountDetails && idDiscount > 0) {
            getDetailsDiscount();
        }
    }, [visibleDiscountDetails]);

    const HandClose = () => {
        onClose();
    };

    const getDetailsDiscount = () => {
        HandleApi(DiscountService.getDiscountDetails(idDiscount), null).then((res) => {
            console.log(res);
            if (res && res.status === 200) {
                setDetailsDiscount(res.data)
            }
        });
    };

    const textEditor = (options: ColumnEditorOptions) => {
        let value = options.rowData[options.field as keyof TypeCustomer] as string;
        let field = options.field as keyof TypeCustomer;
        return <InputText type="text" value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback!(e.target.value)} />;
    };

    const AddNewRow = (e: any) => {
        e.target.disable = true;
        // let _typeCustomers = [...typeCustomers];
        // _typeCustomers.push(emptyTypeCustomer);
        // setTypeCustomers(_typeCustomers);
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Danh sách chi tiết khuyến mãi</span>
            <Button label="Thêm món" icon="pi pi-fw pi-plus-circle"
                className="p-button p-component p-button-success ml-3"
                onClick={AddNewRow} />
        </div>
    );


    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        console.log(e);

        // if (idDiscount) { // update
        //     HandleApi(DiscountService.updateDiscount(idDiscount, discount), toast).then((res) => {
        //         if (res.status === 200) {
        //             onDiscountChange();
        //             HandClose();
        //         }
        //         setLoading(false);
        //     });
        // } else { // create
        //     HandleApi(DiscountService.createDiscount(discount), toast).then((res) => {
        //         if (res.status === 201) {
        //             onDiscountChange();
        //             HandClose();
        //         }
        //         setLoading(false);
        //     });
        // }
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={headerElement} visible={visibleDiscountDetails} style={{ width: '40vw' }}
                onHide={() => { if (!visibleDiscountDetails) return; HandClose(); }} >
                <DataTable value={detailsDiscount} editMode="row" dataKey="IDChiTietKM" loading={loading}
                    onRowEditComplete={onRowEditComplete}
                    tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDChiTietKM" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="IDMon" header="Id món" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="PhanTramKM" header="Phần trăm KM" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </>
    )
}