export interface OrderDetail {
    IDChiTietHD: number;
    IDHoaDon: number;
    IDMon: number;
    SoLuong?: number;
    DonGia?: number;
    ChietKhau?: number;
    TienChuaCK?: number;
    TienCK?: number;
    TienSauCK?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}