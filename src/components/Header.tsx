import '@/styles/header.css';
import { Avatar } from 'primereact/avatar';

const Header = () => {
    return (
        <div className='wrapper-header'>
            <h1>Logo</h1>
            <h1>Store</h1>
            <Avatar icon="pi pi-user" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }}/>
        </div>
    );
};

export default Header;