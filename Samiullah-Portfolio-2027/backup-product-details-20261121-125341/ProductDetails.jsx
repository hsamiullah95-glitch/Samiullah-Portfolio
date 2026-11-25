import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Code2,
  ExternalLink,
  FolderOpen
} from 'lucide-react';
import './ProductDetails.css';

const API_URL = 'http://localhost:8001/api/products.php?public=1';

function mapDatabaseProduct(item) {
  const categories = {
    portfolio: 'My Portfolio',
    applications: 'Web Applications',
    projects: 'Student Projects'
  };

  return {
    id: `database-${item.id}`,
    title: item.title || 'Untitled Project',
    subtitle: categories[item.category] || 'Digital Product',
    type: categories[item.category] || 'Digital Product',
    description: item.description || 'No description available.',
    image: item.image || '',
    productUrl: item.product_url || '',
    features: [
      'Project information and description',
      'Responsive presentation',
      'Modern user interface'
    ],
    technologies: ['React', 'PHP', 'MySQL'],
    status: Number(item.is_active) === 1 ? 'Available' : 'Inactive'
  };
}

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [project, setProject] = useState(location.state?.project || null);
  const [loading, setLoading] = useState(!location.state?.project);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.project) {
      setProject(location.state.project);
      setLoading(false);
      return;
    }

    const loadProject = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Could not connect to the products API.');
        }

        const result = await response.json();
        const rows = Array.isArray(result.data) ? result.data : [];
        const databaseId = id.replace('database-', '');
        const found = rows.find((item) => String(item.id) === databaseId);

        if (!found) {
          setError('This project could not be found.');
          setProject(null);
          return;
        }

        setProject(mapDatabaseProduct(found));
      } catch (err) {
        setError(err.message || 'Something went wrong while loading this project.');
      } finally {
        setLoading(false);
      }
    };

    if (id.startsWith('database-')) {
      loadProject();
    } else {
      setError('Open this project from the Products page.');
      setLoading(false);
    }
  }, [id, location.state]);

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">Loading project details...</div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">
          <FolderOpen size={42} />
          <h2>Project Not Found</h2>
          <p>{error || 'The requested project is unavailable.'}</p>
          <Link to="/products" className="details-back-button">
            <ArrowLeft size={18} /> Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const validProjectUrl =
    typeof project.productUrl === 'string' &&
    /^https?:\/\//i.test(project.productUrl.trim());

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        <div className="details-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">My Products</Link>
          <span>/</span>
          <span>{project.title}</span>
        </div>

        <Link to="/products" className="details-back-link">
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <section className="product-details-hero">
          <div className="product-details-content">
            <span className="details-eyebrow">
              <Code2 size={16} />
              PROJECT DETAILS
            </span>

            <span className="details-category">{project.type}</span>

            <h1>{project.title}</h1>
            <h3>{project.subtitle}</h3>
            <p>{project.description}</p>

            <div className="details-status">
              <Clock3 size={17} />
              Status: {project.status || 'Available'}
            </div>

            {validProjectUrl && (
              <a
                href={project.productUrl.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="details-visit-button"
              >
                Visit Project <ExternalLink size={17} />
              </a>
            )}
          </div>

          <div className="product-details-image">
            {project.image ? (
              <img src={project.image} alt={project.title} />
            ) : (
              <div className="details-image-placeholder">
                <FolderOpen size={65} />
                <span>Project Preview</span>
              </div>
            )}
          </div>
        </section>

        <section className="details-information">
          <div className="details-info-card">
            <span className="details-eyebrow">ABOUT THIS PROJECT</span>
            <h2>Project Overview</h2>
            <p>{project.description}</p>
          </div>

          <div className="details-info-card">
            <span className="details-eyebrow">PROJECT FEATURES</span>
            <h2>Key Features</h2>
            <div className="details-features">
              {(project.features || []).map((feature, index) => (
                <div key={index}>
                  <CheckCircle2 size={18} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="details-info-card">
            <span className="details-eyebrow">DEVELOPMENT</span>
            <h2>Technologies</h2>
            <div className="details-technologies">
              {(project.technologies || []).map((tech, index) => (
                <span key={index}>{tech}</span>
              ))}
            </div>
          </div>
        </section>

        <div className="details-bottom-link">
          <Link to="/products">
            Explore More Products <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
