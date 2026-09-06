'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

export default function Navbar() {
    const pathname = usePathname();

    type NavItem = {
        href: string;
        label: string;
    };

    const links: NavItem[] = [
        { href: '/', label: 'Home' },
        { href: '/paste', label: 'Paste' },
        { href: '/files', label: 'Files' },
        { href: '/p2p', label: 'P2P Transfer' },
    ];

    function isNavLinkActive(href: string): boolean {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    }

    // Closes the mobile dropdown menu by removing focus from the button
    const handleMobileLinkClick = () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-base-200/80 bg-base-100/80 backdrop-blur-md transition-colors duration-200">
            <div className="navbar max-w-7xl mx-auto px-4 sm:px-6">

                {/* Navbar Start */}
                <div className="navbar-start flex items-center gap-2">
                    {/* Mobile Dropdown Container */}
                    <div className="dropdown lg:hidden">
                        <button
                            tabIndex={0}
                            className="p-2 rounded-xl text-base-content hover:bg-base-200 focus:outline-none transition-colors"
                            aria-label="Open Navigation Menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7"
                                />
                            </svg>
                        </button>

                        {/* Mobile Dropdown Menu */}
                        <ul
                            tabIndex={0}
                            className="dropdown-content mt-3 z-[1] p-3 shadow-2xl bg-base-100 text-base-content rounded-2xl w-56 border border-base-200 outline-none flex flex-col gap-1"
                        >
                            {links.map(({ href, label }) => {
                                const active = isNavLinkActive(href);
                                return (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            onClick={handleMobileLinkClick}
                                            className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                                ? 'bg-primary/15 text-primary font-semibold'
                                                : 'hover:bg-base-200 text-base-content/80 active:bg-base-300'
                                                }`}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <Logo />
                </div>

                {/* Navbar Center */}
                <div className="navbar-center hidden lg:flex">
                    <nav className="flex items-center gap-1 p-1 bg-base-200/60 border border-base-300/40 rounded-full">
                        {links.map(({ href, label }) => {
                            const active = isNavLinkActive(href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${active
                                        ? 'bg-base-100 text-primary font-semibold shadow-md dark:text-primary'
                                        : 'text-base-content/70 hover:text-base-content hover:bg-base-300/30'
                                        }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Navbar End */}
                <div className="navbar-end gap-2.5">
                    <ThemeToggle />
                </div>

            </div>
        </header>
    );
}