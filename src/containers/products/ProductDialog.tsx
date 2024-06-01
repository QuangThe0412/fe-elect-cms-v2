import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Form from 'rc-field-form';
import { Toast } from 'primereact/toast';
import { ProductService } from '@/services/products.service';
import { CategoryGroupService } from '@/services/categoryGroup.service';
import { Product, Category, Product2, FileUploadState } from '@/models';
import { HandleApi } from '@/services/handleApi';
import { LabelField } from '@/components';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import Categories from '../category/Category';
import { CategoryService } from '@/services/category.service';
import { convertFormData, linkImageGG, trimString } from '@/utils/common';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';

type PropType = {
    idProduct: number,
    visible: boolean,
    onClose: () => void,
    onProductChange: () => void,
};

type typeForm = {
    id: number;
    idCategory: number;
    unit: string;
    priceRetail: number;
    priceWholeSale: number;
    priceCost: number;
    note: string;
    quantity: number;
    nameProduct: string;
    timeWarranty: number;
}

const initialForm: typeForm = {
    id: 0,
    idCategory: 0,
    unit: '',
    priceRetail: 0,
    priceWholeSale: 0,
    priceCost: 0,
    note: '',
    quantity: 0,
    nameProduct: '',
    timeWarranty: 0,
};


export default function ProductDialog({ visible, onClose, idProduct, onProductChange }: PropType) {
    const [form] = Form.useForm();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category>();
    const [objectURL, setObjectURL] = useState<string>('');

    const emptyImage: FileUploadState = {
        files: [new File([], "")],
    }

    const [fileImage, setFileImage] = useState<FileUploadState>({
        files: [],
    });

    useEffect(() => {
        getCategories();
        if (visible && idProduct > 0) {
            getProduct();
        }
    }, [visible]);

    const HandClose = () => {
        onClose();
        form.resetFields();
        setSelectedCategory(undefined);
        setObjectURL('');
    };

    const getProduct = () => {
        HandleApi(ProductService.getProduct(idProduct), null).then((res) => {
            if (res && res.status === 200) {
                let product = res.data as Product;
                console.log(product);

                setSelectedCategory(categories.find((x) => x.IDLoaiMon === product.IDLoaiMon));
                form.setFieldsValue({
                    id: product.IDMon,
                    idCategory: product.IDLoaiMon,
                    unit: product.DVTMon,
                    priceRetail: product.DonGiaBanLe,
                    priceWholeSale: product.DonGiaBanSi,
                    priceCost: product.DonGiaVon,
                    note: product.GhiChu,
                    image: product.Image,
                    modifyDate: product.modifyDate,
                    createDate: product.createDate,
                    quantity: product.SoLuongTonKho,
                    nameProduct: product.TenMon,
                    timeWarranty: product.ThoiGianBH,
                });

                setObjectURL(linkImageGG + product.Image);
            }
        });
    };

    const getCategories = () => {
        HandleApi(CategoryService.getCategories(), null).then((result) => {
            if (result.status === 200) {
                let data = result.data as Category[];
                setCategories(data);
            }
            setLoading(false);
        });
    }

    const onFinish = async (values: typeForm) => {
        setLoading(true);
        let product: Product = {
            IDMon: idProduct,
            IDLoaiMon: selectedCategory?.IDLoaiMon || 0,
            DVTMon: values.unit,
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
                setLoading(false);
            });
        } else { // create
            HandleApi(ProductService.createProduct(formData), toast).then((res) => {
                if (res.status === 201) {
                    onProductChange();
                    HandClose();
                }
                setLoading(false);
            });
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
            <Dialog header={idProduct ? 'Cập nhật' : 'Thêm mới'} visible={visible} style={{ width: '35vw' }}
                onHide={() => { if (!visible) return; HandClose(); }}>
                <Form form={form} onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={initialForm}
                    className="p-fluid">
                    <LabelField label="Hình ảnh" name="image">
                        {(control, meta) => (
                            <FileUpload {...control} id="image" mode="basic" accept="image/*"
                                maxFileSize={1000000} className={classNames({ 'invalid': meta.errors.length })}
                                onSelect={handleSelectFile}
                            />
                        )}
                    </LabelField>

                    {objectURL && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                        <img style={{ maxWidth: 200, maxHeight: 200 }} src={objectURL} />
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
                            <Dropdown value={selectedCategory}
                                onChange={(e: DropdownChangeEvent) => {
                                    setSelectedCategory(e.value);
                                }}
                                options={categories} optionLabel={'TenLoai'}
                                placeholder="Chọn loại món" className="w-full" />
                        )}
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
                            <InputNumber
                                {...control}
                                id="priceRetail"
                                className={classNames({ 'invalid': meta.errors.length })}
                                onChange={(value) => {
                                    control.onChange(value?.value);
                                }}
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
                        {(control, meta) => (<InputNumber {...control} id="priceWholeSale"
                            className={classNames({ 'invalid': meta.errors.length })}
                            onChange={(value) => {
                                control.onChange(value?.value);
                            }}
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
                        {(control, meta) => (<InputNumber {...control} id="priceCost"
                            className={classNames({ 'invalid': meta.errors.length })}
                            onChange={(value) => {
                                control.onChange(value?.value);
                            }}
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
                        {(control, meta) => (<InputNumber {...control} id="quantity"
                            className={classNames({ 'invalid': meta.errors.length })}
                            onChange={(value) => {
                                control.onChange(value?.value);
                            }}
                        />
                        )}
                    </LabelField>
                    <LabelField label="Thời gian bảo hành" name="timeWarranty">
                        {(control, meta) => (<InputNumber {...control} id="timeWarranty"
                            className={classNames({ 'invalid': meta.errors.length })}
                            onChange={(value) => {
                                control.onChange(value?.value);
                            }}
                        />
                        )}
                    </LabelField>
                    <LabelField label="Ghi chú" name="note">
                        {(control, meta) => (<InputTextarea {...control} id="note"
                            className={classNames({ 'invalid': meta.errors.length })} />)}
                    </LabelField>
                    <Button loading={loading} type='submit' label={idProduct ? 'Cập nhật' : 'Tạo mới'} className="w-6" style={{ float: 'right' }} />
                </Form>
            </Dialog>
        </>
    )
}