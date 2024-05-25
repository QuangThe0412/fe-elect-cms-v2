import erroImage from '../assets/images/error.jpg';

export function formatCurrency(value: number | string) {
    if (value) {
        return value.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).replace('₫', '');
    } else {
        return value;
    }
}

export function validateEmail(input: HTMLInputElement) {
    if (input.type === 'email' || input.name === 'email') {
        if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/.test(input.value.trim())) {
            return false;
        }
    } else {
        if (input.value.trim() === '') {
            return false;
        }
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

// export const linkImageGG = 'https://drive.google.com/uc?export=view&id=';
export const linkImageGG = 'https://lh3.google.com/u/0/d/';