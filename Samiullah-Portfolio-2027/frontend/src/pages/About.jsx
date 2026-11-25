
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  GraduationCap,
  Code2,
  Network,
  Camera,
  Server,
  Database,
  Award,
  BriefcaseBusiness,
  MapPin,
  CalendarDays,
  Laptop,
  ShieldCheck,
  CheckCircle2,
  Globe,
  BookOpen,
  UserRound,
} from 'lucide-react';

import './About.css';

const experiences = [
  {
    role: 'IT Support',
    company: 'Kandahar University',
    period: '1 Year and 5 Months',
    description:
      'Practical experience in IT support, computer systems, troubleshooting and technical assistance in a university environment.',
    icon: Laptop,
    number: '01',
  },
  {
    role: 'CCTV & Computer Support',
    company: 'Ahsan Computer and CCTV Cameras',
    period: '2 Months',
    description:
      'Practical experience in CCTV installation and maintenance for homes, hotels, businesses and academic centers, including IP camera systems.',
    icon: Camera,
    number: '02',
  },
];

const skills = [
  {
    name: 'Web Development',
    detail: 'HTML, CSS, JavaScript and React',
    icon: Code2,
  },
  {
    name: 'Backend Development',
    detail: 'PHP and backend fundamentals',
    icon: Server,
  },
  {
    name: 'Database Management',
    detail: 'MySQL and database concepts',
    icon: Database,
  },
  {
    name: 'Computer Networking',
    detail: 'CCNA, routing and switching',
    icon: Network,
  },
  {
    name: 'Windows Server',
    detail: 'DNS, DHCP and server administration',
    icon: ShieldCheck,
  },
  {
    name: 'CCTV Systems',
    detail: 'IP cameras and CCTV installation',
    icon: Camera,
  },
];

const facts = [
  {
    label: 'University',
    value: 'Kandahar University',
    icon: GraduationCap,
  },
  {
    label: 'Department',
    value: 'Computer Science',
    icon: Code2,
  },
  {
    label: 'Location',
    value: 'Afghanistan',
    icon: MapPin,
  },
  {
    label: 'Professional Interest',
    value: 'Web & IT',
    icon: Laptop,
  },
];

export default function About() {
  const [profile, setProfile] = useState({
    full_name: "Samiullah Hakimi",
    title: "",
    bio: "",
    email: "",
    phone: "",
    photo: ""
  });

  useEffect(() => {
    let active = true;

    fetch("http://localhost:8001/api/profile.php")
      .then((response) => response.json())
      .then((result) => {
        if (active && result.success && result.data) {
          const data = result.data;

          if (data.photo) {
            data.photo = data.photo.replace(
              "localhost:8000",
              "localhost:8001"
            );
          }

          setProfile(data);
        }
      })
      .catch((error) => {
        console.error("Profile loading error:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="about-page">

      {/* HERO HEADING */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">
            <span className="about-eyebrow-line"></span>
            GET TO KNOW ME
          </span>

          <h1>
            About <span>Me</span>
          </h1>

          <p>
            Discover my journey, education, experience and
            passion for technology.
          </p>

          <div className="about-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>About</span>
          </div>
        </div>

        <div className="about-hero-decoration">ABOUT</div>
      </section>

      {/* INTRODUCTION */}
      <section className="about-intro">

        <div className="about-image-column">
          <div className="about-image-frame">
            <div className="about-image-backdrop"></div>

            <img
              src={profile.photo || "/images/samiullah.jpg"}
              alt={`${profile.full_name} - ${profile.title}`}
              className="about-profile-image"
            />

            <div className="about-image-caption">
              <span className="about-status-dot"></span>
              Learning. Building. Growing.
            </div>
          </div>

          <div className="about-image-experience">
            <Award size={25} />
            <div>
              <strong>IT Experience</strong>
              <span>Practical Technical Skills</span>
            </div>
          </div>
        </div>

        <div className="about-intro-content">
          <span className="about-eyebrow">
            <span className="about-eyebrow-line"></span>
            WHO AM I?
          </span>

          <h2>
            Building My Future Through
            <span> Technology & Innovation.</span>
          </h2>

          {profile.title && (
            <p className="about-profile-title">
              {profile.title}
            </p>
          )}

          {profile.bio?.trim() ? (
            <p className="about-dynamic-bio">
              {profile.bio}
            </p>
          ) : (
            <>
              <p>
                My name is {profile.full_name}. I am a final-year
                Computer Science student at Kandahar University,
                Afghanistan. I am passionate about web development,
                computer networking and information technology.
              </p>

              <p>
                I have studied technologies including HTML, CSS,
                JavaScript, React, PHP and MySQL. I also have
                practical experience in IT support, computer
                systems and CCTV/IP camera systems.
              </p>

              <p>
                My goal is to improve my technical knowledge,
                develop useful digital solutions and build a
                successful career in the technology industry.
              </p>
            </>
          )}

          <div className="about-location">
            <MapPin size={18} />
            <span>Afghanistan</span>
          </div>

          <div className="about-facts-grid">
            {facts.map((fact) => {
              const Icon = fact.icon;

              return (
                <div className="about-fact" key={fact.label}>
                  <div className="about-fact-icon">
                    <Icon size={21} />
                  </div>

                  <div>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/contact"
            className="about-primary-button"
          >
            Contact Me
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-eyebrow">
            <span className="about-eyebrow-line"></span>
            MY BACKGROUND
          </span>

          <h2>
            Education & <span>Learning</span>
          </h2>

          <p>
            My academic journey and educational background.
          </p>
        </div>

        <div className="about-education-grid">

          <article className="about-education-card">
            <div className="about-card-top">
              <div className="about-card-icon">
                <GraduationCap size={28} />
              </div>
              <span className="about-card-number">01</span>
            </div>

            <span className="about-card-label">
              UNIVERSITY EDUCATION
            </span>

            <h3>Kandahar University</h3>

            <p>
              Bachelor of Computer Science
            </p>

            <div className="about-card-footer">
              <CalendarDays size={16} />
              Started in 1402
            </div>
          </article>

          <article className="about-education-card">
            <div className="about-card-top">
              <div className="about-card-icon">
                <BookOpen size={28} />
              </div>
              <span className="about-card-number">02</span>
            </div>

            <span className="about-card-label">
              HIGH SCHOOL EDUCATION
            </span>

            <h3>Shahid Abdul Salam High School</h3>

            <p>
              Grade 12 - Successfully Completed
            </p>

            <div className="about-card-footer">
              <CalendarDays size={16} />
              Graduated in 1401
            </div>
          </article>

        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-eyebrow">
            <span className="about-eyebrow-line"></span>
            MY EXPERIENCE
          </span>

          <h2>
            Professional <span>Experience</span>
          </h2>

          <p>
            Practical experience gained through technical
            work and IT environments.
          </p>
        </div>

        <div className="about-experience-grid">
          {experiences.map((item) => {
            const Icon = item.icon;

            return (
              <article
                className="about-experience-card"
                key={item.company}
              >
                <div className="about-experience-top">
                  <div className="about-card-icon">
                    <Icon size={27} />
                  </div>

                  <span className="about-card-number">
                    {item.number}
                  </span>
                </div>

                <span className="about-experience-period">
                  <BriefcaseBusiness size={15} />
                  {item.period}
                </span>

                <h3>{item.role}</h3>

                <h4>{item.company}</h4>

                <p>{item.description}</p>

                <div className="about-experience-bottom">
                  <CheckCircle2 size={17} />
                  Practical Experience
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* TECHNICAL SKILLS */}
      <section className="about-section">
        <div className="about-section-heading">
          <span className="about-eyebrow">
            <span className="about-eyebrow-line"></span>
            WHAT I WORK WITH
          </span>

          <h2>
            Technical <span>Knowledge</span>
          </h2>

          <p>
            Technologies and technical areas I have studied
            and worked with.
          </p>
        </div>

        <div className="about-skills-grid">
          {skills.map((skill) => {
            const Icon = skill.icon;

            return (
              <article
                className="about-skill-card"
                key={skill.name}
              >
                <div className="about-skill-icon">
                  <Icon size={25} />
                </div>

                <div className="about-skill-content">
                  <h3>{skill.name}</h3>
                  <p>{skill.detail}</p>
                </div>

                <ArrowUpRight
                  size={19}
                  className="about-skill-arrow"
                />
              </article>
            );
          })}
        </div>
      </section>

      {/* CERTIFICATE */}
      <section className="about-certificate">
        <div className="about-certificate-icon">
          <Award size={35} />
        </div>

        <div className="about-certificate-content">
          <span className="about-eyebrow">
            MY ACHIEVEMENT
          </span>

          <h2>Computer Training Certificate</h2>

          <p>
            Successfully completed computer training at
            Binawa Institute.
          </p>

          <div className="about-certificate-status">
            <CheckCircle2 size={17} />
            Certificate Earned
          </div>
        </div>

        <div className="about-certificate-decoration">
          <Award size={110} />
        </div>
      </section>

      {/* PERSONAL INTEREST */}
      <section className="about-interest">
        <div className="about-interest-heading">
          <span className="about-eyebrow">
            MY INTERESTS
          </span>

          <h2>
            Always Ready to <span>Learn & Grow</span>
          </h2>
        </div>

        <div className="about-interest-list">
          <div>
            <Code2 size={20} />
            Web Development
          </div>

          <div>
            <Network size={20} />
            Computer Networking
          </div>

          <div>
            <Globe size={20} />
            Information Technology
          </div>

          <div>
            <BookOpen size={20} />
            Continuous Learning
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="about-cta">
        <div className="about-cta-decoration">
          <UserRound size={150} />
        </div>

        <div className="about-cta-content">
          <span className="about-eyebrow">
            LET'S CONNECT
          </span>

          <h2>
            Have a Project or an Opportunity in Mind?
          </h2>

          <p>
            I am always interested in learning,
            collaboration and new opportunities
            in the world of technology.
          </p>

          <Link
            to="/contact"
            className="about-primary-button"
          >
            Get In Touch
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>

    </main>
  );
}
