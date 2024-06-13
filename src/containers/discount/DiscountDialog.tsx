import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { DiscountService } from '@/services/discount.service';
import { TypeCustomerService } from '@/services/typecustomer.service';
import { Discount, TypeCustomer } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

type PropType = {
    idDiscount: number,
    visible: boolean,
    onClose: () => void,
    onDiscountChange: () => void,
};

type typeForm = {
    idDiscount: number;
    idTypeCustomer: number;
    nameDiscount: string;
    fromDate: Date;
    toDate: Date;
}

const initialForm: typeForm = {
    idDiscount: 0,
    idTypeCustomer: 0,
    nameDiscount: '',
    fromDate: new Date(),
    toDate: new Date(),
};


export default
    function DiscountDialog({ visible, onClose, idDiscount, onDiscountChange }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [typeCustomers, setTypeCustomers] = useState<TypeCustomer[]>([]);
    const [selectedTypeCustomers, setSelectedTypeCustomers] = useState<TypeCustomer>();
    const [fromDate, setFromDate] = useState<Date | null>(new Date());
    const [toDate, setToDate] = useState<Date | null>(null);

    useEffect(() => {
        getTypeCustomers();
        if (visible && idDiscount > 0) {
            getDiscount();
        }
    }, [visible]);

    const HandClose = () => {
        onClose();
        form.resetFields();
        setSelectedTypeCustomers(undefined);
        setFromDate(new Date());
        setToDate(null);
    };

    const getDiscount = () => {
        setLoading(true);
        HandleApi(DiscountService.getDiscount(idDiscount), null).then((res) => {
            if (res && res.status === 200) {
                const { IdLoaiKH, TenKhuyenMai, TuNgay, DenNgay } = res.data as Discount;
                const typeCustomer = typeCustomers.find((x) => x.IDLoaiKH === IdLoaiKH);
                setSelectedTypeCustomers(typeCustomer);
                setFromDate(TuNgay ? new Date(TuNgay) : null);
                setToDate(DenNgay ? new Date(DenNgay) : null);
                form.setFieldsValue({
                    idDiscount: idDiscount,
                    idTypeCustomer: IdLoaiKH,
                    nameDiscount: TenKhuyenMai,
                    fromDate: new Date(TuNgay),
                    toDate: new Date(DenNgay),
                });
            }
        }).finally(() => { setLoading(false); });
    };

    const getTypeCustomers = () => {
        setLoading(true);
        HandleApi(TypeCustomerService.getTypeCustomers(), null).then((result) => {
            if (result.status === 200) {
                let data = result.data;
                setTypeCustomers(data);
            }
        }).finally(() => { setLoading(false); });
    }

    const onFinish = (values: typeForm) => {
        setLoading(true);
        let discount: Discount = {
            IDKhuyenMai: values.idDiscount,
            TenKhuyenMai: values.nameDiscount,
            IdLoaiKH: selectedTypeCustomers?.IDLoaiKH || 0,
            TuNgay: values.fromDate,
            DenNgay: values.toDate,
            createDate: null,
            modifyDate: null,
            createBy: null,
            modifyBy: null,
            Deleted: false,
        };

        if (idDiscount) { // update            
            HandleApi(DiscountService.updateDiscount(idDiscount, discount), toast).then((res) => {
                if (res.status === 200) {
                    onDiscountChange();
                    HandClose();
                }
            }).finally(() => { setLoading(false); });
        } else { // create
            HandleApi(DiscountService.createDiscount(discount), toast).then((res) => {
                if (res.status === 201) {
                    onDiscountChange();
                    HandClose();
                }
            }).finally(() => { setLoading(false); });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={idDiscount ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ width: '40vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialForm}
                    className="p-fluid">
                    <LabelField label="Tên khuyến mãi" name="nameDiscount"
                        rules={[
                            { required: true, message: 'Tên loại không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (<InputText {...control} id="nameDiscount"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Áp dụng cho loại khách" name="idTypeCustomer">
                        {(control, meta) => (
                            <Dropdown value={selectedTypeCustomers}
                                onChange={(e: DropdownChangeEvent) => {
                                    setSelectedTypeCustomers(e.value);
                                }}
                                options={typeCustomers} optionLabel={'TenLoaiKH'}
                                placeholder="Chọn loại khách hàng" className="w-full" />
                        )}
                    </LabelField>

                    {/* <LabelField label="Từ ngày" name="fromDate">
                        <Calendar id="fromDate" dateFormat="dd/mm/yy" mask="99/99/9999" showIcon
                            showButtonBar
                            value={idDiscount && fromDate || ''}
                            minDate={new Date()}
                            maxDate={toDate || new Date()}
                            onSelect={(e) => { setFromDate(e.value as Date) }}
                            style={{ width: '100%' }} />
                    </LabelField>

                    <LabelField label="Đến ngày" name="toDate">
                        <Calendar id="toDate" dateFormat="dd/mm/yy" mask="99/99/9999" showIcon
                            showButtonBar
                            value={idDiscount && toDate || ''}
                            minDate={fromDate || new Date('01/01/1970')}
                            onSelect={(e) => { setToDate(e.value as Date) }}
                            style={{ width: '100%' }} />
                    </LabelField> */}

                    <Button loading={loading} type='submit' label={idDiscount ? 'Cập nhật' : 'Tạo mới'} className="w-6" style={{ float: 'right' }} />
                </Form>
            </Dialog>
        </>
    )
}