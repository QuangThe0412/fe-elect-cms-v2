import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { DiscountDetailsService } from '@/services/discountDetails.service';
import { DiscountService } from '@/services/discount.service';
import { DiscountDetails, Product, selectedRowType } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { DataTable, DataTableRowEditCompleteEvent, DataTableRowEditEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { ProductService } from '@/services/products.service';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ImportDetailsService } from '@/services/importDetails.service';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { formatCurrency } from '@/utils/common';

type PropType = {
    idDiscount: number,
    nameDiscount: string,
    visibleDiscountDetails: boolean,
    onClose: () => void,
};

interface ExtendedDiscountDetails extends DiscountDetails {
    IDMon: number;
    TenMon: string;
    GiaLe: number;
    GiaSi: number;
    GiaGoc: number;
}

let emptyDetails: ExtendedDiscountDetails = {
    IDChiTietKM: 0,
    IDKhuyenMai: 0,
    IDMon: 0,
    PhanTramKM: 0,
    createDate: null,
    modifyDate: null,
    createBy: null,
    modifyBy: null,
    Deleted: false,
    TenMon: '',
    GiaLe: 0,
    GiaSi: 0,
    GiaGoc: 0,
};

export default function DiscountDetailsDialog({ visibleDiscountDetails, onClose, idDiscount, nameDiscount }: PropType) {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [details, setDetails] = useState<ExtendedDiscountDetails[]>([]);
    const [onChangetDetails, setOnChangeDetails] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<selectedRowType>();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (visibleDiscountDetails && idDiscount) {
                const resPro = await getProduct();
                setProducts(resPro);
            }
        };

        fetchData();
    }, [onChangetDetails, visibleDiscountDetails]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (products.length > 0) {
                await getDetailsDiscount();
            }
        };

        fetchDetails();
    }, [products]);

    const HandClose = () => {
        onClose();
        setSelectedRow(undefined);
    };

    const getDetailsDiscount = async () => {
        setLoading(true);
        let arrayDetailsDiscount: ExtendedDiscountDetails[] = [];
        const res = await HandleApi(DiscountService.getDiscountDetails(idDiscount), null);
        if (res && res.status === 200) {
            let data = res.data as ExtendedDiscountDetails[];
            arrayDetailsDiscount = data.filter((item) => !item.Deleted) as ExtendedDiscountDetails[];
            arrayDetailsDiscount.forEach((item) => {
                const product = products.find((x) => x.IDMon === item?.IDMon) as Product;
                item.TenMon = product?.TenMon;
                item.GiaLe = product?.DonGiaBanLe;
                item.GiaSi = product?.DonGiaBanSi;
                item.GiaGoc = product?.DonGiaVon;
            });
            setDetails(arrayDetailsDiscount);
        }
        setLoading(false);
        return arrayDetailsDiscount;
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

    const AddNewRow = (e: any) => {
        e.target.disable = true;
        let _details = [...details];

        emptyDetails.IDKhuyenMai = idDiscount;
        emptyDetails.IDMon = 0;
        emptyDetails.TenMon = '';
        emptyDetails.GiaLe = 0;
        emptyDetails.GiaSi = 0;
        emptyDetails.GiaGoc = 0;
        emptyDetails.PhanTramKM = 0;

        _details.push(emptyDetails);
        setDetails(_details);
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">
                Các món thuộc khuyến mãi: &nbsp;
                <span style={{ color: 'var(--red-400)', textDecoration: 'underline' }}>{nameDiscount}</span>
            </span>
            <Button label="Thêm món" icon="pi pi-fw pi-plus-circle"
                className="p-button p-component p-button-success ml-3"
                onClick={AddNewRow} />
        </div>
    );

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        setLoading(true);
        const { dataSelected } = selectedRow as selectedRowType;
        const idDetails = dataSelected.IDChiTietKM ?? 0;

        let details: ExtendedDiscountDetails = {
            IDChiTietKM: idDetails,
            IDKhuyenMai: idDiscount,
            IDMon: dataSelected.IDMon,
            PhanTramKM: dataSelected.PhanTramKM,
            createDate: dataSelected.createDate,
            modifyDate: dataSelected.modifyDate,
            createBy: dataSelected.createBy,
            modifyBy: dataSelected.modifyBy,
            Deleted: false,
            TenMon: dataSelected.TenMon,
            GiaLe: dataSelected.GiaLe,
            GiaSi: dataSelected.GiaSi,
            GiaGoc: dataSelected.GiaGoc,
        };

        if (idDetails) { // update
            HandleApi(DiscountDetailsService.updateDiscountDetail(idDetails, details), toast)
                .then((res) => {
                    if (res.status === 200) {
                        setOnChangeDetails(!onChangetDetails);
                    }
                }).finally(() => {
                    setSelectedRow(undefined);
                    setLoading(false);
                });
        } else { // create
            HandleApi(DiscountDetailsService.createDiscountDetail(details), toast)
                .then((res) => {
                    if (res.status === 201) {
                        setOnChangeDetails(!onChangetDetails);
                    }
                }).finally(() => {
                    setLoading(false);
                    setSelectedRow(undefined);
                });
        }
    };

    const productEditor = (options: ColumnEditorOptions) => {
        const { rowIndex, rowData } = options;
        const arrayProducts = products.filter((item) => !item.Deleted);
        return (
            <Dropdown
                optionLabel="TenMon" optionValue="IDMon"
                value={rowData?.IDMon}
                options={arrayProducts} filter
                onChange={(e: DropdownChangeEvent) => {
                    options.editorCallback!(e.value);
                    const idMonChosse = e.value as number;
                    const choseProduct = products.find((x) => x.IDMon === idMonChosse) as Product;
                    let _updatedRow: ExtendedDiscountDetails = emptyDetails;

                    _updatedRow.IDKhuyenMai = idDiscount;
                    _updatedRow.IDChiTietKM = rowData.IDChiTietKM;
                    _updatedRow.IDMon = choseProduct.IDMon;
                    _updatedRow.TenMon = choseProduct.TenMon;
                    _updatedRow.GiaLe = choseProduct.DonGiaBanLe;
                    _updatedRow.GiaSi = choseProduct.DonGiaBanSi;
                    _updatedRow.GiaGoc = choseProduct.DonGiaVon;
                    _updatedRow.PhanTramKM = 0;
                    setSelectedRow({ index: rowIndex, dataSelected: _updatedRow });
                }}
            />
        );
    };

    const bodyTemplateButtonDeleted = (rowData: ExtendedDiscountDetails) => {
        return <Button icon='pi pi-trash' onClick={deleteRow(rowData.IDChiTietKM)} />
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

    const bodyChonMon = (rowData: ExtendedDiscountDetails) => {
        return rowData.TenMon;
    };

    const rowClassName = (data: DiscountDetails) => (!data.IDChiTietKM ? 'bg-danger' : '');

    const onRowEditInit = (options: DataTableRowEditEvent) => {
        const { data, index } = options;
        setSelectedRow({ index: index, dataSelected: data })
    };

    const numberEditor = (options: ColumnEditorOptions) => {
        let { field, value } = options;
        let disable = false;
        if (selectedRow) {
            const { dataSelected } = selectedRow;
            switch (field) {
                case 'GiaGoc':
                    value = dataSelected?.GiaGoc ?? 0;
                    disable = true;
                    break;
                case 'GiaSi':
                    value = dataSelected?.GiaSi ?? 0;
                    disable = true;
                    break;
                case 'GiaLe':
                    value = dataSelected?.GiaLe ?? 0;
                    disable = true;
                    break;
                case 'PhanTramKM':
                    value = dataSelected?.PhanTramKM ?? 0;
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

        dataSelected[field] = value;
        setSelectedRow({ index: rowIndex, dataSelected: dataSelected });
    };
    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={headerElement} visible={visibleDiscountDetails} style={{ width: '90vw' }}
                onHide={() => { if (!visibleDiscountDetails) return; HandClose(); }} >
                <DataTable value={details} editMode="row" loading={loading}
                    rowClassName={rowClassName}
                    onRowEditComplete={onRowEditComplete}
                    onRowEditCancel={() => { setSelectedRow(undefined) }}
                    onRowEditInit={onRowEditInit}
                    tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDChiTietKM" header="Id" style={{ width: '5%' }}></Column>
                    <Column field="IDMon" body={bodyChonMon} header="Món"
                        editor={(options) => productEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="GiaGoc" header="Giá gốc" style={{ width: '5%' }}
                        body={(rowData: ExtendedDiscountDetails) => <>{formatCurrency(rowData.GiaGoc)}</>}
                        editor={(options) => numberEditor(options)}></Column>
                    <Column field="GiaSi" header="Giá sỉ" style={{ width: '5%' }}
                        body={(rowData: ExtendedDiscountDetails) => <>{formatCurrency(rowData.GiaSi)}</>}
                        editor={(options) => numberEditor(options)}></Column>
                    <Column field="GiaLe" header="Giá lẻ" style={{ width: '5%' }}
                        body={(rowData: ExtendedDiscountDetails) => <>{formatCurrency(rowData.GiaLe)}</>}
                        editor={(options) => numberEditor(options)}></Column>
                    <Column field="PhanTramKM" header="Phần trăm KM"
                        editor={(options) => numberEditor(options)} style={{ width: '5%' }}></Column>
                    <Column rowEditor={(dataRow, rowProps) =>
                        selectedRow ? selectedRow?.index === rowProps.rowIndex : true}
                        headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column body={bodyTemplateButtonDeleted} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </>
    )
}