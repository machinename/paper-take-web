'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, 
    // useSearchParams, 
    useRouter } from 'next/navigation';

import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress';
import {
    AccountBoxOutlined, ArchiveOutlined, CircleOutlined, Close, DeleteOutlined, LoginOutlined,
    LogoutOutlined, MenuOpen, Refresh, Search,
    // SettingsOutlined, 
    Archive, Delete,
    HelpCenter,
    HelpCenterOutlined,
    Circle,
    // Settings,
    Lightbulb,
    LightbulbOutlined,
    Settings,
    SettingsOutlined
} from '@mui/icons-material';

import { useAppContext } from '../providers/AppProvider';
import { useAuthContext } from '../providers/AuthProvider';
import styles from "./Header.module.css";
import { StyledIconButton } from './Styled';

export default function Header() {
    // Contexts
    const { isLoadingAuth, logOut, user } = useAuthContext();
    const {
        searchTerm,
        handleSearch, 
        handleCloseSearch, 
        isLoadingApp,
        fetchData,
    } = useAppContext();


    // State Variables
    const [title, setTitle] = useState('');
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const pathname = usePathname();
    // const searchParams = useSearchParams();
    const router = useRouter();

    const accountMenuRef = useRef<HTMLDivElement>(null);
    const accountButtonRef = useRef<HTMLButtonElement>(null);
    const navMenuRef = useRef<HTMLDivElement>(null);
    const navButtonRef = useRef<HTMLButtonElement>(null);
    const settingsMenuRef = useRef<HTMLDivElement>(null);
    const settingsButtonRef = useRef<HTMLButtonElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchButton = () => {
        router.push('/search');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        router.push('/search');
        handleSearch(event.target.value);

    }

    const handleOnFocus = () => {
        router.push('/search');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleLogOut = async () => {
        try {
            await logOut();
            setIsAccountMenuOpen(false);
        } catch (error) {
            console.log(error);
        }
    };
    const handleCloseButton = () => {
        router.push('/ideas');
        handleCloseSearch();
        window.scrollTo({ top: 0 });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
                if (!navButtonRef.current?.contains(event.target as Node)) {
                    setIsNavMenuOpen(false);
                }
            }
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                if (!accountButtonRef.current?.contains(event.target as Node)) {
                    setIsAccountMenuOpen(false);
                }
            }
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
                if (!settingsButtonRef.current?.contains(event.target as Node)) {
                    setIsSettingsMenuOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [accountButtonRef, accountMenuRef, navButtonRef, navMenuRef, settingsButtonRef, settingsMenuRef]);


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        handleCloseSearch();
        switch (pathname) {
            case '/account':
                setTitle('Account');
                break;
            case '/archive':
                setTitle('Archive');
                break;
            case '/help':
                setTitle('Help');
                break;
            case '/ideas':
                setTitle('Paper Take');
                break;
            case '/search':
                setTitle('Paper Take');
                break;
            case '/trash':
                setTitle('Trash');
                break;
            default:
                setTitle('Paper Take');
        }
    }, [handleCloseSearch, pathname]);

    useEffect(() => {
        const url = new URL(window.location.href);
        if (searchTerm) {
            url.searchParams.set('term', searchTerm);
        } else {
            url.searchParams.delete('term');
        }
        window.history.replaceState({}, '', url);
        console.log('URL updated with search term: ', searchTerm);
        // console.log('Filtered items: ', newFiltered);
    }, [searchTerm]);


    if (pathname === '/') {
        return null;
    }

    return (
        <Suspense>
            <header className={isScrolled ? styles.headerScrolled : styles.header}>
                {/* Nav Leading */}
                <div className={styles.headerLeading}>
                    <div className={styles.navAnchor}>
                        <StyledIconButton ref={navButtonRef} onClick={() => setIsNavMenuOpen(prev => !prev)}>
                            {isNavMenuOpen ? <Close /> : <MenuOpen />}
                        </StyledIconButton>
                        {isNavMenuOpen && (
                            <nav className={styles.menu} ref={navMenuRef}>
                                <Link className={pathname === '/ideas' ? styles.navLinkActive : styles.navLink} href='/ideas'>
                                    {pathname === '/ideas' ? <Lightbulb /> : <LightbulbOutlined />} Ideas
                                </Link>
                                <Link className={pathname === '/archive' ? styles.navLinkActive : styles.navLink} href='/archive'>
                                    {pathname === '/archive' ? <Archive /> : <ArchiveOutlined />} Archive
                                </Link>
                                <Link className={pathname === '/trash' ? styles.navLinkActive : styles.navLink} href='/trash'>
                                    {pathname === '/trash' ? <Delete /> : <DeleteOutlined />} Trash
                                </Link>
                                <Link className={pathname === '/help' ? styles.navLinkActive : styles.navLink} href='/help'>
                                    {pathname === '/help' ? <HelpCenter /> : <HelpCenterOutlined />} Help
                                </Link>
                            </nav>
                        )}
                    </div>
                    <div className={styles.headerTitle}>
                        <p>{title ? title : 'Paper Take'}</p>
                    </div>
                    {/* Nav Input */}
                    <div className={styles.searchInputContainer}>
                        <StyledIconButton onClick={handleSearchButton}>
                            <Search />
                        </StyledIconButton>
                        <input
                            autoComplete="off"
                            className={styles.searchInput}
                            id='headerInput'
                            type="text"
                            placeholder='Search...'
                            onFocus={handleOnFocus}
                            value={searchTerm}
                            onChange={(event) => handleOnChange(event)}
                            ref={inputRef}
                        />
                        {pathname === '/search' && (
                            <StyledIconButton onClick={handleCloseButton}>
                                <Close />
                            </StyledIconButton>
                        )}
                    </div>
                </div>
                {/* Nav Trailing */}
                <div className={styles.headerTrailing}>
                    {
                        user && ((isLoadingApp || isLoadingAuth) ? (
                            <StyledIconButton>
                                <CircularProgress size={20} />
                            </StyledIconButton>
                        ) : (
                            <StyledIconButton onClick={fetchData}>
                                <Refresh />
                            </StyledIconButton>
                        ))
                    }
                    <div className={styles.settingsAnchor}>
                        <StyledIconButton
                            ref={settingsButtonRef}
                            onClick={() => setIsSettingsMenuOpen(prev => !prev)}>
                            {isSettingsMenuOpen ? <Settings /> : <SettingsOutlined />}
                        </StyledIconButton>
                        {isSettingsMenuOpen && (
                            <nav className={styles.menu} ref={settingsMenuRef}>
                                <div className={styles.navLink}>
                                    Todo - Settings Menu
                                </div>
                                <div className={styles.navLink}>
                                    Todo - Project
                                </div>
                                <div className={styles.navLink}>
                                    Todo - Drag Drop Grid
                                </div>
                                <div className={styles.navLink}>
                                    Todo - Too Much
                                </div>
                            </nav>
                        )}
                    </div>
                    <div className={styles.accountAnchor}>
                        <StyledIconButton ref={accountButtonRef} onClick={() => setIsAccountMenuOpen(prev => !prev)}>
                            {isAccountMenuOpen ? <Circle /> : <CircleOutlined />}
                        </StyledIconButton>
                        {isAccountMenuOpen && (
                            <nav className={styles.menu} ref={accountMenuRef}>
                                {user && (
                                    <Link className={styles.navLink}
                                        onClick={() => setIsAccountMenuOpen(false)} href='/account'>
                                        <AccountBoxOutlined /> Account
                                    </Link>
                                )}
                                {user ? (
                                    <Link className={styles.navLink} href='/' onClick={handleLogOut}>
                                        <LogoutOutlined /> Log Out
                                    </Link>
                                ) : (
                                    <Link className={styles.navLink} href='/' onClick={() => setIsAccountMenuOpen(false)}>
                                        <LoginOutlined /> Login
                                    </Link>
                                )}
                            </nav>
                        )}
                    </div>
                </div>
            </header>
        </Suspense>
    );
}