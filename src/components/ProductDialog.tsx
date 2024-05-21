import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Product } from '@/models';
import erroImage from '../assets/images/error.jpg';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';

type PropType = {
    product: Product,
    visible: boolean,
    onClose?: () => void,
}

const ProductDialog = (props: PropType) => {
    const { product, visible, onClose } = props;
    const [submitted, setSubmitted] = useState(false);


    const hideDialog = () => {
        onClose?.();
    };

    const saveProduct = () => {
        console.log('save product');
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );

    return (
        <>
            <Dialog visible={visible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header={product == null ? 'Thêm' : 'Sửa'} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <img src={product?.Image ? `https://primefaces.org/cdn/primereact/Images/product/${product.Image}` : erroImage}
                    alt={product?.Image} className="product-Image block m-auto pb-3" />
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Tên món
                    </label>
                    <InputText id="name" value={product?.TenMon} onChange={(e) => { console.log('change name') }} required
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
                        <label htmlFor="price" className="font-bold">
                            Giá bán sỉ
                        </label>
                        <InputNumber id="price" value={product.DonGiaBanSi}
                            onValueChange={(e) => (console.log('change price'))}
                            mode="currency" currency="VND" locale="vn-VN" />
                    </div>
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Giá bán lẻ
                        </label>
                        <InputNumber id="price" value={product.DonGiaBanLe}
                            onValueChange={(e) => (console.log('change price'))}
                            mode="currency" currency="VND" locale="vn-VN" />
                    </div>
                </div>
                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Giá vốn
                        </label>
                        <InputNumber id="price" value={product.DonGiaVon}
                            onValueChange={(e) => (console.log('change price'))}
                            mode="currency" currency="VND" locale="vn-VN" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Số lượng tồn kho
                        </label>
                        <InputNumber id="quantity" value={product.SoLuongTonKho}
                            onValueChange={(e) => (console.log('change SoLuongTonKho'))} />
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="note" className="font-bold">
                        Ghi chú
                    </label>
                    <InputTextarea id="note" value={product?.GhiChu ?? ""} onChange={(e) => { console.log('change note') }}
                        required rows={3} cols={20} />
                </div>
            </Dialog>
        </>
    )
}

export default ProductDialog;