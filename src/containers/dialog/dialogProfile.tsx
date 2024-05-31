import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { AuthService } from '@/services/auth.service';
import { User } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { on } from 'events';

type PropType = {
    idUser: string,
    visible: boolean,
    onClose: () => void
};

type typeForm = {
    idUser: string;
    phone: string;
    ngaySinh: Date | null;
}

const initialForm: typeForm = {
    idUser: '',
    phone: '',
    ngaySinh: null,
};

export default function DialogProfile({ visible, onClose, idUser }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (visible) {
            getProfile();
        }
    }, [visible]);

    const getProfile = () => {
        HandleApi(AuthService.getProfile(idUser), null).then((res) => {
            if (res && res.status === 200) {
                const { phone, ngaySinh } = res.data as User;
                form.setFieldsValue({
                    phone,
                    ngaySinh: ngaySinh ? new Date(ngaySinh) : null,
                });
            }
        });
    };

    const onFinish = (values: typeForm) => {
        setLoading(true);
        let user: User = {
            id: parseInt(idUser),
            phone: values.phone,
            ngaySinh: values.ngaySinh,
        };

        HandleApi(AuthService.updateProfile(user), toast).then((res) => {
            if (res && res.status === 200) {
                onClose();
            }
            setLoading(false);
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header="Cập nhật thông tin" visible={visible} style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; onClose(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialForm}
                    className="p-fluid">
                    <LabelField label="Số điện thoại" name="phone"
                        rules={[
                            { required: true, message: 'Số điện thoại không được bỏ trống.' },
                            { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: 'Số điện thoại không đúng' }
                        ]}>
                        <InputText id="phone"
                             />
                    </LabelField>

                    <LabelField label="Ngày sinh" name="ngaySinh">
                        <Calendar id="ngaySinh" dateFormat="dd/mm/yy" mask="99/99/9999" showIcon
                            showButtonBar={true}
                            maxDate={new Date()}
                            minDate={new Date('01/01/1970')}
                            style={{ width: '100%' }} />
                    </LabelField>

                    <Button loading={loading} type='submit' label='Cập nhật' className="w-6" style={{float: 'right'}} />
                </Form>
            </Dialog>
        </>
    )
}
