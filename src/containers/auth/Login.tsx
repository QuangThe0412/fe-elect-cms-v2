import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { paths } from '@/constants/api';
import { Password } from 'primereact/password';
import '@/styles/Auth.css';
import Form from 'rc-field-form';
import { Field } from 'rc-field-form';
import { LabelField } from '@/components';

type typeForm = {
    email: string;
    password: string;
}

const initialForm: typeForm = {
    email: '',
    password: '',
};

export default function Login() {
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

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <h1 className="text-center">{textTitle}</h1>
                    <Form form={form} onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        initialValues={initialForm}
                        className="p-fluid">
                        <LabelField label="Tài khoản" name="account" rules={[{ required: true, message: 'Tài khoản không được bỏ trống.' }]}>
                            <InputText id="account" autoFocus 
                                className={classNames({ 'p-invalid': form.isFieldTouched('account') && form.getFieldError('account') })} />
                        </LabelField>
                        
                        <LabelField label="Mật khẩu" name="password" rules={[{ required: true, message: 'Mật khẩu không được bỏ trống.' }]}>
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