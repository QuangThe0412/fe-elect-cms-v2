import React from 'react';
import { Toast } from 'primereact/toast';

type ResponseApi = {
    mess: string,
    data: any,
    code: string,
}

export const HandleApi = async (request: Promise<any>, toast: React.RefObject<Toast> | null) => {
    try {
        const result  = await request;
        const responseApi = result?.data as ResponseApi;
        // handle the response here
        toast?.current?.show({ severity: 'success', summary: 'Thành công', detail: responseApi?.mess, life: 3000 });
        return responseApi?.data;
    } catch (error) {
        // handle the error here
        console.error(error);
        toast?.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Đã có lỗi xảy ra', life: 3000 });
        throw error;
    }
}