
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/product.css';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OrderService } from '@/services/order.service';
import { CustomerService } from '@/services/customer.service';
import { InputText } from 'primereact/inputtext';
import { Customer, Order } from '@/models';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import OrderDialog from './OrderDialog';
import { HandleApi } from '@/services/handleApi';
import { Button } from 'primereact/button';
import { STATUS_ENUM } from '@/constants';

export default function Orders() {
  const [categories, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [orderChange, setOrderChange] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDHoaDon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDBaoGia: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDKhachHang: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TrangThai: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Hủy', icon: 'pi pi-fw pi-pencil', command: () => console.log('Hủy') },
    { label: 'Hoàn thành', icon: 'pi pi-fw pi-plus-circle', command: () => console.log('Hoàn thành') },
    { label: 'Đang xử lý', icon: 'pi pi-fw pi-pencil', command: () => console.log('Đang xử lý') },
    {
      label: 'Chi tiết',
      icon: 'pi pi-eyes',
      command: () => console.log('Chi tiết')
    }
  ];

  useEffect(() => {
    const fethData = async () => {
      const customerRes: Customer[] = await getCustomers();
      setCustomers(customerRes);

      const ordersRes = await getOrders();
      console.log({ ordersRes });
      setOrders(ordersRes);
    };

    fethData();
  }, [orderChange]);

  const getOrders = async () => {
    const res = await HandleApi(OrderService.getOrders(), null)

    let result = [] as Order[];
    if (res && res.status === 200) {
      result = res.data as Order[];
    }
    setLoading(false);
    return result;
  }

  const getCustomers = async () => {
    const res = await HandleApi(CustomerService.getCustomers(), null)

    let result = [] as Customer[];
    if (res && res.status === 200) {
      result = res.data as Customer[];
    }
    setLoading(false);
    return result;
  }

  const rowClassName = (data: Order) => {
    let enumData = data.TrangThai;
    console.log({ enumData });
    console.log('/////',STATUS_ENUM.PENDING);

    switch (enumData) {
      case STATUS_ENUM.PENDING:
        return 'bg-warning';
      case STATUS_ENUM.FINISH:
        return 'bg-success';
      case STATUS_ENUM.CANCEL:
        return 'bg-danger';
      default:
        return '';
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
      </div>
    );
  };


  return (
    <div className="card">
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={categories}
        header={renderHeader()}
        rowClassName={rowClassName}
        onContextMenu={(e) => cm.current?.show(e.originalEvent)}
        contextMenuSelection={selectedOrder ? selectedOrder : undefined}
        onContextMenuSelectionChange={(e: any) => { setSelectedOrder(e.value) }}
        paginator rows={15} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedOrder}
        onSelectionChange={(e: any) => { setSelectedOrder(e.value) }} dataKey="IDHoaDon"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={[
          "IDHoaDon",
          "IDBaoGia",
          "IDKhachHang",
          "TrangThai",
        ]} emptyMessage="No Order found."
      >
        <Column field="IDHoaDon" header="Id" ></Column>
        <Column field="IDBaoGia" header="Id báo giá"></Column>
        <Column field="IDKhachHang" header="Id khách hàng"  ></Column>
        <Column field="TrangThai" header="Trạng thái"  ></Column>
        <Column field="CongNo" header="Công nợ"  ></Column>
        <Column field="GhiChu" header="Ghi chú"  ></Column>

      </DataTable>
      {/* <OrderDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        idOrder={selectedOrder.IDLoaiMon}
        onOrderChange={() => {
          setOrderChange(!orderChange)
        }} // refresh data
      /> */}
    </div>
  );
}
