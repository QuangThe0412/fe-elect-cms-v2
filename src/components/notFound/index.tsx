import { Button } from 'primereact/button';

const NotFound = () => {
    return (
        <>
            <Button label="Link" link onClick={() => window.open('https://react.dev', '_blank')} />
        </>
    );
}

export default NotFound;