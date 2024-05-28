
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
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { trimString } from '@/utils/common';

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
    { label: 'Thêm', icon: 'pi pi-fw pi-plus-circle', command: () => addCategory(selectedCategory as Category) },
    { label: 'Sửa', icon: 'pi pi-fw pi-pencil', command: () => editCategory(selectedCategory as Category) },
    {
      label: !selectedCategory?.Deleted ? 'Tắt' : 'Bật',
      icon: 'pi pi-fw pi-power-off',
      command: () => toggleActiveCategory(selectedCategory as Category)
    }
  ];

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getCategories();
    getCategoryGroup();
  }, []);

  const getCategories = () => {
    HandleApi(CategoryService.getCategories(), null).then((result) => {
      if (result.status === 200) {
        setCategories(result.data)
      }
      setLoading(false);
    });
  }

  const getCategoryGroup = () => {
    HandleApi(CategoryGroupService.getCategoryGroups(), null).then((result) => {
      if (result.status === 200) {
        setCategoryGroups(result.data)
      }
      setLoading(false);
    });
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
    HandleApi(CategoryService.toggleActiveCategory(category.IDLoaiMon.toString()), toast).then(() => {
      getCategories();
    });
  };

  const rowClassName = (data: Category) => (!data.Deleted ? '' : 'bg-warning');

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

  const saveCategory = async () => {
    setLoading(true);
    setSubmitted(true);

    if (selectedCategory?.TenLoai?.trim() && selectedCategory?.IDNhomMon > 0) {
      let _category: Category = { ...selectedCategory };
      //remove white space
      trimString(_category);

      if (_category.IDLoaiMon) {
        HandleApi(CategoryService.updateCategory(_category.IDLoaiMon.toString(), _category), toast)
          .then((result) => {
            if (result.status === 200) {
              getCategories();
            }
            setLoading(false);
          });
      } else {
        HandleApi(CategoryService.createCategory(_category), toast).then((result) => {
          if (result.status === 200) {
            getCategories();
          }
          setLoading(false);
        });
      }

      setDialogVisible(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _category: Category = { ...selectedCategory };

    // @ts-ignore
    _category[`${name}`] = val;
    setSelectedCategory(_category as Category);
  };

  const onCategoryChange = (e: RadioButtonChangeEvent, name: string) => {
    const val = e.value || 0;
    let _category: Category = { ...selectedCategory };

    _category.IDNhomMon = val;
    setSelectedCategory(_category as Category);
  };

  const bodyNhomMon = (rowData: Category) => {
    return (
      <>
        {categoryGroups.map((categoryGroups: CategoryGroup) => {
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
        paginator rows={25} rowsPerPageOptions={[5, 10, 25, 50]}
        stripedRows sortMode="multiple" removableSort
        tableStyle={{ width: '100%' }}
        loading={loading} scrollable scrollHeight="75.5vh"
        selectionMode="single" selection={selectedCategory}
        onSelectionChange={(e: any) => { setSelectedCategory(e.value) }} dataKey="IDLoaiMon"
        resizableColumns showGridlines columnResizeMode="expand"
        filters={filters}
        globalFilterFields={["IDLoaiMon", "TenLoai"]} emptyMessage="No category found."
      >
        <Column field="IDLoaiMon" header="Id" ></Column>
        <Column field="TenLoai" header="Tên loại"></Column>
        <Column field="IDNhomMon" header="Nhóm" body={bodyNhomMon} ></Column>

      </DataTable>
      <CategoryDialog
        submitted={submitted}
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        onSaved={saveCategory}
        onInputChange={onInputChange}
        selectedCategory={selectedCategory as Category}
        categoryGroup={categoryGroups as CategoryGroup[]}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
}
