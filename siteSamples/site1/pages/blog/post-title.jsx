const React = require('react');
const { Helmet } = require('react-helmet');
const App = require('../../components/App');

function Post() {
    return (
        <App>
            <Helmet>
                <title>Post title</title>
            </Helmet>
            <a href="/">Go to index page</a>
            <h1>This is the post title</h1>
            <p>Content of the post</p>
        </App>
    );
}

module.exports = Post;
