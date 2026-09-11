'use client';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/global.css';
import '@/styles/layout/TopBar.css';
import { Menu, UserRound } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';

const TopBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Close drawer on route change
  useEffect(() => {
    if (pathname) {
      setMenuOpen(false);
    }
  }, [pathname]);

  // Close drawer on click anywhere or Escape key
  useEffect(() => {
    if (!menuOpen) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (toggleButtonRef.current?.contains(event.target as Node)) {
        return;
      }
      setMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('click', handleDocumentClick);
      document.addEventListener('keydown', handleKeyDown);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const iconsize = 16;

  return (
    <div className='topbar'>
      {menuOpen && <div className='menu-backdrop' onClick={closeMenu} aria-hidden='true' />}

      <Link href='/' className='topbar-left' onClick={closeMenu}>
        <Image
          className='logo-light'
          src='/logo/logo-light.svg'
          alt='logo'
          width={100}
          height={100}
        />
        <Image
          className='logo-dark'
          src='/logo/logo-dark.svg'
          alt='logo'
          width={100}
          height={100}
        />
      </Link>

      <div className='topbar-middle'>
        <Link href='/products'>
          <button type='button'>Products</button>
        </Link>
        <Link href='/articles'>
          <button type='button'>Articles</button>
        </Link>
        <Link href='/research'>
          <button type='button'>Research</button>
        </Link>
        <Link href='/about'>
          <button type='button'>About</button>
        </Link>
        <Link href='/careers'>
          <button type='button'>Careers</button>
        </Link>
      </div>

      <div className='topbar-right'>
        <div className='theme-toggle-container'>
          <ThemeToggle />
        </div>

        <div className='menu-n-account'>
          <button
            ref={toggleButtonRef}
            type='button'
            className='menu-toggle'
            onClick={handleMenuToggle}
            aria-label='Toggle menu'
            aria-expanded={menuOpen}
          >
            <Menu size={iconsize} className='icon' />
          </button>
          <div className='user-account'>
            <UserRound size={iconsize} className='icon' />
          </div>
        </div>
      </div>

      <div
        className={`menu-box ${menuOpen ? 'open' : 'closed'}`}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      >
        <Link href='/products' onClick={closeMenu}>
          <button type='button'>Products</button>
        </Link>
        <Link href='/articles' onClick={closeMenu}>
          <button type='button'>Articles</button>
        </Link>
        <Link href='/research' onClick={closeMenu}>
          <button type='button'>Research</button>
        </Link>
        <Link href='/about' onClick={closeMenu}>
          <button type='button'>About</button>
        </Link>
        <Link href='/careers' onClick={closeMenu}>
          <button type='button'>Careers</button>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
