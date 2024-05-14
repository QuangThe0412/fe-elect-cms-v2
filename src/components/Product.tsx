
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload, FileUploadHandlerOptions } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
// import { ApiGetProducts, Product, ApiAddProduct, ApiUpdateProduct, ApiDeletedProduct, ApiDeletedProducts } 
// from '@/services/productApi';
// import { formatCurrency, handleImageError, linkImageGG } from '../Common';
import '@/styles/product.css';
// import { ApiGetCategories, Category } from '@/services/categoryApi';
import { Product } from '@/models';
interface FileUploadState {
  files: File[];
}

export default function ProductsDemo() {
  const emptyProduct: Product = {
    id: '',
    idCategory: '',
    name: '',
    brand: '',
    unsignedName: '',
    idFake: '',
    unit: '',
    image: '',
    quantity: 0,
    importPrice: 0,
    wholeSalePrice: 0,
    retailPrice: 0,
    numberImport: 0,
    description: '',
    warrantyTime: 0,
    dateCreate: null,
    dateFix: null,
  };

  const emptyImage: FileUploadState = {
    files: [new File([], "")],
  }

  const [fileImage, setFileImage] = useState<FileUploadState>({
    files: [],
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productDialog, setProductDialog] = useState<boolean>(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState<boolean>(false);
  const [product, setProduct] = useState<Product>(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [renderApi, setRenderApi] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Product[]>>(null);
  const [objectURL, setObjectURL] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  //api product
  useEffect(() => {
    const fetchDataProducts = async () => {
      const productRes = await ApiGetProducts();
      if (productRes && productRes.code === 200) {
        setProducts(productRes.data);
        setLoading(false);
      }
    }

    fetchDataProducts();
  }, [renderApi]);

  //api categories
  useEffect(() => {
    const fetchDataCategories = async () => {
      const categoriesRes = await ApiGetCategories();
      if (categoriesRes && categoriesRes.code === 200) {
        setCategories(categoriesRes.data);
        setLoading(false);
      }
    }

    fetchDataCategories();
  }, []);

  const openNew = () => {
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setIsLoading(false);
    setSubmitted(false);
    setProductDialog(false);

    setProduct(emptyProduct);
    setFileImage(emptyImage);
    setObjectURL('');
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  /**
   * Kiểm tra form
   * @returns true => Khi thõa tất cả validate và false khi có ít nhất 1 thuộc tính không thõa
   */
  const validateForm = () => {
    if ((product.name && product.name.trim() !== '' && product.name.trim() !== null)
      && (product.idCategory && product.idCategory.trim() !== '' && product.idCategory.trim() !== null)
      && (product.unit && product.unit.trim() !== '' && product.unit.trim() !== null)
      && (product.brand && product.brand.trim() !== '' && product.brand.trim() !== null)
      && (product.idFake && product.idFake.trim() !== '' && product.idFake.trim() !== null)
    ) {
      return true;
    }
    return false;
  };

  const saveProduct = async () => {
    setSubmitted(true);

    //set loading
    setIsLoading(true);
    const validate = validateForm();
    if (validate) {
      if (product.id) { // update
        const res = await ApiUpdateProduct(product, fileImage);
        if (res && res.code === 200) {
          hideDialog();
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          //reder lại products
          setRenderApi(!renderApi);
        } else {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: res?.mess, life: 8000 });
        }
      } else { // create new
        const res = await ApiAddProduct(product, fileImage);

        if (res && res.code === 201) {
          hideDialog();
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          //reder lại products
          setRenderApi(!renderApi);
        } else {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: res?.mess, life: 8000 });
        }
      }
    }
    setIsLoading(false);
  };

  const editProduct = (product: Product) => {
    setProduct({ ...product });
    const image = product.image ?? '';
    setObjectURL(linkImageGG() + image);
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = async () => {
    const res = await ApiDeletedProduct(product.id);
    if (res && res.code === 200) {
      toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      //reder lại products
      setRenderApi(!renderApi);
    } else {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: res?.mess, life: 8000 });
    }

    setDeleteProductDialog(false);
    setProduct(emptyProduct);
  };

  const findIndexById = (id: string) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = async () => {
    const arrIds = selectedProducts.map(product => product.id);
    const ids: string = arrIds.filter(id => id !== undefined).join(',');

    const res = await ApiDeletedProducts(ids);
    if (res && res.code === 200) {
      toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      //reder lại products
      setRenderApi(!renderApi);
    } else {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: res?.mess, life: 8000 });
    }
    setDeleteProductsDialog(false);
    setSelectedProducts([]);
  };

  const onCategoryChange = (e: RadioButtonChangeEvent) => {
    let _product = { ...product };

    _product['idCategory'] = e.value;
    setProduct(_product);
  };
  const onBrandChange = (e: RadioButtonChangeEvent) => {
    let _product = { ...product };

    _product['brand'] = e.value;
    setProduct(_product);
  };
  const onInputChange = (e: any, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    // @ts-ignore
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const onInputNumberChange = (e: any, name: string) => {
    const val = e.value || 0;
    let _product = { ...product };

    // @ts-ignore
    _product[`${name}`] = val;

    setProduct(_product);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help"
      onClick={exportCSV} />;
  };

  const imageBodyTemplate = (rowData: Product) => {
    return (
      <img
        src={`https://drive.google.com/uc?export=view&id=${rowData.image}`}
        alt={rowData.image!}
        className="shadow-2 border-round"
        style={{ width: '64px' }}
        onError={handleImageError}
      />
    );
  };

  const importPriceBodyTemplate = (rowData: Product) => {
    return formatCurrency(rowData.importPrice);
  };

  const wholeSalePriceBodyTemplate = (rowData: Product) => {
    return formatCurrency(rowData.wholeSalePrice);
  };

  const retailPriceBodyTemplate = (rowData: Product) => {
    return formatCurrency(rowData.retailPrice);
  };

  const categoryBodyTemplate = (rowData: Product) => {
    const category = categories.find((item) => item.id === rowData.idCategory);

    if (category) {
      return <span>{category.name}</span>;
    }

    return null;
  };
  const templateCategories = () => {
    return categories.map(ca => {
      return (
        <div key={ca.id} className="field-radiobutton col-6">
          <RadioButton inputId={ca.id} name="idCategory" value={ca.id}
            onChange={onCategoryChange}
            checked={product.idCategory === ca.id} />
          <label htmlFor={ca.id}>{ca.name}</label>
        </div>
      );
    })
  };
  const templateBrand = () => {
    return (
      <>
        <div className="field-radiobutton col-6">
          <RadioButton inputId="senko" name="brand" value="senko"
            onChange={onBrandChange} checked={product.brand === 'senko'} />
          <label htmlFor="senko">Senko</label>
        </div>
        <div className="field-radiobutton col-6">
          <RadioButton inputId="toshiba" name="brand" value="toshiba"
            onChange={onBrandChange} checked={product.brand === 'toshiba'} />
          <label htmlFor="toshiba">Toshiba</label>
        </div>
        <div className="field-radiobutton col-6">
          <RadioButton inputId="lg" name="brand" value="lg"
            onChange={onBrandChange} checked={product.brand === 'lg'} />
          <label htmlFor="lg">LG</label>
        </div>
        <div className="field-radiobutton col-6">
          <RadioButton inputId="sony" name="brand" value="sony"
            onChange={onBrandChange} checked={product.brand === 'sony'} />
          <label htmlFor="sony">Sony</label>
        </div>
      </>
    );
  };

  const actionBodyTemplate = (rowData: Product) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2"
          onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger"
          onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Products</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" placeholder="Search..."
          onInput={(e) => { const target = e.target as HTMLInputElement; setGlobalFilter(target.value); }} />
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
    </React.Fragment>
  );

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
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-1" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={products} selection={selectedProducts} removableSort loading={loading}
          onSelectionChange={(e) => {
            if (Array.isArray(e.value)) {
              setSelectedProducts(e.value);
            }
          }}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="idFake" header="Mã" exportable={false} style={{ minWidth: '6rem' }}></Column>
          <Column field="name" header="Tên" sortable style={{ width: '17rem' }}></Column>
          <Column field="brand" header="Thương hiệu" style={{ minWidth: '8rem' }}></Column>
          <Column field="unit" header="Đơn vị" sortable style={{ minWidth: '8rem' }}></Column>
          <Column field="image" header="Ảnh" exportable={false} body={imageBodyTemplate}></Column>
          <Column field="importPrice" header="Giá nhập" exportable={false} body={importPriceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
          <Column field="idCategory" header="Loại" body={categoryBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
          <Column field="numberImport" header="Số lượng nhập" exportable={false} sortable style={{ minWidth: '8rem' }}></Column>
          <Column field="retailPrice" header="Giá bán lẻ" body={retailPriceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
          <Column field="wholeSalePrice" header="Giá bán sĩ" body={wholeSalePriceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
          {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
          {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
          <Column field="discount" header="Chiết khấu" sortable style={{ minWidth: '6rem' }}></Column>
          <Column field="warrantyTime" header="Bảo hành" sortable style={{ minWidth: '6rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={productDialog} style={{ width: '45rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <FileUpload name="file" accept="image/*" mode='basic'
          onSelect={handleSelectFile}
          emptyTemplate={
            product.image && <img style={{ maxWidth: 200 }}
              src={`${linkImageGG()}${product.image}`}
              onError={handleImageError} alt={product.image}
              className="product-image block m-auto pb-3" />
          } />
        {objectURL && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img onError={handleImageError} style={{ maxWidth: 200, maxHeight: 200 }}
            src={objectURL} />
        </div>}
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Tên
          </label>
          <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')}
            required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
          {submitted && !product.name && <small className="p-error">Tên không được để trống.</small>}
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="idFake" className="font-bold">
              Mã
            </label>
            <InputText id="idFake" value={product.idFake} onChange={(e) => onInputChange(e, 'idFake')}
              required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
            {submitted && !product.idFake && <small className="p-error">Mã không được để trống.</small>}
          </div>
          <div className="field col">
            <label htmlFor="unit" className="font-bold">
              Đơn vị tính
            </label>
            <InputText id="unit" value={product.unit} onChange={(e) => onInputChange(e, 'unit')}
              required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
            {submitted && !product.unit && <small className="p-error">Đơn vị tính không được để trống.</small>}
          </div>
        </div>

        <div className="field col">
          <label className="mb-3 font-bold">Thể loại</label>
          <div className="formgrid grid">
            {templateCategories()}
            {submitted && !product.idCategory && <small className="p-error">Vui lòng chọn thể loại.</small>}
          </div>
        </div>
        <div className="field col">
          <label className="mb-3 font-bold">Thương hiệu</label>
          <div className="formgrid grid">
            {templateBrand()}
            {submitted && !product.brand && <small className="p-error">Vui lòng chọn thương hiệu.</small>}
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="importPrice" className="font-bold">
              Giá nhập
            </label>
            <InputNumber id="importPrice" value={product.importPrice} onValueChange={(e) => onInputNumberChange(e, 'importPrice')} mode="currency" currency="VND" locale="vi-VN" />
          </div>
          <div className="field col">
            <label htmlFor="quantity" className="font-bold">
              Số lượng
            </label>
            <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
          </div>
          <div className="field col">
            <label htmlFor="warrantyTime" className="font-bold">
              Bảo hành
            </label>
            <InputNumber id="warrantyTime" value={product.warrantyTime} onValueChange={(e) => onInputNumberChange(e, 'warrantyTime')} />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="retailPrice" className="font-bold">
              Bán lẻ
            </label>
            <InputNumber id="retailPrice" value={product.retailPrice} onValueChange={(e) => onInputNumberChange(e, 'retailPrice')} mode="currency" currency="VND" locale="vi-VN" />
          </div>
          <div className="field col">
            <label htmlFor="wholeSalePrice" className="font-bold">
              Bán sĩ
            </label>
            <InputNumber id="wholeSalePrice" value={product.wholeSalePrice} onValueChange={(e) => onInputNumberChange(e, 'wholeSalePrice')} mode="currency" currency="VND" locale="vi-VN" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="description" className="font-bold">
            Mô tả
          </label>
          <InputTextarea id="description" value={product.description || ""} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
        </div>
      </Dialog>

      <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm"
        modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm"
        modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>Are you sure you want to delete the selected products?</span>}
        </div>
      </Dialog>
    </>
  );
}
