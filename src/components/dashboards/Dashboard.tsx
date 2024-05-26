
import React, { useState, useEffect, useRef } from 'react';
import '@/styles/dashboard.css';
import { ThongKeService } from '@/services/thongke.service';
import { Toast } from 'primereact/toast';
import { HandleApi } from '@/services/handleApi';
import { Calendar } from 'primereact/calendar';
import { Dashboard } from '@/models';
import { formatCurrency } from '@/utils/common';

export default function DashboardComponent() {
    const toast = useRef<Toast>(null);
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const [number, setNumber] = useState(0);

    useEffect(() => {
        getThongKe();

    }, [dateFrom, dateTo]);

    const getThongKe = () => {
        HandleApi(ThongKeService.getThongKe(dateFrom, dateTo), toast).then((result) => {
            let data: Dashboard[] = result?.data;
            setNumber(data.map((item) => item.TienSauCK).reduce((a, b) => a + b, 0));
        });
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className='group-date'>
                <div>
                    <label htmlFor="date-from" className="font-bold block mb-2">
                        Từ ngày
                    </label>
                    <Calendar id="date-from" value={dateFrom} dateFormat="dd/mm/yy" onChange={(e: any) => setDateFrom(e.value)} maxDate={dateTo} />
                </div>
                <div>
                    <label htmlFor="date-from" className="font-bold block mb-2">
                        Đến ngày
                    </label>
                    <Calendar id="date-to" value={dateTo} dateFormat="dd/mm/yy" onChange={(e: any) => setDateTo(e.value)} minDate={dateFrom} maxDate={new Date()} />
                </div>
            </div>

            {/* <Chart type="bar" data={chartData} options={chartOptions} /> */}
            <h1>Tổng doanh thu : </h1> {formatCurrency(number) + ' VNĐ'}
        </div>
    )
}
