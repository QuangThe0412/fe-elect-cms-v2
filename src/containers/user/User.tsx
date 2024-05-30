
import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { UserService } from '@/services/user.service';
import { InputText } from 'primereact/inputtext';
import { User } from '@/models';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import { HandleApi } from '@/services/handleApi';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { trimString } from '@/utils/common';
import { Checkbox } from 'primereact/checkbox';

let emptyUser: User = {

};

export default function Users() {
  const [Users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>(emptyUser);
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
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addUser(selectedUser as User) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editUser(selectedUser as User) },
    {
      label: !selectedUser?.Deleted ? 'Tắt' : 'Bật',
      icon: 'pi pi-fw pi-power-off',
      command: () => toggleActiveUser(selectedUser as User)
    }
  ];

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    HandleApi(UserService.getUsers(), toast).then((result) => {
      if (result.status === 200) {
        setUsers(result.data)
      }
      setLoading(false);
    });
  }

  const addUser = (User: User) => {
    setSelectedUser(emptyUser);
    setDialogVisible(true);
  };

  const editUser = (User: User) => {
    setSelectedUser(User);
    setDialogVisible(true);
  };

  const toggleActiveUser = (User: User) => {
    let id = User.id || 0;
    HandleApi(UserService.toggleActiveUser(id), toast).then(() => {
      getUsers();
    });
  };

  const rowClassName = (data: User) => (!data.Deleted ? '' : 'bg-warning');

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
            onClick={() => addUser(selectedUser as User)}
          />
        </span>
      </div>
    );
  };

  const saveUser = async () => {
    setLoading(true);
    setSubmitted(true);

    // if (selectedUser?.TenLoai?.trim() && selectedUser?.IDNhomMon > 0) {
    //   let _User: User = { ...selectedUser };
    //   //remove white space
    //   trimString(_User);

    //   if (_User.IDLoaiMon) {
    //     HandleApi(UserService.updateUser(_User.IDLoaiMon.toString(), _User), toast)
    //       .then((result) => {
    //         if (result.status === 200) {
    //           getUsers();
    //         }
    //         setLoading(false);
    //       });
    //   } else {
    //     HandleApi(UserService.createUser(_User), toast).then((result) => {
    //       if (result.status === 200) {
    //         getUsers();
    //       }
    //       setLoading(false);
    //     });
    //   }

    //   setDialogVisible(false);
    // }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _User: User = { ...selectedUser };

    // @ts-ignore
    _User[`${name}`] = val;
    setSelectedUser(_User as User);
  };

  const onUserChange = (e: RadioButtonChangeEvent, name: string) => {
    const val = e.value || 0;
    let _User: User = { ...selectedUser };

    // _User.IDNhomMon = val;
    setSelectedUser(_User as User);
  };

  const bodyCheckBox = (rowData: User, options: { field: keyof User }) => {
    const field = options.field;
    const checked = rowData[field] as boolean;
    return (
      <Checkbox checked={checked} disabled></Checkbox>
    );
  };

const bodyDate = (rowData: User, options: { field: keyof User }) => {
    const field = options.field;
    const dateValue = rowData[field];
    if (dateValue) {
        const date = new Date(dateValue as string);
        return date instanceof Date ? date.toLocaleDateString('vi-VN') : '';
    }
    return '';
}
  return (
    <div className="card">
      <Toast ref={toast} />
      <ContextMenu model={menuModel} ref={cm} />
      <DataTable value={Users}
        header={renderHeader()}
        rowClassName={rowClassName}
        onContextMenu={(e) => cm.current?.show(e.originalEvent)}
        contextMenuSelection={selectedUser ? selectedUser : undefined}
        onContextMenuSelectionChange={(e: any) => { setSelectedUser(e.value) }}
        paginator rows={25} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedUser}
        onSelectionChange={(e: any) => { setSelectedUser(e.value) }} dataKey="id"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["id", "username", "phone"]} emptyMessage="No User found."
      >
        <Column field="id" header="Id" ></Column>
        <Column field="username" header="Tên"></Column>
        <Column field="ngaySinh" header="Ngày sinh" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="admin" header="admin" body={bodyCheckBox as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="cashier" header="cashier" body={bodyCheckBox as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="inventory" header="inventory" body={bodyCheckBox as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="saler" header="saler" body={bodyCheckBox as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="guest" header="guest" body={bodyCheckBox as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="phone" header="Điện thoại"></Column>
        <Column field="createDate" header="Ngày tạo" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
        <Column field="modifyDate" header="Ngày sửa" body={bodyDate as (data: any, options: any) => React.ReactNode}></Column>
      </DataTable>
    </div>
  );
}
