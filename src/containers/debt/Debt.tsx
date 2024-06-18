
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/product.css';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DebtService } from '@/services/debt.service';
import { DebtDetailService } from '@/services/debtDetails.service';
import { CustomerService } from '@/services/customer.service';
import { InputText } from 'primereact/inputtext';
import { Customer, Debt, DebtDetail, Order } from '@/models';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import DebtDialog from './DebtDialog';
import { HandleApi } from '@/services/handleApi';
import { Button } from 'primereact/button';
import { bodyDate, formatCurrency } from '@/utils/common';
import DebtDetailsDialog from './DebtDetailsDialog';
import { OrderService } from '@/services/order.service';

interface NewDebt extends Debt {
  TenKhachHang: string | null | undefined;
}

const emptydebt: NewDebt = {
  Id: 0,
  IDKhachHang: 0,
  TenKhachHang: '',
  IDHoaDon: 0,
  CongNoDau: 0,
  createDate: null,
  modifyDate: null,
  createBy: '',
  modifyBy: '',
};

export default function DebtComponent() {
  const [debts, setDebts] = useState<NewDebt[]>([]);
  const [debtDetails, setDebtDetails] = useState<DebtDetail[]>([]);
  const [selectedDebt, setselectedDebt] = useState<NewDebt>(emptydebt);
  const [debtChange, setdebtChange] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dialogDtailsVisible, setDialogDtailsVisible] = useState<boolean>(false);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDKhachHang: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDHoaDon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TenKhachHang: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addDebt(selectedDebt) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editDebt(selectedDebt) },
    {
      label: 'Chi tiết Công nợ',
      icon: 'pi pi-fw pi-sitemap',
      command: () => setDialogDtailsVisible(true)
    },
  ];

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const resCustomer: Customer[] = await getCustomer();
      const resDebt: Debt[] = await getDebts();
      const _resDebt: NewDebt[] = resDebt.map((item) => {
        return {
          ...item,
          TenKhachHang: resCustomer.find((x) => x.IDKhachHang === item.IDKhachHang)?.TenKhachHang
        }
      })

      setCustomers(resCustomer);
      setDebts(_resDebt);

      if (_resDebt.length > 0) {
        const resDebtDetail: DebtDetail[] = await getDebtDetails();
        setDebtDetails(resDebtDetail.filter((x) => !x.Deleted));
      }

      getOrders();
    };

    fetchData();
  }, [debtChange]);

  const getDebts = async () => {
    setLoading(true);
    const res = await HandleApi(DebtService.getDebts(), null);

    let result = [] as Debt[];
    if (res && res.status === 200) {
      result = res.data as Debt[];
    }

    setLoading(false);
    return result;
  }

  const getDebtDetails = async () => {
    setLoading(true);
    const res = await HandleApi(DebtDetailService.getDebtDetails(), null);

    let result = [] as DebtDetail[];
    if (res && res.status === 200) {
      result = res.data as DebtDetail[];
    }

    setLoading(false);
    return result;
  };

  const getCustomer = async () => {
    setLoading(true);
    let res = await HandleApi(CustomerService.getCustomers(), null);

    let result = [] as Customer[];
    if (res && res.status === 200) {
      result = res.data as Customer[];
    }

    setLoading(false);
    return result;
  }
  
  const getOrders = async () => {
    setLoading(true);
    let res = await HandleApi(OrderService.getOrders(), null);
    let result = res.data as Order[];
    if (res && res.status === 200) {
        result = res.data as Order[];
        setOrders(result);
    }
    setLoading(false);
    return result;
};

  const addDebt = (debt: Debt) => {
    setselectedDebt(emptydebt);
    setDialogVisible(true);
  };

  const editDebt = (debt: NewDebt) => {
    setselectedDebt(debt);
    setDialogVisible(true);
  };

  const rowClassName = (data: Debt) => {
    const detail = debtDetails.filter((x) => x.idCongNoKH === data.Id);
    const totalSoTienTra = detail.reduce((a, b) => a + (b.SoTienTra ?? 0), 0);
    return { 'bg-danger': (data.CongNoDau ?? 0) !== totalSoTienTra };
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
          <Button label="Thêm" icon="pi pi-plus" className="p-button-success ml-3"
            onClick={() => addDebt(selectedDebt as Debt)}
          />
        </span>
      </div>
    );
  };

  const bodySoTienTra = (data: Debt) => {
    const detail = debtDetails.filter((x) => x.idCongNoKH === data.Id);
    return formatCurrency(detail.reduce((a, b) => a + (b.SoTienTra ?? 0), 0));
  }

  const bodyCongNoCuoi = (data: Debt) => {
    const detail = debtDetails.filter((x) => x.idCongNoKH === data.Id);
    const totalSoTienTra = detail.reduce((a, b) => a + (b.SoTienTra ?? 0), 0);
    return formatCurrency((data.CongNoDau ?? 0) - totalSoTienTra);
  }

  const bodyCongNoDau = (data: Debt) => {
    return formatCurrency(data.CongNoDau ?? 0);
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={debts}
        header={renderHeader()}
        rowClassName={rowClassName}
        onContextMenu={(e) => cm.current?.show(e.originalEvent)}
        contextMenuSelection={selectedDebt ? selectedDebt : undefined}
        onContextMenuSelectionChange={(e: any) => { setselectedDebt(e.value) }}
        paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedDebt}
        onSelectionChange={(e: any) => { setselectedDebt(e.value) }} dataKey="Id"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["IDKhachHang", "IDHoaDon", "TenKhachHang"]} emptyMessage="Không có dữ liệu"
      >
        <Column field="Id" header="Id" ></Column>
        <Column field="IDHoaDon" header="IDHoaDon" ></Column>
        <Column field="IDKhachHang" header="IDKhachHang" hidden></Column>
        <Column field="TenKhachHang" header="Khách hàng"></Column>
        <Column field="CongNoDau" header="Công nợ đầu" body={bodyCongNoDau}></Column>
        <Column field="SoTienTra" header="Số tiền trả" body={bodySoTienTra}></Column>
        <Column field="CongNoCuoi" header="Công nợ cuối" body={bodyCongNoCuoi}></Column>
        <Column field="createDate" header="Ngày lập" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="createBy" header="Lập bởi" ></Column>
        <Column field="modifyDate" header="Ngày sửa" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="modifyBy" header="Sửa bởi" ></Column>
      </DataTable>
      <DebtDialog
        orders={orders}
        customers={customers}
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        idDebt={selectedDebt?.Id}
        onDebtChange={() => {
          setdebtChange(!debtChange)
        }} // refresh data
      />
      <DebtDetailsDialog
        visible={dialogDtailsVisible}
        onClose={() => {
          setDialogDtailsVisible(false)
        }}
        idDebt={selectedDebt?.Id}
        onDebtChange={() => {
          setdebtChange(!debtChange)
        }} // refresh data
      />
    </div>
  );
}
