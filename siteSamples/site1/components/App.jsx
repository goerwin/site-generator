const React = require('react');
const { Helmet } = require('react-helmet');
const favicon = require('../images/favicon-32x32.png');
require('./App.css');

function App({ children }) {
    return (
        <>
            <Helmet>
                <link href={favicon} rel="shortcut icon" />
            </Helmet>
            {children}
        </>
    );
}

module.exports = App;
