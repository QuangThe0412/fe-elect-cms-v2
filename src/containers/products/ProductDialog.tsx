import { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { ProductService } from '@/services/products.service';
import { Product, Category, Product2, FileUploadState } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { convertFormData, generateLinkGoogleImage, removeVietnameseTones, trimString } from '@/utils/common';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';

type PropType = {
    idProduct: number,
    visible: boolean,
    onClose: () => void,
    categories: Category[],
    onProductChange: () => void,
};

type typeForm = {
    id: number;
    idCategory: number;
    unit: string;
    priceRetail: number;
    priceWholeSale: number;
    priceCost: number;
    maTat: string;
    note: string;
    quantity: number;
    nameProduct: string;
    timeWarranty: number;
}

const initialForm: typeForm = {
    id: 0,
    idCategory: 0,
    unit: '',
    maTat: '',
    priceRetail: 0,
    priceWholeSale: 0,
    priceCost: 0,
    note: '',
    quantity: 0,
    nameProduct: '',
    timeWarranty: 0,
};


export default function ProductDialog({ visible, onClose, idProduct, onProductChange, categories }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<Category>();
    const [objectURL, setObjectURL] = useState<string>('');

    const [fileImage, setFileImage] = useState<FileUploadState>({
        files: [],
    });

    useEffect(() => {
        if (visible && idProduct > 0) {
            getProduct();
        }
    }, [visible]);

    const HandClose = () => {
        onClose();
        form.resetFields();
        setSelectedCategory(undefined);
        setFileImage({ files: [] });
        setObjectURL('');
    };

    const getProduct = () => {
        setLoading(true);
        HandleApi(ProductService.getProduct(idProduct), null).then((res) => {
            if (res && res.status === 200) {
                let product = res.data as Product;
                setSelectedCategory(categories.find((x) => x.IDLoaiMon === product.IDLoaiMon));
                form.setFieldsValue({
                    id: product.IDMon || 0,
                    idCategory: product.IDLoaiMon || 0,
                    unit: product.DVTMon || '',
                    maTat: product.MaTat || '',
                    priceRetail: product.DonGiaBanLe || 0,
                    priceWholeSale: product.DonGiaBanSi || 0,
                    priceCost: product.DonGiaVon || 0,
                    note: product.GhiChu || '',
                    image: product.Image || '',
                    modifyDate: product.modifyDate || '',
                    createDate: product.createDate || '',
                    quantity: product.SoLuongTonKho || 0,
                    nameProduct: product.TenMon || '',
                    timeWarranty: product.ThoiGianBH || 0,
                });
                setObjectURL(generateLinkGoogleImage(product.Image));
            }
        }).finally(() => { setLoading(false); });
    };

    const onFinish = async (values: typeForm) => {
        setLoading(true);
        let product: Product = {
            TenKhongDau: removeVietnameseTones(values.nameProduct),
            IDMon: idProduct,
            IDLoaiMon: selectedCategory?.IDLoaiMon || 0,
            DVTMon: values.unit,
            MaTat: values.maTat,
            DonGiaBanLe: values.priceRetail,
            DonGiaBanSi: values.priceWholeSale,
            DonGiaVon: values.priceCost,
            GhiChu: values.note,
            SoLuongTonKho: values.quantity,
            TenMon: values.nameProduct,
            ThoiGianBH: values.timeWarranty,
            Deleted: false,
            Image: '',
            createDate: null,
            modifyDate: null,
        };

        let _product: Product2 = { ...product as Product2 };
        trimString(_product);

        const formData = await convertFormData(_product, fileImage);
        if (idProduct) { // update
            HandleApi(ProductService.updateProduct(idProduct, formData), toast).then((res) => {
                if (res && res.status === 200) {
                    onProductChange();
                    HandClose();
                }
            }).finally(() => { setLoading(false); });
        } else { // create
            HandleApi(ProductService.createProduct(formData), toast).then((res) => {
                if (res.status === 201) {
                    onProductChange();
                    HandClose();
                }
            }).finally(() => { setLoading(false); });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const handleSelectFile = async (event: any) => {
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob());

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            setFileImage({
                files: [new File([blob], file.name, { type: file.type })],
            });
            setObjectURL(file.objectURL);
        };
    };
    return (
        <>
            <Toast ref={toast}></Toast>
            <Dialog header={idProduct ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ minWidth: '35vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialForm}
                    className="p-fluid">
                    <LabelField label="Hình ảnh" name="image">
                        {(control, meta) => (
                            <FileUpload {...control} id="image" mode="basic" accept="image/*" chooseLabel='Chọn ảnh'
                                maxFileSize={10485760} className={classNames({ 'invalid': meta.errors.length })}
                                onSelect={handleSelectFile}
                            />
                        )}
                    </LabelField>

                    {objectURL && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                        <img alt={idProduct?.toString()} style={{ maxWidth: 200, maxHeight: 200 }} src={objectURL} />
                    </div>}
                    <LabelField label="Tên sản phẩm" name="nameProduct"
                        rules={[
                            { required: true, message: 'Tên sản phẩm không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (<InputText {...control} id="nameProduct"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>
                    <LabelField label="Loại món" name="idCategory"
                        rules={[
                            { required: true, message: 'Loại món không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (
                            <Dropdown value={selectedCategory} filter
                                onChange={(e: DropdownChangeEvent) => {
                                    setSelectedCategory(e.value);
                                }}
                                options={categories} optionLabel={'TenLoai'}
                                placeholder="Chọn loại món" className="w-full" />
                        )}
                    </LabelField>
                    <LabelField label="Mã" name="maTat"
                        rules={[
                            { required: true, message: 'Mã tắt không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (<InputText {...control} id="maTat"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>
                    <LabelField label="Đơn vị tính" name="unit"
                        rules={[
                            { required: true, message: 'Đơn vị tính không được bỏ trống.' },
                        ]}>
                        {(control, meta) => (<InputText {...control} id="unit"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>
                    <LabelField label="Giá bán lẻ" name="priceRetail"
                        rules={[
                            { required: true, message: 'Giá bán lẻ không được bỏ trống.' },
                            {
                                validator: (_, value) => value < 1
                                    ? Promise.reject('Vui lòng nhập giá lẻ.')
                                    : Promise.resolve()
                            }
                        ]}>
                        {(control, meta) => (
                            <InputText
                                {...control}
                                id="priceRetail" type='number'
                                className={classNames({ 'invalid': meta.errors.length })}
                            />
                        )}
                    </LabelField>
                    <LabelField label="Giá bán sỉ" name="priceWholeSale"
                        rules={[
                            { required: true, message: 'Giá bán sỉ không được bỏ trống.' },
                            {
                                validator: (_, value) => value < 1
                                    ? Promise.reject('Vui lòng nhập giá sỉ.')
                                    : Promise.resolve()
                            }
                        ]}>
                        {(control, meta) => (<InputText {...control} id="priceWholeSale" type='number'
                            className={classNames({ 'invalid': meta.errors.length })}
                        />
                        )}

                    </LabelField>
                    <LabelField label="Giá vốn" name="priceCost"
                        rules={[
                            { required: true, message: 'Giá vốn không được bỏ trống.' },
                            {
                                validator: (_, value) => value < 1
                                    ? Promise.reject('Vui lòng nhập giá vốn.')
                                    : Promise.resolve()
                            }
                        ]}>
                        {(control, meta) => (<InputText {...control} id="priceCost" type='number'
                            className={classNames({ 'invalid': meta.errors.length })}
                        />
                        )}
                    </LabelField>
                    <LabelField label="Số lượng tồn kho" name="quantity"
                        rules={[
                            { required: true, message: 'Số lượng tồn kho không được bỏ trống.' },
                            {
                                validator: (_, value) => value < 1
                                    ? Promise.reject('Vui lòng nhập số lượng tồn kho.')
                                    : Promise.resolve()
                            }
                        ]}>
                        {(control, meta) => (<InputText {...control} id="quantity" type='number'
                            className={classNames({ 'invalid': meta.errors.length })}
                        />
                        )}
                    </LabelField>
                    <LabelField label="Thời gian bảo hành" name="timeWarranty">
                        {(control, meta) => (<InputText {...control} id="timeWarranty" type='number'
                            className={classNames({ 'invalid': meta.errors.length })}
                        />
                        )}
                    </LabelField>
                    <LabelField label="Ghi chú" name="note">
                        {(control, meta) => (<InputTextarea {...control} id="note"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>
                    <Button loading={loading} type='submit'
                        label={idProduct ? 'Cập nhật' : 'Tạo mới'}
                        className="w-6" style={{ float: 'right' }} />
                </Form>
            </Dialog>
        </>
    )
}