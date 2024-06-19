
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import ProductTable from './ProductTable';
import styles from './sale.module.css';

export default function SaleComponent() {

  const toast = useRef<Toast>(null);

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className={styles.groupHandle}>
        <div className={styles.groupChossen}>
          
        </div>
        <div className={styles.totalMoney}>
          <span>Tổng tiền</span>
          <span>0</span>
        </div>
      </div>
      <div className={styles.groupData}>
        <ProductTable />
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
