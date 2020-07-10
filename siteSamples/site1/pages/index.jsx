const React = require('react');
const { Helmet } = require('react-helmet');
const App = require('../components/App');
const Layout = require('../components/Layout');
require('./index.scss');

function Index() {
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

module.exports = Index;
