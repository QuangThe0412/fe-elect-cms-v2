import { FileUploadState } from '@/models';
export interface Product {
    IDMon: number | 0 ,
    IDLoaiMon: number | 0,
    DVTMon: string | '',
    Deleted: boolean,
    DonGiaBanLe: number | 0,
    DonGiaBanSi: number | 0,
    DonGiaVon: number | 0,
    GhiChu: string | '',
    Image: string | '',
    modifyDate: Date | null,
    createdDate: Date | null,
    SoLuongTonKho: number | 0,
    TenMon: string | '',
    ThoiGianBH: number | 0,
};

export interface Product2 extends Product {
    file: File;
}