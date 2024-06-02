export interface Customer {
    IDKhachHang: number;
    IDLoaiKH?: number | null;
    TenKhachHang?: string | null;
    username?: string | null;
    password?: string | null;
    DienThoai?: string | null;
    createDate?: Date | null;
    modifyDate?: Date | null;
    createBy?: string | null;
    modifyBy?: string | null;
    Deleted?: boolean | null;
} 