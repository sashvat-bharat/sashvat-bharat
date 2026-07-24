import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Cpu, Flame, Code, BookOpen } from 'lucide-react';

import "@/styles/global.css";
import HeroSection from "@/components/ui/HeroSection";

const page = () => {
  return (
    <>
      <div className='home-container'>
        <HeroSection />

        <div className='home_sections_container'>
          {/* Focus Areas Section */}
          <section className='home_section delay-1'>
            <h2 className='home_section_title'>Focus Areas</h2>
            <div className='pillars_grid'>
              <div className='pillar_card'>
                <Compass size={24} color="var(--text-primary)" />
                <h3>Frontier Systems Research</h3>
                <p>Developing robust reasoning algorithms, distributed agent setups, and scalable compilation mechanisms.</p>
              </div>
              <div className='pillar_card'>
                <Cpu size={24} color="var(--text-primary)" />
                <h3>Developer Ecosystems</h3>
                <p>Designing high-throughput command-line execution interfaces, local cached engines, and compiler integrations.</p>
              </div>
              <div className='pillar_card'>
                <Flame size={24} color="var(--text-primary)" />
                <h3>Open Collaboration</h3>
                <p>Pioneering transparent protocol specifications that optimize standard model context windows and reduce token bloat.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default page;
