import React from 'react';
import { Helmet } from 'react-helmet';
import App from '../../components/App';

export default function Post() {
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
