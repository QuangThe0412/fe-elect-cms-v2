
import FloatButton from '@/containers/FloatButton';
import Header from '@/containers/layout/admin/Header';

const AdminLayout = ({ children }: any) => {
    return (
        <div className="App">
            <FloatButton />
            <div className='header-app'>
                <Header />
            </div>
            <div className='body-app'>
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;