import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { paths } from '@/constants/api';
import { Password } from 'primereact/password';
import '@/styles/Auth.css';
import Form from 'rc-field-form';
import { LabelField } from '@/components';
import { AuthService } from '@/services/auth.service';
import { HandleApi } from '@/services/handleApi';
import { Toast } from 'primereact/toast';
import { setCookie } from '@/utils/cookie';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/constants';

type typeForm = {
    username: string;
    password: string;
}

const initialForm: typeForm = {
    username: 'quangthe',
    password: 'Aa123123',
};

export default function Login() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useAuth();
    const textTitle = 'Đăng nhập';
    const [form] = Form.useForm();

    useEffect(() => {
        //if had login then redirect to dashboard
        if (isAuthenticated) {
            navigate(paths.dashboard)
        }
    }, [isAuthenticated]);

    const onFinish = (values: typeForm) => {
        let { username, password } = values;
        HandleApi(AuthService.login(username, password), toast).then((res) => {
            console.log(res);
            if (res && res.status === 200) {
                const { accessToken, refreshToken } = res.data;
                setCookie(ACCESS_COOKIE_NAME, accessToken);
                setCookie(REFRESH_COOKIE_NAME, refreshToken);

                form.resetFields();
                // navigate(paths.dashboard);
                window.location.href = paths.dashboard;
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
                        <LabelField label="Tài khoản" name="username" rules={[{ required: true, message: 'Tài khoản không được bỏ trống.' }]}>
                            <InputText id="username" autoFocus
                                className={classNames({ 'p-invalid': form.isFieldTouched('username') && form.getFieldError('username') })} />
                        </LabelField>

                        <LabelField label="Mật khẩu" name="password"
                            rules={[
                                { required: true, message: 'Mật khẩu không được bỏ trống.' }
                            ]}>
                            <Password id="password" toggleMask feedback={false}
                                className={classNames({ 'p-invalid': form.isFieldTouched('password') && form.getFieldError('password') })} />
                        </LabelField>

                        <Button type='submit' label={textTitle} icon="pi pi-user" className="w-8" />
                    </Form>
                </div>
            </div>
        </div>
    )
}