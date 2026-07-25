import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import "@/styles/global.css";
import "@/styles/not-found.css";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The requested page could not be found.",
};

export default function NotFound() {
  return (
    <div className="home-container">
      <div className="not_found_container">
        <h1 className="not_found_code">404</h1>
        <h2 className="not_found_title">Unresolved Endpoint</h2>
        <p className="not_found_desc">
          The path you are looking for does not exist in our namespace. It may have been relocated, deprecated, or never instantiated.
        </p>
        <Link href="/" className="not_found_btn">
          <span>Return Home</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
