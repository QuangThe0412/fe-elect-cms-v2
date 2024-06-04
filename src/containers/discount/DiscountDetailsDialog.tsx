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
import { Column, ColumnEditorOptions } from 'primereact/column';
import { ProductService } from '@/services/products.service';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

type PropType = {
    idDiscount: number,
    nameDiscount: string,
    visibleDiscountDetails: boolean,
    onClose: () => void,
};

type ArrayProducts = {
    IDMon: number,
    TenMon: string,
};

let emptyTypeCustomer: DiscountDetails = {
    IDChiTietKM: 0,
    IDKhuyenMai: 0,
    IDMon: 0,
    PhanTramKM: 0,
    createDate: null,
    modifyDate: null,
    createBy: null,
    modifyBy: null,
    Deleted: false
};

export default function DiscountDetailsDialog({ visibleDiscountDetails, onClose, idDiscount, nameDiscount }: PropType) {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [detailsDiscount, setDetailsDiscount] = useState<DiscountDetails[]>([]);
    const [products, setProducts] = useState<ArrayProducts[]>([]);
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
        setLoading(true);
        HandleApi(DiscountService.getDiscountDetails(idDiscount), null).then((res) => {
            if (res && res.status === 200) {
                setDetailsDiscount(res.data)
            }
            setLoading(false);
        });
    };

    const getProduct = () => {
        HandleApi(ProductService.getProducts(), null).then((res) => {
            if (res && res.status === 200) {
                let data = res.data as Product[];

                let arrayProducts: ArrayProducts[] = data
                    .filter((item) => !item.Deleted)
                    .map((item) => ({
                        IDMon: item.IDMon,
                        TenMon: item.TenMon,
                    }));
                setProducts(arrayProducts);
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

        emptyTypeCustomer.IDKhuyenMai = idDiscount;
        _detailsDiscount.push(emptyTypeCustomer);
        setDetailsDiscount(_detailsDiscount);
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">
                Các món thuộc khuyến mãi: &nbsp;
                <span style={{ color: 'red', textDecoration: 'underline' }}>{nameDiscount}</span>
            </span>
            <Button label="Thêm món" icon="pi pi-fw pi-plus-circle"
                className="p-button p-component p-button-success ml-3"
                onClick={AddNewRow} />
        </div>
    );

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        setLoading(true);
        let _detailsDiscount = [...detailsDiscount];
        let { newData, index } = e;

        _detailsDiscount[index] = newData as DiscountDetails;
        const discount = _detailsDiscount[index];
        let idDiscount = discount.IDChiTietKM;

        discount.PhanTramKM = parseInt(discount.PhanTramKM as any);

        if(discount.IDMon === 0 || discount.PhanTramKM === 0 
            || (discount.PhanTramKM && discount?.PhanTramKM >= 100)) {
                toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Dữ liệu không hợp lệ' });
                setLoading(false);
                return;
            }

        if (idDiscount) { // update
            HandleApi(DiscountDetailsService.updateDiscountDetail(idDiscount, discount), toast).then((res) => {
                if (res.status === 200) {
                    setChangeDetailDiscount(!changeDetailDiscount);
                }
                setLoading(false);
            });
        } else { // create
            HandleApi(DiscountDetailsService.createDiscountDetail(discount), toast).then((res) => {
                if (res.status === 201) {
                    setChangeDetailDiscount(!changeDetailDiscount);
                }
                setLoading(false);
            });
        }
    };

    const productBodyTemplate = (rowData: DiscountDetails) => {
        let product = products.find(p => p.IDMon === rowData?.IDMon);
        return product ? product.TenMon : '';
    };

    const productEditor = (options: ColumnEditorOptions) => {
        const arrayProducts = products.map((item) => {
            return { IDMon: item.IDMon, TenMon: item.TenMon };
        });
        const { rowData } = options;
        return (
            <Dropdown value={rowData.IDMon}
                options={arrayProducts} filter
                onChange={(e: DropdownChangeEvent) => {
                    console.log(e.value);
                    options.editorCallback!(e.value);
                }}
                optionLabel="TenMon" optionValue="IDMon" placeholder="Chọn món"
            />
        );
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={headerElement} visible={visibleDiscountDetails} style={{ width: '90vw' }}
                onHide={() => { if (!visibleDiscountDetails) return; HandClose(); }} >
                <DataTable value={detailsDiscount} editMode="row" dataKey="IDChiTietKM" loading={loading}
                    onRowEditComplete={onRowEditComplete}
                    tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDChiTietKM" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="IDMon" header="Món" body={productBodyTemplate}
                        editor={(options) => productEditor(options)} style={{ width: '20%' }}></Column>

                    <Column field="PhanTramKM" header="Phần trăm KM" editor={(options) => textEditor(options)} style={{ width: '20%' }}></Column>
                    <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </>
    )
}