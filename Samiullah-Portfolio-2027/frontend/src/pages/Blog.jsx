import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, FileText } from "lucide-react";
import "./Blog.css";

const API = "http://localhost:8001/api/blog.php?public=1";
const BACKEND_ORIGIN = "http://localhost:8001";

function getBlogImageUrl(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${BACKEND_ORIGIN}/${image.replace(/^\/+/, "")}`;
}

export default function Blog() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        const response = await fetch(API, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load blog posts.");
        }

        if (active) {
          setPosts(Array.isArray(result.data) ? result.data : []);
        }
      } catch (err) {
        if (active) setError(err.message || "Unable to connect to Blog.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  const post = slug
    ? posts.find((item) => item.slug === slug)
    : null;

  if (loading) {
    return <section className="sh-blog-page"><p className="sh-blog-message">Loading articles...</p></section>;
  }

  if (error) {
    return (
      <section className="sh-blog-page">
        <p className="sh-blog-message">{error}</p>
      </section>
    );
  }

  if (slug) {
    if (!post) {
      return (
        <section className="sh-blog-page">
          <div className="sh-blog-message">
            <h2>Article Not Found</h2>
            <Link to="/blog">Back to Blog</Link>
          </div>
        </section>
      );
    }

    return (
      <section className="sh-blog-page">
        <div className="sh-blog-container">
          <Link to="/blog" className="sh-blog-back">
            <ArrowLeft size={17} /> Back to Blog
          </Link>

          <article className="sh-blog-detail">
            {post.image && (
              <img className="sh-blog-detail-image" src={getBlogImageUrl(post.image)} alt={post.title} />
            )}

            <span className="sh-blog-category">{post.category || "General"}</span>
            <h1>{post.title}</h1>

            <div className="sh-blog-date">
              <CalendarDays size={16} />
              {post.created_at || ""}
            </div>

            {post.excerpt && <p className="sh-blog-excerpt">{post.excerpt}</p>}

            <div className="sh-blog-content">{post.content}</div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="sh-blog-page">
      <div className="sh-blog-container">
        <div className="sh-blog-heading">
          <span className="sh-blog-eyebrow">MY ARTICLES</span>
          <h1>Blog & Insights</h1>
          <p>Articles, ideas, tutorials and updates.</p>
        </div>

        {posts.length === 0 ? (
          <div className="sh-blog-message">
            <FileText size={36} />
            <h2>No Published Articles Yet</h2>
            <p>New articles will appear here when published.</p>
          </div>
        ) : (
          <div className="sh-blog-grid">
            {posts.map((item) => (
              <article className="sh-blog-card" key={item.id}>
                {item.image ? (
                  <img src={getBlogImageUrl(item.image)} alt={item.title} className="sh-blog-card-image" />
                ) : (
                  <div className="sh-blog-card-placeholder">
                    <FileText size={38} />
                  </div>
                )}

                <div className="sh-blog-card-body">
                  <span className="sh-blog-category">{item.category || "General"}</span>
                  <h2>{item.title}</h2>
                  <p>{item.excerpt || "Read this article to learn more."}</p>

                  <div className="sh-blog-card-bottom">
                    <small>{item.created_at || ""}</small>
                    <Link to={`/blog/${encodeURIComponent(item.slug)}`}>
                      Read More <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
