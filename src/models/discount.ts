export interface Discount {
    IDKhuyenMai: number;
    TenKhuyenMai: string;
    IdLoaiKH: number | null;
    TuNgay: Date;
    DenNgay: Date;
    createDate: Date | null;
    modifyDate: Date | null;
    createBy: string | null;
    modifyBy: string | null;
    Deleted: boolean | null;
}