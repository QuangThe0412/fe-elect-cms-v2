
import React, { useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { HandleApi } from "@/services/handleApi";
import { ImportService } from "@/services/import.service";
import { ImportDetailsService } from "@/services/importDetails.service";
import { ImportDetails, Product } from "@/models";
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

type selectedRowType = {
    index: number,
    dataSelected: ImportDetails,
}

type changeProductType = {
    index: number,
    dataSelected: Product,
}

export default function ImportDetailsDialog({ visible, onClose, onImportChange, idImport }: PropType) {
    const [importDetails, setImportDetails] = useState<ImportDetails[]>([]);
    const [onChangeImportDetails, setOnChangeImportDetails] = useState<boolean>(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<selectedRowType>();
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [onChangeProduct, setOnChangeProduct] = useState<changeProductType>();
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
                setImportDetails(res.data);
            }
        }).finally(() => { setLoading(false); });
    };

    const onRowEditComplete = (options: DataTableRowEditCompleteEvent) => {
        // setLoading(true);
        // const { dataSelected } = selected as selectedType;
        // let importDetails: ImportDetails = {
        //     IDChiTietPhieuNhap: dataSelected?.IDChiTietPhieuNhap,
        //     IDPhieuNhap: idImport,
        //     IDMon: dataSelected?.IDMon,
        //     SoLuongNhap: dataSelected?.SoLuongNhap,
        //     DonGiaNhap: dataSelected?.DonGiaNhap,
        //     ChietKhau: dataSelected?.ChietKhau,
        //     ThanhTien: dataSelected?.ThanhTien,
        // };

        // if (dataSelected?.IDChiTietPhieuNhap) { // update
        //     HandleApi(ImportDetailsService.updateImportDetail(dataSelected?.IDChiTietPhieuNhap, importDetails), toast).then((res) => {
        //         if (res && res.status === 200) {
        //             setOnChangeImportDetails(!onChangeImportDetails);
        //         }
        //     }).finally(() => {
        //         setSelected(undefined);
        //         setLoading(false);
        //         onImportChange();
        //     });
        // } else { // create
        //     HandleApi(ImportDetailsService.createImportDetail(importDetails), toast).then((res) => {
        //         if (res && res.status === 201) {
        //             setOnChangeImportDetails(!onChangeImportDetails);
        //         }
        //     }).finally(() => {
        //         setSelected(undefined);
        //         setLoading(false);
        //         onImportChange();
        //     });
        // }
    };

    const currencyEditor = (options: ColumnEditorOptions) => {
        let { field, rowIndex, value } = options;
        if (onChangeProduct?.index === rowIndex) {
            const _updatedRow = onChangeProduct.dataSelected;
            if (field === 'DonGiaNhap')
                value = _updatedRow.DonGiaVon;
        }

        return <InputNumber value={value}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => onBlurEditor(e, options)}
            onValueChange={(e: InputNumberValueChangeEvent) =>
                options.editorCallback!(e.value)} mode="currency" currency="VND" locale="vn-VN" />;
    };

    const numberEditor = (options: ColumnEditorOptions) => {
        let { field, rowIndex, value } = options;
        if (onChangeProduct?.index === rowIndex) {
            const _updatedRow = onChangeProduct.dataSelected;
            value = 0;
        }
        return <InputNumber value={value}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => onBlurEditor(e, options)}
            onValueChange={(e: InputNumberValueChangeEvent) =>
                options.editorCallback!(e.value)} />;
    };

    const onBlurEditor = (e: React.FocusEvent<HTMLInputElement>, options: ColumnEditorOptions) => {
        const { field, rowIndex } = options;
        const _updatedRow = selectedRow as ImportDetails || {};
        switch (field) {
            case 'DonGiaNhap':
                _updatedRow.DonGiaNhap = parseInt(e.target?.value) ?? 0;
                break;
            case 'SoLuongNhap':
                _updatedRow.SoLuongNhap = parseInt(e.target?.value) ?? 0;
                break;
            case 'ChietKhau':
                _updatedRow.ChietKhau = parseInt(e.target?.value) ?? 0;
                break;
            default:
                return;
        }
        const donGiaNhap = _updatedRow.DonGiaNhap || 0;
        const soLuongNhap = _updatedRow.SoLuongNhap || 0;
        const chietKhau = _updatedRow.ChietKhau || 0;
        const thanhTien = donGiaNhap * soLuongNhap * (1 - chietKhau / 100);

        _updatedRow.ThanhTien = thanhTien;
        setSelectedRow({
            index: rowIndex,
            dataSelected: _updatedRow,
        });
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
        const { rowData, rowIndex } = options;
        const oldData = importDetails[rowIndex];
        const value = onChangeProduct?.index === rowIndex ? onChangeProduct?.dataSelected.IDMon : oldData.IDMon;
        return (
            <Dropdown value={value} filter
                options={products} optionLabel="TenMon" optionValue="IDMon"
                onChange={(e: any) => {
                    options.editorCallback!(e.value);
                    const idMonChosse = e.value as number;
                    const choseProduct = products.find((x) => x.IDMon === idMonChosse) as Product;
                    setOnChangeProduct({ index: rowIndex, dataSelected: choseProduct });

                    // let _updatedRow: ImportDetails = emptyImportDetails;

                    // _updatedRow.IDMon = choseProduct.IDMon;
                    // _updatedRow.DonGiaNhap = choseProduct.DonGiaVon;
                    // _updatedRow.SoLuongNhap = 1;
                    // _updatedRow.ChietKhau = 0;
                    // _updatedRow.ThanhTien = choseProduct.DonGiaVon * _updatedRow.SoLuongNhap * (1 - _updatedRow.ChietKhau / 100);

                }}
            />
        );
    };

    const onRowEditInit = (options: DataTableRowEditEvent) => {
        const { data, index } = options;
        setSelectedRow({ index: index, dataSelected: data })
        console.log('index', index);
        // if ( ) {
        //     setCanEdit(false);
        // }
    };

    return (
        <div className="card flex justify-content-center">
            <Toast ref={toast} />
            <Dialog visible={visible}
                modal header={headerElement}
                onHide={() => { if (!visible) return; HandClose() }}>
                <DataTable value={importDetails} editMode="row" dataKey="IDChiTietPhieuNhap" loading={loading}
                    onRowEditComplete={onRowEditComplete}
                    onRowEditCancel={() => setSelectedRow(undefined)}
                    onRowEditInit={onRowEditInit}

                    tableStyle={{ minWidth: '70rem' }}>
                    <Column field="IDChiTietPhieuNhap" header="id" style={{ width: '10%' }}></Column>
                    <Column field="IDMon" header="Món" body={bodyMon} className="white-space-normal"
                        editor={(options) => productEditor(options)}
                        style={{ width: '20%', whiteSpace: 'wrap' }}></Column>
                    <Column field="DonGiaNhap" header="Đơn giá nhập"
                        body={(rowData: ImportDetails) => <>{formatCurrency(rowData.DonGiaNhap)}</>}
                        editor={(options) => currencyEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="SoLuongNhap" header="Số lượng nhập"
                        body={(rowData: ImportDetails) => <>{formatNumber(rowData.SoLuongNhap)}</>}
                        editor={(options) => numberEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="ChietKhau" header="Chiết khấu"
                        editor={(options) => numberEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="ThanhTien" header="Thành tiền"
                        body={(rowData: ImportDetails) => <>{formatCurrency(rowData.ThanhTien)}</>}></Column>
                    <Column field="createDate" header="Ngày lập"
                        body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
                    <Column field="createBy" header="Người lập"></Column>
                    <Column rowEditor={(...args) => {
                        return true;
                    }} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </div>
    )
}