import { useState, useRef } from 'react';
import '@/styles/header.css';
import DockMenu from '@/containers/menu/Dock';
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import useAuth from '@/hooks/useAuth';
import TimeDisplay from './TImeDisplay';
import { eraseCookie } from '@/utils/cookie';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/constants';
import { paths } from '@/constants/api';
import { Button } from 'primereact/button';
import DialogProfile from '@/containers/dialog/dialogProfile';
import DialogChangePassword from '@/containers/dialog/dialogChangePassword';

const Header = () => {
    const { profile } = useAuth();
    const menu = useRef<Menu>(null);
    const toast = useRef<Toast>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [visibleChangePassword, setVisibleChangePassword] = useState<boolean>(false);

    const items = [
        {
            label: 'Xin chào',
            items: [
                {
                    label: 'Cập nhật thông tin',
                    icon: 'pi pi-refresh',
                    command: () => {
                        setVisible(true);
                    }
                },
                {
                    label: 'Đổi mật khẩu',
                    icon: 'pi pi-lock',
                    command: () => {
                        setVisibleChangePassword(true);
                    }
                },
                {
                    label: 'Đăng xuất',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        Logout();
                    }
                }
            ]
        },
    ];

    const Logout = () => {
        eraseCookie(ACCESS_COOKIE_NAME);
        eraseCookie(REFRESH_COOKIE_NAME);
        window.location.href = paths.login;
    };

    const onClose = () => {
        setVisible(false);
    };

    const onCloseChangePassword = () => {
        setVisibleChangePassword(false);
    };

    return (
        <>
            <div className='wrapper-header'>
                <Toast ref={toast}></Toast>
                <TimeDisplay />
                <DockMenu />
                <Menu model={items} popup ref={menu} id="popup_avatar" />
                <Button label={profile.username} icon="pi pi-user" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }}
                    onClick={(event: any) => menu?.current?.toggle(event)} aria-controls="popup_avatar" aria-haspopup />
                <DialogProfile idUser={profile.userId} visible={visible} onClose={onClose} />
                <DialogChangePassword idUser={profile.userId} visible={visibleChangePassword} onClose={onCloseChangePassword} />
            </div>
        </>
    );
};

export default Header;