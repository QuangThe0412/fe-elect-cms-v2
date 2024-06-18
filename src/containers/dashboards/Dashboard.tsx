
import { useState, useEffect, useRef } from 'react';
import '@/styles/dashboard.css';
import { ThongKeService } from '@/services/thongke.service';
import { Toast } from 'primereact/toast';
import { HandleApi } from '@/services/handleApi';
import { Calendar } from 'primereact/calendar';
import { OrderDetail } from '@/models';
import CardDashboard from './CardDashboard';
import { Divider } from 'primereact/divider';
import LoadingComponent from '@/components/loading/LoadingComponent';

const date = new Date();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const week = Math.ceil(date.getDate() / 7);
export interface typeRes extends OrderDetail {
    TenMon: string,
    TenKhachHang: string,
    TrangThai: number,
}

export default function DashboardComponent() {
    const toast = useRef<Toast>(null);
    const [dateFrom, setDateFrom] = useState(new Date());
    const [dateTo, setDateTo] = useState(new Date());
    const [dataSearch, setDataSearch] = useState<typeRes[]>([]);
    const [dataMonth, setDataMonth] = useState<typeRes[]>([]);
    const [dataWeek, setDataWeek] = useState<typeRes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getThongKeByMonth();
        getThongKeByWeek();
    }, []);

    useEffect(() => {
        getThongKe();
    }, [dateFrom, dateTo]);

    const getThongKe = () => {
        setLoading(true);
        HandleApi(ThongKeService.getThongKe(dateFrom, dateTo), null).then((result) => {
            let data: typeRes[] = result?.data;
            setDataSearch(data);
        }).finally(() => { setLoading(false); });
    };

    const getThongKeByMonth = () => {
        setLoading(true);
        HandleApi(ThongKeService.getThongKeByMonth(), null).then((result) => {
            let data: typeRes[] = result?.data;
            setDataMonth(data);
        }).finally(() => { setLoading(false); });
    };

    const getThongKeByWeek = () => {
        setLoading(true);
        HandleApi(ThongKeService.getThongKeByWeek(), null).then((result) => {
            let data: typeRes[] = result?.data;
            setDataWeek(data);
        }).finally(() => { setLoading(false); });
    };

    return (
        <>
            <LoadingComponent loading={loading} />
            <div className="card">
                <Toast ref={toast} />
                <div className="grid" style={{ justifyContent: 'center', marginTop: '20px' }}>
                    <CardDashboard title={"Tổng doanh thu tháng " + month + "/" + year} data={dataMonth} />
                    <CardDashboard title={"Tổng doanh thu tuần " + week + " tháng " + month} data={dataWeek} />
                </div>
                <Divider type="solid" className='bg-danger' />
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
                <CardDashboard title="Tổng doanh thu tìm kiếm" data={dataSearch} />

                {/* <Chart type="bar" data={chartData} options={chartOptions} /> */}
            </div>
        </>
    )
}
