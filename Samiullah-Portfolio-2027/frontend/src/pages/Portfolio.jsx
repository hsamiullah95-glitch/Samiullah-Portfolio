
import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Code2,
  Globe,
  Database,
  Network,
  Monitor,
  Layers3,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FolderOpen,
  CheckCircle2,
  Clock3

} from 'lucide-react';

import './Portfolio.css';

const projects = [
  {
    id: 1,
    title: 'Kandahar University Dormitory System',
    category: 'React',
    type: 'Academic Project',
    status: 'In Progress',
    description:
      'A comprehensive dormitory management system designed to manage students, rooms, floors, occupancy, check-in and check-out operations.',
    technologies: ['React', 'PHP', 'MySQL', 'CSS'],
    icon: <Monitor size={27} />,
    number: '01',
    featured: true
  },
  {
    id: 2,
    title: 'Wadan Hakimi Motor Showroom',
    category: 'PHP',
    type: 'Web Application',
    status: 'In Progress',
    description:
      'A modern vehicle showroom platform featuring vehicle listings, multilingual support, theme switching and an administration interface.',
    technologies: ['React', 'PHP', 'MySQL', 'JavaScript'],
    icon: <Globe size={27} />,
    number: '02',
    featured: true
  },
  {
    id: 3,
    title: 'Samiullah Hakimi Portfolio',
    category: 'React',
    type: 'Personal Project',
    status: 'In Progress',
    description:
      'A personal portfolio website presenting professional profile, skills, services, projects and contact information.',
    technologies: ['React', 'Vite', 'CSS', 'JavaScript'],
    icon: <Code2 size={27} />,
    number: '03',
    featured: true
  },
  {
    id: 4,
    title: 'Star Dash Application',
    category: 'Other',
    type: 'Desktop & Mobile App',
    status: 'In Progress',
    description:
      'A cross-platform application project planned for Windows desktop and Android devices.',
    technologies: ['Electron', 'Capacitor', 'JavaScript'],
    icon: <Layers3 size={27} />,
    number: '04',
    featured: false
  },
  {
    id: 5,
    title: 'Network Infrastructure Lab',
    category: 'Networking',
    type: 'Networking Lab',
    status: 'Practice Project',
    description:
      'Practical networking laboratory covering router and switch configuration, NAT, network connectivity and network services.',
    technologies: ['GNS3', 'Cisco', 'NAT', 'TCP/IP'],
    icon: <Network size={27} />,
    number: '05',
    featured: false
  },
  {
    id: 6,
    title: 'Database Management Practice',
    category: 'PHP',
    type: 'Database Project',
    status: 'Practice Project',
    description:
      'Database design and management practice focused on structured data, SQL queries, relationships and CRUD operations.',
    technologies: ['MySQL', 'SQL', 'PHP', 'Database'],
    icon: <Database size={27} />,
    number: '06',
    featured: false
  }
];

const categories = [
  'All Projects'
];

const projectsPerPage = 3;

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All Projects');
  const [currentPage, setCurrentPage] = useState(1);
  const [databaseProjects, setDatabaseProjects] = useState([]);

  const API_BASE = "http://localhost:8001";

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE}/api/projects.php?public=1`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Could not load portfolio projects");
        }
        return response.json();
      })
      .then(result => {
        if (isMounted && result.success && Array.isArray(result.data)) {
          const formattedProjects = result.data.map((project, index) => ({
            id: `admin-${project.id}`,
            title: project.title,
            category: 'Other',
            type: 'Admin Project',
            status: 'Published',
            description: project.description || 'Explore this project.',
            technologies: ['PHP', 'MySQL', 'Web Development'],
            icon: <Layers3 size={27} />,
            number: `A${String(index + 1).padStart(2, '0')}`,
            featured: false,
            image: project.image,
            projectUrl: project.project_url
          }));

          setDatabaseProjects(formattedProjects);
        }
      })
      .catch(error => {
        console.error("Portfolio API Error:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const allProjects = databaseProjects;

  const filteredProjects =
    activeCategory === 'All Projects'
      ? allProjects
      : allProjects.filter(project => project.category === activeCategory);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const visibleProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  const handleCategoryChange = category => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <main className="portfolio-page">

      {/* HERO SECTION */}
      <section className="portfolio-hero">
        <div className="portfolio-hero-glow"></div>

        <div className="portfolio-container">
          <div className="portfolio-hero-content">

            <span className="portfolio-eyebrow">
              <Sparkles size={15} />
              MY CREATIVE WORK
            </span>

            <h1>
              My Creative
              <span> Portfolio.</span>
            </h1>

            <p>
              Explore my projects, technical experiments and creative
              solutions in Web Development, Database Systems and Networking.
            </p>

            <div className="portfolio-hero-buttons">
              <a href="#projects" className="portfolio-primary-btn">
                Explore Projects
                <ArrowUpRight size={18} />
              </a>

              <a href="/contact" className="portfolio-outline-btn">
                Let's Connect
              </a>
            </div>

            <div className="portfolio-hero-stats">
              <div>
                <strong>06+</strong>
                <span>Projects & Labs</span>
              </div>
              <div>
                <strong>08+</strong>
                <span>Technologies</span>
              </div>
              <div>
                <strong>03</strong>
                <span>Main Areas</span>
              </div>
            </div>
          </div>

          <div className="portfolio-hero-visual">
            <div className="portfolio-visual-ring ring-one"></div>
            <div className="portfolio-visual-ring ring-two"></div>

            <div className="portfolio-visual-card">
              <div className="visual-card-top">
                <span className="visual-dot"></span>
                <span className="visual-dot"></span>
                <span className="visual-dot"></span>
                <span className="visual-card-label">PROJECT SHOWCASE</span>
              </div>

              <div className="visual-code-icon">
                <Code2 size={58} strokeWidth={1.3} />
              </div>

              <h3>Ideas into Reality</h3>
              <p>Design. Develop. Innovate.</p>

              <div className="visual-card-bottom">
                <span>CREATIVE DEVELOPER</span>
                <Sparkles size={17} />
              </div>
            </div>

            <div className="floating-tech floating-one">React.js</div>
            <div className="floating-tech floating-two">PHP</div>
            <div className="floating-tech floating-three">MySQL</div>
          </div>
        </div>

        <div className="portfolio-hero-bottom">
          <span>SCROLL TO EXPLORE</span>
          <div></div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="portfolio-intro">
        <div className="portfolio-container portfolio-intro-inner">
          <div>
            <span className="portfolio-section-label">WHAT I HAVE BUILT</span>
            <h2>
              Turning Ideas Into
              <span> Digital Experiences.</span>
            </h2>
          </div>

          <p>
            Every project is an opportunity to learn, solve problems and
            create something meaningful. Here are some of my academic,
            personal and practical projects.
          </p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="portfolio-projects" id="projects">
        <div className="portfolio-container">

          <div className="portfolio-section-heading">
            <div>
              <span className="portfolio-section-label">
                MY SELECTED WORK
              </span>
              <h2>Featured <span>Projects</span></h2>
            </div>

            <div className="portfolio-project-count">
              <FolderOpen size={19} />
              <span>{filteredProjects.length} Projects Found</span>
            </div>
          </div>

          {/* FILTERS */}
          <div className="portfolio-filters">
            {categories.map(category => (
              <button
                key={category}
                className={
                  activeCategory === category ? 'active' : ''
                }
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* PROJECT GRID */}
          <div className="portfolio-grid">
            {visibleProjects.map(project => (
              <article className="portfolio-card" key={project.id}>

                <div
                  className="portfolio-card-image"
                  style={
                    project.image
                      ? {
                          backgroundImage: `linear-gradient(rgba(11,16,23,0.30), rgba(11,16,23,0.55)), url("${API_BASE}/${project.image}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }
                      : undefined
                  }
                >
                  <div className="portfolio-card-image-pattern"></div>

                  <span className="portfolio-project-number">
                    / {project.number}
                  </span>

                  <div className="portfolio-card-main-icon">
                    {project.icon}
                  </div>

                  <span className="portfolio-card-type">
                    {project.type}
                  </span>

                  <div className="portfolio-card-hover">
                    <span>PROJECT DETAILS</span>
                    <ArrowUpRight size={25} />
                  </div>
                </div>

                <div className="portfolio-card-content">

                  <div className="portfolio-card-meta">
                    <span>{project.category}</span>
                    <span className="portfolio-status">
                      {project.status === 'In Progress' ? (
                        <Clock3 size={13} />
                      ) : (
                        <CheckCircle2 size={13} />
                      )}
                      {project.status}
                    </span>
                  </div>

                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <div className="portfolio-tech-list">
                    {project.technologies.map(tech => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <div className="portfolio-card-footer">
                    <span>Explore Project</span>
                    <ArrowUpRight size={19} />
                  </div>

                </div>
              </article>
            ))}
          </div>

          {/* EMPTY STATE */}
          {visibleProjects.length === 0 && (
            <div className="portfolio-empty">
              No projects found in this category.
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="portfolio-pagination">

              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={19} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage(page => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={19} />
              </button>

            </div>
          )}

        </div>
      </section>

      {/* TECHNOLOGY SECTION */}
      <section className="portfolio-technologies">
        <div className="portfolio-container">

          <div className="portfolio-tech-heading">
            <span className="portfolio-section-label">
              TOOLS & TECHNOLOGIES
            </span>
            <h2>Technologies I <span>Work With</span></h2>
            <p>
              The technologies and tools I use to build, design and
              understand digital systems.
            </p>
          </div>

          <div className="portfolio-tech-grid">
            {[
              ['React.js', 'Frontend Development', Code2],
              ['JavaScript', 'Programming', Code2],
              ['PHP', 'Backend Development', Database],
              ['MySQL', 'Database Management', Database],
              ['HTML & CSS', 'Web Design', Globe],
              ['Cisco / GNS3', 'Networking', Network]
            ].map(([name, description, Icon]) => (
              <div className="portfolio-tech-item" key={name}>
                <div className="portfolio-tech-icon">
                  <Icon size={25} />
                </div>
                <div>
                  <h4>{name}</h4>
                  <span>{description}</span>
                </div>
                <ArrowUpRight size={17} className="tech-arrow" />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="portfolio-cta">
        <div className="portfolio-container">
          <div className="portfolio-cta-box">

            <div className="portfolio-cta-decoration"></div>

            <span className="portfolio-section-label">
              HAVE A PROJECT IN MIND?
            </span>

            <h2>
              Let's Build Something
              <span> Amazing Together.</span>
            </h2>

            <p>
              Have an idea, project or opportunity? Let's connect and
              explore how we can make it happen.
            </p>

            <a href="/contact" className="portfolio-primary-btn">
              Get In Touch
              <ArrowUpRight size={19} />
            </a>

          </div>
        </div>
      </section>

    </main>
  );
}


