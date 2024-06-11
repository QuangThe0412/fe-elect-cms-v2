
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/product.css';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ImportService } from '@/services/import.service';
import { InputText } from 'primereact/inputtext';
import { Import } from '@/models';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import { HandleApi } from '@/services/handleApi';
import { Button } from 'primereact/button';

let emptyImport: Import = {
  IDPhieuNhap: 0,
  NhaCungCap: '',
  GhiChu: '',
};

export default function ImportComponent() {
  const [imports, setImports] = useState<Import[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [importChange, setImportChange] = useState<boolean>(false);
  const [selectedImport, setSelectedImport] = useState<Import>(emptyImport);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDLoaiMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TenLoai: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDNhomMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addImport(selectedImport as Import) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editImport(selectedImport as Import) },
    {
      label: 'Chi tiết phiếu nhập',
      icon: 'pi pi-fw pi-external-link',
      command: () => { }
    }
  ];

  useEffect(() => {
    getCategories();
  }, [importChange]);

  const getCategories = () => {
    setLoading(true);
    HandleApi(ImportService.getImports(), null).then((result) => {
      console.log(result);
      if (result.status === 200) {
        setImports(result.data)
      }
    }).finally(() => { setLoading(false); });
  }

  const addImport = (phieuNhap: Import) => {
    setSelectedImport(emptyImport);
    setDialogVisible(true);
  };

  const editImport = (phieuNhap: Import) => {
    setSelectedImport(phieuNhap);
    setDialogVisible(true);
  };

  const rowClassName = (data: Import) => (!data.Deleted ? '' : 'bg-danger');

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
            onClick={() => addImport(selectedImport as Import)}
          />
        </span>
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={imports}
        header={renderHeader()}
        rowClassName={rowClassName}
        onContextMenu={(e) => cm.current?.show(e.originalEvent)}
        contextMenuSelection={selectedImport ? selectedImport : undefined}
        onContextMenuSelectionChange={(e: any) => { setSelectedImport(e.value) }}
        paginator rows={15} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedImport}
        onSelectionChange={(e: any) => { setSelectedImport(e.value) }} dataKey="IDLoaiMon"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["IDLoaiMon", "TenLoai"]} emptyMessage="Không có dữ liệu"
      >
        <Column field="IDLoaiMon" header="Id" ></Column>
        <Column field="TenLoai" header="Tên loại"></Column>
        <Column field="IDNhomMon" header="Nhóm" ></Column>

      </DataTable>
      {/* <ImportDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        idImport={selectedImport.IDLoaiMon}
        onImportChange={() => {
          setImportChange(!phieuNhapChange)
        }} // refresh data
      /> */}
    </div>
  );
}
