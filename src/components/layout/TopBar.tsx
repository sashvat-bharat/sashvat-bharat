"use client"
import Image from 'next/image'
import Link from 'next/link'
import "@/styles/global.css"
import "@/styles/layout/TopBar.css"
import { useState } from 'react'
import { Menu, UserRound } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'



const TopBar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  }



  const iconsize = 16;

  return (
    <>

      <div className="topbar">

        <Link href="/" className='topbar-left'>
          <Image className="logo-light" src="logo/logo-light.svg" alt="logo" width={100} height={100} />
          <Image className="logo-dark" src="logo/logo-dark.svg" alt="logo" width={100} height={100} />
        </Link>

        <div className='topbar-middle'>
          <button>Products</button>
          <button>Articles</button>
          <Link href="/research">
            <button>Research</button>
          </Link>
          <button>About Us</button>
          <button>Careers</button>
        </div>

        <div className='topbar-right'>

          <div className='theme-toggle-container'>
            <ThemeToggle />
          </div>

          <div className='menu-n-account'>
            <div className='menu-toggle' onClick={handleMenuToggle}>
              <Menu size={iconsize} className='icon' />
            </div>
            <div className='user-account'>
              <UserRound size={iconsize} className='icon' />
            </div>
          </div>
        </div>

        <div className={`menu-box ${menuOpen ? 'open' : 'closed'}`}>

          <button>Products</button>
          <button>Articles</button>
          <Link href="/research"><button>Research</button></Link>
          <button>About Us</button>
          <button>Careers</button>

          <div className='line-separator'></div>

          <div className='theme-toggle-container-under-menubox'>
            <ThemeToggle />
          </div>

        </div>

      </div>
    </>
  )
}

export default TopBar