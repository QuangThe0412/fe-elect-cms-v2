import React from 'react';
import imgLoading from '@/images/loading_dog.gif';
import styles from './loading.module.css';

type PropTypes = {
    loading: boolean;
};

export default function LoadingComponent({ loading }: PropTypes) {
    if (!loading) {
        return null; // Don't render anything if not loading
    }

    return (
        <div className={styles.loadingOverlay}>
            <img src={imgLoading} alt="loading" />
        </div>
    );
}