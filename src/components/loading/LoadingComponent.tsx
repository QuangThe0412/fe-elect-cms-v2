import imgLoading from '@/images/loading_ghost.gif';

type PropTypes = {
    loading: boolean;
};

export default function LoadingComponent({ loading }: PropTypes) {
    return (
        <div className={loading ? "loading" : ""}>
            <img src={imgLoading} alt="loading" />
        </div>
    );
}