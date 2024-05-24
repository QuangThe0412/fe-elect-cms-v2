import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Category, Product } from '@/models';
import erroImage from '@/images/error.jpg';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { FileUpload } from 'primereact/fileupload';
import { linkImageGG, handleImageError } from '@/utils/common';

type PropType = {
    categories: Category[],
    selectedProduct: Product,
    visible: boolean,
    submitted: boolean,
    objectURL: string,
    onClose?: () => void,
    onSaved?: () => void,
    onInputChange: (e: any, name: string) => void,
    onInputNumberChange: (e: any, name: string) => void,
    onCategoryChange: (e: any, name: string) => void
    handleSelectFile: (e: any) => void
}

const ProductDialog = (props: PropType) => {
    let {
        selectedProduct,
        visible,
        submitted,
        objectURL,
        categories,
        onClose,
        onSaved,
        onInputChange,
        onInputNumberChange,
        onCategoryChange,
        handleSelectFile
    } = props;
    const toast = useRef<Toast>(null);

    const hideDialog = () => {
        onClose?.();
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={onSaved} />
        </React.Fragment>
    );

    return (
        <>
            <Toast ref={toast} />

            <Dialog visible={visible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header={selectedProduct?.IDMon ? 'Chỉnh sữa ' : 'Thêm mới'} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <FileUpload name="file" accept="image/*" mode='basic'
                    onSelect={handleSelectFile}
                    emptyTemplate={
                        selectedProduct?.Image && <img style={{ maxWidth: 200 }}
                            src={`${linkImageGG}${selectedProduct?.Image}`}
                            onError={handleImageError} alt={selectedProduct?.Image}
                            className="product-image block m-auto pb-3" />
                    } />

                {objectURL && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img onError={handleImageError} style={{ maxWidth: 200, maxHeight: 200 }}
                        src={objectURL} />
                </div>}

                <div className="field">
                    <label htmlFor="TenMon" className="font-bold">
                        Tên món
                    </label>
                    <InputText id="TenMon" value={selectedProduct?.TenMon} onChange={(e) => onInputChange(e, 'TenMon')} required
                        autoFocus className={classNames({ 'p-invalid': submitted && !selectedProduct?.TenMon })} />
                    {submitted && !selectedProduct?.TenMon && <small className="p-error">Tên món không được bỏ trống.</small>}
                </div>
                <div className="field">
                    <label className="mb-3 font-bold">Loại món</label>
                    <div className="formgrid grid">
                        {
                            categories.map((category: Category) => (
                                <div key={category.IDLoaiMon} className="field-radiobutton col-6">
                                    <RadioButton inputId={category.IDLoaiMon.toString()} name="category" value={category.IDLoaiMon}
                                        onChange={(e: any) => onCategoryChange(e, 'IDLoaiMon')}
                                        checked={selectedProduct.IDLoaiMon === category.IDLoaiMon} />
                                    <label htmlFor={category.IDLoaiMon.toString()}>{category.TenLoai}</label>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="ThoiGianBH" className="font-bold">
                            Bảo hành (tháng)
                        </label>
                        <InputNumber id="ThoiGianBH" value={selectedProduct?.ThoiGianBH} onChange={(e: any) => onInputNumberChange(e, 'ThoiGianBH')} required
                            autoFocus className={classNames({ 'p-invalid': submitted && !selectedProduct?.ThoiGianBH })} />
                        {submitted && !selectedProduct?.ThoiGianBH && <small className="p-error">Thời gian bảo hành không được bỏ trống.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="DVTMon" className="font-bold">
                            Đơn vị tính
                        </label>
                        <InputText id="DVTMon" value={selectedProduct?.DVTMon} onChange={(e) => onInputChange(e, 'DVTMon')} required
                            autoFocus className={classNames({ 'p-invalid': submitted && !selectedProduct?.DVTMon })} />
                        {submitted && !selectedProduct?.DVTMon && <small className="p-error">Đơn vị tính không được bỏ trống.</small>}
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="DonGiaBanSi" className="font-bold">
                            Giá bán sỉ
                        </label>
                        <InputNumber id="DonGiaBanSi" value={selectedProduct?.DonGiaBanSi}
                            onChange={(e: any) => onInputNumberChange(e, 'DonGiaBanSi')}
                            mode="currency" currency="VND" locale="vn-VN" required
                            autoFocus className={classNames({ 'p-invalid': submitted && !selectedProduct?.DonGiaBanSi })} />
                        {submitted && !selectedProduct?.DonGiaBanSi && <small className="p-error">Giá bán sỉ không được bỏ trống.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="DonGiaBanLe" className="font-bold">
                            Giá bán lẻ
                        </label>
                        <InputNumber id="DonGiaBanLe" value={selectedProduct?.DonGiaBanLe}
                            onChange={(e: any) => onInputNumberChange(e, 'DonGiaBanLe')}
                            mode="currency" currency="VND" locale="vn-VN" required
                            autoFocus className={classNames({ 'p-invalid': submitted && !selectedProduct?.DonGiaBanLe })} />
                        {submitted && !selectedProduct?.DonGiaBanLe && <small className="p-error">Giá bán lẻ không được bỏ trống.</small>}
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="DonGiaVon" className="font-bold">
                            Giá vốn
                        </label>
                        <InputNumber id="DonGiaVon" value={selectedProduct?.DonGiaVon}
                            onChange={(e: any) => onInputNumberChange(e, 'DonGiaVon')}
                            mode="currency" currency="VND" locale="vn-VN" required
                            autoFocus className={classNames({ 'p-invalid': submitted && !selectedProduct?.DonGiaVon })} />
                        {submitted && !selectedProduct?.DonGiaVon && <small className="p-error">Giá vốn không được bỏ trống.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="SoLuongTonKho" className="font-bold">
                            Số lượng tồn kho
                        </label>
                        <InputNumber id="SoLuongTonKho" value={selectedProduct?.SoLuongTonKho}
                            onChange={(e: any) => onInputNumberChange(e, 'SoLuongTonKho')} required
                            autoFocus className={classNames({ 'p-invalid': submitted && !selectedProduct?.SoLuongTonKho })} />
                        {submitted && !selectedProduct?.SoLuongTonKho && <small className="p-error">Số lượng tồn kho không được bỏ trống.</small>}
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="GhiChu" className="font-bold">
                        Ghi chú
                    </label>
                    <InputTextarea id="GhiChu" value={selectedProduct?.GhiChu ?? ""}
                        onChange={(e) => onInputChange(e, 'GhiChu')}
                        required rows={2} cols={20} />
                </div>
            </Dialog>
        </>
    )
}

export default ProductDialog;