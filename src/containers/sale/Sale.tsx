
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import ProductTable from './ProductTable';
import styles from './sale.module.css';
import { Customer, Product } from '@/models';
import ProductChossen from './ProductChossen';
import { HandleApi } from '@/services/handleApi';
import { CustomerService } from '@/services/customer.service';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { formatCurrency } from '@/utils/common';

export interface ChossenProduct extends Product {
  Number: number | 0;
  MoneyBeforeDiscount: number | 0;
  Discount: number | 0;
  MoneyAfterDiscount: number | 0;
  MoneyDiscount: number | 0;
}

export default function SaleComponent() {
  const toast = useRef<Toast>(null);
  const [chosenProducts, setChosenProducts] = useState<ChossenProduct[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer>();

  useEffect(() => {
    const fethData = async () => {
      const customerRes: Customer[] = await getCustomers();
      setCustomers(customerRes);
    };

    fethData();
  }, []);

  const getCustomers = async () => {
    const res = await HandleApi(CustomerService.getCustomers(), null)

    let result = [] as Customer[];
    if (res && res.status === 200) {
      result = res.data as Customer[];
    }
    return result;
  }

  const CaculateMoneyBeforeDiscount = () => {
    let total = 0;
    chosenProducts.forEach((product) => {
      total += product.MoneyBeforeDiscount;
    });
    return formatCurrency(total);
  };

  const CaculateDiscount = () => {
    let total = 0;
    chosenProducts.forEach((product) => {
      total += product.MoneyDiscount;
    });
    return formatCurrency(total);
  };

  const CaculateMoneyAfterDiscount = () => {
    let total = 0;
    chosenProducts.forEach((product) => {
      total += product.MoneyAfterDiscount;
    });
    return formatCurrency(total);
  };
  
  const OnClickPayment = () => {
    if (!selectedCustomers) {
      toast.current?.show({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn khách hàng' });
      return;
    }

    console.log('Thanh toán', chosenProducts, selectedCustomers);
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className={styles.groupHandle}>
        <div className={styles.groupChossen}>
          <ProductChossen
            chosenProducts={chosenProducts}
            setChosenProducts={setChosenProducts}
          />
        </div>
        <div className={styles.groupMoney}>
          <div className={styles.dropDown}>
            <Dropdown value={selectedCustomers} filter
              onChange={(e: DropdownChangeEvent) => {
                setSelectedCustomers(e.value);
              }}
              options={customers} optionLabel={'TenKhachHang'}
              placeholder="Chọn khách hàng" className="w-full" />
          </div>
          <div className={styles.textMoney}>
            <span>Trước chiết khấu</span>
            <span className={styles.money}>{CaculateMoneyBeforeDiscount()}</span>
          </div>
          <div className={styles.textMoney}>
            <span>Tiền Chiết khấu</span>
            <span className={styles.money}>{CaculateDiscount()}</span>
          </div>
          <div className={styles.textMoney}>
            <span>Tổng tiền</span>
            <span className={styles.money}>{CaculateMoneyAfterDiscount()}</span>
          </div>
          <div>
            <Button label="Thanh toán" className="p-button-success" onClick={OnClickPayment} />
          </div>
        </div>
      </div>
      <div className={styles.groupData}>
        <ProductTable
          chosenProducts={chosenProducts}
          setChosenProducts={setChosenProducts}
        />
      </div>
      {/* <CategoryDialog
        categoryGroups={categoryGroups}
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false)
        }}
        idCategory={selectedCategory?.IDLoaiMon}
        onCategoryChange={() => {
          setCategoryChange(!categoryChange)
        }} // refresh data
      /> */}
    </div>
  );
}
