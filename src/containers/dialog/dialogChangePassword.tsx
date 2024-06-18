import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { AuthService } from '@/services/auth.service';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';

type PropType = {
    idUser: string,
    visible: boolean,
    onClose: () => void
};

export type typeFormChangePassword = {
    idUser: string;
    oldPassword: string;
    newPassword: string;
    reNewPassword: string;
}

const initialForm: typeFormChangePassword = {
    idUser: '',
    oldPassword: '',
    newPassword: '',
    reNewPassword: ''
};


export default function DialogChangePassword({ visible, onClose, idUser }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const HandleHide = () => {
        onClose();
        form.resetFields();
    };

    const onFinish = (values: typeFormChangePassword) => {
        setLoading(true);
        values.idUser = idUser;
        HandleApi(AuthService.changePassword(values), toast).then((res) => {
            if (res && res.status === 200) {
                HandleHide();
            } else {
                const { code, mess } = res;
                if (code === 'incorrect_old_password')
                    form.setFields([
                        {
                            name: 'oldPassword',
                            errors: [mess]
                        }
                    ]);
            }
        }).finally(() => { setLoading(false); });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header="Đổi mật khẩu" visible={visible} style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; HandleHide(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialForm}
                    className="p-fluid">
                    <LabelField label="Mật khẩu hiện tại" name="oldPassword"
                        rules={[
                            { required: true, message: 'Mật khẩu hiện tại không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (<Password toggleMask {...control} id="oldPassword"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Mật khẩu mới" name="newPassword"
                        rules={[
                            { required: true, message: 'Mật khẩu mới không được bỏ trống.' },
                            {
                                pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                                message: 'Mật khẩu phải chứa ít nhất một ký tự thường, một ký tự hoa, một số và có ít nhất 8 ký tự.'
                            }
                        ]}>
                        {(control, meta) => (<Password toggleMask {...control} id="newPassword"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Nhập lại mật khẩu mới" name="reNewPassword"
                        rules={[
                            { required: true, message: 'Nhập lại mật khẩu mới không được bỏ trống.' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu nhập lại không khớp.'));
                                },
                            }),
                        ]}>
                        {(control, meta) => (<Password toggleMask {...control} id="reNewPassword"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>
                    <Button loading={loading} type='submit' label='Cập nhật' className="w-6" style={{ float: 'right' }} />
                </Form>
            </Dialog>
        </>
    )
}
