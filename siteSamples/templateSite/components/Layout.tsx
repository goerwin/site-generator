import React from 'react';
import styles from './Layout.module.css';

interface Props {
    children: React.ReactNode;
    activePage?: string;
}

export function Layout({ children, activePage }: Props) {
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
            </header>
            <main>{children}</main>
        </div>
    );
}

export default Layout;
