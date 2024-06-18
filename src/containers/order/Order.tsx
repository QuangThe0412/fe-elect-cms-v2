
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
import { STATUS_ENUM } from '@/constants';
import { IsPendingStatus, bodyDate } from '@/utils/common';

interface OrderType extends Order {
  TenKhachHang?: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [orderChange, setOrderChange] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
    IDHoaDon: { value: '', matchMode: FilterMatchMode.CONTAINS },
    IDBaoGia: { value: '', matchMode: FilterMatchMode.CONTAINS },
    IDKhachHang: { value: '', matchMode: FilterMatchMode.CONTAINS },
    TrangThai: { value: '', matchMode: FilterMatchMode.CONTAINS },
  });

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Đang xử lý', icon: 'pi pi-spin pi-spinner', command: () => HandleStatus(STATUS_ENUM.PENDING) },
    { label: 'Hoàn thành', icon: 'pi pi-fw pi-check', command: () => HandleStatus(STATUS_ENUM.FINISH) },
    { label: 'Hủy', icon: 'pi pi-fw pi-times', command: () => HandleStatus(STATUS_ENUM.CANCEL) },
    {
      label: 'Chi tiết hóa đơn',
      icon: 'pi pi-eye',
      command: () => setDialogVisible(true)
    }
  ];

  useEffect(() => {
    const fethData = async () => {
      const customerRes: Customer[] = await getCustomers();
      setCustomers(customerRes);

      const ordersRes = await getOrders();
      const _ordersRes = ordersRes as OrderType[];
      _ordersRes.forEach((x) => {
        const customer = customerRes.find((y) => y.IDKhachHang === x.IDKhachHang);
        if (customer) {
          x.TenKhachHang = customer.TenKhachHang as string;
        }
      });
      setOrders(ordersRes);
    };

    fethData();
  }, [orderChange]);

  const getOrders = async () => {
    setLoading(true);
    const res = await HandleApi(OrderService.getOrders(), null)

    let result = [] as Order[];
    if (res && res.status === 200) {
      result = res.data as Order[];
    }
    setLoading(false);
    return result;
  }

  const getCustomers = async () => {
    setLoading(true);
    const res = await HandleApi(CustomerService.getCustomers(), null)

    let result = [] as Customer[];
    if (res && res.status === 200) {
      result = res.data as Customer[];
    }
    setLoading(false);
    return result;
  }

  const HandleStatus = (status: number) => {
    if (selectedOrder?.TrangThai === status) return;

    setLoading(true);
    HandleApi(OrderService.updateStatusOrder(selectedOrder?.IDHoaDon as number, status), toast).then((res) => {
      if (res.status === 200) {
        setOrderChange(!orderChange);
      }
    }).finally(() => { setLoading(false); });
  };

  const rowClassName = (data: Order) => {
    let enumData = data.TrangThai;
    switch (enumData) {
      case STATUS_ENUM.PENDING:
        return 'bg-success';
      case STATUS_ENUM.CANCEL:
        return 'bg-danger';
      case STATUS_ENUM.FINISH:
        return '';
      default:
        return '';
    }
  };

  const bodyStatus = (data: Order) => {
    let enumData = data.TrangThai;
    switch (enumData) {
      case STATUS_ENUM.PENDING:
        return <span className="text-help">Đang xử lý</span>;
      case STATUS_ENUM.CANCEL:
        return <span className="text-danger">Hủy</span>;
      case STATUS_ENUM.FINISH:
        return <span className="text-success">Hoàn thành</span>;
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
      <DataTable value={orders}
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
          "TenKhachHang",
          "TrangThai",
        ]} emptyMessage="Không có dữ liệu"
      >
        <Column field="IDHoaDon" header="Id" ></Column>
        <Column field="IDBaoGia" header="Id báo giá"></Column>
        <Column field="IDKhachHang" header="IDKhachHang" hidden></Column>
        <Column field="TenKhachHang" header="Tên khách hàng" ></Column>
        <Column field="TrangThai" header="Trạng thái" body={bodyStatus} ></Column>
        <Column field="createDate" header="Ngày lập" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="CongNo" header="Công nợ"></Column>
        <Column field="GhiChu" header="Ghi chú"></Column>

      </DataTable>
      <OrderDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        isPending={IsPendingStatus(selectedOrder?.TrangThai as number)}
        idOrder={selectedOrder?.IDHoaDon as number}
      />
    </div>
  );
}
