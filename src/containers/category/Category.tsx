
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/product.css';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CategoryService } from '@/services/category.service';
import { CategoryGroupService } from '@/services/categoryGroup.service';
import { InputText } from 'primereact/inputtext';
import { Category, CategoryGroup } from '@/models';
import { Toast } from 'primereact/toast';
import { ContextMenu } from 'primereact/contextmenu';
import { FilterMatchMode } from 'primereact/api';
import CategoryDialog from './CategoryDialog';
import { HandleApi } from '@/services/handleApi';
import { Button } from 'primereact/button';

let emptyCategory: Category = {
  IDLoaiMon: 0,
  IDNhomMon: 0,
  TenLoai: '',
  Deleted: false,
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>(emptyCategory);
  const [categoryChange, setCategoryChange] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDLoaiMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TenLoai: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IDNhomMon: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const toast = useRef<Toast>(null);
  const cm = useRef<ContextMenu>(null);
  const menuModel = [
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addCategory(selectedCategory as Category) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editCategory(selectedCategory as Category) },
    {
      label: !selectedCategory?.Deleted ? 'Tắt' : 'Bật',
      icon: 'pi pi-fw pi-power-off',
      command: () => toggleActiveCategory(selectedCategory as Category)
    }
  ];

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);

  useEffect(() => {
    getCategories();
    getCategoryGroup();
  }, [categoryChange]);

  const getCategories = () => {
    setLoading(true);
    HandleApi(CategoryService.getCategories(), null).then((result) => {
      if (result.status === 200) {
        setCategories(result.data)
      }
    }).finally(() => { setLoading(false); });
  }

  const getCategoryGroup = () => {
    setLoading(true);
    HandleApi(CategoryGroupService.getCategoryGroups(), null).then((result) => {
      if (result.status === 200) {
        setCategoryGroups(result.data)
      }
    }).finally(() => { setLoading(false); });
  }

  const addCategory = (category: Category) => {
    setSelectedCategory(emptyCategory);
    setDialogVisible(true);
  };

  const editCategory = (category: Category) => {
    setSelectedCategory(category);
    setDialogVisible(true);
  };

  const toggleActiveCategory = (category: Category) => {
    setLoading(true);
    HandleApi(CategoryService.toggleActiveCategory(category.IDLoaiMon), toast).then(() => {
      getCategories();
    }).finally(() => { setLoading(false); });
  };

  const rowClassName = (data: Category) => (!data.Deleted ? '' : 'bg-danger');

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
            onClick={() => addCategory(selectedCategory as Category)}
          />
        </span>
      </div>
    );
  };

  const bodyNhomMon = (rowData: Category) => {
    return (
      <>
        {categoryGroups?.map((categoryGroups: CategoryGroup) => {
          if (categoryGroups.IDNhomMon === rowData.IDNhomMon) {
            return categoryGroups.TenNhom;
          }
        })}
      </>
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
        contextMenuSelection={selectedCategory ? selectedCategory : undefined}
        onContextMenuSelectionChange={(e: any) => { setSelectedCategory(e.value) }}
        paginator rows={15} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedCategory}
        onSelectionChange={(e: any) => { setSelectedCategory(e.value) }} dataKey="IDLoaiMon"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["IDLoaiMon", "TenLoai"]} emptyMessage="Không có dữ liệu"
      >
        <Column field="IDLoaiMon" header="Id" ></Column>
        <Column field="TenLoai" header="Tên loại"></Column>
        <Column field="IDNhomMon" header="Nhóm" body={bodyNhomMon} ></Column>

      </DataTable>
      <CategoryDialog
        categoryGroups={categoryGroups}
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        idCategory={selectedCategory?.IDLoaiMon}
        onCategoryChange={() => {
          setCategoryChange(!categoryChange)
        }} // refresh data
      />
    </div>
  );
}
