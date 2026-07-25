import React from 'react';
import { Compass, Cpu, Flame } from 'lucide-react';

import "@/styles/global.css";
import HeroSection from "@/components/ui/HeroSection";
import StarfieldBackground from "@/components/ui/StarfieldBackground";

const page = () => {
  return (
    <>
      <StarfieldBackground />
      <div className='home-container' style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />

        <div className='home_sections_container'>
          {/* Focus Areas Section */}
          <section className='home_section delay-1'>
            <h2 className='home_section_title'>Focus Areas</h2>
            <div className='pillars_grid'>
              <div className='pillar_card'>
                <Compass size={24} color="var(--text-primary)" />
                <h3>Sovereign Infrastructure Autonomy</h3>
                <p>Breaking the monopoly of cloud API dependencies. We build secure, local-first products while supporting and contributing to foundational open-source infrastructure.</p>
              </div>
              <div className='pillar_card'>
                <Cpu size={24} color="var(--text-primary)" />
                <h3>From Wrappers to Reasoning Engines</h3>
                <p>No superficial tools. We research and build compound architectures that allow neural networks to plan, reason, and self-correct with mathematical reliability.</p>
              </div>
              <div className='pillar_card'>
                <Flame size={24} color="var(--text-primary)" />
                <h3>The Centenary Mission (2047)</h3>
                <p>Engineering on a decadal horizon. Establishing the premier systems and AI research powerhouse in Bharat by the centenary of Independence.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default page;
