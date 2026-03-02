"use client"
import Image from 'next/image'
import "@/styles/global.css"
import "@/styles/layout/TopBar.css"
import { useState } from 'react'
import { Menu, X } from 'lucide-react'


const TopBar = () => {

  const [menuState, setMenuState] = useState<'initial' | 'open' | 'closed'>('initial');

  const toggleMenu = () => {
    setMenuState(prev => prev === 'open' ? 'closed' : 'open');
  };

  return (
    <>

      <div className='flash-message-space'></div>

      <div className="topbar">
        <div className='topbar-left'>
          <Image src="/logo.svg" alt="logo" width={100} height={100} />
        </div>

        <div className='topbar-middle'>
          <button>Research</button>
          <button>Articles</button>
          <button>Products</button>
          <button>About Us</button>
          <button>Careers</button>
        </div>

        <div className='topbar-right'>
          <button className='login-btn'>Log in</button>
          <button className='signup-btn'>Sign up</button>
        </div>

        <button
          className={`menu-toggle ${menuState === 'open' ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <div className="hamburger-box">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

      </div>

      <div className={`menu-box ${menuState}`}>
        <button>Research</button>
        <button>Articles</button>
        <button>Products</button>
        <button>About Us</button>
        <button>Careers</button>
      </div>

    </>
  )
}

export default TopBar