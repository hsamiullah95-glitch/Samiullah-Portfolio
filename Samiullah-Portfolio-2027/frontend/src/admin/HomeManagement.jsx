import { useEffect, useState } from "react";
import {
  Save, RefreshCw, Upload, Image as ImageIcon, CheckCircle,
  AlertCircle, User, Type, BarChart3, Code2, Network, Languages,
  Briefcase, MessageSquare, Plus, Trash2, ChevronDown
} from "lucide-react";
import "./HomeManagement.css";

const API = "http://localhost:8001/api/home-content.php";

const DEFAULT_CONTENT = {
  hero: {
    status: "COMPUTER SCIENCE STUDENT & IT ENTHUSIAST",
    greeting: "ASSALAMUALAIKUM / HELLO, I'M",
    firstName: "Samiullah",
    lastName: "Hakimi.",
    subtitle: "Web Developer & IT Professional",
    description: "I am a Computer Science student passionate about web development, database systems and computer networking. I enjoy building useful digital solutions and continuously improving my skills.",
    primaryButton: "Explore My Work",
    secondaryButton: "Contact Me"
  },
  profile: {
    image: "/images/samiullah-profile.jpg",
    name: "Samiullah Hakimi",
    title: "Web Developer & IT Enthusiast",
    location: "Kandahar, Afghanistan"
  },
  stats: [
    { icon: "GraduationCap", number: "04", label: "University Year" },
    { icon: "BriefcaseBusiness", number: "1.5+", label: "Years IT Experience" },
    { icon: "Code2", number: "08", label: "Core Technologies" }
  ],
  webSkills: [
    { name: "HTML5", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "CSS3", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "JavaScript", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "React", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "PHP", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
    { name: "MySQL", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "Laravel", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" },
    { name: "Git", image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" }
  ],
  networkSkills: [
    { name: "CCNA", icon: "Network", detail: "Networking Fundamentals" },
    { name: "Routing & Switching", icon: "Router", detail: "Network Configuration" },
    { name: "MikroTik", icon: "Wifi", detail: "Network Administration" },
    { name: "GNS3", icon: "Cable", detail: "Network Simulation" },
    { name: "Windows Server", icon: "Server", detail: "Server Administration" },
    { name: "DNS & DHCP", icon: "Globe", detail: "Network Services" },
    { name: "SNMP", icon: "Monitor", detail: "Network Monitoring" },
    { name: "TCP/IP", icon: "ShieldCheck", detail: "Network Protocols" }
  ],
  cctvSkills: [
    { name: "IP Cameras", icon: "Camera", detail: "IP Camera Setup" },
    { name: "CCTV Installation", icon: "ShieldCheck", detail: "Camera Installation" },
    { name: "NVR / DVR", icon: "HardDrive", detail: "Recording Systems" },
    { name: "IT Support", icon: "Laptop", detail: "Technical Support" },
    { name: "Computer Hardware", icon: "Monitor", detail: "Hardware Troubleshooting" },
    { name: "Windows Support", icon: "Monitor", detail: "Windows Configuration" }
  ],
  languages: [
    { name: "Pashto", native: "پښتو", level: "Native", flag: "🇦🇫" },
    { name: "Dari", native: "دري", level: "Fluent", flag: "🇦🇫" },
    { name: "English", native: "English", level: "Good Knowledge", flag: "🌐" }
  ],
  expertiseTitle: "My Areas of Expertise",
  expertiseDescription: "I enjoy creating useful digital solutions through development, databases and IT infrastructure.",
  expertise: [
    { icon: "Code2", title: "Web Development", description: "Building responsive and modern websites using HTML, CSS, JavaScript and React.", linkText: "Explore Services" },
    { icon: "Database", title: "Database Development", description: "Working with PHP and MySQL to build organized database-driven applications.", linkText: "Explore Services" },
    { icon: "Network", title: "Networking & CCTV", description: "Computer networking, network administration, IP cameras and IT support.", linkText: "Explore Services" }
  ],
  cta: {
    eyebrow: "LET'S BUILD SOMETHING GREAT",
    title: "Have a project in mind?",
    description: "Let's work together and turn your ideas into useful digital experiences.",
    button: "Let's Talk"
  },
  floatingSkills: {
    first: "Web Development",
    second: "Database Systems"
  }
};

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="hm-field">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 3 }) {
  return (
    <label className="hm-field">
      <span>{label}</span>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="hm-section">
      <div className="hm-section-heading">
        <div className="hm-section-icon"><Icon size={19} /></div>
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
      </div>
      <div className="hm-section-content">{children}</div>
    </section>
  );
}

function HomeManagement() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [savedContent, setSavedContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    setLoading(true);
    try {
      const response = await fetch(API, { credentials: "include" });
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Could not load Home Page content.");
      }

      const data = { ...DEFAULT_CONTENT, ...(result.data || {}) };
      setContent(data);
      setSavedContent(data);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Could not connect to server." });
    } finally {
      setLoading(false);
    }
  }

  function updateField(section, field, value) {
    setContent((previous) => ({
      ...previous,
      [section]: {
        ...(previous[section] || {}),
        [field]: value
      }
    }));
  }

  function updateRoot(field, value) {
    setContent((previous) => ({ ...previous, [field]: value }));
  }

  function updateArrayItem(arrayName, index, field, value) {
    setContent((previous) => {
      const items = [...(previous[arrayName] || [])];
      items[index] = { ...items[index], [field]: value };
      return { ...previous, [arrayName]: items };
    });
  }

  function addArrayItem(arrayName, item) {
    setContent((previous) => ({
      ...previous,
      [arrayName]: [...(previous[arrayName] || []), item]
    }));
  }

  function removeArrayItem(arrayName, index) {
    setContent((previous) => ({
      ...previous,
      [arrayName]: previous[arrayName].filter((_, i) => i !== index)
    }));
  }

  async function saveContent() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch(API, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Could not save Home Page content.");
      }

      setSavedContent(content);
      setMessage({ type: "success", text: "Home Page changes saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Save failed. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select a valid image file." });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5 MB." });
      event.target.value = "";
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(API, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Image upload failed.");
      }

      const imageUrl = result.data?.image;
      if (!imageUrl) throw new Error("Image URL was not returned by server.");

      updateField("profile", "image", imageUrl);
      setMessage({ type: "success", text: "Image uploaded. Click Save Changes to publish it." });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Image upload failed." });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function resetChanges() {
    setContent(savedContent);
    setMessage({ type: "success", text: "Unsaved changes have been reset." });
  }

  if (loading) {
    return (
      <div className="hm-loading">
        <RefreshCw className="hm-spin" size={22} />
        Loading Home Page settings...
      </div>
    );
  }

  return (
    <div className="hm-management">
      <div className="hm-topbar">
        <div>
          <span className="hm-eyebrow">WEBSITE CONTENT</span>
          <h2>Home Page Management</h2>
          <p>Manage the text, profile, skills and sections displayed on your website.</p>
        </div>
        <div className="hm-top-actions">
          <button className="hm-reset-button" onClick={resetChanges} disabled={saving || uploading}>
            <RefreshCw size={16} /> Reset
          </button>
          <button className="hm-save-button" onClick={saveContent} disabled={saving || uploading}>
            {saving ? <RefreshCw className="hm-spin" size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`hm-message ${message.type}`}>
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <Section icon={User} title="Profile & Hero" description="Your profile information and the main introduction shown at the top of Home Page.">
        <div className="hm-profile-layout">
          <div className="hm-image-panel">
            <div className="hm-image-preview">
              {content.profile?.image ? (
                <img src={content.profile.image} alt="Profile preview" />
              ) : (
                <ImageIcon size={42} />
              )}
            </div>
            <label className="hm-upload-button">
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Profile Image"}
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadImage} disabled={uploading} />
            </label>
            <small>JPG, PNG or WEBP · Maximum 5 MB</small>
            <Field label="Image URL" value={content.profile?.image} onChange={(v) => updateField("profile", "image", v)} />
          </div>

          <div className="hm-fields-grid">
            <Field label="Profile Name" value={content.profile?.name} onChange={(v) => updateField("profile", "name", v)} />
            <Field label="Profile Title" value={content.profile?.title} onChange={(v) => updateField("profile", "title", v)} />
            <Field label="Location" value={content.profile?.location} onChange={(v) => updateField("profile", "location", v)} />
            <Field label="Hero Status" value={content.hero?.status} onChange={(v) => updateField("hero", "status", v)} />
            <Field label="Greeting Text" value={content.hero?.greeting} onChange={(v) => updateField("hero", "greeting", v)} />
            <Field label="First Name" value={content.hero?.firstName} onChange={(v) => updateField("hero", "firstName", v)} />
            <Field label="Last Name" value={content.hero?.lastName} onChange={(v) => updateField("hero", "lastName", v)} />
            <Field label="Hero Subtitle" value={content.hero?.subtitle} onChange={(v) => updateField("hero", "subtitle", v)} />
            <TextAreaField label="Hero Description" value={content.hero?.description} onChange={(v) => updateField("hero", "description", v)} rows={4} />
            <Field label="Primary Button Text" value={content.hero?.primaryButton} onChange={(v) => updateField("hero", "primaryButton", v)} />
            <Field label="Secondary Button Text" value={content.hero?.secondaryButton} onChange={(v) => updateField("hero", "secondaryButton", v)} />
          </div>
        </div>
      </Section>

      <Section icon={BarChart3} title="Statistics Cards" description="Edit the three statistic cards displayed on your Home Page.">
        <div className="hm-repeat-grid">
          {(content.stats || []).map((item, index) => (
            <div className="hm-repeat-card" key={index}>
              <div className="hm-card-title"><strong>Statistic {index + 1}</strong><button className="hm-icon-danger" onClick={() => removeArrayItem("stats", index)} title="Delete"><Trash2 size={16} /></button></div>
              <Field label="Icon Name" value={item.icon} onChange={(v) => updateArrayItem("stats", index, "icon", v)} />
              <Field label="Number" value={item.number} onChange={(v) => updateArrayItem("stats", index, "number", v)} />
              <Field label="Label" value={item.label} onChange={(v) => updateArrayItem("stats", index, "label", v)} />
            </div>
          ))}
        </div>
        <button className="hm-add-button" onClick={() => addArrayItem("stats", { icon: "Star", number: "01", label: "New Statistic" })}><Plus size={16} /> Add Statistic</button>
      </Section>

      <Section icon={Code2} title="Web Development Skills" description="Manage technology names and their logo image URLs.">
        <div className="hm-repeat-grid">
          {(content.webSkills || []).map((item, index) => (
            <div className="hm-repeat-card" key={index}>
              <div className="hm-card-title"><strong>Skill {index + 1}</strong><button className="hm-icon-danger" onClick={() => removeArrayItem("webSkills", index)} title="Delete"><Trash2 size={16} /></button></div>
              <Field label="Skill Name" value={item.name} onChange={(v) => updateArrayItem("webSkills", index, "name", v)} />
              <Field label="Logo Image URL" value={item.image} onChange={(v) => updateArrayItem("webSkills", index, "image", v)} />
              {item.image && <img className="hm-skill-logo" src={item.image} alt={item.name} />}
            </div>
          ))}
        </div>
        <button className="hm-add-button" onClick={() => addArrayItem("webSkills", { name: "New Skill", image: "" })}><Plus size={16} /> Add Web Skill</button>
      </Section>

      <Section icon={Network} title="Networking Skills" description="Manage networking skills, icon names and descriptions.">
        <div className="hm-repeat-grid">
          {(content.networkSkills || []).map((item, index) => (
            <div className="hm-repeat-card" key={index}>
              <div className="hm-card-title"><strong>Network Skill {index + 1}</strong><button className="hm-icon-danger" onClick={() => removeArrayItem("networkSkills", index)} title="Delete"><Trash2 size={16} /></button></div>
              <Field label="Skill Name" value={item.name} onChange={(v) => updateArrayItem("networkSkills", index, "name", v)} />
              <Field label="Icon Name" value={item.icon} onChange={(v) => updateArrayItem("networkSkills", index, "icon", v)} />
              <Field label="Detail" value={item.detail} onChange={(v) => updateArrayItem("networkSkills", index, "detail", v)} />
            </div>
          ))}
        </div>
        <button className="hm-add-button" onClick={() => addArrayItem("networkSkills", { name: "New Network Skill", icon: "Network", detail: "Skill Description" })}><Plus size={16} /> Add Network Skill</button>
      </Section>

      <Section icon={Briefcase} title="CCTV & IT Skills" description="Manage CCTV, camera and technical support skills.">
        <div className="hm-repeat-grid">
          {(content.cctvSkills || []).map((item, index) => (
            <div className="hm-repeat-card" key={index}>
              <div className="hm-card-title"><strong>CCTV / IT Skill {index + 1}</strong><button className="hm-icon-danger" onClick={() => removeArrayItem("cctvSkills", index)} title="Delete"><Trash2 size={16} /></button></div>
              <Field label="Skill Name" value={item.name} onChange={(v) => updateArrayItem("cctvSkills", index, "name", v)} />
              <Field label="Icon Name" value={item.icon} onChange={(v) => updateArrayItem("cctvSkills", index, "icon", v)} />
              <Field label="Detail" value={item.detail} onChange={(v) => updateArrayItem("cctvSkills", index, "detail", v)} />
            </div>
          ))}
        </div>
        <button className="hm-add-button" onClick={() => addArrayItem("cctvSkills", { name: "New CCTV Skill", icon: "Camera", detail: "Skill Description" })}><Plus size={16} /> Add CCTV / IT Skill</button>
      </Section>

      <Section icon={Languages} title="Languages" description="Edit the languages displayed on your profile.">
        <div className="hm-repeat-grid">
          {(content.languages || []).map((item, index) => (
            <div className="hm-repeat-card" key={index}>
              <div className="hm-card-title"><strong>Language {index + 1}</strong><button className="hm-icon-danger" onClick={() => removeArrayItem("languages", index)} title="Delete"><Trash2 size={16} /></button></div>
              <Field label="Language Name" value={item.name} onChange={(v) => updateArrayItem("languages", index, "name", v)} />
              <Field label="Native Name" value={item.native} onChange={(v) => updateArrayItem("languages", index, "native", v)} />
              <Field label="Level" value={item.level} onChange={(v) => updateArrayItem("languages", index, "level", v)} />
              <Field label="Flag / Symbol" value={item.flag} onChange={(v) => updateArrayItem("languages", index, "flag", v)} />
            </div>
          ))}
        </div>
        <button className="hm-add-button" onClick={() => addArrayItem("languages", { name: "New Language", native: "", level: "Good", flag: "🌐" })}><Plus size={16} /> Add Language</button>
      </Section>

      <Section icon={Briefcase} title="Areas of Expertise" description="Manage the expertise heading and the three service cards shown on Home Page.">
        <div className="hm-fields-grid">
          <Field label="Section Title" value={content.expertiseTitle} onChange={(v) => updateRoot("expertiseTitle", v)} />
          <TextAreaField label="Section Description" value={content.expertiseDescription} onChange={(v) => updateRoot("expertiseDescription", v)} />
        </div>
        <div className="hm-repeat-grid hm-expertise-grid">
          {(content.expertise || []).map((item, index) => (
            <div className="hm-repeat-card" key={index}>
              <div className="hm-card-title"><strong>Expertise {index + 1}</strong><button className="hm-icon-danger" onClick={() => removeArrayItem("expertise", index)} title="Delete"><Trash2 size={16} /></button></div>
              <Field label="Icon Name" value={item.icon} onChange={(v) => updateArrayItem("expertise", index, "icon", v)} />
              <Field label="Title" value={item.title} onChange={(v) => updateArrayItem("expertise", index, "title", v)} />
              <TextAreaField label="Description" value={item.description} onChange={(v) => updateArrayItem("expertise", index, "description", v)} />
              <Field label="Link Button Text" value={item.linkText} onChange={(v) => updateArrayItem("expertise", index, "linkText", v)} />
            </div>
          ))}
        </div>
        <button className="hm-add-button" onClick={() => addArrayItem("expertise", { icon: "Star", title: "New Expertise", description: "Describe this expertise.", linkText: "Explore Services" })}><Plus size={16} /> Add Expertise</button>
      </Section>

      <Section icon={MessageSquare} title="Call To Action (CTA)" description="Edit the invitation section near the bottom of Home Page.">
        <div className="hm-fields-grid">
          <Field label="Small Heading" value={content.cta?.eyebrow} onChange={(v) => updateField("cta", "eyebrow", v)} />
          <Field label="Main Title" value={content.cta?.title} onChange={(v) => updateField("cta", "title", v)} />
          <TextAreaField label="Description" value={content.cta?.description} onChange={(v) => updateField("cta", "description", v)} />
          <Field label="Button Text" value={content.cta?.button} onChange={(v) => updateField("cta", "button", v)} />
        </div>
      </Section>

      <Section icon={Type} title="Floating Skill Labels" description="Edit the small floating labels shown in the Home Page hero section.">
        <div className="hm-fields-grid">
          <Field label="First Floating Label" value={content.floatingSkills?.first} onChange={(v) => updateField("floatingSkills", "first", v)} />
          <Field label="Second Floating Label" value={content.floatingSkills?.second} onChange={(v) => updateField("floatingSkills", "second", v)} />
        </div>
      </Section>

      <div className="hm-bottom-actions">
        <span>Remember to save your changes before leaving this page.</span>
        <button className="hm-save-button" onClick={saveContent} disabled={saving || uploading}>
          {saving ? <RefreshCw className="hm-spin" size={16} /> : <Save size={16} />}
          {saving ? "Saving..." : "Save All Home Page Changes"}
        </button>
      </div>
    </div>
  );
}

export default HomeManagement;
