import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsData } from '../../utils/projectsData';
import ProjectCard3D from './ProjectCard3D';
import { X, ExternalLink } from 'lucide-react';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const filterCategories = [
  { name: 'All', tag: 'all' },
  { name: 'React / Next.js', tag: 'react' },
  { name: 'PHP / Laravel', tag: 'php' },
  { name: 'TypeScript', tag: 'typescript' }
];

export default function ProjectsGrid({ limit }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(projectsData);

  useEffect(() => {
    let result = projectsData;

    if (selectedFilter !== 'all') {
      result = projectsData.filter((project) => {
        const tagsLower = project.tags.map((t) => t.toLowerCase());
        if (selectedFilter === 'react') {
          return tagsLower.includes('react') || tagsLower.includes('react.js') || tagsLower.includes('next.js');
        }
        if (selectedFilter === 'php') {
          return tagsLower.includes('php') || tagsLower.includes('laravel') || tagsLower.includes('codeigniter');
        }
        if (selectedFilter === 'typescript') {
          return tagsLower.includes('typescript');
        }
        return true;
      });
    }

    if (limit) {
      result = result.slice(0, limit);
    }

    setFilteredProjects(result);
  }, [selectedFilter, limit]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  return (
    <div className="w-full flex flex-col gap-8" id="projects-grid-section">
      {/* <div className="flex flex-wrap gap-2 mb-6">
          {filterCategories.map((cat) => (
            <button key={cat.tag}
              onClick={() => setSelectedFilter(cat.tag)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 ${
                selectedFilter === cat.tag
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent font-semibold'
                  : 'bg-transparent text-[var(--text-primary)]/55 border-[var(--border)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]/25 hover:bg-[var(--border)]'
              }`}
            >
              {cat.name}
            </button>
          ))}
      </div> */}

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ProjectCard3D
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              data-modal="true"
              className="relative w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl z-50 flex flex-col max-h-[90vh]"
              style={{ cursor: 'default' }}
            >
              <div className="relative aspect-video w-full border-b border-[var(--border)]">
                <img
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/10"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 overflow-y-auto">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                    {selectedProject.title}
                  </h3>
                  <span className="text-xs text-[var(--accent)] font-mono-technical">
                    Project Showcase
                  </span>
                </div>

                <p className="text-base text-[var(--text-primary)]/80 leading-relaxed text-justify">
                  {selectedProject.desc}
                </p>

                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-xs font-mono-technical text-[var(--text-primary)]/50">Tech Stack:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.tags.map((tag, i) => (
                      <span key={`modal-${selectedProject.title}-tag-${i}`} class="text-xs font-mono-technical px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text-primary)]/55 bg-[var(--bg-surface)]/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <a
                    href={selectedProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Live Site
                  </a>
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[var(--border)] bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-semibold transition-all duration-300"
                    >
                      <GithubIcon />
                      GitHub Repository
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
