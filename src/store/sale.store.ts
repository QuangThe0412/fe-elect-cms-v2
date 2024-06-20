import { ChossenProduct } from "@/containers/sale/Sale";
import { create } from "zustand";

export type SaleStore = {
    chosenProducts: ChossenProduct[];
    setChosenProducts: (product: ChossenProduct[]) => void;
    deleteChosenProduct: (product: ChossenProduct) => void;
};

const useSaleStore = create<SaleStore>()((set) => ({
    chosenProducts: [] as ChossenProduct[],
    setChosenProducts: (bys: ChossenProduct[]) => set((state) => ({ chosenProducts: bys })),
    deleteChosenProduct: (by: ChossenProduct) => set((state) => ({ chosenProducts: state.chosenProducts.filter((product) => product.IDMon !== by.IDMon) })),
}));

export default useSaleStore;