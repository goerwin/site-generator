import React from 'react';
import { Helmet } from 'react-helmet';
import App from '../components/App';
import Layout from '../components/Layout';
import './index.css';

export default function Index() {
    return (
        <App>
            <Layout activePage="index">
                <Helmet>
                    <title>Index page</title>
                </Helmet>
                <h1>This is the index page</h1>
                <a href="/page-2">Go to page-2</a>
            </Layout>
        </App>
    );
}
