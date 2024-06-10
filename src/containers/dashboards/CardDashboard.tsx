import { paths } from "@/constants/api";
import { formatCurrency } from "@/utils/common";
import { useNavigate } from "react-router-dom";
import { typeRes } from "./Dashboard";
import { STATUS_ENUM } from "@/constants";
import { useState } from "react";

type PropTypes = {
    title: string,
    data: typeRes[]
}

export default function CardDashboard({ data, title }: PropTypes) {
    const _data = data.filter(item => item.TrangThai === STATUS_ENUM.PENDING);
    const navigate = useNavigate();
    const totalMoney = _data.reduce((total, item) => total + (item.TienSauCK ?? 0), 0);

    let arrayHoaDon = _data
        .map(item => item.IDHoaDon)
        .filter((value, index, self) => self.indexOf(value) === index);

    return (
        <>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">{title}</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(totalMoney) + ' VNĐ'}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round"
                            onClick={() => { navigate(paths.order) }}
                            style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-eye text-blue-500 text-xl"></i>
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{'Có ' + arrayHoaDon.length} </span>
                    <span className="text-500">hóa đơn</span>
                </div>
            </div>
        </>
    );
};