export const apiUrl = 'http://localhost:3002/admin';

export const paths = {
    //auth
    login: '/auth/login',
    refreshToken: '/auth/refreshToken',
    register: '/auth/register',
    //account
    getProfile: '/account/me',
    updateProfile: '/account/updateProfile',
    changePassword: '/account/changePassword',
    //product
    product: '/mon',
    categoryGroup: '/nhommon',
    category: '/loaimon',
    //======
    dashboard: '/thongke',
    user: '/nguoiDung',
    customer:'/khachHang',
    customerType:'/loaiKhachHang',
    discount:'/khuyenMai',
    discountDetails:'/chiTietKhuyenMai',
    order:'/hoadon',
    orderDetails:'/chiTietHoaDon',
    debt:'/congNo',
    debtDetails:'/chiTietCongNo',
    import:'/phieuNhap',
    importDetails:'/chiTietPhieuNhap',
    export:'/phieuXuat',
    exportDetails:'/chiTietPhieuXuat',
};