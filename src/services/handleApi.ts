import React from 'react';
import { Toast } from 'primereact/toast';

export const HandleApi = async (request: Promise<any>, toast: React.RefObject<Toast> | null) => {
    try {
        return HandleResponse(await request, toast);
    } catch (error: any) {
        console.error(error);
        return HandleResponse(error?.response, toast);
    }
}

const HandleResponse = (response: Response | any, toast: React.RefObject<Toast> | null) => {
    let data = response?.data?.data;
    let status = response?.status;
    let code = response?.data?.code;
    let mess = response?.data?.mess;
    let summaryTitle = 'Thất bại';
    let severityType: "success" | "info" | "warn" | "error";
    switch (status) {
        case 200: // success
        case 201: // created
            severityType = 'success';
            summaryTitle = 'Thành công';
            break;
        case 204: // no content
            severityType = 'info';
            break;
        case 400: // bad request
        case 401: // unauthorized
        case 403: // forbidden
        case 404: // not found
            severityType = 'error';
            break;
        case 500: // internal server error
            severityType = 'error';
            break;
        default:
            severityType = 'info';
            break;
    };
    toast?.current?.show({ severity: severityType, summary: summaryTitle, detail: mess, life: 3000 });
    return {
        data: data,
        status: status,
        code: code,
        mess: mess
    };
}