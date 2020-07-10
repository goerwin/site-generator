import React from 'react';
import { Helmet } from 'react-helmet';
import favicon from '../images/favicon-32x32.png';
import './App.scss';

interface Props {
    children: React.ReactNode;
}

export default function App({ children }: Props) {
    return (
        <>
            <Helmet>
                <link href={favicon} rel="shortcut icon" />
            </Helmet>
            {children}
        </>
    );
}
