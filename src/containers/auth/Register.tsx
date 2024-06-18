import Form from 'rc-field-form';
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import '@/styles/Auth.css';
import { LabelField } from '@/components';
import { AuthService } from '@/services/auth.service';
import { User } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { Toast } from 'primereact/toast';
import { setCookie } from '@/utils/cookie';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/constants';
import { paths } from '@/constants/api';

type typeForm = {
    username: string;
    phone: string;
    password: string;
    ngaySinh: Date | null;
}

const initialForm: typeForm = {
    username: '',
    phone: '',
    password: '',
    ngaySinh: null,
};

export const Register = () => {
    const textTitle = 'Đăng ký';
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);

    const onFinish = (values: typeForm) => {
        let newUser: User = {
            username: values.username,
            phone: values.phone,
            password: values.password,
            ngaySinh: values.ngaySinh,
        };
        HandleApi(AuthService.register(newUser), toast).then((res) => {
            if(res && res.status === 201) {
                const {accessToken, refreshToken} = res.data;
                setCookie(ACCESS_COOKIE_NAME, accessToken);
                setCookie(REFRESH_COOKIE_NAME, refreshToken);

                form.resetFields();
                window.location.href = paths.user;
            }
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="flex justify-content-center">
                <div className="card">
                    <h1 className="text-center">{textTitle}</h1>
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
                                className={classNames({ 'p-invalid': form.isFieldTouched('phone') && form.getFieldError('phone') })} />
                        </LabelField>

                        <LabelField label="Tài khoản" name="username"
                            rules={[
                                { required: true, message: 'Tài khoản không được bỏ trống.' },
                                {
                                    pattern: /^[a-zA-Z0-9]{6,}$/,
                                    message: 'Tài khoản phải có ít nhất 6 ký tự và không được chứa ký tự đặc biệt.'
                                }]}>
                            <InputText id="username" autoFocus
                                className={classNames({ 'p-invalid': form.isFieldTouched('username') && form.getFieldError('username') })} />
                        </LabelField>

                        <LabelField label="Mật khẩu" name="password"
                            rules={[
                                { required: true, message: 'Mật khẩu không được bỏ trống.' },
                                { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, message: 'Mật khẩu phải chứa ít nhất một ký tự thường, một ký tự hoa, một số và có ít nhất 8 ký tự.' }
                            ]}>
                            <Password id="password" toggleMask feedback={false}
                                className={classNames({ 'p-invalid': form.isFieldTouched('password') && form.getFieldError('password') })} />
                        </LabelField>

                        <LabelField label="Ngày sinh" name="ngaySinh">
                            <Calendar id="ngaySinh" dateFormat="dd/mm/yy" mask="99/99/9999" showIcon
                                maxDate={new Date()}
                                minDate={new Date('01/01/1970')}
                                style={{ width: '100%' }} />
                        </LabelField>

                        <Button type='submit' label={textTitle} icon="pi pi-user" className="w-8" />
                    </Form>
                </div>
            </div>
        </div>
    );
}