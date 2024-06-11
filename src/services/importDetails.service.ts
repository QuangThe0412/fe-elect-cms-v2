import axios from 'axios';
import { paths } from '@/constants/api';
import { ImportDetails } from '@/models';

export const ImportDetailsService = {
    getImportDetails() {
        return axios.get(paths.importDetails);
    },

    getImportDetail(id: number) {
        return axios.get(paths.importDetails + `/${id}`);
    },

    createImportDetail(importDetail: ImportDetails) {
        return axios.post(paths.importDetails, importDetail);
    },

    updateImportDetail(id: number, updatedImportDetail: ImportDetails) {
        return axios.put(paths.importDetails + `/${id}`, updatedImportDetail);
    },

    deleteImportDetail(id: number) {
        return axios.delete(paths.importDetails + `/${id}`);
    }
}