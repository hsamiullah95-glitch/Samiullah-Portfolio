import { useEffect, useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import "./HeaderFooterManagement.css";

const API = "http://localhost:8001/api/header-footer.php";

const fields = [
  ["brand_name", "Website Brand Name"],
  ["footer_tagline", "Footer Tagline"],
  ["footer_description", "Footer Description"],
  ["footer_cta_title", "Footer CTA Heading"],
  ["footer_cta_text", "Footer CTA Description"],
  ["footer_location", "Contact Location"],
  ["footer_email", "Contact Email"],
  ["footer_phone", "Contact Phone"],
  ["footer_copyright", "Copyright Text"],
  ["facebook_url", "Facebook URL"],
  ["instagram_url", "Instagram URL"],
  ["linkedin_url", "LinkedIn URL"],
  ["github_url", "GitHub URL"]
];

const emptySettings = Object.fromEntries(fields.map(([key]) => [key, ""]));

export default function HeaderFooterManagement() {
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSettings() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API, { credentials: "include" });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load settings.");
      }

      setSettings({ ...emptySettings, ...result.data });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleChange(key, value) {
    setSettings(previous => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(API, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save settings.");
      }

      setSettings({ ...emptySettings, ...result.data });
      setMessage("Settings saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="hf-management">Loading settings...</div>;

  return (
    <section className="hf-management">
      <div className="hf-heading">
        <div>
          <span className="hf-eyebrow">WEBSITE CUSTOMIZATION</span>
          <h2>Header & Footer Management</h2>
          <p>Manage your website brand, footer information and social links.</p>
        </div>

        <button type="button" className="hf-refresh" onClick={loadSettings}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {message && <div className="hf-success">{message}</div>}
      {error && <div className="hf-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="hf-section-title">Website Brand & Footer Information</div>

        <div className="hf-fields">
          {fields.map(([key, label]) => (
            <label className="hf-field" key={key}>
              <span>{label}</span>

              {key.includes("description") || key.includes("cta_title") ||
                key.includes("cta_text") ? (
                <textarea
                  value={settings[key]}
                  onChange={e => handleChange(key, e.target.value)}
                  rows={3}
                />
              ) : (
                <input
                  type="text"
                  value={settings[key]}
                  onChange={e => handleChange(key, e.target.value)}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              )}
            </label>
          ))}
        </div>

        <div className="hf-actions">
          <button type="submit" disabled={saving}>
            <Save size={17} />
            {saving ? "Saving..." : "Save Header & Footer"}
          </button>
        </div>
      </form>
    </section>
  );
}
