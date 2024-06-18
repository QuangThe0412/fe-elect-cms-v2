import '@/styles/404.css';

const NotFound = () => {
    return (
        <div className="section">
            <h1 className="error">404</h1>
            <div className="page">Ooops!!! Trang này không tìm thấy</div>
            <a className="back-home" href="/">Quay lại</a>
        </div>
    );
}

export default NotFound;