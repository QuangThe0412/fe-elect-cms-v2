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

type typeFormRegister = {
    name: string;
    phone: string;
    password: string;
    date: Date | null;
}

const initialFormRegister: typeFormRegister = {
    name: '',
    phone: '',
    password: '',
    date: null,
};

export const Register = () => {
    const textTile = 'Đăng ký';
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState(initialFormRegister);

    useEffect(() => {
        HandleSubmit();
    }, [formData]);

    const HandleSubmit = () => {
        console.log('formData', formData);
    }

    const passwordHeader = 'Yêu cầu mật khẩu';
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Bắt buộc</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>Có ký tự thường</li>
                <li>Có ký tự hoa</li>
                <li>Có số</li>
                <li>Có it nhất 8 ký tự</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <h1 className="text-center">{textTile}</h1>
                    <Form initialValues={initialFormRegister} onFinish={(data) => {
                        setFormData(data);
                        setShowMessage(true);
                    }}>
                        {/* <Field name="name" rules={[{ required: true, message: 'Họ tên không được bỏ trống.' }]}>
                            <InputText id="name" autoFocus className={classNames({ 'p-invalid': form.isFieldTouched('name') && form.getFieldError('name') })} />
                        </Field>
                        <Field name="phone" rules={[{ required: true, message: 'Số điện thoại không được bỏ trống.' }, { validator: (_, value) => validatePhone(value) ? Promise.resolve() : Promise.reject(new Error('Số điện thoại không hợp lệ.')) }]}>
                            <InputText id="phone" className={classNames({ 'p-invalid': form.isFieldTouched('phone') && form.getFieldError('phone') })} />
                        </Field> */}
                        {/* <Field name="password" rules={[{ required: true, message: 'Mật khẩu không được bỏ trống.' }, { validator: (_, value) => validatePassword(value) ? Promise.resolve() : Promise.reject(new Error('Mật khẩu không hợp lệ.')) }]}>
                            <Password id="password" toggleMask feedback={false} className={classNames({ 'p-invalid': form.isFieldTouched('password') && form.getFieldError('password') })} header={passwordHeader} footer={passwordFooter} />
                        </Field> */}
                        <Field name="date">
                            <Calendar id="date" dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                        </Field>
                        <Button type="submit" label={textTile} className="mt-2" />
                    </Form>
                </div>
            </div>
        </div>
    );
}