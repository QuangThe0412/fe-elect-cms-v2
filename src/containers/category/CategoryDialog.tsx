import React, { useRef } from 'react';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Category, CategoryGroup } from '@/models';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';

type PropType = {
    categoryGroup: CategoryGroup[],
    selectedCategory: Category,
    visible: boolean,
    submitted: boolean,
    onClose?: () => void,
    onSaved?: () => void,
    onInputChange: (e: any, name: string) => void,
    onCategoryChange: (e: any, name: string) => void
}

const CategoryDialog = (props: PropType) => {
    let {
        selectedCategory,
        visible,
        submitted,
        categoryGroup,
        onClose,
        onSaved,
        onInputChange,
        onCategoryChange,
    } = props;
    const toast = useRef<Toast>(null);

    const hideDialog = () => {
        onClose?.();
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={onSaved} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />

            <Dialog visible={visible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header={selectedCategory?.IDLoaiMon ? 'Chỉnh sữa ' : 'Thêm mới'} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="TenLoai" className="font-bold">
                        Tên Loại
                    </label>
                    <InputText id="TenLoai" value={selectedCategory?.TenLoai || ''} onChange={(e) => onInputChange(e, 'TenLoai')} required
                        autoFocus className={classNames({ 'p-invalid': submitted && !selectedCategory?.TenLoai })} />
                    {submitted && !selectedCategory?.TenLoai && <small className="p-error">Tên loại không được bỏ trống.</small>}
                </div>
                <div className="field">
                    <label className="mb-3 font-bold">Nhóm</label>
                    <div className="formgrid grid">
                        {
                            categoryGroup.map((categoryGroup: CategoryGroup) => (
                                <div key={categoryGroup.IDNhomMon} className="field-radiobutton col-6">
                                    <RadioButton inputId={categoryGroup.IDNhomMon.toString()} name="category"
                                        value={categoryGroup.IDNhomMon}
                                        onChange={(e: any) => onCategoryChange(e, 'IDLoaiMon')}
                                        checked={selectedCategory.IDNhomMon === categoryGroup.IDNhomMon} />
                                    <label htmlFor={categoryGroup.IDNhomMon.toString()}>{categoryGroup.TenNhom}</label>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default CategoryDialog;