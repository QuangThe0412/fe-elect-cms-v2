export interface TypeCustomer {
    IDLoaiKH: number;
    TenLoaiKH: string | null;
    MoTa: string | null;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
}