
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import ProductTable from './ProductTable';
import styles from './sale.module.css';
import { Customer, OrderDetail, Product } from '@/models';
import ProductChossen from './ProductChossen';
import { HandleApi } from '@/services/handleApi';
import { CustomerService } from '@/services/customer.service';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { formatCurrency } from '@/utils/common';
import SaleDialog from './SaleDialog';
import useSaleStore, { SaleStore } from '@/store/sale.store';
import { OrderService, _order, _orderDetails } from '@/services/order.service';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { STATUS_ENUM } from '@/constants';

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
  const [debt, setDebt] = useState<number>(0);

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

  const OnClickPayment = (TrangThai: STATUS_ENUM) => {
    if (!selectedCustomers) {
      toast.current?.show({ severity: 'error', summary: 'Thông báo', detail: 'Chưa chọn khách hàng' });
      return;
    }

    const _data: _orderDetails[] = chosenProducts.map((product: ChossenProduct) => {
      return {
        IDMon: product.IDMon,
        SoLuong: product.Number,
        ChietKhau: product.Discount,
        DonGia: product.DonGiaBanLe,
      }
    });

    const _order: _order = {
      IDKhachHang: selectedCustomers.IDKhachHang,
      CongNo: debt || 0,
      TrangThai: TrangThai,
      data: _data
    }

    console.log(_order);
    HandleApi(OrderService.createOrderWithOrderDetails(_order), null).then((res) => {
      console.log(res);

    }).finally(() => {
      // setVisible(true);
      // setChosenProducts([]);
    });
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
          <div className={styles.textMoney}>
            <span>Công nợ</span>
            <div className={styles.inputDebt}>
              <InputNumber value={debt}
                min={0} mode="currency" currency="VND" locale="vi-VN"
                max={results.MoneyAfterDiscount}
                onValueChange={(e: any) => setDebt(e.value)} />
            </div>
          </div>
          <div>
            <Button
              disabled={chosenProducts.length === 0}
              onClick={() => OnClickPayment(STATUS_ENUM.PENDING)}
              label="Lưu"
              icon="pi pi-check"
              className="p-button-success" />
            <Button
              disabled={chosenProducts.length === 0}
              onClick={() => OnClickPayment(STATUS_ENUM.FINISH)}
              label="Thanh toán"
              icon="pi pi-check"
              className="p-button-success" />
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
