
import React, { useState, useRef } from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '@/store/theme.store';

export default function FloatButton() {
    const { changeTheme, isDark } = useThemeStore((state: any) => (
        { changeTheme: state.changeTheme, isDark: state.isDark }
    ));
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const items: MenuItem[] = [
        {
            label: 'Upload',
            icon: 'pi pi-upload',
            command: () => {
                navigate('/fileupload');
            }
        },
        {
            label: 'React Website',
            icon: 'pi pi-external-link',
            command: () => {
                window.location.href = 'https://react.dev/';
            }
        },
        {
            label: 'Change Theme',
            icon: 'pi pi-sync',
            command: () => {
                changeTheme(isDark);
            }
        }
    ];

    return (
        <div className="float-button">
                <Toast ref={toast} />
                <SpeedDial model={items} direction="up" transitionDelay={80} showIcon="pi pi-bars" hideIcon="pi pi-times" buttonClassName="p-button-outlined" />
        </div>
    )
}
