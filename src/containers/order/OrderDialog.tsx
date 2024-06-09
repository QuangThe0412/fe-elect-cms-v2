import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { OrderDetailsService } from '@/services/orderDetails.service';
import { OrderService } from '@/services/order.service';
import { OrderDetail, Product } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { useReactToPrint } from "react-to-print";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { DataTable, DataTableFilterMeta, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { ProductService } from '@/services/products.service';
import { Button } from 'primereact/button';
import { formatCurrency, formatNumber } from '@/utils/common';
import { FilterMatchMode } from 'primereact/api';

type PropType = {
    idOrder: number,
    visible: boolean,
    isPending: boolean,
    onClose: () => void,
};

export default
    function OrderDialog({ visible, onClose, idOrder, isPending }: PropType) {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [changeDetailOrder, setChangeDetailOrder] = useState<boolean>(false);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        IDMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        const fetchData = async () => {
            const productRes: Product[] = await getProducts();
            let _products = productRes.filter((x) => !x.Deleted);
            setProducts(_products);

            if (visible && idOrder > 0) {
                getOrderDetails().then((res) => {
                    let _orderDetails = res.filter((x) => !x.Deleted);
                    setOrderDetails(_orderDetails);
                });
            }
        };

        fetchData();
    }, [visible, changeDetailOrder]);

    const HandClose = () => {
        onClose();

    };

    const getOrderDetails = async () => {
        const res = await HandleApi(OrderService.getOrderDetailsByIdOrder(idOrder), null);
        let result = [] as OrderDetail[];
        if (res && res.status === 200) {
            result = res.data;
        }
        return result;
    };

    const getProducts = async () => {
        const res = await HandleApi(ProductService.getProducts(), null);
        let result = [] as Product[];
        if (res && res.status === 200) {
            result = res.data;
        }

        return result;
    };

    const textEditor = (options: ColumnEditorOptions) => {
        const { value } = options;
        return <InputText type='number' value={value || 0}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => { onBlurEditor(e, options); }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { options.editorCallback!(e.target.value); }
            } />;
    };

    const onBlurEditor = (e: React.FocusEvent<HTMLInputElement>, options: ColumnEditorOptions) => {
        const { rowIndex, field } = options;
        const updatedData = [...orderDetails];
        const _updatedRow = orderDetails[rowIndex];
        switch (field) {
            case 'SoLuong':
                _updatedRow.SoLuong = parseInt(e.target.value);
                break;
            case 'ChietKhau':
                _updatedRow.ChietKhau = parseInt(e.target.value);
                break;
            default:
                break;
        }
        const DonGiaBanLe = (_updatedRow.DonGia ?? 0);
        const TienChuaCK = (_updatedRow.SoLuong ?? 0) * DonGiaBanLe;
        const TienCK = (_updatedRow.ChietKhau ?? 0) * TienChuaCK / 100;
        const TienSauCK = TienChuaCK - TienCK;
        _updatedRow.TienChuaCK = TienChuaCK;
        _updatedRow.TienCK = TienCK;
        _updatedRow.TienSauCK = TienSauCK;
        _updatedRow.DonGia = DonGiaBanLe;

        updatedData[rowIndex] = _updatedRow;
        setOrderDetails(updatedData);
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        let _orderDetails = [...orderDetails];
        let { index } = e;

        let targetUpdate = _orderDetails[index];
        const { IDChiTietHD, IDMon, SoLuong, ChietKhau } = targetUpdate;
        if (!IDMon) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Chưa chọn món' });
            return;
        }

        if (!SoLuong || SoLuong <= 0) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Số lượng phải lớn hơn 0' });
            return;
        }

        const _chietKhau = ChietKhau ?? 0;
        if (_chietKhau < 0 || _chietKhau > 100) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Chiết khấu phải từ 0 đến 100' });
            return;
        }

        setLoading(true);
        if (IDChiTietHD) {//update
            HandleApi(OrderDetailsService.updateOrderDetail(targetUpdate.IDChiTietHD, _orderDetails[index]), toast).then((res) => {
                if (res.status === 200) {
                    setChangeDetailOrder(!changeDetailOrder);
                }
                setLoading(false);
            })
        } else {
            HandleApi(OrderDetailsService.createOrderDetail(targetUpdate), toast).then((res) => {
                if (res.status === 201) {
                    setChangeDetailOrder(!changeDetailOrder);
                }
                setLoading(false);
            })
        }
    };

    const bodyChonMon = (rowData: OrderDetail) => {
        return products.find((x) => x.IDMon === rowData.IDMon)?.TenMon;
    };

    const productEditor = (options: ColumnEditorOptions) => {
        const { rowIndex, rowData } = options;
        return (
            <Dropdown value={rowData.IDMon}
                options={products} optionLabel="TenMon" optionValue="IDMon"
                onChange={(e: DropdownChangeEvent) => {
                    options.editorCallback!(e.value);
                    const idMonChose = e.value as number;
                    const choseProduct = products.find((x) => x.IDMon === idMonChose) as Product;
                    const updatedData = [...orderDetails] as OrderDetail[];
                    const _updatedRow = updatedData[rowIndex] as OrderDetail;

                    const DonGiaBanLe = (choseProduct.DonGiaBanLe ?? 0);
                    const TienChuaCK = (rowData.SoLuong ?? 0) * DonGiaBanLe;
                    const TienCK = (rowData.ChietKhau ?? 0) * TienChuaCK / 100;
                    const TienSauCK = TienChuaCK - TienCK;
                    _updatedRow.IDMon = choseProduct.IDMon;
                    _updatedRow.DonGia = DonGiaBanLe;
                    _updatedRow.SoLuong = rowData.SoLuong || 1;
                    _updatedRow.ChietKhau = rowData.ChietKhau || 0;
                    _updatedRow.TienCK = TienCK;
                    _updatedRow.TienChuaCK = TienChuaCK;
                    _updatedRow.TienSauCK = TienSauCK;

                    updatedData[rowIndex] = _updatedRow;
                    setOrderDetails(updatedData);
                }}
            />
        );
    };

    const bodyTemplateButtonDeleted = (rowData: OrderDetail) => {
        return <Button icon='pi pi-trash' onClick={() => deleteRow(rowData?.IDChiTietHD)} />
    };

    const deleteRow = (IDChiTietHD: number) => {
        if (!IDChiTietHD) {
            let _orderDetails = [...orderDetails];
            _orderDetails.pop();
            setOrderDetails(_orderDetails);
        } else {
            setLoading(true);
            HandleApi(OrderDetailsService.toggleActiveOrderDetail(IDChiTietHD), toast).then((res) => {
                console.log(res);
                if (res.status === 200) {
                    setChangeDetailOrder(!changeDetailOrder);
                }
            });
            setLoading(false);
        }
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'] = { value: value, matchMode: FilterMatchMode.CONTAINS };
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Nhập IDMon" />
                </span>
                <h3 style={{ fontWeight: 'bold' }}>Tổng : {formatCurrency(orderDetails.reduce((total, item) => total + (item.TienSauCK ?? 0), 0))}</h3>
            </div>
        );
    };

    const AddNewRow = (e: any) => {
        let _orderDetails = [...orderDetails];
        _orderDetails.push({
            IDChiTietHD: 0,
            IDHoaDon: idOrder,
            IDMon: 0,
            SoLuong: 1,
            DonGia: 0,
            TienChuaCK: 0,
            ChietKhau: 0,
            TienCK: 0,
            TienSauCK: 0,
        });
        setOrderDetails(_orderDetails);
    };

    ///print
    const componentRef = useRef(null);
    const onBeforeGetContentResolve = useRef(null);

    const handleAfterPrint = useCallback(() => {
        console.log("`onAfterPrint` called");
    }, []);

    const handleBeforePrint = useCallback(() => {
        console.log("`onBeforePrint` called");
    }, []);

    const handleOnBeforeGetContent = useCallback(() => {
        console.log("`onBeforeGetContent` called");
        setLoading(true);

        // return new Promise((resolve) => {
        //     onBeforeGetContentResolve.current = resolve;

        //     setTimeout(() => {
        //         setLoading(false);
        //         resolve();
        //     }, 2000);
        // });
    }, [setLoading]);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const OnClickPrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "AwesomeFileName",
        onBeforeGetContent: handleOnBeforeGetContent,
        onBeforePrint: handleBeforePrint,
        onAfterPrint: handleAfterPrint,
        removeAfterPrint: true
    });

    useEffect(() => {
        if (typeof onBeforeGetContentResolve.current === "function") {
            // onBeforeGetContentResolve.current();
            console.log("onBeforeGetContentResolve.current");
        }
    }, [onBeforeGetContentResolve.current]);
    //end print 
    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">
                Cập nhật
            </span>
            {isPending && <Button label="Thêm món" icon="pi pi-fw pi-plus-circle"
                className="p-button p-component p-button-success ml-3"
                onClick={AddNewRow} />}
            <Button label="In hóa đơn" icon="pi pi-fw pi-print"
                className="p-button p-component p-button-primary ml-3"
                onClick={OnClickPrint} />
        </div>
    );
    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog visible={visible} style={{ width: '95vw' }} header={headerElement}
                onHide={() => { if (!visible) return; HandClose(); }} >
                <DataTable value={orderDetails} editMode="row" loading={loading} ref={componentRef}
                    filters={filters} header={renderHeader()}
                    globalFilterFields={["IDMon"]} emptyMessage="Không có dữ liệu"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
                    onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDChiTietHD" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="IDHoaDon" header="IDHoaDon" style={{ width: '5%' }}></Column>
                    <Column field="IDMon" body={bodyChonMon} header="Món"
                        editor={(options) => productEditor(options)} style={{ width: '20%', whiteSpace: 'wrap' }}></Column>
                    <Column field="SoLuong" header="Số lượng" sortable
                        body={(rowData: OrderDetail) => <>{formatNumber(rowData.SoLuong)}</>}
                        editor={(options) => textEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="DonGia" header="Giá lẻ" style={{ width: '5%' }} sortable
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.DonGia)}</>}></Column>
                    <Column field="TienChuaCK" header="Tiền chưa CK" style={{ width: '10%' }} sortable
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.TienChuaCK)}</>} ></Column>
                    <Column field="ChietKhau" header="Chiết khấu" sortable
                        editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                    <Column field="TienCK" header="Tiền CK" style={{ width: '10%' }} sortable
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.TienCK)}</>}></Column>
                    <Column field="TienSauCK" header="Tiền đã CK" style={{ width: '10%' }} sortable
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.TienSauCK)}</>}></Column>
                    <Column hidden={!isPending} rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column hidden={!isPending} body={bodyTemplateButtonDeleted} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </>
    )
}