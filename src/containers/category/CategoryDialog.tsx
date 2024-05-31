import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { CategoryService } from '@/services/category.service';
import { CategoryGroupService } from '@/services/categoryGroup.service';
import { Category, CategoryGroup } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

type PropType = {
    idCategory: number,
    visible: boolean,
    onClose: () => void,
    onCategoryChange: () => void,
};

type typeForm = {
    idCategory: number;
    nameCategory: string;
    idGroupCategory: number;
}

const initialForm: typeForm = {
    idCategory: 0,
    nameCategory: '',
    idGroupCategory: 0,
};


export default
    function CategoryDialog({ visible, onClose, idCategory, onCategoryChange }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
    const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<CategoryGroup>();

    useEffect(() => {
        getCategoryGroup();
        if (visible && idCategory > 0) {
            getCategory();
        }
    }, [visible]);

    const HandClose = () => {
        onClose();
        form.resetFields();
        setSelectedCategoryGroup(undefined);
    };

    const getCategory = () => {
        HandleApi(CategoryService.getCategory(idCategory), null).then((res) => {
            if (res && res.status === 200) {
                const { IDLoaiMon, IDNhomMon, TenLoai } = res.data as Category;
                console.log(res.data);
                const categoryGroup = categoryGroups.find((x) => x.IDNhomMon === IDNhomMon);
                setSelectedCategoryGroup(categoryGroup);
                form.setFieldsValue({
                    idCategory: IDLoaiMon,
                    nameCategory: TenLoai,
                    idGroupCategory: IDNhomMon
                });
            }
        });
    };

    const getCategoryGroup = () => {
        HandleApi(CategoryGroupService.getCategoryGroups(), toast).then((result) => {
            if (result.status === 200) {
                let data = result.data;
                setCategoryGroups(data);
            }
            setLoading(false);
        });
    }

    const onFinish = (values: typeForm) => {
        setLoading(true);
        let category: Category = {
            IDLoaiMon: idCategory,
            IDNhomMon: selectedCategoryGroup?.IDNhomMon as number,
            TenLoai: values.nameCategory,
        };

        if (idCategory) { // update
            HandleApi(CategoryService.updateCategory(idCategory, category), toast).then((res) => {
                if (res.status === 200) {
                    onCategoryChange();
                    HandClose();
                }
                setLoading(false);
            });
        } else { // create
            HandleApi(CategoryService.createCategory(category), toast).then((res) => {
                if (res.status === 201) {
                    console.log(res.data);
                    onCategoryChange();
                    HandClose();
                }
                setLoading(false);
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
console.log(selectedCategoryGroup);
    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={idCategory ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialForm}
                    className="p-fluid">
                    <LabelField label="Tên loại" name="nameCategory"
                        rules={[
                            { required: true, message: 'Tên loại không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (<InputText {...control} id="nameCategory"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Nhóm món" name="idGroupCategory"
                        rules={[
                            { required: true, message: 'Nhóm món không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (
                            <Dropdown value={selectedCategoryGroup}
                                onChange={(e: DropdownChangeEvent) => {
                                    setSelectedCategoryGroup(e.value);
                                }}
                                options={categoryGroups} optionLabel={'TenNhom'}
                                placeholder="Chọn nhóm món" className="w-full" />
                            )}
                    </LabelField>

                    <Button loading={loading} type='submit' label={idCategory ? 'Cập nhật' : 'Tạo mới'} className="w-6" style={{ float: 'right' }} />
                </Form>
            </Dialog>
        </>
    )
}