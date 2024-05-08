import '@/styles/header.css';
import { Avatar } from 'primereact/avatar';

const Header = () => {
    return (
        <div className='wrapper-header'>
            <div>
                <h1>Logo</h1>
            </div>
            <div>
                <h1>Store</h1>
            </div>
            <div>
                <Avatar icon="pi pi-user" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} shape="circle" />
            </div>
        </div>
    );
};

export default Header;