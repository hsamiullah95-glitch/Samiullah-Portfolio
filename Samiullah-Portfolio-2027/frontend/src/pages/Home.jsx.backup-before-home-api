
import {
  ArrowUpRight,
  ArrowRight,
  GraduationCap,
  BriefcaseBusiness,
  Code2,
  MapPin,
  Sparkles,
  Database,
  Network,
  Router,
  Camera,
  Server,
  Monitor,
  ShieldCheck,
  Wifi,
  HardDrive,
  Languages,
  Globe,
  Laptop,
  Cable,
} from "lucide-react";

import { Link } from "react-router-dom";

const stats = [
  { icon: GraduationCap, number: "04", label: "University Year" },
  { icon: BriefcaseBusiness, number: "1.5+", label: "Years IT Experience" },
  { icon: Code2, number: "08", label: "Core Technologies" },
];

const webSkills = [
  { name: "HTML5", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "React", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "PHP", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "MySQL", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "Laravel", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
  { name: "Git", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
];

const networkSkills = [
  { name: "CCNA", icon: Network, detail: "Networking Fundamentals" },
  { name: "Routing & Switching", icon: Router, detail: "Network Configuration" },
  { name: "MikroTik", icon: Wifi, detail: "Network Administration" },
  { name: "GNS3", icon: Cable, detail: "Network Simulation" },
  { name: "Windows Server", icon: Server, detail: "Server Administration" },
  { name: "DNS & DHCP", icon: Globe, detail: "Network Services" },
  { name: "SNMP", icon: Monitor, detail: "Network Monitoring" },
  { name: "TCP/IP", icon: ShieldCheck, detail: "Network Protocols" },
];

const cctvSkills = [
  { name: "IP Cameras", icon: Camera, detail: "IP Camera Setup" },
  { name: "CCTV Installation", icon: ShieldCheck, detail: "Camera Installation" },
  { name: "NVR / DVR", icon: HardDrive, detail: "Recording Systems" },
  { name: "IT Support", icon: Laptop, detail: "Technical Support" },
  { name: "Computer Hardware", icon: Monitor, detail: "Hardware Troubleshooting" },
  { name: "Windows Support", icon: SettingsIcon, detail: "Windows Configuration" },
];

function SettingsIcon(props) {
  return <Monitor {...props} />;
}

const languages = [
  { name: "Pashto", native: "پښتو", level: "Native", flag: "🇦🇫" },
  { name: "Dari", native: "دري", level: "Fluent", flag: "🇦🇫" },
  { name: "English", native: "English", level: "Good Knowledge", flag: "🌐" },
];

function SkillCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="skill-detail-card">
      <div className="skill-detail-icon">
        <Icon size={27} strokeWidth={1.8} />
      </div>
      <div>
        <h3>{item.name}</h3>
        <p>{item.detail}</p>
      </div>
      <ArrowUpRight className="skill-card-arrow" size={17} />
    </div>
  );
}

export default function Home() {
  return (
    <main className="home-page">

      {/* HERO */}
      <section className="home-hero">
        <div className="home-hero-container">

          <div className="home-hero-content">
            <div className="home-status">
              <span className="status-dot"></span>
              COMPUTER SCIENCE STUDENT & IT ENTHUSIAST
            </div>

            <p className="home-greeting">
              ASSALAMUALAIKUM / HELLO, I'M
            </p>

            <h1 className="home-title">
              Samiullah <span>Hakimi.</span>
            </h1>

            <h2 className="home-subtitle">
              Web Developer <span>&</span> IT Professional
            </h2>

            <p className="home-description">
              I am a Computer Science student passionate about web
              development, database systems and computer networking.
              I enjoy building useful digital solutions and continuously
              improving my skills.
            </p>

            <div className="home-actions">
              <Link to="/portfolio" className="home-primary-btn">
                Explore My Work <ArrowUpRight size={20} />
              </Link>

              <Link to="/contact" className="home-secondary-btn">
                Contact Me <ArrowRight size={20} />
              </Link>
            </div>

            <div className="home-stats">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="home-stat" key={item.label}>
                    <Icon className="home-stat-icon" size={34} />
                    <div>
                      <h3>{item.number}</h3>
                      <p>{item.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="home-visual">
            <div className="hero-circle hero-circle-one"></div>
            <div className="hero-circle hero-circle-two"></div>
            <div className="hero-dots hero-dots-top"></div>
            <div className="hero-dots hero-dots-bottom"></div>
            <div className="hero-orange-shape"></div>

            <div className="available-badge">
              <span className="status-dot"></span>
              <div>
                <strong>Available</strong>
                <small>For Projects</small>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-card-top">
                <span>PERSONAL PORTFOLIO</span>
                <span className="profile-creative">CREATIVE · TECHNICAL</span>
              </div>

              <div className="profile-image-frame">
                <img
                  src="/images/samiullah-profile.jpg"
                  alt="Samiullah Hakimi"
                  className="profile-image"
                />
                <div className="image-corner-decoration"></div>
              </div>

              <div className="profile-information">
                <div>
                  <h2>Samiullah Hakimi</h2>
                  <p>Web Developer & IT Enthusiast</p>
                </div>
                <div className="profile-code-icon">
                  <Code2 size={31} />
                </div>
              </div>

              <div className="profile-location">
                <MapPin size={18} />
                <span>Kandahar, Afghanistan</span>
              </div>
            </div>

            <div className="floating-skill floating-skill-web">
              <Code2 size={20} />
              <span>Web Development</span>
            </div>

            <div className="floating-skill floating-skill-database">
              <Database size={20} />
              <span>Database Systems</span>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS SHOWCASE */}
      <section className="skills-showcase" id="skills">
        <div className="skills-container">

          <div className="skills-section-heading">
            <span className="section-eyebrow">MY KNOWLEDGE & ABILITIES</span>
            <h2>Skills & Technologies</h2>
            <p>
              Technologies, tools and IT skills I have learned
              and worked with throughout my learning journey.
            </p>
          </div>

          {/* WEB DEVELOPMENT */}
          <div className="skill-group">
            <div className="skill-group-heading">
              <div className="skill-group-symbol orange-symbol">
                <Code2 size={25} />
              </div>
              <div>
                <h3>Web Development</h3>
                <p>Programming Languages & Development Tools</p>
              </div>
              <span className="skill-group-count">08 SKILLS</span>
            </div>

            <div className="technology-logo-grid">
              {webSkills.map((skill) => (
                <div className="technology-logo-card" key={skill.name}>
                  <div className="technology-logo-image">
                    <img src={skill.image} alt={`${skill.name} logo`} loading="lazy" />
                  </div>
                  <h4>{skill.name}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* NETWORKING */}
          <div className="skill-group">
            <div className="skill-group-heading">
              <div className="skill-group-symbol blue-symbol">
                <Network size={25} />
              </div>
              <div>
                <h3>Networking & Server Administration</h3>
                <p>Computer Networks, Configuration & Infrastructure</p>
              </div>
              <span className="skill-group-count">08 SKILLS</span>
            </div>

            <div className="skill-detail-grid">
              {networkSkills.map((item) => (
                <SkillCard item={item} key={item.name} />
              ))}
            </div>
          </div>

          {/* CCTV AND IT */}
          <div className="skill-group">
            <div className="skill-group-heading">
              <div className="skill-group-symbol purple-symbol">
                <Camera size={25} />
              </div>
              <div>
                <h3>CCTV, Hardware & IT Support</h3>
                <p>Security Cameras, Computer Systems & Technical Support</p>
              </div>
              <span className="skill-group-count">06 SKILLS</span>
            </div>

            <div className="skill-detail-grid">
              {cctvSkills.map((item) => (
                <SkillCard item={item} key={item.name} />
              ))}
            </div>
          </div>

          {/* LANGUAGES */}
          <div className="skill-group language-group">
            <div className="skill-group-heading">
              <div className="skill-group-symbol green-symbol">
                <Languages size={25} />
              </div>
              <div>
                <h3>Languages I Speak</h3>
                <p>Communication & Language Skills</p>
              </div>
            </div>

            <div className="language-grid">
              {languages.map((language) => (
                <div className="language-card" key={language.name}>
                  <span className="language-flag">{language.flag}</span>
                  <div>
                    <h4>{language.name}</h4>
                    <p>{language.native}</p>
                    <span>{language.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* EXPERTISE */}
      <section className="home-expertise">
        <div className="expertise-heading">
          <span className="section-eyebrow">WHAT I DO</span>
          <h2>My Areas of Expertise</h2>
          <p>
            I enjoy creating useful digital solutions through
            development, databases and IT infrastructure.
          </p>
        </div>

        <div className="expertise-grid">
          <article className="expertise-card">
            <div className="expertise-icon"><Code2 size={29} /></div>
            <h3>Web Development</h3>
            <p>
              Building responsive and modern websites using HTML,
              CSS, JavaScript and React.
            </p>
            <Link to="/services">Explore Services <ArrowUpRight size={17} /></Link>
          </article>

          <article className="expertise-card">
            <div className="expertise-icon"><Database size={29} /></div>
            <h3>Database Development</h3>
            <p>
              Working with PHP and MySQL to build organized
              database-driven applications.
            </p>
            <Link to="/services">Explore Services <ArrowUpRight size={17} /></Link>
          </article>

          <article className="expertise-card">
            <div className="expertise-icon"><Network size={29} /></div>
            <h3>Networking & CCTV</h3>
            <p>
              Computer networking, network administration,
              IP cameras and IT support.
            </p>
            <Link to="/services">Explore Services <ArrowUpRight size={17} /></Link>
          </article>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="home-portfolio-cta">
        <div>
          <span>LET'S BUILD SOMETHING GREAT</span>
          <h2>Have a project in mind?</h2>
          <p>
            Let's work together and turn your ideas into
            useful digital experiences.
          </p>
        </div>
        <Link to="/contact" className="home-primary-btn">
          Let's Talk <ArrowUpRight size={20} />
        </Link>
      </section>

    </main>
  );
}
