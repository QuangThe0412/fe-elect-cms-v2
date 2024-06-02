import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { CustomerService } from '@/services/customer.service';
import { Customer } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

type PropType = {
    idCustomer: number,
    visible: boolean,
    onClose: () => void,
    onCustomerChange: () => void,
};

type typeForm = {
    idCustomer: number;
    nameCustomer: string;
    idTypeCustomer: number;
    phone: string;
    username: string;
    password: string;
}

const initialForm: typeForm = {
    idCustomer: 0,
    nameCustomer: '',
    idTypeCustomer: 0,
    phone: '',
    username: '',
    password: '',
};


export default function CustomerDialog({ visible, onClose, idCustomer, onCustomerChange }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (visible && idCustomer > 0) {
            getCustomer();
        }
    }, [visible]);

    const HandClose = () => {
        onClose();
        form.resetFields();
    };

    const getCustomer = () => {
        HandleApi(CustomerService.getCustomer(idCustomer), null).then((res) => {
            if (res && res.status === 200) {
                const customer = res.data as Customer;
                form.setFieldsValue({
                    idCustomer: customer.IDKhachHang,
                    nameCustomer: customer.TenKhachHang,
                    idTypeCustomer: customer.IDLoaiKH,
                    phone: customer.DienThoai,
                    username: customer.username,
                    password: customer.password,
                });
            }
        });
    };

    const onFinish = (values: typeForm) => {
        setLoading(true);
        let customer: Customer = {
            IDKhachHang: idCustomer,
            IDLoaiKH: values.idTypeCustomer,
            TenKhachHang: values.nameCustomer,
            DienThoai: values.phone,
            username: values.username,
            password: values.password,
        };

        if (idCustomer) { // update
            HandleApi(CustomerService.updateCustomer(idCustomer, customer), toast).then((res) => {
                if (res.status === 200) {
                    onCustomerChange();
                    HandClose();
                }
                setLoading(false);
            });
        } else { // create
            HandleApi(CustomerService.createCustomer(customer), toast).then((res) => {
                if (res.status === 201) {
                    console.log(res.data);
                    onCustomerChange();
                    HandClose();
                }
                setLoading(false);
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={idCustomer ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialForm}
                    className="p-fluid">
                    <LabelField label="Tên khách hàng" name="nameCustomer"
                        rules={[
                            { required: true, message: 'Tên khách hàng không được bỏ trống.' },
                            { max: 100, message: 'Tên khách hàng không được quá 100 ký tự.' },
                            { min: 5, message: 'Tên khách hàng không được ít hơn 5 ký tự.' }
                        ]}>
                        {(control, meta) => (<InputText {...control} id="nameCustomer"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Số điện thoại" name="phone"
                        rules={[
                            { required: true, message: 'Số điện thoại không được bỏ trống.' },
                            { pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ.' }
                        ]}>
                        {(control, meta) => (<InputText {...control} id="phone"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Tên đăng nhập" name="username"
                        rules={[
                            { required: true, message: 'Tên đăng nhập không được bỏ trống.' },
                            {
                                pattern: /^[a-zA-Z0-9]{6,}$/,
                                message: 'Tài khoản phải có ít nhất 6 ký tự và không được chứa ký tự đặc biệt.'
                            }
                        ]}>
                        {(control, meta) => (<InputText {...control} id="username" disabled={!!idCustomer}
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Mật khẩu" name="password"
                        rules={[
                            { required: !idCustomer, message: 'Mật khẩu không được bỏ trống.' },
                            { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, message: 'Mật khẩu phải chứa ít nhất một ký tự thường, một ký tự hoa, một số và có ít nhất 8 ký tự.' }
                        ]}>
                        {(control, meta) => (<InputText {...control} id="password"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    {/* <LabelField label="Nhóm món" name="idGroupCustomer"
                        rules={[
                            { required: true, message: 'Nhóm món không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (
                            <Dropdown value={selectedCustomerGroup}
                                onChange={(e: DropdownChangeEvent) => {
                                    setSelectedCustomerGroup(e.value);
                                }}
                                options={CustomerGroups} optionLabel={'TenNhom'}
                                placeholder="Chọn nhóm món" className="w-full" />
                            )}
                    </LabelField> */}

                    <Button loading={loading} type='submit' label={idCustomer ? 'Cập nhật' : 'Tạo mới'} className="w-6" style={{ float: 'right' }} />
                </Form>
            </Dialog>
        </>
    )
}