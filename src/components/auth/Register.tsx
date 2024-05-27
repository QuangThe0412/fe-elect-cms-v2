
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
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
    const formik = useFormik({
        initialValues: initialFormRegister,
        validate: (data: typeFormRegister) => {
            let errors: Partial<typeFormRegister> = {};

            if (!data.name) {
                errors.name = 'Họ tên không được bỏ trống.';
            }

            if (!data.phone) {
                errors.phone = 'Số điện thoại không được bỏ trống.';
            }
            else if (!validatePhone(data.phone)){
                errors.phone = 'Số điện thoại không hợp lệ.';
            }

            if (!data.password) {
                errors.password = 'Mật khẩu không được bỏ trống.';
            } else if (!validatePassword(data.password)) {
                errors.password = 'Mật khẩu không hợp lệ.';
            }

            return errors;
        },
        onSubmit: (data) => {
            setFormData(data);
            setShowMessage(true);
            // formik.resetForm();
        }
    });

    const isFormFieldValid = (name: keyof typeFormRegister) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name: keyof typeFormRegister) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

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
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-user" />
                                <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                                <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>Họ tên
                                    <span style={{ color: 'red' }}> *</span>
                                </label>
                            </span>
                            {getFormErrorMessage('name')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-phone" />
                                <InputText id="phone" name="phone" value={formik.values.phone} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('phone') })} />
                                <label htmlFor="phone" className={classNames({ 'p-error': isFormFieldValid('phone') })}>Số điện thoại
                                    <span style={{ color: 'red' }}> *</span>
                                </label>
                            </span>
                            {getFormErrorMessage('phone')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask
                                    className={classNames({ 'p-invalid': isFormFieldValid('password') })} header={passwordHeader} footer={passwordFooter} />
                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Mật khẩu
                                    <span style={{ color: 'red' }}> *</span>
                                </label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Calendar id="date" name="date" value={formik.values.date} onChange={formik.handleChange} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                <label htmlFor="date">Ngày sinh</label>
                            </span>
                        </div>
                        <Button type="submit" label={textTile} className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
}
