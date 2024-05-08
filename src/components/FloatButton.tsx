
import React, { useState, useRef } from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';
import { useNavigate } from 'react-router-dom';
import useThemeStore from '@/store/theme.store';

export default function FloatButton() {
    const randomTheme = useThemeStore((state: any) => state.randomTheme);
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
            label: 'Random Theme',
            icon: 'pi pi-sync',
            command: () => {
                randomTheme()
            }
        }
    ];

    return (
        <div className="card float-button">
            <div style={{ position: 'relative', height: '350px' }}>
                <Toast ref={toast} />
                <SpeedDial model={items} direction="up" transitionDelay={80} showIcon="pi pi-bars" hideIcon="pi pi-times" buttonClassName="p-button-outlined" />
            </div>
        </div>
    )
}
