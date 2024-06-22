
import { useRef } from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';
import useThemeStore from '@/store/theme.store';

export default function FloatButton() {
    const { changeTheme, isLight } = useThemeStore((state: any) => (
        { changeTheme: state.changeTheme, isLight: state.isLight }
    ));
    const toast = useRef<Toast>(null);
    const items: MenuItem[] = [
        {
            label: 'Change Theme',
            icon: 'pi pi-sync',
            command: () => {
                changeTheme(isLight);
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
