import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { OrderDetailsService } from '@/services/orderDetails.service';
import { OrderService } from '@/services/order.service';
import { OrderDetail, Product, selectedRowType } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { DataTable, DataTableFilterMeta, DataTableRowEditCompleteEvent, DataTableRowEditEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { ProductService } from '@/services/products.service';
import { Button } from 'primereact/button';
import { formatCurrency, formatNumber } from '@/utils/common';
import { FilterMatchMode } from 'primereact/api';
import OrderPrintComponent from './OrderPrint';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';

type PropType = {
    idOrder: number,
    visible: boolean,
    isPending: boolean,
    onClose: () => void,
};

interface TypeOrderDetail extends OrderDetail {
    TenMon?: string;
}

const emptyDetails: OrderDetail = {
    IDChiTietHD: 0,
    IDHoaDon: 0,
    IDMon: 0,
    SoLuong: 0,
    DonGia: 0,
    ChietKhau: 0,
    TienChuaCK: 0,
    TienCK: 0,
    TienSauCK: 0,
};

export default
    function OrderDialog({ visible, onClose, idOrder, isPending }: PropType) {
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [details, setDetails] = useState<TypeOrderDetail[]>([]);
    const [onChangetDetails, setOnChangeDetails] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<selectedRowType>();
    const [products, setProducts] = useState<Product[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        IDMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
        TenMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        const fetchData = async () => {
            if (visible && idOrder) {
                const productRes: Product[] = await getProducts();
                let _products = productRes.filter((x) => !x.Deleted);
                setProducts(_products);

                const resOrders = await getOrderDetails();
                let _details = resOrders.filter((x) => !x.Deleted);
                const detailsData = _details.map((x) => {
                    return {
                        ...x,
                        TenMon: productRes.find((y) => y.IDMon === x.IDMon)?.TenMon
                    }
                });
                setDetails(detailsData);
            };
        };

        fetchData();
    }, [visible, onChangetDetails]);

    const HandClose = () => {
        onClose();
        setSelectedRow(undefined);
        setDetails([]);
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

    const numberEditor = (options: ColumnEditorOptions) => {
        let { field, value } = options;
        let disable = false;
        if (selectedRow) {
            const { dataSelected } = selectedRow;
            switch (field) {
                case 'SoLuong':
                    value = dataSelected?.SoLuong ?? 0;
                    break;
                case 'DonGia':
                    value = dataSelected?.DonGia ?? 0;
                    disable = true;
                    break;
                case 'TienChuaCK':
                    value = dataSelected?.TienChuaCK ?? 0;
                    disable = true;
                    break;
                case 'ChietKhau':
                    value = dataSelected?.ChietKhau ?? 0;
                    break;
                case 'TienCK':
                    value = dataSelected?.TienCK ?? 0;
                    disable = true;
                    break;
                case 'TienSauCK':
                    value = dataSelected?.TienSauCK ?? 0;
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
            case 'SoLuong':
                dataSelected.SoLuong = parseInt(value) ?? 0;
                break;
            case 'ChietKhau':
                dataSelected.ChietKhau = parseInt(value) ?? 0;
                break;
            default:
                break;
        }

        const DonGiaBanLe = (dataSelected.DonGia ?? 0);
        const TienChuaCK = (dataSelected.SoLuong ?? 0) * DonGiaBanLe;
        const TienCK = (dataSelected.ChietKhau ?? 0) * TienChuaCK / 100;
        const TienSauCK = TienChuaCK - TienCK;
        dataSelected.TienChuaCK = TienChuaCK;
        dataSelected.TienCK = TienCK;
        dataSelected.TienSauCK = TienSauCK;
        dataSelected.DonGia = DonGiaBanLe;

        setSelectedRow({ index: rowIndex, dataSelected: dataSelected });
    };

    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        const { dataSelected } = selectedRow as selectedRowType;
        const IDChiTietHD = dataSelected?.IDChiTietHD ?? 0;

        const { IDMon, SoLuong, DonGia, ChietKhau, TienChuaCK, TienCK, TienSauCK } = dataSelected;

        let details: OrderDetail = {
            IDChiTietHD: IDChiTietHD,
            IDHoaDon: idOrder,
            IDMon: IDMon,
            SoLuong: SoLuong,
            DonGia: DonGia,
            ChietKhau: ChietKhau,
            TienChuaCK: TienChuaCK,
            TienCK: TienCK,
            TienSauCK: TienSauCK,
        };

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
            HandleApi(OrderDetailsService.updateOrderDetail(IDChiTietHD, details), toast).then((res) => {
                if (res.status === 200) {
                    setOnChangeDetails(!onChangetDetails);
                }
            }).finally(() => {
                setSelectedRow(undefined);
                setLoading(false);
            });
        } else {
            HandleApi(OrderDetailsService.createOrderDetail(details), toast).then((res) => {
                if (res.status === 201) {
                    setOnChangeDetails(!onChangetDetails);
                }
            }).finally(() => {
                setSelectedRow(undefined);
                setLoading(false);
            });
        }
    };

    const bodyChonMon = (rowData: OrderDetail) => {
        return products.find((x) => x.IDMon === rowData.IDMon)?.TenMon;
    };

    const productEditor = (options: ColumnEditorOptions) => {
        const { rowIndex, rowData } = options;
        return (
            <Dropdown value={rowData.IDMon} filter
                options={products} optionLabel="TenMon" optionValue="IDMon"
                onChange={(e: DropdownChangeEvent) => {
                    options.editorCallback!(e.value);
                    const idMonChose = e.value as number;
                    const choseProduct = products.find((x) => x.IDMon === idMonChose) as Product;
                    const updatedData = [...details] as OrderDetail[];
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

                    setSelectedRow({ index: rowIndex, dataSelected: _updatedRow });
                }}
            />
        );
    };

    const bodyTemplateButtonDeleted = (rowData: OrderDetail) => {
        return <Button icon='pi pi-trash' onClick={deleteRow(rowData.IDChiTietHD)} />
    };

    const deleteRow = (id: number | undefined) => {
        if (!id) {
            return () => {
                let _data = [...details];
                _data.pop();
                setDetails(_data);
            }
        }

        return () => {
            setLoading(true);
            HandleApi(OrderDetailsService.deleteOrderDetail(id), toast).then((res) => {
                if (res.status === 200) {
                    setOnChangeDetails(!onChangetDetails);
                }
            }).finally(() => { setLoading(false); });
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
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm" />
                </span>
                <h3 style={{ fontWeight: 'bold' }}>Tổng : {formatCurrency(details.reduce((total, item) => total + (item.TienSauCK ?? 0), 0))}</h3>
            </div>
        );
    };

    const AddNewRow = (e: any) => {
        let _details = [...details];
        emptyDetails.SoLuong = 1;
        _details.push(emptyDetails);
        setDetails(_details);
    };

    ///print
    const handlePrint = () => {
        var content = document.getElementById("divcontents");
        var pri = (document.getElementById("ifmcontentstoprint") as HTMLIFrameElement)?.contentWindow;
        if (content && pri) {
            pri.document.open();
            pri.document.write(content.innerHTML);
            pri.document.close();
            pri.focus();
            pri.print();

            pri.onbeforeprint = () => {
                // Đặt hành động cần thực hiện trước khi mở hộp thoại in ở đây
                console.log("Print dialog opened");
            };

            pri.onafterprint = () => {
                // Đặt hành động cần thực hiện sau khi đóng hộp thoại in ở đây
                console.log("Print dialog closed");
            };
        }
    }

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">
                {
                    !idOrder ? "Thêm mới hóa đơn" : `Cập nhật hóa đơn số ${idOrder}`
                }
            </span>
            {(!idOrder || isPending) && <Button label="Thêm món" icon="pi pi-fw pi-plus-circle"
                className="p-button p-component p-button-success ml-3"
                onClick={AddNewRow} />}

            {details.length > 0 && < Button label="In" icon="pi pi-fw pi-print"
                className="p-button p-component p-button-primary ml-3"
                onClick={handlePrint}
            />
            }
        </div>
    );

    const rowClassName = (data: OrderDetail) => (!data.IDChiTietHD ? 'bg-danger' : '');

    const onRowEditInit = (options: DataTableRowEditEvent) => {
        const { data, index } = options;
        setSelectedRow({ index: index, dataSelected: data })
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <OrderPrintComponent id='divcontents'
                dataOrderDetails={details}
                dataProducts={products}
            />
            <iframe id="ifmcontentstoprint"
                style={{ display: 'none', height: '0px', width: '0px', position: 'absolute' }}>
            </iframe>

            <Dialog visible={visible} style={{ minWidth: '95vw' }} header={headerElement}
                onHide={() => { if (!visible) return; HandClose(); }} >
                <DataTable value={details} editMode="row" loading={loading}
                    rowClassName={rowClassName}
                    onRowEditComplete={onRowEditComplete}
                    onRowEditCancel={() => { setSelectedRow(undefined) }}
                    onRowEditInit={onRowEditInit}
                    filters={filters} header={renderHeader()}
                    globalFilterFields={["IDMon", "TenMon"]} emptyMessage="Không có dữ liệu"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="IDChiTietHD" header="Id" style={{ width: '10%' }}></Column>
                    <Column field="IDHoaDon" header="IDHoaDon" style={{ width: '5%' }} hidden></Column>
                    <Column field="TenMon" header="TenMon" hidden style={{ width: '5%' }}></Column>
                    <Column field="IDMon" body={bodyChonMon} header="Món"
                        editor={(options) => productEditor(options)} style={{ width: '20%', whiteSpace: 'wrap' }}></Column>
                    <Column field="SoLuong" header="Số lượng" sortable
                        body={(rowData: OrderDetail) => <>{formatNumber(rowData.SoLuong)}</>}
                        editor={(options) => numberEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="DonGia" header="Giá lẻ" style={{ width: '5%' }} sortable
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.DonGia)}</>}
                        editor={(options) => numberEditor(options)}></Column>
                    <Column field="TienChuaCK" header="Tiền chưa CK" style={{ width: '10%' }} sortable
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.TienChuaCK)}</>}
                        editor={(options) => numberEditor(options)}></Column>
                    <Column field="ChietKhau" header="Chiết khấu" sortable
                        editor={(options) => numberEditor(options)} style={{ width: '5%' }}></Column>
                    <Column field="TienCK" header="Tiền CK" style={{ width: '10%' }} sortable
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.TienCK)}</>}
                        editor={(options) => numberEditor(options)}></Column>
                    <Column field="TienSauCK" header="Tiền đã CK" style={{ width: '10%' }} sortable
                        body={(rowData: OrderDetail) => <>{formatCurrency(rowData.TienSauCK)}</>}
                        editor={(options) => numberEditor(options)}></Column>
                    <Column hidden={!isPending} rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                    <Column hidden={!isPending} body={bodyTemplateButtonDeleted} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                </DataTable>
            </Dialog>
        </>
    )
}