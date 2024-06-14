import { linkImageGGEndpoint } from '@/config';
import erroImage from '../assets/images/error.jpg';
import { RouteArray } from '../routes/routes'
import { STATUS_ENUM } from '@/constants';

export function formatCurrency(value: number | string | undefined) {
    if (value) {
        return value.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    } else {
        return value;
    }
}

export function formatNumber(value: number | string | undefined) {
    if (value) {
        return value.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).replace('₫', '').replace(/,/g, '');
    } else {
        return value;
    }
}

export function validateEmail(input: string) {
    if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/.test(input.trim())) {
        return false;
    }
    return true;
}

export function validatePhone(input: string) {
    if (!/^\d{10,11}$/.test(input.trim())) {
        return false;
    }
    return true;
}

export function validatePassword(input: string) {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(input.trim())) {
        return false;
    }
    return true;
}

export const handleImageError = (event: any) => {
    event.target.src = erroImage;
};

export const convertFormData = async (data: any, file?: any) => {
    const formData = new FormData();
    const date = new Date();

    for (const key of Object.keys(data)) {
        let value = data[key];
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

        if (value instanceof Date) {
            formData.append(capitalizedKey, date.toISOString());
        } else {
            formData.append(capitalizedKey, String(value) || '');
        }
    }

    if (file) {
        formData.append('file', file.files[0]);
    }

    return formData;
};

export const trimString = (value: any): any => {
    if (typeof value === 'string') {
        return value.trim().replace(/ +/g, ' ');
    }
    return value;
}

export function checkRoleAccess(userRole: string[], paths: string) {
    let routeMap = RouteArray.find(route => route.path === paths);
    if (!routeMap) {
        return false;
    }

    let checkAccess = routeMap.roles.some(role => userRole.includes(role));
    return checkAccess;
}

export const bodyDate = (rowData: any, options: { field: keyof any }) => {
    const field = options.field;
    const dateValue = rowData[field];
    if (dateValue) {
        const date = new Date(dateValue as string);
        return date instanceof Date ? date.toLocaleDateString('vi-VN') : '';
    }
    return '';
}

export const IsPendingStatus = (status: number) => {
    return status === STATUS_ENUM.PENDING;
};

// export const linkImageGG = 'https://drive.google.com/uc?export=view&id=';
export const linkImageGG = linkImageGGEndpoint;