import '@/styles/header.css';
import { Avatar } from 'primereact/avatar';
import DockMenu from '@/components/menu/Dock';

const Header = () => {
    return (
        <div className='wrapper-header'>
            <h1>Logo</h1>
            <DockMenu />
            <Avatar icon="pi pi-user" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }}/>
        </div>
    );
};

export default Header;