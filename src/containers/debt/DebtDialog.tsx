import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { DebtService } from '@/services/debt.service';
import { Debt, Customer, Order } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { CustomerService } from '@/services/customer.service';

type PropType = {
    idDebt: number,
    visible: boolean,
    customers: Customer[],
    orders: Order[],
    onClose: () => void,
    onDebtChange: () => void,
};

type typeForm = {
    idDebt: number;
    idCustomer: number;
    idBill: number;
    debtStart: number;
}

const initialForm: typeForm = {
    idDebt: 0,
    idCustomer: 0,
    idBill: 0,
    debtStart: 0,
};

export default
    function DebtDialog({ visible, onClose, idDebt, onDebtChange, customers,orders }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>();
    const [selectedBill, setSelectedBill] = useState<Order>();

    useEffect(() => {
        const fetchData = async () => {
            if (visible && idDebt > 0) {
                let resDebtDetail = await getDebt();
                if (resDebtDetail) {
                    const customer = customers.find((x) => x.IDKhachHang === resDebtDetail.IDKhachHang);
                    setSelectedCustomer(customer);

                    let order = orders.find((x) => x.IDHoaDon === resDebtDetail.IDHoaDon);

                    form.setFieldsValue({
                        idCustomer: customer?.IDKhachHang,
                        idBill: order?.IDHoaDon,
                        debtStart: resDebtDetail.CongNoDau,
                    });
                }
            }
        };

        fetchData();
    }, [visible]);

    const HandClose = () => {
        onClose();
        form.resetFields();
        setSelectedCustomer(undefined);
        setSelectedBill(undefined);
    };

    const getCustomers = async () => {
        setLoading(true);
        let res = await HandleApi(CustomerService.getCustomers(), null);
        let result = res.data as Customer[];
        if (res && res.status === 200) {
            result = res.data as Customer[];
        }
        setLoading(false);
        return result;
    };


    const getDebt = async () => {
        setLoading(true);
        let res = await HandleApi(DebtService.getDebt(idDebt), null);
        let result = res.data as Debt;
        if (res && res.status === 200) {
            result = res.data as Debt;
        }
        setLoading(false);
        return result;
    };

    const onFinish = (values: typeForm) => {
        let idCustomer = selectedCustomer?.IDKhachHang ?? 0;
        let idBill = selectedBill?.IDHoaDon ?? 0;
        if (idCustomer <= 0 || idBill <= 0 || values.debtStart === 0) {
            toast.current?.show({ severity: 'error', summary: 'Thất bại', detail: 'Vui lòng nhập đầy đủ thông tin' });
            return;
        }

        const debt: Debt = {
            Id: values.idDebt,
            IDKhachHang: idCustomer,
            IDHoaDon: idBill,
            CongNoDau: values.debtStart,
        };

        setLoading(true);
        if (idDebt) {
            HandleApi(DebtService.updateDebt(idDebt, debt), toast).then((res) => {
                if (res && res.status === 200) {
                    onDebtChange();
                    HandClose();
                }
            }).finally(() => setLoading(false));
        } else {
            HandleApi(DebtService.createDebt(debt), toast).then((res) => {
                if (res && res.status === 201) {
                    onDebtChange();
                    HandClose();
                }
            }).finally(() => setLoading(false));
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={idDebt ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ minWidth: '35vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed} initialValues={initialForm} className="p-fluid">
                    <LabelField name='idCustomer' label='Khách hàng'
                        rules={[
                            { required: true, message: 'Vui lòng chọn khách hàng.' },
                        ]}>
                        {(control, meta) => (
                            <Dropdown value={selectedCustomer} filter
                                onChange={(e: DropdownChangeEvent) => {
                                    setSelectedCustomer(e.value);
                                }}
                                options={customers}
                                optionLabel='TenKhachHang'
                                placeholder='Chọn khách hàng'
                                id='idCustomer'
                                className={`w-full ${classNames({ 'invalid': meta.errors.length })}`} />
                        )}
                    </LabelField>
                    <LabelField name='idBill' label='Hóa đơn'
                        rules={[
                            { required: true, message: 'Vui lòng chọn số hóa đơn .' },
                        ]}>
                        {(control, meta) => (
                            <Dropdown value={selectedBill} filter
                                onChange={(e: DropdownChangeEvent) => {
                                    setSelectedBill(e.value);
                                }}
                                options={orders}
                                optionLabel='IDHoaDon'
                                placeholder='Chọn hóa đơn'
                                id='idBill'
                                className={`w-full ${classNames({ 'invalid': meta.errors.length })}`} />
                        )}
                    </LabelField>
                    <LabelField name='debtStart' label='Nợ ban đầu'
                        rules={[
                            { required: true, message: 'Nợ không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (
                            <InputText {...control} id='debtStart'
                                className={classNames({ 'invalid': meta.errors.length })} />
                        )}
                    </LabelField>

                    <Button loading={loading} type='submit' label={idDebt ? 'Cập nhật' : 'Tạo mới'}
                        className="w-6" style={{ float: 'right' }} />
                </Form>
            </Dialog>
        </>
    )
}