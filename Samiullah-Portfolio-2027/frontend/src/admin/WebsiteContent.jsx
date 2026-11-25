import { useEffect, useState } from "react";
import {
  Globe, RefreshCw, Save, FileText, CheckCircle2,
  AlertCircle, Eye, EyeOff
} from "lucide-react";
import "./WebsiteContent.css";

const API = "http://localhost:8001/api/pages.php";

export default function WebsiteContent() {
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadPages() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API, {
        method: "GET",
        credentials: "include"
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load pages.");
      }

      const data = Array.isArray(result.data) ? result.data : [];
      setPages(data);

      setSelected(current => {
        if (!data.length) return null;

        const updated = current
          ? data.find(page => Number(page.id) === Number(current.id))
          : null;

        return updated || data[0];
      });
    } catch (err) {
      setError(err.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, []);

  function updateSelected(field, value) {
    setSelected(current => ({
      ...current,
      [field]: value
    }));
  }

  async function savePage(event) {
    event.preventDefault();

    if (!selected) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(API, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: Number(selected.id),
          page_title: selected.page_title,
          page_content: selected.page_content || "",
          is_active: Number(selected.is_active)
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save page.");
      }

      setMessage("Page updated successfully.");
      await loadPages();
    } catch (err) {
      setError(err.message || "Could not save page.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="wc-page">
      <div className="wc-heading">
        <div>
          <span className="wc-eyebrow">
            <Globe size={15} /> WEBSITE CONTROL
          </span>
          <h1>Website Content</h1>
          <p>Manage the content of your public website pages.</p>
        </div>

        <button
          className="wc-refresh"
          type="button"
          onClick={loadPages}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="wc-summary">
        <div className="wc-summary-card">
          <Globe size={23} />
          <div>
            <strong>{pages.length}</strong>
            <span>Total Pages</span>
          </div>
        </div>

        <div className="wc-summary-card">
          <Eye size={23} />
          <div>
            <strong>{pages.filter(p => Number(p.is_active) === 1).length}</strong>
            <span>Active Pages</span>
          </div>
        </div>

        <div className="wc-summary-card">
          <EyeOff size={23} />
          <div>
            <strong>{pages.filter(p => Number(p.is_active) === 0).length}</strong>
            <span>Inactive Pages</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="wc-alert wc-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {message && (
        <div className="wc-alert wc-success">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      <div className="wc-layout">
        <aside className="wc-page-list">
          <h2>Website Pages</h2>
          <p>Select a page to manage.</p>

          {loading ? (
            <div className="wc-loading">
              <RefreshCw size={22} />
              Loading pages...
            </div>
          ) : pages.length === 0 ? (
            <p>No pages found.</p>
          ) : (
            pages.map(page => (
              <button
                type="button"
                key={page.id}
                className={`wc-page-item ${
                  Number(selected?.id) === Number(page.id) ? "active" : ""
                }`}
                onClick={() => {
                  setSelected(page);
                  setMessage("");
                  setError("");
                }}
              >
                <FileText size={19} />
                <span>
                  <strong>{page.page_title}</strong>
                  <small>/{page.page_slug}</small>
                </span>
                <span className={`wc-status ${
                  Number(page.is_active) === 1 ? "is-active" : "is-inactive"
                }`}>
                  {Number(page.is_active) === 1 ? "Active" : "Inactive"}
                </span>
              </button>
            ))
          )}
        </aside>

        <section className="wc-editor">
          {!selected ? (
            <div className="wc-empty">
              <FileText size={42} />
              <h2>Select a page</h2>
              <p>Choose a page from the list to edit its content.</p>
            </div>
          ) : (
            <form onSubmit={savePage}>
              <div className="wc-editor-heading">
                <div>
                  <span>PAGE EDITOR</span>
                  <h2>{selected.page_title}</h2>
                  <small>Page URL: /{selected.page_slug}</small>
                </div>
                <FileText size={30} />
              </div>

              <label>Page Title</label>
              <input
                type="text"
                value={selected.page_title || ""}
                onChange={e => updateSelected("page_title", e.target.value)}
                required
              />

              <label>Page Content</label>
              <textarea
                rows={12}
                value={selected.page_content || ""}
                onChange={e => updateSelected("page_content", e.target.value)}
                placeholder="Write the content for this page..."
              />

              <label className="wc-toggle">
                <input
                  type="checkbox"
                  checked={Number(selected.is_active) === 1}
                  onChange={e =>
                    updateSelected("is_active", e.target.checked ? 1 : 0)
                  }
                />
                <span>
                  <strong>Page is active</strong>
                  <small>
                    Active pages can be loaded by public visitors.
                  </small>
                </span>
              </label>

              <div className="wc-editor-footer">
                <span>Changes are saved in the database.</span>
                <button type="submit" disabled={saving}>
                  <Save size={17} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
