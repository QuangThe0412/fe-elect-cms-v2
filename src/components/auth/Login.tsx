import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { paths } from '@/constants/api';
import { Password } from 'primereact/password';
import '@/styles/Auth.css';

type typeFormLogin = {
    email: string;
    password: string;
}

const initialFormLogin: typeFormLogin = {
    email: '',
    password: '',
};

export default function Login() {
    const navigate = useNavigate();
    const { isAuthenticated, userRole } = useAuth();
    const textTitle = 'Đăng nhập';
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState(initialFormLogin);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        //if had login then redirect to dashboard
        if (isAuthenticated) {
            navigate(paths.dashboard)
        }
    }, [isAuthenticated]);

    useEffect(() => {
        HandleSubmit();
    }, [formData]);

    const HandleSubmit = () => {
        console.log('formData', formData);
    }

    const formik = useFormik({
        initialValues: initialFormLogin,
        validate: (data: typeFormLogin) => {
            let errors: Partial<typeFormLogin> = {};

            if (!data.email) {
                errors.email = 'Tài khoản không được bỏ trống.';
            }

            if (!data.password) {
                errors.password = 'Mật khẩu không được bỏ trống.';
            }
            return errors;
        },
        onSubmit: (data) => {
            // Handle login logic here
            setFormData(data);
            setShowMessage(true);
        },
    });

    const isFormFieldValid = (name: keyof typeFormLogin) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name: keyof typeFormLogin) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <h1 className="text-center">{textTitle}</h1>
                    <form onSubmit={formik.handleSubmit} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-user" />
                                <InputText id="email" name="email" value={formik.values.email} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                                <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Tài khoản
                                    <span style={{ color: 'red' }}> *</span>
                                </label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-lock" />
                                <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask feedback={false}
                                    className={classNames({ 'p-invalid': isFormFieldValid('password') })} />
                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Mật khẩu
                                    <span style={{ color: 'red' }}> *</span>
                                </label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <div className="field text-check-box-save-info">
                            <Checkbox id="rememberme" onChange={(e: any) => setChecked(e.checked)} checked={checked} className="mr-2" />
                            <label htmlFor="rememberme">Lưu thông tin</label>
                        </div>
                        <Button type='submit' label={textTitle} icon="pi pi-user" className="w-full" />
                    </form>
                </div>
            </div>
        </div>
    )
}