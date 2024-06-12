
import React, { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { HandleApi } from "@/services/handleApi";
import { ImportService } from "@/services/import.service";
import { ImportDetailsService } from "@/services/importDetails.service";
import { ImportDetails, Product } from "@/models";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { bodyDate, formatCurrency, formatNumber } from "@/utils/common";
import { ProductService } from "@/services/products.service";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

type PropType = {
    visible: boolean,
    idImport: number,
    onClose: () => void,
    onImportChange: () => void,
};

const emptyImportDetails: ImportDetails = {
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
    const [importDetails, setImportDetails] = useState<ImportDetails[]>([]);
    const [onChangeImportDetails, setOnChangeImportDetails] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedImportDetails, setSelectedImportDetails] = useState<ImportDetails>();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const fetchData = async () => {
            const resPro = await getProduct();
            setProducts(resPro);

            if (idImport) {
                getImportDetails();
            }
        };

        fetchData();
    }, [visible, onChangeImportDetails]);

    const HandClose = () => {
        onClose();
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
                setImportDetails(res.data);
            }
        }).finally(() => { setLoading(false); });
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        // setLoading(true);
        let _importDetails = [...importDetails];
        let { newData, index } = e;

        _importDetails[index] = newData as ImportDetails;

        let importDetailsValue: ImportDetails = {
            IDChiTietPhieuNhap: newData.IDChiTietPhieuNhap,
            IDPhieuNhap: idImport,
            IDMon: newData.IDMon,
            SoLuongNhap: newData.SoLuongNhap,
            DonGiaNhap: newData.DonGiaNhap,
            ChietKhau: newData.ChietKhau,
            ThanhTien: newData.ThanhTien,
        };

        console.log(importDetailsValue);
        setSelectedImportDetails(undefined);

        // if (importDetails.IDLoaiKH) { // update
        //     HandleApi(ImportDetailsService.updateImportDetails(importDetails.IDLoaiKH, importDetails), toast).then((res) => {
        //         if (res && res.status === 200) {
        //             setOnChangeImportDetails(!onChangeImportDetails);
        //         }
        //     }).finally(() => {
        //         setLoading(false);
        //         onImportDetailsChange();
        //     });
        // } else { // create
        //     HandleApi(ImportDetailsService.createImportDetails(importDetails), toast).then((res) => {
        //         if (res && res.status === 201) {
        //             setOnChangeImportDetails(!onChangeImportDetails);
        //         }
        //     }).finally(() => {
        //         setLoading(false);
        //         onImportDetailsChange();
        //     });
        // }
    };

    const textEditor = (options: ColumnEditorOptions) => {
        console.log('textEditor', { selectedImportDetails });
        
        let value;
        if(!selectedImportDetails) {
            value = options.rowData[options.field as keyof ImportDetails] as string;
        }else {
            value = selectedImportDetails[options.field as keyof ImportDetails] as string;
        }
        
        
        return <InputText type="text" value={value || ''}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { onBlurEditor(e, options); }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback!(e.target.value)} />;
    };

    const onBlurEditor = (e: React.FocusEvent<HTMLInputElement>, options: ColumnEditorOptions) => {
        const { rowIndex, field } = options;
        const updatedData = [...importDetails];
        const _updatedRow = importDetails[rowIndex];
        switch (field) {
            case 'DonGiaNhap':
                _updatedRow.DonGiaNhap = parseInt(e.target.value) ?? 0;
                break;
            case 'SoLuongNhap':
                _updatedRow.SoLuongNhap = parseInt(e.target.value) ?? 0;
                break;
            case 'ChietKhau':
                _updatedRow.ChietKhau = parseInt(e.target.value) ?? 0;
                break;
            default:
                break;
        }
        const donGiaNhap = _updatedRow.DonGiaNhap || 0;
        const soLuongNhap = _updatedRow.SoLuongNhap || 0;
        const chietKhau = _updatedRow.ChietKhau || 0;
        const thanhTien = donGiaNhap * soLuongNhap * (1 - chietKhau / 100);

        _updatedRow.ThanhTien = thanhTien;
        updatedData[rowIndex] = _updatedRow;
        setImportDetails(updatedData);
    };

    const AddNewRow = (e: any) => {
        e.target.disable = true;
        let _importDetailss = [...importDetails];
        _importDetailss.push(emptyImportDetails);
        setImportDetails(_importDetailss);
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

    const productEditor = (options: ColumnEditorOptions) => {
        const { rowIndex, rowData } = options;
        return (
            <Dropdown value={rowData.IDMon}
                options={products} optionLabel="TenMon" optionValue="IDMon"
                onChange={(e: any) => {
                    options.editorCallback!(e.value);
                    const idMonChose = e.value as number;
                    const choseProduct = products.find((x) => x.IDMon === idMonChose) as Product;
                    const updatedData = [...importDetails] as ImportDetails[];
                    const _updatedRow = updatedData[rowIndex] as ImportDetails;

                    _updatedRow.IDMon = choseProduct.IDMon;
                    _updatedRow.DonGiaNhap = choseProduct.DonGiaVon;
                    _updatedRow.SoLuongNhap = 1;
                    _updatedRow.ChietKhau = 0;
                    _updatedRow.ThanhTien = choseProduct.DonGiaVon * _updatedRow.SoLuongNhap * (1 - _updatedRow.ChietKhau / 100);

                    updatedData[rowIndex] = _updatedRow;
                    setSelectedImportDetails(_updatedRow)
                    setImportDetails(updatedData);
                }}
            />
        );
    };
    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog visible={visible}
                modal header={headerElement}
                onHide={() => { if (!visible) return; HandClose() }}>
                <DataTable value={importDetails} editMode="row" dataKey="IDChiTietPhieuNhap" loading={loading}
                    onRowEditComplete={onRowEditComplete}
                    tableStyle={{ minWidth: '70rem' }}>
                    <Column field="IDChiTietPhieuNhap" header="id" style={{ width: '10%' }}></Column>
                    <Column field="IDMon" header="Món" body={bodyMon} className="white-space-normal"
                        editor={(options) => productEditor(options)}
                        style={{ width: '20%', whiteSpace: 'wrap' }}></Column>
                    <Column field="DonGiaNhap" header="Đơn giá nhập"
                        body={(rowData: ImportDetails) => <>{formatCurrency(rowData.DonGiaNhap)}</>}
                        editor={(options) => textEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="SoLuongNhap" header="Số lượng nhập"
                        body={(rowData: ImportDetails) => <>{formatNumber(rowData.SoLuongNhap)}</>}
                        editor={(options) => textEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="ChietKhau" header="Chiết khấu"
                        editor={(options) => textEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="ThanhTien" header="Thành tiền"
                        body={(rowData: ImportDetails) => <>{formatCurrency(rowData.ThanhTien)}</>}></Column>
                    <Column field="createDate" header="Ngày lập"
                        body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
                    <Column field="createBy" header="Người lập"></Column>
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </div>
    )
}