
import { useEffect, useMemo, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowUpRight, Code2, Monitor, Database,
  Globe, Layers3, Network, Sparkles, X,
  GraduationCap, Smartphone, CheckCircle2,
  Clock3, ChevronRight, FolderKanban, ExternalLink
} from 'lucide-react';
import './Products.css';

const projects = [
  {
    id: 1,
    title: 'Kandahar University Dormitory',
    subtitle: 'Dormitory Management System',
    category: 'Student Projects',
    status: 'In Progress',
    icon: GraduationCap,
    number: '01',
    description: 'A university dormitory management platform designed to manage students, rooms, floors, occupancy, check-in and check-out operations.',
    features: ['Student Management', 'Room & Floor Management', 'Occupancy Dashboard', 'Admin Panel'],
    technologies: ['React', 'PHP', 'MySQL', 'CSS'],
    color: 'gold',
    type: 'Academic Project'
  },
  {
    id: 2,
    title: 'Wadan Hakimi Motor Showroom',
    subtitle: 'Luxury Vehicle Management',
    category: 'Web Applications',
    status: 'In Progress',
    icon: Monitor,
    number: '02',
    description: 'A modern luxury showroom website concept with vehicle listings, multilingual interface, dark and light themes, and administration features.',
    features: ['Vehicle Showcase', 'Multilingual Interface', 'Theme Switcher', 'Admin Dashboard'],
    technologies: ['React', 'PHP', 'MySQL', 'JavaScript'],
    color: 'blue',
    type: 'Web Application'
  },
  {
    id: 3,
    title: 'Star Dash',
    subtitle: 'Desktop & Android App',
    category: 'Student Projects',
    status: 'In Progress',
    icon: Smartphone,
    number: '03',
    description: 'An application development project focused on desktop and Android application packaging.',
    features: ['Desktop App Concept', 'Android App Build', 'Electron Integration', 'Capacitor Integration'],
    technologies: ['Electron', 'JavaScript', 'Capacitor'],
    color: 'purple',
    type: 'Application'
  },
  {
    id: 4,
    title: 'Samiullah Hakimi Portfolio',
    subtitle: 'Personal Portfolio 2027',
    category: 'My Portfolio',
    status: 'In Progress',
    icon: Globe,
    number: '04',
    description: 'A professional personal portfolio presenting profile, skills, services, projects, experience and contact information.',
    features: ['Personal Profile', 'Project Showcase', 'Services Section', 'Admin Content Management'],
    technologies: ['React', 'JavaScript', 'CSS', 'PHP'],
    color: 'gold',
    type: 'Personal Website'
  },
  {
    id: 5,
    title: 'Networking & IT Solutions',
    subtitle: 'Network Infrastructure Projects',
    category: 'Student Projects',
    status: 'Learning & Practice',
    icon: Network,
    number: '05',
    description: 'Practical networking exercises and infrastructure concepts involving routers, switches, network services and CCTV systems.',
    features: ['Router & Switch Configuration', 'GNS3 Network Labs', 'DHCP & DNS Concepts', 'IP Camera Network Design'],
    technologies: ['CCNA', 'GNS3', 'MikroTik', 'Windows Server'],
    color: 'blue',
    type: 'Networking'
  },
  {
    id: 6,
    title: 'Database Solutions',
    subtitle: 'Database Design & Management',
    category: 'Student Projects',
    status: 'Learning & Practice',
    icon: Database,
    number: '06',
    description: 'Database learning and practical exercises focused on relational database design, SQL queries and application data management.',
    features: ['Database Design', 'SQL Queries', 'Data Relationships', 'MySQL Practice'],
    technologies: ['MySQL', 'SQL', 'PHP'],
    color: 'purple',
    type: 'Database'
  },
  {
    id: 7,
    title: 'Web Development Solutions',
    subtitle: 'Modern Website Development',
    category: 'Web Applications',
    status: 'Available',
    icon: Code2,
    number: '07',
    description: 'Website design and development concepts with responsive layouts, modern interfaces and practical web technologies.',
    features: ['Responsive Layouts', 'Modern UI Design', 'Frontend Development', 'Backend Integration'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    color: 'gold',
    type: 'Web Development'
  }
];

const sections = {
  '/products/portfolio': {
    eyebrow: 'MY PERSONAL SPACE',
    title: 'My Portfolio',
    accent: 'Portfolio.',
    description: 'Discover my professional profile, technical skills, personal journey and the work I am building as a Computer Science student.',
    category: 'My Portfolio',
    icon: Globe,
    label: 'PERSONAL PROFILE'
  },
  '/products/applications': {
    eyebrow: 'DIGITAL PRODUCTS',
    title: 'Web',
    accent: 'Applications.',
    description: 'Explore web applications, digital platforms and software solutions developed through practical learning and creative ideas.',
    category: 'Web Applications',
    icon: Monitor,
    label: 'WEB & SOFTWARE'
  },
  '/products/projects': {
    eyebrow: 'ACADEMIC JOURNEY',
    title: 'Student',
    accent: 'Projects.',
    description: 'A collection of university projects, practical assignments, networking labs and technology experiments.',
    category: 'Student Projects',
    icon: GraduationCap,
    label: 'ACADEMIC WORK'
  }
};

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.replace(/\/$/, '') || '/products';

  const section = sections[path] || {
    eyebrow: 'MY CREATIVE WORKSPACE',
    title: 'My',
    accent: 'Products.',
    description: 'Explore my web applications, academic projects, software concepts and practical IT solutions.',
    category: 'All Projects',
    icon: Layers3,
    label: 'ALL MY WORK'
  };

  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch('http://localhost:8001/api/products.php?public=1')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Products API error: ' + response.status);
        }
        return response.json();
      })
      .then((result) => {
        if (!isMounted || !result.success || !Array.isArray(result.data)) return;

        const mapped = result.data.map((item, index) => {
          const categoryNames = {
            portfolio: 'My Portfolio',
            applications: 'Web Applications',
            projects: 'Student Projects'
          };

          const category = categoryNames[item.category] || 'Student Projects';

          return {
            id: `database-${item.id}`,
            title: item.title || 'Untitled Product',
            subtitle: category,
            category,
            status: 'Available',
            icon: item.category === 'portfolio'
              ? Globe
              : item.category === 'applications'
                ? Monitor
                : GraduationCap,
            number: String(index + 8).padStart(2, '0'),
            description: item.description || '',
            features: ['Product information', 'Details available'],
            technologies: [],
            color: item.category === 'applications' ? 'blue' : 'purple',
            type: item.category === 'applications'
              ? 'Web Application'
              : item.category === 'portfolio'
                ? 'Personal Portfolio'
                : 'Student Project',
            image: item.image || '',
            productUrl: /^https?:\/\//i.test(item.product_url || '')
              ? item.product_url
              : ''
          };
        });

        setDbProducts(mapped);
      })
      .catch((error) => console.error('Products loading error:', error));

    return () => {
      isMounted = false;
    };
  }, []);
const filters = ['All', 'Web', 'Application', 'Networking', 'Database'];

  const visibleProjects = useMemo(() => {
    return [...projects, ...dbProducts].filter((project) => {
      const routeMatch =
        section.category === 'All Projects' ||
        project.category === section.category;

      const term = search.toLowerCase();

      const searchMatch =
        project.title.toLowerCase().includes(term) ||
        project.subtitle.toLowerCase().includes(term) ||
        project.technologies.join(' ').toLowerCase().includes(term);

      const filterMatch =
        activeFilter === 'All' ||
        project.type.toLowerCase().includes(activeFilter.toLowerCase()) ||
        (activeFilter === 'Web' && project.category === 'Web Applications');

      return routeMatch && searchMatch && filterMatch;
    });
  }, [section, search, activeFilter, dbProducts]);

  const HeroIcon = section.icon;

  return (
    <main className="products-page">

      <section className="products-hero">
        <div className="hero-light light-one" />
        <div className="hero-light light-two" />

        <div className="products-container">
          <div className="products-breadcrumb">
            <Link to="/">HOME</Link>
            <ChevronRight size={13} />
            <span>MY PRODUCTS</span>
            <ChevronRight size={13} />
            <span>{section.label}</span>
          </div>

          <div className="products-hero-content">
            <div className="products-hero-text">
              <span className="products-eyebrow">
                <Sparkles size={15} />
                {section.eyebrow}
              </span>

              <h1>
                {section.title}
                <br />
                <span>{section.accent}</span>
              </h1>

              <p>{section.description}</p>

              <a href="#project-showcase" className="products-main-btn">
                Explore Collection
                <ArrowUpRight size={18} />
              </a>
            </div>

            <div className="products-hero-visual">
              <div className="products-orbit orbit-one" />
              <div className="products-orbit orbit-two" />

              <div className="products-visual-card">
                <div className="visual-card-top">
                  <span className="visual-dot" />
                  <span>CREATIVE WORKSPACE</span>
                  <span>2027</span>
                </div>

                <div className="visual-code-icon">
                  <HeroIcon size={45} />
                </div>

                <h3>Ideas Into</h3>
                <h3 className="gold-text">Digital Reality.</h3>

                <div className="visual-tech-row">
                  <span>React</span>
                  <span>PHP</span>
                  <span>MySQL</span>
                </div>

                <div className="visual-bottom">
                  <span>DESIGN Â· DEVELOP Â· CREATE</span>
                  <Sparkles size={17} />
                </div>
              </div>

              <div className="floating-chip chip-one">
                <Code2 size={17} /> Creative Development
              </div>
              <div className="floating-chip chip-two">
                <Database size={17} /> Technology
              </div>
            </div>
          </div>

          <div className="products-stats">
            <div>
              <strong>{String(visibleProjects.length).padStart(2, '0')}<span>+</span></strong>
              <small>PROJECTS IN THIS SECTION</small>
            </div>
            <div>
              <strong>04<span>+</span></strong>
              <small>TECHNOLOGY AREAS</small>
            </div>
            <div>
              <strong>2027</strong>
              <small>CREATIVE JOURNEY</small>
            </div>
          </div>
        </div>
      </section>

      <section className="project-showcase" id="project-showcase">
        <div className="products-container">
          <div className="showcase-heading">
            <div>
              <span className="products-eyebrow">
                <FolderKanban size={15} />
                SELECTED WORK
              </span>
              <h2>
                Explore <span>My Work.</span>
              </h2>
              <p>Browse the collection and discover project details.</p>
            </div>

            <div className="project-count">
              <span>{String(visibleProjects.length).padStart(2, '0')}</span>
              <small>PROJECTS FOUND</small>
            </div>
          </div>

          <div className="products-toolbar">
            <div className="products-search">
              <Search size={19} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects and technologies..."
              />
              {search && (
                <button onClick={() => setSearch('')} aria-label="Clear search">
                  <X size={17} />
                </button>
              )}
            </div>

            <div className="products-categories">
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={activeFilter === filter ? 'active' : ''}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="products-grid">
            {visibleProjects.map((project) => {
              const Icon = project.icon;

              return (
                <article className={`project-card ${project.color}`} key={project.id}>
                  <div className="project-card-top">
                    <span className="project-number">{project.number}</span>
                    <span className="project-status">
                      <span />
                      {project.status}
                    </span>
                  </div>

                  {project.image && (
                    <div className="project-card-image">
                      <img src={project.image} alt={project.title} loading="lazy" />
                    </div>
                  )}

                  <div className="project-icon">
                    <Icon size={30} strokeWidth={1.6} />
                  </div>

                  <span className="project-category">{project.type}</span>
                  <h3>{project.title}</h3>
                  <h4>{project.subtitle}</h4>
                  <p>{project.description}</p>

                  <div className="project-tech">
                    {project.technologies.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <div className="project-card-footer">
                    <Link to={`/products/details/${project.id}`} state={{ project }} className="project-details-link">
  View Project Details
  <ArrowUpRight size={17} />
</Link>
                    <span><Icon size={18} /></span>
                  </div>
                </article>
              );
            })}
          </div>

          {visibleProjects.length === 0 && (
            <div className="products-empty">
              <Search size={35} />
              <h3>No projects found</h3>
              <p>Try another search or filter.</p>
              <button onClick={() => {
                setSearch('');
                setActiveFilter('All');
              }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="products-profile">
        <div className="products-container">
          <div className="profile-showcase">
            <div className="profile-symbol">
              <span>SH</span>
              <div className="profile-symbol-ring" />
            </div>

            <div className="profile-showcase-content">
              <span className="products-eyebrow">
                <Sparkles size={15} />
                ABOUT THE CREATOR
              </span>
              <h2>Meet <span>Samiullah Hakimi.</span></h2>
              <p>
                Computer Science student and technology enthusiast
                interested in web development, networking, databases
                and building useful digital solutions.
              </p>

              <div className="profile-skills">
                <span>Web Development</span>
                <span>React</span>
                <span>PHP & MySQL</span>
                <span>Networking</span>
              </div>

              <Link to="/about" className="profile-about-link">
                Discover My Profile
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="products-cta">
        <div className="products-container">
          <div className="products-cta-inner">
            <span className="products-eyebrow">
              <Sparkles size={15} />
              LET'S BUILD SOMETHING
            </span>
            <h2>
              Have an Idea?
              <br />
              <span>Let's Create It.</span>
            </h2>
            <p>
              Explore my work and get in touch to discuss a website,
              application or technology project.
            </p>
            <Link to="/contact" className="products-main-btn">
              Contact Me
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {selectedProject && (
        <div className="project-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>
              <X size={22} />
            </button>

            <span className="products-eyebrow">PROJECT DETAILS</span>

            <div className="modal-project-icon">
              {(() => {
                const Icon = selectedProject.icon;
                return <Icon size={34} />;
              })()}
            </div>

            <span className="modal-category">{selectedProject.type}</span>
            <h2>{selectedProject.title}</h2>
            <h4>{selectedProject.subtitle}</h4>
            <p>{selectedProject.description}</p>

            <h3 className="modal-section-title">Key Features</h3>
            <div className="modal-features">
              {selectedProject.features.map((feature) => (
                <div key={feature}>
                  <CheckCircle2 size={17} />
                  {feature}
                </div>
              ))}
            </div>

            <h3 className="modal-section-title">Technologies</h3>
            <div className="project-tech modal-tech">
              {selectedProject.technologies.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>

            <div className="modal-status">
              <Clock3 size={17} />
              Status: {selectedProject.status}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}



