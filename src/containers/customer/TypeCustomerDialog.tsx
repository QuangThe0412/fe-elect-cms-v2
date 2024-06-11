
import React, { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { HandleApi } from "@/services/handleApi";
import { TypeCustomerService } from "@/services/typecustomer.service";
import { TypeCustomer } from "@/models";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

type PropType = {
    visible: boolean,
    onClose: () => void,
    onTypeCustomerChange: () => void,
};

const emptyTypeCustomer: TypeCustomer = {
    IDLoaiKH: 0,
    TenLoaiKH: '',
    MoTa: '',
};

export default function TypeCustomerDialog({ visible, onClose, onTypeCustomerChange }: PropType) {
    const [typeCustomers, setTypeCustomers] = useState<TypeCustomer[]>([]);
    const [onChangeTypeCustomer, setOnChangeTypeCustomer] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        getTypesTypeCustomer();
    }, [visible, onChangeTypeCustomer]);

    const HandClose = () => {
        onClose();
    };

    const getTypesTypeCustomer = () => {
        setLoading(true);
        HandleApi(TypeCustomerService.getTypeCustomers(), null).then((res) => {
            if (res && res.status === 200) {
                setTypeCustomers(res.data);
            }
        }).finally(() => { setLoading(false); });
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        setLoading(true);
        let _typeCustomers = [...typeCustomers];
        let { newData, index } = e;

        _typeCustomers[index] = newData as TypeCustomer;

        let typeCustomer: TypeCustomer = {
            MoTa: _typeCustomers[index]?.MoTa,
            IDLoaiKH: _typeCustomers[index]?.IDLoaiKH,
            TenLoaiKH: _typeCustomers[index]?.TenLoaiKH,
        };

        if (typeCustomer.IDLoaiKH) { // update
            HandleApi(TypeCustomerService.updateTypeCustomer(typeCustomer.IDLoaiKH, typeCustomer), toast).then((res) => {
                if (res && res.status === 200) {
                    setOnChangeTypeCustomer(!onChangeTypeCustomer);
                }
            }).finally(() => {
                setLoading(false);
                onTypeCustomerChange();
            });
        } else { // create
            HandleApi(TypeCustomerService.createTypeCustomer(typeCustomer), toast).then((res) => {
                if (res && res.status === 201) {
                    setOnChangeTypeCustomer(!onChangeTypeCustomer);
                }
            }).finally(() => {
                setLoading(false);
                onTypeCustomerChange();
            });
        }
    };

    const textEditor = (options: ColumnEditorOptions) => {
        let value = options.rowData[options.field as keyof TypeCustomer] as string;
        let field = options.field as keyof TypeCustomer;
        if (field === 'MoTa') {
            return <InputTextarea value={value || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => options.editorCallback!(e.target.value)} />;
        }
        return <InputText type="text" value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback!(e.target.value)} />;
    };

    const AddNewRow = (e: any) => {
        e.target.disable = true;
        let _typeCustomers = [...typeCustomers];
        _typeCustomers.push(emptyTypeCustomer);
        setTypeCustomers(_typeCustomers);
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Loại khách hàng</span>
            <Button label="Thêm loại" icon="pi pi-fw pi-plus-circle"
                className="p-button p-component p-button-success ml-3"
                onClick={AddNewRow} />
        </div>
    );

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog visible={visible}
                modal header={headerElement}
                onHide={() => { if (!visible) return; HandClose() }}>
                <DataTable value={typeCustomers} editMode="row" dataKey="IDLoaiKH" loading={loading}
                    onRowEditComplete={onRowEditComplete}
                    tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDLoaiKH" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="TenLoaiKH" header="Tên loại" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="MoTa" header="Mô tả" editor={(options) => textEditor(options)} style={{ width: '30%' }}></Column>
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </div>
    )
}