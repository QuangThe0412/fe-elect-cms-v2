import React from 'react';
import { Toast } from 'primereact/toast';

export const HandleApi = async (request: Promise<any>, toast: React.RefObject<Toast> | null) => {
    try {
        const response = await request;
        // handle the response here
        console.log(response);
        toast?.current?.show({ severity: 'success', summary: 'Thành công', detail: response?.data?.code, life: 3000 });
        return response?.data;
    } catch (error) {
        // handle the error here
        console.error(error);
        toast?.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Đã có lỗi xảy ra', life: 3000 });
        throw error;
    }
}