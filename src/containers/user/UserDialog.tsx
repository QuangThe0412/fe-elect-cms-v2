import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { User } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { UserService } from '@/services/user.service';
import { Checkbox } from 'primereact/checkbox';
import { RoleEnum } from '@/constants';
import styles from './user.module.css'

type PropType = {
    idUser: number,
    visible: boolean,
    onClose: () => void,
    onUserChange: () => void,
};

type typeForm = {
    idUser: number;
    username: string;
    password: string;
    phone: string;
    ngaySinh: Date | null;
    admin: boolean;
    saler: boolean;
    inventory: boolean;
    cashier: boolean;
    guest: boolean;
}

const initialForm: typeForm = {
    idUser: 0,
    username: '',
    phone: '',
    password: '',
    ngaySinh: null,
    admin: false,
    saler: false,
    inventory: false,
    cashier: false,
    guest: true,
};


export default function UserDialog({ visible, onClose, idUser, onUserChange }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [admin, setAdmin] = useState<boolean>(false);
    const [saler, setSaler] = useState<boolean>(false);
    const [inventory, setInventory] = useState<boolean>(false);
    const [cashier, setCashier] = useState<boolean>(false);
    const [guest, setGuest] = useState<boolean>(true);

    useEffect(() => {
        if (visible && idUser > 0) {
            getProfile();
        }
    }, [visible]);

    const getProfile = () => {
        setLoading(true);
        HandleApi(UserService.getUser(idUser), null).then((res) => {
            if (res && res.status === 200) {
                const { phone, ngaySinh, username, admin, saler, inventory, cashier, guest } = res.data as User;
                setAdmin(!!admin);
                setSaler(!!saler);
                setInventory(!!inventory);
                setCashier(!!cashier);
                setGuest(!!guest);
                form.setFieldsValue({
                    phone,
                    username,
                    admin,
                    saler,
                    inventory,
                    cashier,
                    guest,
                    ngaySinh: ngaySinh ? new Date(ngaySinh) : null,
                });
            }
        }).finally(() => { setLoading(false); });
    };

    const onFinish = (values: typeForm) => {
        setLoading(true);
        let user: User = {
            id: idUser,
            username: values.username,
            password: values.password,
            phone: values.phone,
            ngaySinh: values.ngaySinh,
            admin: admin,
            saler: saler,
            inventory: inventory,
            cashier: cashier,
            guest: guest,
        };

        if (idUser) { // update
            HandleApi(UserService.updateUser(idUser, user), toast).then((res) => {
                if (res && res.status === 200) {
                    onUserChange();
                    HandClose();
                }
            }).finally(() => { setLoading(false); });
        } else {
            HandleApi(UserService.createUser(user), toast).then((res) => {
                if (res && res.status === 201) {
                    onUserChange();
                    HandClose();
                }
            }).finally(() => { setLoading(false); });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const HandClose = () => {
        form.resetFields();
        setAdmin(false);
        setSaler(false);
        setInventory(false);
        setCashier(false);
        setGuest(true);
        onClose();
    };

    const onClickAdmin = (e: any) => {
        console.log(e);
        setAdmin(e.checked);
    };

    const onClickSaler = (e: any) => {
        setSaler(e.checked);
    };

    const onClickInventory = (e: any) => {
        setInventory(e.checked);
    };

    const onClickCashier = (e: any) => {
        setCashier(e.checked);
    };

    const onClickGuest = (e: any) => {
        setGuest(e.checked);
    };

    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={idUser ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialForm}
                    className="p-fluid">
                    <LabelField label="Tài khoản" name="username"
                        rules={[
                            { required: true, message: 'Tài khoản không được bỏ trống.' },
                            { pattern: /^[a-zA-Z0-9]+$/, message: 'Tài khoản không được chứa ký tự đặc biệt.' }
                        ]}>
                        {(control, meta) => (<InputText {...control} id="username" disabled={!!idUser}
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Mật khẩu" name="password"
                        rules={
                            idUser ? [] :
                                [
                                    { required: true, message: 'Mật khẩu không được bỏ trống.' },
                                    {
                                        pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                                        message: 'Mật khẩu phải chứa ít nhất một ký tự thường, một ký tự hoa, một số và có ít nhất 8 ký tự.'
                                    }
                                ]}>
                        {(control, meta) => (<Password toggleMask {...control} id="password"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Số điện thoại" name="phone"
                        rules={[
                            { required: true, message: 'Số điện thoại không được bỏ trống.' },
                            { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: 'Số điện thoại không đúng' }
                        ]}>
                        {(control, meta) => (<InputText {...control} id="phone"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>

                    <LabelField label="Ngày sinh" name="ngaySinh">
                        <Calendar id="ngaySinh" dateFormat="dd/mm/yy" mask="99/99/9999" showIcon
                            showButtonBar={true}
                            maxDate={new Date()}
                            minDate={new Date('01/01/1970')}
                            style={{ width: '100%' }} />
                    </LabelField>

                    <LabelField label="Roles" name="role">
                        <div className={styles.groupCheckBox}>
                            <div className={styles.wraperItemCheckbox}>
                                <Checkbox inputId="admin" value={RoleEnum.ADMIN} checked={admin} onChange={onClickAdmin} />
                                <label htmlFor="admin" className="ml-2">Admin</label>
                            </div>
                            <div className={styles.wraperItemCheckbox}>
                                <Checkbox inputId="saler" value={RoleEnum.SALER} checked={saler} onChange={onClickSaler} />
                                <label htmlFor="saler" className="ml-2">Saler</label>
                            </div>
                            <div className={styles.wraperItemCheckbox}>
                                <Checkbox inputId="inventory" value={RoleEnum.INVENTORY} checked={inventory} onChange={onClickInventory} />
                                <label htmlFor="inventory" className="ml-2">Inventory</label>
                            </div>
                            <div className={styles.wraperItemCheckbox}>
                                <Checkbox inputId="cashier" value={RoleEnum.CASHIER} checked={cashier} onChange={onClickCashier} />
                                <label htmlFor="cashier" className="ml-2">Cashier</label>
                            </div>
                            <div className={styles.wraperItemCheckbox}>
                                <Checkbox inputId="guest" value={RoleEnum.GUEST} checked={guest} disabled onChange={onClickGuest} />
                                <label htmlFor="guest" className="ml-2">Guest</label>
                            </div>
                        </div>
                    </LabelField>
                    <Button loading={loading} type='submit' label={idUser ? 'Cập nhật' : 'Tạo mới'} className="w-6" style={{ float: 'right' }} />
                </Form>
            </Dialog>
        </>
    )
}
