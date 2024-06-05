import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { DiscountDetailsService } from '@/services/discountDetails.service';
import { DiscountService } from '@/services/discount.service';
import { TypeCustomerService } from '@/services/typecustomer.service';
import { Discount, DiscountDetails, Product, TypeCustomer } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnBodyOptions, ColumnEditorOptions } from 'primereact/column';
import { ProductService } from '@/services/products.service';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

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

let emptyDiscountDetails: ExtendedDiscountDetails = {
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
    const [detailsDiscount, setDetailsDiscount] = useState<ExtendedDiscountDetails[]>([]);
    const [changeDetailDiscount, setChangeDetailDiscount] = useState<boolean>(false);

    useEffect(() => {
        if (visibleDiscountDetails && idDiscount > 0) {
            getDetailsDiscount();
            getProduct();
        }
    }, [changeDetailDiscount, visibleDiscountDetails]);

    const HandClose = () => {
        onClose();
        setDetailsDiscount([]);
    };

    const getDetailsDiscount = () => {
        console.log('getDetailsDiscount')
        setLoading(true);
        HandleApi(DiscountService.getDiscountDetails(idDiscount), null).then((res) => {
            if (res && res.status === 200) {
                let data = res.data as ExtendedDiscountDetails[];
                let arrayDetailsDiscount = data.filter((item) => !item.Deleted);
                setDetailsDiscount(arrayDetailsDiscount)
            }
            setLoading(false);
        });
    };

    const getProduct = () => {
        console.log('getProduct')
        HandleApi(ProductService.getProducts(), null).then((res) => {
            if (res && res.status === 200) {
                let data = res.data as Product[];
                let arrayProducts = data.filter((item) => !item.Deleted)
                    .map((item) => ({
                        IDMon: item.IDMon,
                        TenMon: item.TenMon,
                        GiaLe: item.DonGiaBanLe,
                        GiaSi: item.DonGiaBanSi,
                        GiaGoc: item.DonGiaVon,
                    }));

                let newData = detailsDiscount.map((item) => {
                    let product = arrayProducts.find(p => p.IDMon === item.IDMon);
                    console.log('product', product?.IDMon, item.IDMon);
                    if (product) {
                        return {
                            ...item,
                            TenMon: product.TenMon,
                            GiaLe: product.GiaLe,
                            GiaSi: product.GiaSi,
                            GiaGoc: product.GiaGoc,
                        };
                    } else {
                        return item;
                    }
                });
                console.log({newData});
                setDetailsDiscount(newData);
            }
        });
    };

    const textEditor = (options: ColumnEditorOptions) => {
        let value = options.rowData[options.field as keyof TypeCustomer] as string;
        return <InputText type="text" value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback!(e.target.value)} />;
    };

    const AddNewRow = (e: any) => {
        e.target.disable = true;
        let _detailsDiscount = [...detailsDiscount];

        emptyDiscountDetails.IDKhuyenMai = idDiscount;
        _detailsDiscount.push(emptyDiscountDetails);
        setDetailsDiscount(_detailsDiscount);
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
        e.originalEvent.preventDefault();

        setLoading(true);
        let _detailsDiscount = [...detailsDiscount];
        let { newData, index } = e;

        _detailsDiscount[index] = newData as ExtendedDiscountDetails;
        const discount = _detailsDiscount[index];
        let idDiscount = discount.IDChiTietKM;

        discount.PhanTramKM = parseInt(discount.PhanTramKM as any) ?? 0;
        if (discount.IDMon === 0 || discount.PhanTramKM === 0
            || (discount.PhanTramKM && discount?.PhanTramKM >= 100)) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Dữ liệu không hợp lệ' });
            setLoading(false);
            return;
        }

        if (idDiscount) { // update
            HandleApi(DiscountDetailsService.updateDiscountDetail(idDiscount, discount), toast)
                .then((res) => {
                    if (res.status === 200) {
                        setChangeDetailDiscount(!changeDetailDiscount);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật chi tiết giảm giá' });
                    setLoading(false);
                });
        } else { // create
            HandleApi(DiscountDetailsService.createDiscountDetail(discount), toast)
                .then((res) => {
                    if (res.status === 201) {
                        setChangeDetailDiscount(!changeDetailDiscount);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tạo chi tiết giảm giá mới' });
                    setLoading(false);
                });
        }
    };

    const productBodyTemplate = (rowData: ExtendedDiscountDetails) => {
        let product = detailsDiscount.find(p => p.IDMon === rowData?.IDMon);
        return product ? product.TenMon : '';
    };

    const productEditor = (options: ColumnEditorOptions) => {
        const { rowIndex } = options;
        const arrayProducts = detailsDiscount.map((item) => {
            return {
                IDMon: item.IDMon,
                TenMon: item.TenMon,
                GiaLe: item.GiaLe,
                GiaSi: item.GiaSi,
                GiaGoc: item.GiaGoc,
            };
        });
        const { rowData } = options;
        console.log(rowData);
        return (
            <Dropdown value={rowData.IDMon}
                options={arrayProducts} filter
                onChange={(e: DropdownChangeEvent) => {
                    options.editorCallback!(e.value);
                    const dataNew = arrayProducts.find((p) => p.IDMon === e.value) || {} as ExtendedDiscountDetails;
                    const detailsDiscountWithNew = detailsDiscount[rowIndex] as ExtendedDiscountDetails;
                    detailsDiscountWithNew.IDMon = e.value;
                    detailsDiscountWithNew.TenMon = dataNew.TenMon;
                    detailsDiscountWithNew.GiaLe = dataNew.GiaLe;
                    detailsDiscountWithNew.GiaSi = dataNew.GiaSi;
                    detailsDiscountWithNew.GiaGoc = dataNew.GiaGoc;
                }}
                optionLabel="TenMon" optionValue="IDMon" placeholder="Chọn món"
            />
        );
    };

    const bodyTemplateButtonDeleted = (rowData: ExtendedDiscountDetails) => {
        return <Button icon='pi pi-trash' onClick={deleteRow(rowData.IDChiTietKM)} />
    };

    const deleteRow = (ChiTietKM: number) => {
        if (!ChiTietKM) return;
        return () => {
            setLoading(true);
            HandleApi(DiscountDetailsService.deletedDiscountDetail(ChiTietKM), toast).then((res) => {
                if (res.status === 200) {
                    setChangeDetailDiscount(!changeDetailDiscount);
                }
                setLoading(false);
            });
        };
    };

    // const bodyPrice = (rowData: any, keyColumn: string) => {
    //     if (!rowData?.IDMon || !keyColumn) return '';
    //     let product = detailsDiscount.find((p) => p.IDMon === rowData?.IDMon);
    //     let value = product ? product[`${keyColumn}` as keyof ExtendedDiscountDetails] : '';
    //     return value;
    // };
    console.log(detailsDiscount);
    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={headerElement} visible={visibleDiscountDetails} style={{ width: '90vw' }}
                onHide={() => { if (!visibleDiscountDetails) return; HandClose(); }} >
                <DataTable value={detailsDiscount} editMode="row" dataKey="IDChiTietKM" loading={loading}
                    onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDChiTietKM" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="TenMon" header="Món" body={productBodyTemplate}
                        editor={(options) => productEditor(options)} style={{ width: '20%' }}></Column>
                    <Column field="GiaGoc" header="Giá gốc" style={{ width: '20%' }}></Column>
                    <Column field="GiaSi" header="Giá sỉ" style={{ width: '20%' }}></Column>
                    <Column field="GiaLe" header="Giá lẻ" style={{ width: '20%' }}></Column>
                    <Column field="PhanTramKM" header="Phần trăm KM" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column body={bodyTemplateButtonDeleted} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </>
    )
}