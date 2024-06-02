
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/product.css';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CustomerService } from '@/services/customer.service';
import { InputText } from 'primereact/inputtext';
import { Customer } from '@/models';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import CustomerDialog from './CustomerDialog';
import { HandleApi } from '@/services/handleApi';
import { Button } from 'primereact/button';

let emptyCustomer: Customer = {
  IDKhachHang: 0,
  IDLoaiKH: null,
  TenKhachHang: null,
  DienThoai: null,
  createDate: null,
  modifyDate: null,
  createBy: null,
  modifyBy: null,
  Deleted: null,
};

export default function CustomerComponent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(emptyCustomer);
  const [customerChange, setCustomerChange] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TenMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDLoaiMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    DVTMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    GhiChu: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addCustomer(selectedCustomer as Customer) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editCustomer(selectedCustomer as Customer) },
    {
      label: !selectedCustomer?.Deleted ? 'Tắt' : 'Bật',
      icon: 'pi pi-fw pi-power-off',
      command: () => toggleActiveCustomer(selectedCustomer as Customer)
    }
  ];

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  useEffect(() => {
    getCustomer();
  }, [customerChange]);

  const getCustomer = () => {
    HandleApi(CustomerService.getCustomers(), null).then((result) => {
      if (result.status === 200) {
        setCustomers(result.data)
      }
      setLoading(false);
    });
  }


  const addCustomer = (customer: Customer) => {
    setSelectedCustomer(emptyCustomer);
    setDialogVisible(true);
  };

  const editCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogVisible(true);
  };

  const toggleActiveCustomer = (customer: Customer) => {
    HandleApi(CustomerService.toggleActiveCustomer(customer.IDKhachHang), toast).then(() => {
      getCustomer();
    });
  };

  const rowClassName = (data: Customer) => (!data.Deleted ? '' : 'bg-warning');

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
            onClick={() => addCustomer(selectedCustomer as Customer)}
          />
        </span>
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={customers}
        header={renderHeader()}
        rowClassName={rowClassName}
        onContextMenu={(e) => cm.current?.show(e.originalEvent)}
        contextMenuSelection={selectedCustomer ? selectedCustomer : undefined}
        onContextMenuSelectionChange={(e: any) => { setSelectedCustomer(e.value) }}
        paginator rows={15} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedCustomer}
        onSelectionChange={(e: any) => { setSelectedCustomer(e.value) }} dataKey="IDKhachHang"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["username", "IDKhachHang", "IDLoaiKH", "DienThoai,", "TenKhachHang"]} emptyMessage="No Customer found."
      >
        <Column field="IDKhachHang" header="Id" ></Column>
        <Column field="IDLoaiKH" header="IdLoaiKH"></Column>
        <Column field="username" header="Tài khoản"></Column>
        <Column field="TenKhachHang" header="Tên khách hàng"></Column>
        <Column field="DienThoai" header="Số điện thoại"></Column>

      </DataTable>
      <CustomerDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        idCustomer={selectedCustomer.IDKhachHang}
        onCustomerChange={() => {
          setCustomerChange(!customerChange)
        }} // refresh data
      />
    </div>
  );
}
