
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/product.css';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DebtService } from '@/services/debt.service';
import { InputText } from 'primereact/inputtext';
import { Debt } from '@/models';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import DebtDialog from './DebtDialog';
import { HandleApi } from '@/services/handleApi';
import { Button } from 'primereact/button';

const emptydebt: Debt = {
  Id: 0,
  IDKhachHang: 0,
  IDHoaDon: 0,
  CongNoDau: 0,
  createDate: null,
  modifyDate: null,
  createBy: '',
  modifyBy: '',
};

export default function DebtComponent() {
  const [Debts, setDebts] = useState<Debt[]>([]);
  const [selectedDebt, setselectedDebt] = useState<Debt>(emptydebt);
  const [debtChange, setdebtChange] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDKhachHang: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDHoaDon: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addDebt(selectedDebt as Debt) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editDebt(selectedDebt as Debt) },
  ];

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  useEffect(() => {
    getDebts();
  }, [debtChange]);

  const getDebts = () => {
    HandleApi(DebtService.getDebts(), null).then((result) => {
      if (result.status === 200) {
        setDebts(result.data)
      }
      setLoading(false);
    });
  }

  const addDebt = (debt: Debt) => {
    setselectedDebt(emptydebt);
    setDialogVisible(true);
  };

  const editDebt = (debt: Debt) => {
    setselectedDebt(debt);
    setDialogVisible(true);
  };

  const rowClassName = (data: Debt) => ((data.CongNoDau ?? 0) > 0 ? '' : 'bg-danger');

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

  return (
    <div className="card">
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={Debts}
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
        globalFilterFields={["IDKhachHang", "IDHoaDon"]} emptyMessage="Không có dữ liệu"
      >
        <Column field="Id" header="Id" ></Column>
        <Column field="IDKhachHang" header="IDKhachHang" ></Column>
        <Column field="IDHoaDon" header="IDHoaDon" ></Column>
        <Column field="CongNoDau" header="CongNoDau" ></Column>
        <Column field="SoTienTra" header="SoTienTra" ></Column>
        <Column field="CongNoCuoi" header="CongNoCuoi" ></Column>
        <Column field="createDate" header="createDate" ></Column>
        <Column field="modifyDate" header="modifyDate" ></Column>
        <Column field="createBy" header="createBy" ></Column>
        <Column field="modifyBy" header="modifyBy" ></Column>
      </DataTable>
      {/* <debtDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        iddebt={selectedDebt.IDLoaiMon}
        ondebtChange={() => {
          setdebtChange(!debtChange)
        }} // refresh data
      /> */}
    </div>
  );
}
