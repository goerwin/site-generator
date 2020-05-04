const React = require('react');
const { Helmet } = require('react-helmet');
const App = require('../components/App');
const Layout = require('../components/Layout');

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

module.exports = Page2;
