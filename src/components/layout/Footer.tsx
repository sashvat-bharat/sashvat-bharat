"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import "@/styles/global.css";
import "@/styles/layout/Footer.css";
import { ThemeToggle } from '../ui/ThemeToggle';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer_grid">
        {/* Brand Column */}
        <div className="footer_brand_col">
          <Link href="/" className="footer_logo_wrapper">
            <Image className="logo-light" src="/logo/logo-light.svg" alt="logo" width={100} height={100} />
            <Image className="logo-dark" src="/logo/logo-dark.svg" alt="logo" width={100} height={100} />
          </Link>
          <p className="footer_tagline">
            Next-generation AI/ML systems and autonomous intelligence. Built for breakthroughs.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="footer_links_col">
          <h4 className="footer_col_title">Company</h4>
          <div className="footer_links_list">
            <Link href="/about" className="footer_link">About Us</Link>
            <Link href="/careers" className="footer_link">Careers</Link>
            <Link href="/products" className="footer_link">Products</Link>
          </div>
        </div>

        {/* Links Column 2 */}
        <div className="footer_links_col">
          <h4 className="footer_col_title">Resources</h4>
          <div className="footer_links_list">
            <Link href="/research" className="footer_link">Research</Link>
            <Link href="/articles" className="footer_link">Articles</Link>
            <a href="https://github.com/sashvat-bharat" target="_blank" rel="noopener noreferrer" className="footer_link">Github</a>
          </div>
        </div>

        {/* Right Column (Newsletter & Theme) */}
        <div className="footer_right_col">
          <h4 className="footer_col_title">Stay Updated</h4>
          <p className="footer_tagline" style={{ margin: 0 }}>
            Subscribe to our research digest and product announcements.
          </p>
          <form className="footer_newsletter_form" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="footer_newsletter_input" 
              required 
            />
            <button type="submit" className="footer_newsletter_btn">Subscribe</button>
          </form>
          
          <div style={{ marginTop: '8px' }}>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="footer_bottom">
        <p className="footer_copyright">
          © {new Date().getFullYear()} Sashvat Bharat. All rights reserved.
        </p>
        <div className="footer_bottom_links">
          <Link href="/legal" className="footer_bottom_link_item">Legal</Link>
          <Link href="/legal/privacy-policy" className="footer_bottom_link_item">Privacy Policy</Link>
          <Link href="/legal/terms" className="footer_bottom_link_item">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
