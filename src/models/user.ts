export interface User {
    id?: number;
    username?: string;
    password?: string;
    phone?: string;
    ngaySinh?: Date | null;
    admin?: boolean;
    cashier?: boolean;
    saler?: boolean;
    inventory?: boolean;
    guest?: boolean;
    createDate?: Date| null;
    modifyDate?: Date| null;
    Deleted?: boolean;
}