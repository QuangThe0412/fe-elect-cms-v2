import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { DebtDetailService } from '@/services/debtDetails.service';
import { DebtService } from '@/services/debt.service';
import { DebtDetail, selectedRowType } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { DataTable, DataTableRowEditCompleteEvent, DataTableRowEditEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { bodyDate, formatCurrency } from '@/utils/common';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';

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
    const [onChangetDetails, setOnChangeDetails] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<selectedRowType>();

    useEffect(() => {
        const fetchData = async () => {
            if (visible && idDebt) {
                const debtDetails = await getDebtDetails();
                setDebtDetails(debtDetails.filter((x) => !x.Deleted));
            }
        };
        fetchData();
    }, [visible, onChangetDetails]);

    const HandClose = () => {
        onClose();
        setSelectedRow(undefined);
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

    const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
        setLoading(true);
        const { dataSelected } = selectedRow as selectedRowType;
        const idDetail = dataSelected.idChiTietCongNoKH ?? 0;

        let details: DebtDetail = {
            idChiTietCongNoKH: idDetail,
            idCongNoKH: idDebt,
            SoTienTra: dataSelected.SoTienTra,
        };

        if (idDetail) { //update
            HandleApi(DebtDetailService.updateDebtDetail(idDetail, details), toast).then((res) => {
                if (res.status === 200) {
                    setOnChangeDetails(!onChangetDetails);
                }
            }).finally(() => {
                onDebtChange();
                setSelectedRow(undefined);
            });
        } else {
            HandleApi(DebtDetailService.createDebtDetail(details), toast).then((res) => {
                if (res.status === 201) {
                    setOnChangeDetails(!onChangetDetails);
                }
            }).finally(() => {
                onDebtChange();
                setSelectedRow(undefined);
            });
        }
    };

    const bodyTemplateButtonDeleted = (rowData: DebtDetail) => {
        return <Button icon='pi pi-trash' onClick={deleteRow(rowData.idChiTietCongNoKH)} />
    };

    const deleteRow = (id: number | undefined) => {
        if (!id) {
            return () => {
                let _debtDetails = [...debtDetails];
                _debtDetails.pop();
                setDebtDetails(_debtDetails);
            }
        }

        return () => {
            setLoading(true);
            DebtDetailService.deleteDebtDetail(id).then((res) => {
                if (res && res.status === 200) {
                    setOnChangeDetails(!onChangetDetails);
                    onDebtChange();
                }
            }).finally(() => { setLoading(false); });
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
                Chi tiết công nợ số
                <span style={{ color: 'red' }}> {idDebt}</span>
            </span>
            <Button label="Trả nợ" icon="pi pi-fw pi-plus-circle"
                className="p-button p-component p-button-success ml-3"
                onClick={AddNewRow} />
        </div>
    );

    const rowClassName = (data: DebtDetail) => (!data.idChiTietCongNoKH ? 'bg-danger' : '');

    const numberEditor = (options: ColumnEditorOptions) => {
        let { value } = options;

        return <InputNumber value={value}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => onBlurEditor(e, options)}
            onValueChange={(e: InputNumberValueChangeEvent) => options.editorCallback!(e.value)} />;
    };

    const onBlurEditor = (e: React.FocusEvent<HTMLInputElement>, options: ColumnEditorOptions) => {
        const { field, rowIndex } = options;
        const { dataSelected } = selectedRow as selectedRowType || {};
        const value = (e.target?.value).replace(/,/g, '');

        dataSelected[field] = value;
        setSelectedRow({ index: rowIndex, dataSelected: dataSelected });
    };

    const onRowEditInit = (options: DataTableRowEditEvent) => {
        const { data, index } = options;
        setSelectedRow({ index: index, dataSelected: data })
    };
    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog visible={visible} style={{ minWidth: '60vw' }} header={headerElement}
                onHide={() => { if (!visible) return; HandClose(); }} >
                <DataTable value={debtDetails} editMode="row" loading={loading}
                    rowClassName={rowClassName}
                    emptyMessage="Không có dữ liệu"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
                    onRowEditComplete={onRowEditComplete}
                    onRowEditCancel={() => { setSelectedRow(undefined) }}
                    onRowEditInit={onRowEditInit}
                    tableStyle={{ minWidth: '30rem' }}>
                    <Column field="idChiTietCongNoKH" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="SoTienTra" header="Số tiền trả" style={{ width: '10%' }}
                        body={(rowData: DebtDetail) => <>{formatCurrency(rowData.SoTienTra)}</>}
                        editor={(options) => numberEditor(options)}></Column>
                    <Column field="createDate" header="Ngày trả" body={bodyDate as (data: any, options: any) => React.ReactNode} style={{ width: '10%' }}></Column>

                    <Column rowEditor={(dataRow, rowProps) =>
                        selectedRow ? selectedRow?.index === rowProps.rowIndex : true}
                        headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column body={bodyTemplateButtonDeleted} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </>
    )
}