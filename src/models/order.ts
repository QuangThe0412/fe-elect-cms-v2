export interface Order {
    IDHoaDon: number;
    IDBaoGia?: number;
    IDKhachHang?: number;
    GhiChu?: string;
    CongNo?: number;
    TrangThai?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
}