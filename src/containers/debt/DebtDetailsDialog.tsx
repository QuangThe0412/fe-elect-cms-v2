import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { DebtDetailService } from '@/services/debtDetails.service';
import { DebtService } from '@/services/debt.service';
import { Debt, DebtDetail } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { bodyDate, formatCurrency } from '@/utils/common';

type PropType = {
    idDebt: number,
    visible: boolean,
    onDebtChange: () => void,
    onClose: () => void,
};

export default
    function DebtDetailsDialog({ visible, onClose, idDebt, onDebtChange }: PropType) {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [debtDetails, setDebtDetails] = useState<DebtDetail[]>([]);
    const [changeDetailDebt, setChangeDetailDebt] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const debtDetails = await getDebtDetails();
            setDebtDetails(debtDetails.filter((x) => !x.Deleted));
        };
        fetchData();
    }, [visible, changeDetailDebt]);

    const HandClose = () => {
        onClose();
        setDebtDetails([]);
    };

    const getDebtDetails = async () => {
        setLoading(true);
        const res = await HandleApi(DebtService.getAllDebtDetailsByIdDebt(idDebt), null);
        let result = [] as DebtDetail[];
        if (res && res.status === 200) {
            result = res.data;
        }
        setLoading(false);
        return result;
    };

    const textEditor = (options: ColumnEditorOptions) => {
        const { value } = options;
        return <InputText type='number' value={value || 0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { options.editorCallback!(e.target.value); }} />;
    };

    const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
        setLoading(true);
        let _debtDetails = [...debtDetails];
        let { index, newData } = e;

        let updateData = { ..._debtDetails[index], ...newData };
        const id = updateData.idChiTietCongNoKH;
        _debtDetails[index] = updateData;

        if (id) {
            let res = await HandleApi(DebtDetailService.updateDebtDetail(id, updateData), toast);
            if (res && res.status === 200) {
                setChangeDetailDebt(!changeDetailDebt);
                onDebtChange();
            }
            setLoading(false);
        } else {
            let res = await HandleApi(DebtDetailService.createDebtDetail(updateData), toast);
            if (res && res.status === 201) {
                setChangeDetailDebt(!changeDetailDebt);
                onDebtChange();
            }
            setLoading(false);
        }
    };

    const bodyTemplateButtonDeleted = (rowData: DebtDetail) => {
        return <Button icon='pi pi-trash' onClick={() => deleteRow(rowData?.idChiTietCongNoKH ?? 0)} />
    };

    const deleteRow = (id: number) => {
        if (!id) {
            return () => {
                let _debtDetails = [...debtDetails];
                _debtDetails.pop();
                setDebtDetails(_debtDetails);
            }
        }
        return () => {
            DebtDetailService.deleteDebtDetail(id).then((res) => {
                if (res && res.status === 200) {
                    setChangeDetailDebt(!changeDetailDebt);
                }
            });
        }
    };

    const AddNewRow = (e: any) => {
        let _debtDetails = [...debtDetails];
        _debtDetails.push({
            idChiTietCongNoKH: 0,
            idCongNoKH: idDebt,
            SoTienTra: 0,
        } as DebtDetail);
        setDebtDetails(_debtDetails);
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">
                Chi tiết công nợ số {idDebt}
            </span>
            <Button label="Trả nợ" icon="pi pi-fw pi-plus-circle"
                className="p-button p-component p-button-success ml-3"
                onClick={AddNewRow} />
        </div>
    );

    const bodyPrice = (rowData: DebtDetail) => {
        return formatCurrency(rowData.SoTienTra ?? 0);
    }

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog visible={visible} style={{ width: '60vw' }} header={headerElement}
                onHide={() => { if (!visible) return; HandClose(); }} >
                <DataTable value={debtDetails} editMode="row" loading={loading}
                    emptyMessage="Không có dữ liệu"
                    paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                    onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '30rem' }}>
                    <Column field="idChiTietCongNoKH" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="SoTienTra" editor={(options) => textEditor(options)} header="Số tiền trả" body={bodyPrice} style={{ width: '10%' }}></Column>
                    <Column field="createDate" header="Ngày trả" body={bodyDate as (data: any, options: any) => React.ReactNode} style={{ width: '10%' }}></Column>

                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column body={bodyTemplateButtonDeleted} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </>
    )
}