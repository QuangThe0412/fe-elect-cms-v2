import React from 'react';
import { Toast } from 'primereact/toast';
type ResponseApi = {
    mess: string,
    data: any,
    code: string,
    status: number
}

export const HandleApi = async (request: Promise<any>, toast: React.RefObject<Toast> | null) => {
    try {
        console.log('request', request);
        const result = await request;
        const responseApi = result?.data as ResponseApi;
        return HandleResponse(responseApi, toast);
    } catch (error) {
        // handle the error here
        console.error(error);
        // toast?.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Đã có lỗi xảy ra', life: 3000 });
        return HandleResponse(error, toast);
    }
}

const HandleResponse = (response: ResponseApi | any, toast: React.RefObject<Toast> | null) => {
    toast?.current?.show({ severity: 'success', summary: 'Thành công', detail: response?.mess, life: 3000 });
    let status = response?.status;
    let code = response?.code;
    switch (status) {
        case 200: // success
            return response?.data;
        case 201: // created
            return response?.data;
        case 204: // no content
            return response?.data;
        case 400: // bad request
            return response?.data;
        case 401: // unauthorized
            if (code === 'UNAUTHORIZED_ACCESS_TO_GOOGLE_DRIVE') {
                console.log(response?.data)
                // window.location.href = response?.data;
            }
            break;
        case 403: // forbidden -- Client không có quyền truy cập vào tài nguyên cụ thể
            return response?.data;
        case 404: // not found
            return response?.data;
        case 500: // internal server error
            return response?.data;
        default:
            return response?.data;
    };
}