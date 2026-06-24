import React, { useEffect, useState, useRef } from 'react';

function SkillBar({ name, level }) {
  const [width, setWidth] = useState('0%');
  const [hasAnimated, setHasAnimated] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          setWidth(`${level}%`);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [level, hasAnimated]);

  return (
    <div ref={barRef} className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-[var(--text-primary)]/75">
          {name}
        </span>

        <span className="text-sm font-mono-technical text-[var(--text-primary)]/40">
          {level}%
        </span>
      </div>

      <div className="w-full h-2 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          style={{ width }}
          className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-alt)] rounded-full transition-all duration-1000 ease-out"
        />
      </div>
    </div>
  );
}

export default function SkillsBars() {
  const groups = [
    {
      title: 'Frontend',
      skills: [
        { name: 'HTML5 / CSS3', level: 95 },
        { name: 'JavaScript / TypeScript', level: 90 },
        { name: 'React / Next.js', level: 88 },
        { name: 'Tailwind CSS / Bootstrap', level: 90 },
        { name: 'Astro', level: 70 },
      ],
    },
    {
      title: 'Backend',
      skills: [
        { name: 'PHP / Laravel / CodeIgniter', level: 85 },
        { name: 'Node.js / Express.js', level: 82 },
        { name: 'NestJS', level: 75 },
        { name: 'Go', level: 65 },
      ],
    },
    {
      title: 'Database & Tools',
      skills: [
        { name: 'MySQL / PostgreSQL', level: 85 },
        { name: 'MongoDB', level: 78 },
        { name: 'Supabase', level: 80 },
        { name: 'Prisma', level: 75 },
        { name: 'Git / GitHub', level: 88 },
        { name: 'Jest / Postman', level: 80 },
      ],
    },
  ];

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-5"
      id="skills-progress-bars"
    >
      {groups.map((group, i) => (
        <div
          key={i}
          className="flex flex-col gap-5 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--text-primary)]/15 transition-all duration-300"
        >
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />

            <h4 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-primary)]/50 font-mono-technical">
              {group.title}
            </h4>
          </div>

          <div className="flex flex-col gap-5">
            {group.skills.map((skill, idx) => (
              <SkillBar
                key={`${group.title}-${idx}`}
                name={skill.name}
                level={skill.level}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}