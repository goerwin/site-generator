import React from 'react';
import { Helmet } from 'react-helmet';
import App from '../components/App';
import Layout from '../components/Layout';

function Page2() {
    return (
        <App>
            <Layout activePage="page2">
                <Helmet>
                    <title>Page 2</title>
                </Helmet>
                <h1>This is the page 2</h1>
                <a href="/">Go to index page</a>
            </Layout>
        </App>
    );
}

export default Page2;
