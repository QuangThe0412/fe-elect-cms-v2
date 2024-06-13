
import React, { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { HandleApi } from "@/services/handleApi";
import { ImportService } from "@/services/import.service";
import { ImportDetailsService } from "@/services/importDetails.service";
import { ImportDetails, Product, selectedRowType } from "@/models";
import { DataTable, DataTableRowEditCompleteEvent, DataTableRowEditEvent, DataTableValue } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { bodyDate, formatCurrency, formatNumber } from "@/utils/common";
import { ProductService } from "@/services/products.service";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";

type PropType = {
    visible: boolean,
    idImport: number,
    onClose: () => void,
    onImportChange: () => void,
};

const emptyDetails: ImportDetails = {
    IDChiTietPhieuNhap: 0,
    IDPhieuNhap: 0,
    IDMon: 0,
    SoLuongNhap: 0,
    DonGiaNhap: 0,
    ChietKhau: 0,
    ThanhTien: 0,
    createDate: new Date(),
    modifyDate: new Date(),
    createBy: '',
    modifyBy: '',
    Deleted: false,
};

export default function ImportDetailsDialog({ visible, onClose, onImportChange, idImport }: PropType) {
    const [details, setDetails] = useState<ImportDetails[]>([]);
    const [onChangetDetails, setOnChangeDetails] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<selectedRowType>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (visible && idImport) {
                const resPro = await getProduct();
                setProducts(resPro);

                getImportDetails();
            }
        };

        fetchData();
    }, [visible, onChangetDetails]);

    const HandClose = () => {
        onClose();
        setSelectedRow(undefined);
    };

    const getProduct = async () => {
        setLoading(true);
        let arrayProducts: Product[] = [];
        const res = await HandleApi(ProductService.getProducts(), null);
        if (res && res.status === 200) {
            let data = res.data as Product[];
            arrayProducts = data.filter((item) => !item.Deleted);
        }
        setLoading(false);
        return arrayProducts;
    };

    const getImportDetails = () => {
        setLoading(true);
        HandleApi(ImportService.getAllImportDetailsById(idImport), null).then((res) => {
            if (res && res.status === 200) {
                const data = res.data as ImportDetails[];
                const _data = data.filter((x) => !x.Deleted);
                setDetails(_data);
            }
        }).finally(() => { setLoading(false); });
    };

    const onRowEditComplete = (options: DataTableRowEditCompleteEvent) => {
        setLoading(true);
        const { dataSelected } = selectedRow as selectedRowType;
        const IDChiTietPhieuNhap = dataSelected?.IDChiTietPhieuNhap ?? 0;

        let details: ImportDetails = {
            IDChiTietPhieuNhap: dataSelected?.IDChiTietPhieuNhap,
            IDPhieuNhap: idImport,
            IDMon: dataSelected?.IDMon,
            SoLuongNhap: dataSelected?.SoLuongNhap,
            DonGiaNhap: dataSelected?.DonGiaNhap,
            ChietKhau: dataSelected?.ChietKhau,
            ThanhTien: dataSelected?.ThanhTien,
        };

        if (IDChiTietPhieuNhap) { // update
            HandleApi(ImportDetailsService.updateImportDetail(IDChiTietPhieuNhap, details), toast).then((res) => {
                if (res && res.status === 200) {
                    setOnChangeDetails(!onChangetDetails);
                }
            }).finally(() => {
                setSelectedRow(undefined);
                setLoading(false);
                onImportChange();
            });
        } else { // create
            HandleApi(ImportDetailsService.createImportDetail(details), toast).then((res) => {
                if (res && res.status === 201) {
                    setOnChangeDetails(!onChangetDetails);
                }
            }).finally(() => {
                setSelectedRow(undefined);
                setLoading(false);
                onImportChange();
            });
        }
    };

    const numberEditor = (options: ColumnEditorOptions) => {
        let { field, value } = options;
        let disable = false;
        if (selectedRow) {
            const { dataSelected } = selectedRow;
            switch (field) {
                case 'DonGiaNhap':
                    value = dataSelected?.DonGiaNhap ?? 0;
                    break;
                case 'SoLuongNhap':
                    value = dataSelected?.SoLuongNhap ?? 0;
                    break;
                case 'ChietKhau':
                    value = dataSelected?.ChietKhau ?? 0;
                    break;
                case 'ThanhTien':
                    value = dataSelected?.ThanhTien ?? 0;
                    disable = true;
                    break;
                default:
                    break;
            }
        }

        return <InputNumber value={value} disabled={disable}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => onBlurEditor(e, options)}
            onValueChange={(e: InputNumberValueChangeEvent) => options.editorCallback!(e.value)} />;
    };

    const onBlurEditor = (e: React.FocusEvent<HTMLInputElement>, options: ColumnEditorOptions) => {
        const { field, rowIndex } = options;
        const { dataSelected } = selectedRow as selectedRowType || {};
        const value = (e.target?.value).replace(/,/g, '');
        switch (field) {
            case 'DonGiaNhap':
                dataSelected.DonGiaNhap = parseInt(value) ?? 0;
                break;
            case 'SoLuongNhap':
                dataSelected.SoLuongNhap = parseInt(value) ?? 0;
                break;
            case 'ChietKhau':
                dataSelected.ChietKhau = parseInt(value) ?? 0;
                break;
            default:
                break;
        }
        const donGiaNhap = dataSelected.DonGiaNhap || 0;
        const soLuongNhap = dataSelected.SoLuongNhap || 0;
        const chietKhau = dataSelected.ChietKhau || 0;
        const thanhTien = donGiaNhap * soLuongNhap * (1 - chietKhau / 100);

        dataSelected.ThanhTien = thanhTien;
        setSelectedRow({ index: rowIndex, dataSelected: dataSelected });
    };

    const AddNewRow = (e: any) => {
        e.target.disable = true;
        let _detailss = [...details];
        _detailss.push(emptyDetails);
        setDetails(_detailss);
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">
                Chi tiết phiếu nhập số
                <span style={{ color: 'red' }}> {idImport}</span>
            </span>
            <Button label="Thêm" icon="pi pi-fw pi-plus-circle"
                className="p-button p-component p-button-success ml-3"
                onClick={AddNewRow} />
        </div>
    );

    const bodyMon = (rowData: ImportDetails) => {
        return products.find((x) => x.IDMon === rowData.IDMon)?.TenMon;
    };

    const rowClassName = (data: ImportDetails) => (!data.IDChiTietPhieuNhap ? 'bg-danger' : '');

    const productEditor = (options: ColumnEditorOptions) => {
        const { rowData, rowIndex } = options;
        return (
            <Dropdown value={rowData?.IDMon} filter
                options={products} optionLabel="TenMon" optionValue="IDMon"
                onChange={(e: any) => {
                    options.editorCallback!(e.value);
                    const idMonChosse = e.value as number;
                    const choseProduct = products.find((x) => x.IDMon === idMonChosse) as Product;
                    let _updatedRow: ImportDetails = emptyDetails;

                    _updatedRow.IDPhieuNhap = idImport;
                    _updatedRow.IDChiTietPhieuNhap = rowData.IDChiTietPhieuNhap;
                    _updatedRow.IDMon = choseProduct.IDMon;
                    _updatedRow.DonGiaNhap = choseProduct.DonGiaVon;
                    _updatedRow.SoLuongNhap = 1;
                    _updatedRow.ChietKhau = 0;
                    _updatedRow.ThanhTien = choseProduct.DonGiaVon * _updatedRow.SoLuongNhap * (1 - _updatedRow.ChietKhau / 100);
                    setSelectedRow({ index: rowIndex, dataSelected: _updatedRow });
                }}
            />
        );
    };

    const onRowEditInit = (options: DataTableRowEditEvent) => {
        const { data, index } = options;
        setSelectedRow({ index: index, dataSelected: data })
    };

    const bodyTemplateButtonDeleted = (rowData: ImportDetails) => {
        return <Button icon='pi pi-trash' onClick={deleteRow(rowData.IDChiTietPhieuNhap)} />
    };

    const deleteRow = (id: number | undefined) => {
        if (!id) {
            return () => {
                let _data = [...details];
                _data.pop();
                setDetails(_data);
            };
        }
        return () => {
            setLoading(true);
            HandleApi(ImportDetailsService.deleteImportDetail(id), toast).then((res) => {
                if (res.status === 200) {
                    setOnChangeDetails(!onChangetDetails);
                }
            }).finally(() => { setLoading(false); });
        };
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog visible={visible}
                modal header={headerElement}
                onHide={() => { if (!visible) return; HandClose() }}>
                <DataTable value={details} editMode="row" loading={loading}
                    rowClassName={rowClassName}
                    onRowEditComplete={onRowEditComplete}
                    onRowEditCancel={() => { setSelectedRow(undefined) }}
                    onRowEditInit={onRowEditInit}
                    tableStyle={{ minWidth: '70rem' }}>
                    <Column field="IDChiTietPhieuNhap" header="id" style={{ width: '10%' }}></Column>
                    <Column field="IDMon" header="Món" body={bodyMon} className="white-space-normal"
                        editor={(options) => productEditor(options)}
                        style={{ width: '20%', whiteSpace: 'wrap' }}></Column>
                    <Column field="DonGiaNhap" header="Đơn giá nhập"
                        body={(rowData: ImportDetails) => <>{formatCurrency(rowData.DonGiaNhap)}</>}
                        editor={(options) => numberEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="SoLuongNhap" header="Số lượng nhập"
                        body={(rowData: ImportDetails) => <>{formatNumber(rowData.SoLuongNhap)}</>}
                        editor={(options) => numberEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="ChietKhau" header="Chiết khấu"
                        editor={(options) => numberEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="ThanhTien" header="Thành tiền"
                        body={(rowData: ImportDetails) => <>{formatCurrency(rowData.ThanhTien)}</>}
                        editor={(options) => numberEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="createDate" header="Ngày lập"
                        body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
                    <Column field="createBy" header="Người lập"></Column>
                    <Column rowEditor={(dataRow, rowProps) =>
                        selectedRow ? selectedRow?.index === rowProps.rowIndex : true}
                        headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column body={bodyTemplateButtonDeleted} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>

                </DataTable>
            </Dialog>
        </div>
    )
}