const React = require('react');
const styles = require('./Layout.module.scss');

function Layout({ children, activePage }) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <a
                    href="/"
                    className={
                        activePage === 'index' ? styles.headerActive : ''
                    }
                >
                    Home
                </a>
                <a
                    href="/page-2"
                    className={
                        activePage === 'page2' ? styles.headerActive : ''
                    }
                >
                    Page 2
                </a>
                <a href="/blog/post-title">Blog post</a>
            </header>
            <main>{children}</main>
        </div>
    );
}

module.exports = Layout;
