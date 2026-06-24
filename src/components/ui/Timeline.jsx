import React from 'react';
import { motion } from 'framer-motion';

function TimelineItem({ title, subtitle, description, isLast = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative pl-7 pb-7 group"
    >
      {!isLast && (
        <span className="absolute left-[7px] top-3 bottom-0 w-px bg-[var(--border)] group-hover:bg-[var(--accent)]/30 transition-colors duration-500" />
      )}

      <span className="absolute left-0 top-[3px] w-[15px] h-[15px] rounded-full border border-[var(--border)] bg-[var(--bg-primary)] flex items-center justify-center transition-all duration-300 group-hover:border-[var(--accent)]/50">
        <span className="w-[5px] h-[5px] rounded-full bg-[var(--border)] group-hover:bg-[var(--accent)] transition-colors duration-300" />
      </span>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 flex flex-col gap-2.5 hover:border-[var(--text-primary)]/15 transition-all duration-300">
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200 leading-snug">
            {title}
          </h4>
          <span className="text-sm font-mono-technical text-[var(--text-primary)]/40">
            {subtitle}
          </span>
        </div>
        {description && description.length > 0 && (
          <ul className="flex flex-col gap-1.5 mt-0.5">
            {description.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-[var(--text-primary)]/60 leading-relaxed">
                <span className="w-1 h-1 rounded-full bg-[var(--accent)]/60 flex-shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default function Timeline() {
  const experiences = [
    {
      title: 'Web Developer at CV. Jogja Media Web',
      subtitle: 'May 2024 — February 2025 · Sleman, DIY',
      description: [
        'Developed landing pages, company profiles, educational platforms, information systems, and e-commerce websites.',
        'Built and improved features for existing systems, including bug fixing and UI enhancements.',
        'Converted UI/UX and Canva designs into responsive websites.',
        'Integrated payment gateways and optimized website performance.',
        'Handled deployment setup and server/RDP configuration.',
      ],
    },
    {
      title: 'Intern Web Developer at CV. Jogja Media Web',
      subtitle: 'March 2023 — September 2023 · Sleman, DIY',
      description: [
        'Built web projects using Laravel during internship.',
        'Developed ZoneBiz company profile website.',
        'Created Mountain Oasis landing page and Karma Store e-commerce website.',
        'Wrote and published articles for a Yogyakarta tourism website.',
      ],
    },
  ];
  

  const educations = [
    {
      title: 'UPN "Veteran" Yogyakarta',
      subtitle: '2025 — Present · Sleman, DIY',
    },
    {
      title: 'SMKN 1 BANTUL',
      subtitle: '2021 — 2024 · Bantul, DIY',
    },
    {
      title: 'SMPN 1 PUNDONG',
      subtitle: '2018 — 2021 · Bantul, DIY',
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-12" id="timeline-container">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-primary)]/45 font-mono-technical">
            Education
          </h3>
        </div>
        <div>
          {educations.map((edu, idx) => (
            <TimelineItem
              key={`edu-${idx}`}
              title={edu.title}
              subtitle={edu.subtitle}
              isLast={idx === educations.length - 1}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-alt)]" />
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-primary)]/45 font-mono-technical">
            Work Experience
          </h3>
        </div>
        <div>
          {experiences.map((exp, idx) => (
            <TimelineItem
              key={`exp-${idx}`}
              title={exp.title}
              subtitle={exp.subtitle}
              description={exp.description}
              isLast={idx === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
