import React, { useEffect, useState } from 'react';
import Form, { Field } from 'rc-field-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import '@/styles/Auth.css';
import { validatePassword, validatePhone } from '@/utils/common';
import { LabelField } from '@/components';

type typeForm = {
    name: string;
    phone: string;
    password: string;
    date: Date | null;
}

const initialForm: typeForm = {
    name: '',
    phone: '',
    password: '',
    date: null,
};

export const Register = () => {
    const textTitle = 'Đăng ký';
    const [form] = Form.useForm();

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
                        <LabelField label="Họ tên" name="name" rules={[{ required: true, message: 'Họ tên không được bỏ trống.' }]}>
                            <InputText id="name" autoFocus
                                className={classNames({ 'p-invalid': form.isFieldTouched('name') && form.getFieldError('name') })} />
                        </LabelField>

                        <LabelField label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Số điện thoại không được bỏ trống.' }]}>
                            <InputText id="phone"
                                className={classNames({ 'p-invalid': form.isFieldTouched('phone') && form.getFieldError('phone') })} />
                        </LabelField>

                        <LabelField label="Mật khẩu" name="password" rules={[{ required: true, message: 'Mật khẩu không được bỏ trống.' }]}>
                            <Password id="password" toggleMask feedback={false}
                                className={classNames({ 'p-invalid': form.isFieldTouched('password') && form.getFieldError('password') })} />
                        </LabelField>

                        <LabelField label="Ngày sinh" name="date">
                            <Calendar id="date" dateFormat="dd/mm/yy" mask="99/99/9999" showIcon maxDate={new Date()} style={{width:'100%'}}/>
                        </LabelField>
                        
                        <Button type='submit' label={textTitle} icon="pi pi-user" className="w-8" />
                    </Form>
                </div>
            </div>
        </div>
    );
}