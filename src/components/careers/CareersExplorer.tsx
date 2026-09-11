'use client';

import { ArrowUpRight, Check, Copy, Globe, Mail, PauseCircle, Search, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface CareerRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  tags: string[];
}

interface CareersExplorerProps {
  roles: CareerRole[];
  isHiring?: boolean;
}

export default function CareersExplorer({ roles, isHiring = true }: CareersExplorerProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const departments = useMemo(() => {
    const list = ['All'];
    const unique = new Set<string>();
    for (const r of roles) {
      if (r.department) unique.add(r.department);
    }
    return [...list, ...Array.from(unique)];
  }, [roles]);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesDept =
        selectedDepartment === 'All' ||
        role.department.toLowerCase() === selectedDepartment.toLowerCase();

      if (!matchesDept) return false;
      if (!query) return true;

      const titleMatch = role.title.toLowerCase().includes(query);
      const descMatch = role.description.toLowerCase().includes(query);
      const deptMatch = role.department.toLowerCase().includes(query);
      const levelMatch = role.level.toLowerCase().includes(query);
      const tagMatch = role.tags.some((t) => t.toLowerCase().includes(query));

      return titleMatch || descMatch || deptMatch || levelMatch || tagMatch;
    });
  }, [roles, selectedDepartment, searchQuery]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('careers@sashvat.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API unavailable
    }
  };

  const resetFilters = () => {
    setSelectedDepartment('All');
    setSearchQuery('');
  };

  return (
    <div className='careers_explorer'>
      {isHiring ? (
        <>
          {/* Filter and Search Controls */}
          <div className='careers_filter_bar'>
            <div className='careers_dept_filters'>
              {departments.map((dept) => (
                <button
                  key={dept}
                  type='button'
                  className={selectedDepartment === dept ? 'active' : ''}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>

            <div className='careers_search_wrapper'>
              <Search size={16} className='careers_search_icon' />
              <input
                type='text'
                placeholder='Search roles, technologies, or keywords...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label='Search open roles'
              />
            </div>
          </div>

          {/* Role Listings */}
          {filteredRoles.length > 0 ? (
            <div className='career_roles_grid'>
              {filteredRoles.map((role) => {
                const subject = encodeURIComponent(`Application: ${role.title}`);
                const body = encodeURIComponent(
                  `Hi Sashvat Bharat team,\n\nI would like to apply for the ${role.title} role.\n\nPortfolio / GitHub / Papers:\nResume / Relevant Work:\n\nWhy Sashvat Bharat:\n`,
                );
                const mailtoUrl = `mailto:careers@sashvat.com?subject=${subject}&body=${body}`;

                return (
                  <div className='career_role_card' key={role.id}>
                    <div className='role_header'>
                      <div className='role_badges'>
                        <span className='role_badge_department'>{role.department}</span>
                        <span className='role_badge_level'>{role.level}</span>
                      </div>

                      <div className='role_meta'>
                        <span className='role_meta_item'>
                          <Globe size={14} className='role_meta_icon' />
                          {role.location}
                        </span>
                        <span className='role_meta_bullet'>•</span>
                        <span className='role_meta_item'>{role.type}</span>
                      </div>
                    </div>

                    <div className='role_body'>
                      <h3 className='role_title'>{role.title}</h3>
                      <p className='role_description'>{role.description}</p>
                    </div>

                    <div className='role_tags_group'>
                      {role.tags.map((tag) => (
                        <span className='role_tech_tag' key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className='role_footer'>
                      <a
                        href={mailtoUrl}
                        className='role_apply_button'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <span>Apply for Role</span>
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='careers_empty_state'>
              <div className='careers_empty_icon'>
                <SearchX size={28} />
              </div>
              <h3>No matching roles found</h3>
              <p>
                No positions matched your criteria. Try adjusting your search query or department
                filter.
              </p>
              <button type='button' className='careers_reset_btn' onClick={resetFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </>
      ) : (
        /* Hiring Paused State */
        <div className='hiring_paused_card'>
          <div className='paused_status_pill'>
            <PauseCircle size={14} />
            <span>Hiring Currently Paused</span>
          </div>
          <h3>No Active Openings Right Now</h3>
          <p>
            We are currently executing with our core team and have temporarily paused active
            recruitment for open positions. We update our listings periodically as our research and
            products expand.
          </p>
        </div>
      )}

      {/* Spontaneous / Fellowship Application Card */}
      <div className='careers_spontaneous_section'>
        <div className='spontaneous_inner'>
          <div className='spontaneous_badge'>
            {isHiring
              ? 'Speculative Applications & Fellowships'
              : 'General & Speculative Inquiries'}
          </div>
          <h2>
            {isHiring ? "Don't see your exact role?" : 'Exceptional minds are always welcome'}
          </h2>
          <p>
            {isHiring
              ? 'We frequently design bespoke roles for exceptional systems programmers, compiler engineers, and researchers. If your work pushes boundaries in deterministic agents, distributed runtimes, or sovereign computing, we want to hear from you.'
              : 'While specific role openings are currently on pause, our threshold for extraordinary researchers, compiler engineers, and systems hackers never changes. If your work breaks new ground in autonomous intelligence or sovereign computing, we welcome your introduction.'}
          </p>

          <div className='spontaneous_actions'>
            <a
              href='mailto:careers@sashvat.com?subject=General%20Inquiry%20-%20Sashvat%20Bharat&body=Hi%20Sashvat%20Bharat%20team,%0A%0AI%20am%20interested%20in%20connecting%20regarding%20future%20opportunities.%0A%0AGitHub%20/%20Portfolio:%20%0AResume%20/%20Background:%20%0A%0AWhat%20I%20build:%20'
              className='spontaneous_email_btn'
            >
              <Mail size={16} />
              <span>Email careers@sashvat.com</span>
            </a>

            <button
              type='button'
              className='spontaneous_copy_btn'
              onClick={handleCopyEmail}
              title='Copy careers email'
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Email'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
