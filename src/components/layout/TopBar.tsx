"use client"
import Image from 'next/image'
import "@/styles/global.css"
import "@/styles/layout/TopBar.css"
import { useState } from 'react'
import { Menu, UserRound } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'



const TopBar = () => {

  const iconsize = 16;

  return (
    <>
      <div className='flash-message-space'></div>

      <div className="topbar">

        <div className='topbar-left'>
          <Image src="/logo-light.svg" alt="logo" width={100} height={100} />
        </div>

        <div className='topbar-middle'>
          <button>Products</button>
          <button>Articles</button>
          <button>Research</button>
          <button>About Us</button>
          <button>Careers</button>
        </div>

        <div className='topbar-right'>

          <ThemeToggle />

          <div className='menu-n-account'>
            <div className='menu-toggle'>
              <Menu size={iconsize} />
            </div>
            <div className='user-account'>
              <UserRound size={iconsize} />
            </div>
          </div>
        </div>

        <div className='menu-box'>

        </div>

      </div>
    </>
  )
}

export default TopBar