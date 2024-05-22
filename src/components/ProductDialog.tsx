import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Product } from '@/models';
import erroImage from '../assets/images/error.jpg';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

type PropType = {
    typeTitle: string,
    selectedProduct: Product,
    visible: boolean,
    onClose?: () => void,
}

const defaultProduct = {
    TenMon: '',
    IDMon: '',
    IDLoaiMon: '',
    DVTMon: '',
    DonGiaBanLe: 0,
    DonGiaBanSi: 0,
    DonGiaVon: 0,
    SoLuongTonKho: 0,
    ThoiGianBH: '',
};

const ProductDialog = (props: PropType) => {
    let { typeTitle, selectedProduct, visible, onClose } = props;
    const [product, setProduct] = useState<Product>({ ...selectedProduct || defaultProduct });

    const [submitted, setSubmitted] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        setProduct({ ...selectedProduct });
    }, [selectedProduct]);

    const hideDialog = () => {
        onClose?.();
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (product.TenMon?.trim()) {
            let _product = { ...product };

            console.log(_product);

            if (!_product.TenMon?.trim()
                || !_product.IDLoaiMon || !_product.DVTMon
                || _product.DonGiaBanLe === undefined || _product.DonGiaBanLe === null || _product.DonGiaBanLe < 0
                || _product.DonGiaBanSi === undefined || _product.DonGiaBanSi === null || _product.DonGiaBanSi < 0
                || _product.DonGiaVon === undefined || _product.DonGiaVon === null || _product.DonGiaVon < 0
                || !_product.NgaySua || !_product.NgayTao
                || _product.SoLuongTonKho === undefined || _product.SoLuongTonKho === null || _product.SoLuongTonKho < 0
                || !_product.ThoiGianBH) {
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                // _product.id = createId();
                // _product.image = 'product-placeholder.svg';
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            hideDialog();
        }
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        // @ts-ignore
        _product[`${name}`] = val;

        setProduct(prevProduct => ({ ...prevProduct, [name]: val }));
    };

    const onInputNumberChange = (e: InputNumberChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };

        // @ts-ignore
        _product[`${name}`] = val;

        setProduct(prevProduct => ({ ...prevProduct, [name]: val }));
    };

    return (
        <>
            <Toast ref={toast} />

            <Dialog visible={visible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header={typeTitle} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <img src={product?.Image ? `https://primefaces.org/cdn/primereact/Images/product/${product?.Image}` : erroImage}
                    alt={product?.Image} className="product-Image block m-auto pb-3" />
                <div className="field">
                    <label htmlFor="TenMon" className="font-bold">
                        Tên món
                    </label>
                    <InputText id="TenMon" value={product?.TenMon} onChange={(e) => onInputChange(e, 'TenMon')} required
                        autoFocus className={classNames({ 'p-invalid': submitted && !product?.TenMon })} />
                    {submitted && !product?.TenMon && <small className="p-error">Tên món không được bỏ trống.</small>}
                </div>
                {/* <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div> */}
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="ThoiGianBH" className="font-bold">
                            Bảo hành (tháng)
                        </label>
                        <InputNumber id="ThoiGianBH" value={product?.ThoiGianBH} onChange={(e: any) => onInputNumberChange(e, 'ThoiGianBH')} required
                            autoFocus className={classNames({ 'p-invalid': submitted && !product?.ThoiGianBH })} />
                        {submitted && !product?.ThoiGianBH && <small className="p-error">Thời gian bảo hành không được bỏ trống.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="DVTMon" className="font-bold">
                            Đơn vị tính
                        </label>
                        <InputText id="DVTMon" value={product?.DVTMon} onChange={(e) => onInputChange(e, 'DVTMon')} required
                            autoFocus className={classNames({ 'p-invalid': submitted && !product?.DVTMon })} />
                        {submitted && !product?.DVTMon && <small className="p-error">Đơn vị tính không được bỏ trống.</small>}
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="DonGiaBanSi" className="font-bold">
                            Giá bán sỉ
                        </label>
                        <InputNumber id="DonGiaBanSi" value={product?.DonGiaBanSi}
                            onChange={(e: any) => onInputNumberChange(e, 'DonGiaBanSi')}
                            mode="currency" currency="VND" locale="vn-VN" required
                            autoFocus className={classNames({ 'p-invalid': submitted && !product?.DonGiaBanSi })} />
                        {submitted && !product?.DonGiaBanSi && <small className="p-error">Giá bán sỉ không được bỏ trống.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="DonGiaBanLe" className="font-bold">
                            Giá bán lẻ
                        </label>
                        <InputNumber id="DonGiaBanLe" value={product?.DonGiaBanLe}
                            onChange={(e: any) => onInputNumberChange(e, 'DonGiaBanLe')}
                            mode="currency" currency="VND" locale="vn-VN" required
                            autoFocus className={classNames({ 'p-invalid': submitted && !product?.DonGiaBanLe })} />
                        {submitted && !product?.DonGiaBanLe && <small className="p-error">Giá bán lẻ không được bỏ trống.</small>}
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="DonGiaVon" className="font-bold">
                            Giá vốn
                        </label>
                        <InputNumber id="DonGiaVon" value={product?.DonGiaVon}
                            onChange={(e: any) => onInputNumberChange(e, 'DonGiaVon')}
                            mode="currency" currency="VND" locale="vn-VN" required
                            autoFocus className={classNames({ 'p-invalid': submitted && !product?.DonGiaVon })} />
                        {submitted && !product?.DonGiaVon && <small className="p-error">Giá vốn không được bỏ trống.</small>}
                    </div>
                    <div className="field col">
                        <label htmlFor="SoLuongTonKho" className="font-bold">
                            Số lượng tồn kho
                        </label>
                        <InputNumber id="SoLuongTonKho" value={product?.SoLuongTonKho}
                            onChange={(e: any) => onInputNumberChange(e, 'SoLuongTonKho')} required
                            autoFocus className={classNames({ 'p-invalid': submitted && !product?.SoLuongTonKho })} />
                        {submitted && !product?.SoLuongTonKho && <small className="p-error">Số lượng tồn kho không được bỏ trống.</small>}
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="GhiChu" className="font-bold">
                        Ghi chú
                    </label>
                    <InputTextarea id="GhiChu" value={product?.GhiChu ?? ""}
                        required rows={2} cols={20} />
                </div>
            </Dialog>
        </>
    )
}

export default ProductDialog;