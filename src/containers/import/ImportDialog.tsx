import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { ImportService } from '@/services/import.service';
import { Import } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

type PropType = {
    idImport: number,
    visible: boolean,
    onClose: () => void,
    onImportChange: () => void,
};

type typeForm = {
    idImport: number;
    ProviderName: string;
    Note : string;
}

const initialForm: typeForm = {
    idImport: 0,
    ProviderName: '',
    Note: '',
};


export default
    function ImportDialog({ visible, onClose, idImport, onImportChange }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (visible && idImport > 0) {
            getImport();
        }
    }, [visible]);

    const HandClose = () => {
        onClose();
        form.resetFields();
    };

    const getImport = () => {
        setLoading(true);
        HandleApi(ImportService.getImport(idImport), null).then((res) => {
            if (res && res.status === 200) {
                let data = res.data as Import;
                form.setFieldsValue({
                    idImport: data.IDPhieuNhap,
                    ProviderName: data.NhaCungCap,
                    Note: data.GhiChu
                });
            }
        }).finally(() => { setLoading(false); });
    };

    

    const onFinish = (values: typeForm) => {
        setLoading(true);
        // let category: Import = {
        //     IDLoaiMon: idImport,
        //     IDNhomMon: selectedImportGroup?.IDNhomMon as number,
        //     TenLoai: values.nameImport,
        // };

        // if (idImport) { // update
        //     HandleApi(ImportService.updateImport(idImport, category), toast).then((res) => {
        //         if (res.status === 200) {
        //             onImportChange();
        //             HandClose();
        //         }
        //     }).finally(() => setLoading(false));
        // } else { // create
        //     HandleApi(ImportService.createImport(category), toast).then((res) => {
        //         if (res.status === 201) {
        //             console.log(res.data);
        //             onImportChange();
        //             HandClose();
        //         }
        //     }).finally(() => setLoading(false));
        // }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={idImport ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialForm}
                    className="p-fluid">
                    <LabelField label="Nhà cung cấp" name="ProviderName"
                        rules={[
                            { required: true, message: 'Nhà cung cấp không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (<InputText {...control} id="ProviderName"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <Button loading={loading} type='submit' label={idImport ? 'Cập nhật' : 'Tạo mới'} className="w-6" style={{ float: 'right' }} />
                </Form>
            </Dialog>
        </>
    )
}