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
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedproduct, setSelectedproduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (visibleDiscountDetails && idDiscount > 0) {
                const productRes: Product[] = await getProduct();
                setProducts(productRes);

                getDetailsDiscount().then((res) => {
                    res.forEach((item) => {
                        let product = productRes.find((p) => p.IDMon === item.IDMon);
                        if (product) {
                            item.TenMon = product.TenMon;
                            item.GiaLe = product.DonGiaBanLe;
                            item.GiaSi = product.DonGiaBanSi;
                            item.GiaGoc = product.DonGiaVon;
                        }
                    });
                    setDetailsDiscount(res);
                });
            };
        }

        fetchData();
    }, [changeDetailDiscount, visibleDiscountDetails]);

    const HandClose = () => {
        onClose();
        setDetailsDiscount([]);
        setSelectedproduct(null);
    };

    const getDetailsDiscount = async () => {
        setLoading(true);
        let arrayDetailsDiscount: ExtendedDiscountDetails[] = [];
        const res = await HandleApi(DiscountService.getDiscountDetails(idDiscount), null);

        if (res && res.status === 200) {
            let data = res.data as ExtendedDiscountDetails[];
            arrayDetailsDiscount = data.filter((item) => !item.Deleted);
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

    const textEditor = (options: ColumnEditorOptions) => {
        let value = options.rowData[options.field as keyof TypeCustomer] as string;
        return <InputText type="text" value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback!(e.target.value)} />;
    };

    const AddNewRow = (e: any) => {
        // e.target.disable = true;
        setSelectedproduct({} as Product);
        let _detailsDiscount = [...detailsDiscount];

        emptyDiscountDetails.IDKhuyenMai = idDiscount;
        emptyDiscountDetails.IDMon = 0;
        emptyDiscountDetails.TenMon = '';
        emptyDiscountDetails.GiaLe = 0;
        emptyDiscountDetails.GiaSi = 0;
        emptyDiscountDetails.GiaGoc = 0;
        emptyDiscountDetails.PhanTramKM = 0;

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
        setLoading(true);
        let _detailsDiscount = [...detailsDiscount];
        let { index, newData } = e;

        const updatedDiscount = { ...newData } as ExtendedDiscountDetails;
        updatedDiscount.PhanTramKM = parseInt(updatedDiscount.PhanTramKM as any) || 0;

        _detailsDiscount[index] = updatedDiscount;
        let idDiscount = updatedDiscount.IDChiTietKM;

        if (updatedDiscount.IDMon === 0 || updatedDiscount.PhanTramKM === 0
            || (updatedDiscount.PhanTramKM && updatedDiscount?.PhanTramKM >= 100)) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Dữ liệu không hợp lệ' });
            setLoading(false);
            return;
        }

        if (idDiscount) { // update
            HandleApi(DiscountDetailsService.updateDiscountDetail(idDiscount, updatedDiscount), toast)
                .then((res) => {
                    if (res.status === 200) {
                        setChangeDetailDiscount(!changeDetailDiscount);
                    }
                })
                .catch((error) => {
                    toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể cập nhật chi tiết giảm giá' });
                });
            setLoading(false);
            setSelectedproduct(null);
        } else { // create
            HandleApi(DiscountDetailsService.createDiscountDetail(updatedDiscount), toast)
                .then((res) => {
                    if (res.status === 201) {
                        setChangeDetailDiscount(!changeDetailDiscount);
                    }
                })
                .catch((error) => {
                    toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tạo chi tiết giảm giá mới' });
                });
            setLoading(false);
            setSelectedproduct(null);
        }
    };

    const productEditor = (options: ColumnEditorOptions) => {
        const { rowIndex, rowData } = options;
        const arrayProducts = products.filter((item) => !item.Deleted);
        return (
            <Dropdown
                optionLabel="TenMon" optionValue="IDMon"
                value={selectedproduct ? selectedproduct.IDMon : rowData.IDMon}
                options={arrayProducts} filter
                onChange={(e: DropdownChangeEvent) => {
                    options.editorCallback!(e.value);
                    const product = arrayProducts.find((p) => p.IDMon === e.value) || {} as Product;
                    const detailsNew = detailsDiscount[rowIndex] as ExtendedDiscountDetails;
                    detailsNew.IDMon = product.IDMon;
                    detailsNew.TenMon = product.TenMon;
                    detailsNew.GiaLe = product.DonGiaBanLe;
                    detailsNew.GiaSi = product.DonGiaBanSi;
                    detailsNew.GiaGoc = product.DonGiaVon;
                    setDetailsDiscount([
                        ...detailsDiscount.slice(0, rowIndex),
                        detailsNew,
                        ...detailsDiscount.slice(rowIndex + 1)
                    ]);
                    setSelectedproduct(product as Product);
                }}
            />
        );
    };

    const bodyTemplateButtonDeleted = (rowData: ExtendedDiscountDetails) => {
        return <Button icon='pi pi-trash' onClick={deleteRow(rowData.IDChiTietKM)} />
    };

    const deleteRow = (ChiTietKM: number) => {
        if (!ChiTietKM) {
            return () => {
                let _detailsDiscount = [...detailsDiscount];
                _detailsDiscount.pop();
                setDetailsDiscount(_detailsDiscount);
            };
        }
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

    const bodyChonMon = (rowData: ExtendedDiscountDetails) => {
        return rowData.TenMon;
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={headerElement} visible={visibleDiscountDetails} style={{ width: '90vw' }}
                onHide={() => { if (!visibleDiscountDetails) return; HandClose(); }} >
                <DataTable value={detailsDiscount} editMode="row" loading={loading}
                    onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDChiTietKM" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="IDMon" body={bodyChonMon} header="Món" editor={(options) => productEditor(options)} style={{ width: '20%' }}></Column>
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