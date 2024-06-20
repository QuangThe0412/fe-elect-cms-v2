
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
import SaleDialog from './SaleDialog';
import useSaleStore, { SaleStore } from '@/store/sale.store';

export interface ChossenProduct extends Product {
  Number: number | 0;
  MoneyBeforeDiscount: number | 0;
  Discount: number | 0;
  MoneyAfterDiscount: number | 0;
  MoneyDiscount: number | 0;
}

export type ResultsType = {
  MoneyBeforeDiscount: number | 0;
  MoneyDiscount: number | 0;
  MoneyAfterDiscount: number | 0;
}

export default function SaleComponent() {
  const toast = useRef<Toast>(null);
  const { chosenProducts, setChosenProducts, deleteChosenProduct } = useSaleStore((state: SaleStore) =>
  ({
    chosenProducts: state.chosenProducts,
    setChosenProducts: state.setChosenProducts,
    deleteChosenProduct: state.deleteChosenProduct
  }));

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer>();
  const [visible, setVisible] = useState<boolean>(false);
  const [results, setResults] = useState<ResultsType>({} as ResultsType);

  useEffect(() => {
    const fethData = async () => {
      const customerRes: Customer[] = await getCustomers();
      setCustomers(customerRes);
    };

    fethData();
  }, []);

  useEffect(() => {
    if (chosenProducts.length > 0) {
      let _results: ResultsType = {
        MoneyBeforeDiscount: 0,
        MoneyDiscount: 0,
        MoneyAfterDiscount: 0
      }

      chosenProducts.forEach((product: any) => {
        _results.MoneyBeforeDiscount += product.MoneyBeforeDiscount;
        _results.MoneyDiscount += product.MoneyDiscount;
        _results.MoneyAfterDiscount += product.MoneyAfterDiscount;
      });
      setResults(_results);
    }
  }, [chosenProducts]);

  const getCustomers = async () => {
    const res = await HandleApi(CustomerService.getCustomers(), null)

    let result = [] as Customer[];
    if (res && res.status === 200) {
      result = res.data as Customer[];
    }
    return result;
  }

  const OnClickPayment = () => {
    if (!selectedCustomers) {
      toast.current?.show({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn khách hàng' });
      return;
    }

    setVisible(true);
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className={styles.groupHandle}>
        <div className={styles.groupChossen}>
          <ProductChossen
            chosenProducts={chosenProducts}
            setChosenProducts={setChosenProducts}
            deleteChosenProduct={deleteChosenProduct}
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
            <span className={styles.money}>{formatCurrency(results.MoneyBeforeDiscount)}</span>
          </div>
          <div className={styles.textMoney}>
            <span>Tiền Chiết khấu</span>
            <span className={styles.money}>{formatCurrency(results.MoneyDiscount)}</span>
          </div>
          <div className={styles.textMoney}>
            <span>Tổng tiền</span>
            <span className={styles.money}>{formatCurrency(results.MoneyAfterDiscount)}</span>
          </div>
          <div>
            {
              <Button
                disabled={chosenProducts.length === 0}
                onClick={OnClickPayment}
                label="Thanh toán"
                icon="pi pi-check"
                className="p-button-success" />
            }
          </div>
        </div>
      </div>
      <div className={styles.groupData}>
        <ProductTable
          chosenProducts={chosenProducts}
          setChosenProducts={setChosenProducts}
        />
      </div>
      <SaleDialog
        results={results}
        visible={visible}
        onClose={() => { setVisible(false) }}
        chosenProducts={chosenProducts} />
    </div>
  );
}
