export interface Debt {
    Id: number;
    IDKhachHang: number;
    IDHoaDon: number;
    CongNoDau?: number;
    createDate?: Date | null;
    modifyDate?: Date | null;
    createBy?: string;
    modifyBy?: string;
}