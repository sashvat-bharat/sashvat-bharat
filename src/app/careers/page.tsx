import React from 'react';
import type { Metadata } from 'next';
import { ArrowRight, Briefcase, Compass, Cpu, Flame, Target } from 'lucide-react';

import "@/styles/global.css";
import "@/styles/careers/careers.css";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Sashvat Bharat team and help us build the next generation of autonomous intelligence and AI systems.",
  alternates: {
    canonical: '/careers',
  },
};

interface JobPosition {
  title: string;
  department: string;
  location: string;
  type: string;
}

const jobOpenings: { department: string; roles: JobPosition[] }[] = [
  {
    department: "Research & Science",
    roles: [
      {
        title: "AI Research Scientist - Agent Architectures",
        department: "Research & Science",
        location: "Remote",
        type: "Full-time"
      }
    ]
  },
  {
    department: "Engineering",
    roles: [
      {
        title: "Senior Systems Engineer - Rust",
        department: "Engineering",
        location: "Remote",
        type: "Full-time"
      },
      {
        title: "Frontend Engineer - AI Interfaces",
        department: "Engineering",
        location: "Remote",
        type: "Full-time"
      }
    ]
  }
];

const page = () => {
  return (
    <div className='home-container'>
      
      <div className='careers_container'>
        {/* Hero Section */}
        <section className='careers_hero'>
          <h1>Let&apos;s build the breakthroughs together.</h1>
          <p>
            We are a group of researchers, engineers, and builders dedicated to build cool SAAS and Agentic AI Systems Join us in building what comes next.
          </p>
        </section>

        {/* Culture / Values */}
        <section className='culture_section'>
          {/* <h2 className='section_title'>Our Core Principles</h2> */}
          <div className='culture_grid'>
            <div className='culture_card'>
              <Compass size={24} color="var(--text-primary)" />
              <h3>High Autonomy</h3>
              <p>We trust our team to own projects from conception to launch. You choose the tools, set the milestones, and deliver excellence.</p>
            </div>
            <div className='culture_card'>
              <Cpu size={24} color="var(--text-primary)" />
              <h3>Rigor & Speed</h3>
              <p>We combine academic discipline with high-velocity software engineering. We ship fast but build foundational technologies meant to last.</p>
            </div>
            <div className='culture_card'>
              <Flame size={24} color="var(--text-primary)" />
              <h3>Mission First</h3>
              <p>Every line of code and research paper we write directly advances the boundaries of what autonomous systems can achieve.</p>
            </div>
          </div>
        </section>

        {/* Open Roles */}
        {/*
        <section className='positions_section'>
          <h2 className='section_title'>Open Roles</h2>
          
          {jobOpenings.map((group, idx) => (
            <div className='department_group' key={idx}>
              <h3 className='department_title'>{group.department}</h3>
              <div className='positions_list'>
                {group.roles.map((role, rIdx) => (
                  <div className='position_card' key={rIdx}>
                    <div className='position_info'>
                      <h4 className='position_title'>{role.title}</h4>
                      <div className='position_meta'>
                        <span>{role.location}</span>
                        <span>•</span>
                        <span className='position_tag'>{role.type}</span>
                      </div>
                    </div>
                    <button className='apply_btn'>Apply Now</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
        */}

        <section className='positions_section' style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '20px', gap: '12px' }}>
          <h2 className='section_title' style={{ margin: 0 }}>Open Roles</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            There are currently no active openings. We regularly update our listings, so please check back soon or submit a spontaneous application below.
          </p>
        </section>

        {/* Spontaneous Application */}
        <section className='spontaneous_card'>
          <Target size={36} color="var(--text-primary)" />
          <h2>Don&apos;t see the perfect role?</h2>
          <p>
            We are always looking for exceptional talent. If you have a background in compiler design, LLM optimization, agent design, or distributed systems, reach out to us.
          </p>
          <p>
            Send your resume and a brief intro to <a href="mailto:careers@sashvat.com" className='contact_link'>careers@sashvat.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}

export default page;
