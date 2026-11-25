import { useEffect, useState } from "react";
import { Code2, Palette, Braces, Network, Save, RotateCcw } from "lucide-react";
import "./ToolsManagement.css";

const STORAGE_KEY = "online-tools-enabled-categories";

const categories = [
  { id: "html", name: "HTML Tools", description: "HTML editor, formatter and validator.", icon: Code2 },
  { id: "css", name: "CSS Tools", description: "CSS formatter, color picker and gradient tools.", icon: Palette },
  { id: "javascript", name: "JavaScript Tools", description: "JavaScript editor, formatter and console.", icon: Braces },
  { id: "network", name: "Network Tools", description: "IPv4 validator and subnet calculator.", icon: Network },
];

const defaultSettings = {
  html: true,
  css: true,
  javascript: true,
  network: true,
};

function readSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

export default function ToolsManagement() {
  const [settings, setSettings] = useState(readSettings);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const refresh = () => setSettings(readSettings());
    window.addEventListener("online-tools-config-change", refresh);
    return () => window.removeEventListener("online-tools-config-change", refresh);
  }, []);

  const toggleCategory = (id) => {
    setSettings((current) => ({ ...current, [id]: !current[id] }));
    setSavedMessage("");
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("online-tools-config-change"));
    setSavedMessage("Online Tools settings saved successfully.");
  };

  const resetSettings = () => {
    setSettings({ ...defaultSettings });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    window.dispatchEvent(new Event("online-tools-config-change"));
    setSavedMessage("All tool categories have been enabled.");
  };

  const enabledCount = categories.filter((item) => settings[item.id]).length;

  return (
    <div className="sh-tools-management">
      <div className="sh-tools-heading">
        <div>
          <span className="sh-tools-eyebrow">WEBSITE FEATURES</span>
          <h1>Online Tools</h1>
          <p>Manage which tool categories are visible on your public website.</p>
        </div>
        <div className="sh-tools-count">
          <strong>{enabledCount}/4</strong>
          <span>Categories enabled</span>
        </div>
      </div>

      <div className="sh-tools-notice">
        Changes are saved in this browser. The public Online Tools page will use these settings.
      </div>

      <div className="sh-tools-category-list">
        {categories.map((item) => {
          const Icon = item.icon;
          const enabled = Boolean(settings[item.id]);

          return (
            <div className="sh-tools-category-card" key={item.id}>
              <div className="sh-tools-category-icon">
                <Icon size={23} />
              </div>

              <div className="sh-tools-category-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className={enabled ? "sh-tools-status is-enabled" : "sh-tools-status"}>
                  {enabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              <button
                type="button"
                className={`sh-tools-switch ${enabled ? "is-on" : ""}`}
                role="switch"
                aria-checked={enabled}
                aria-label={`Toggle ${item.name}`}
                onClick={() => toggleCategory(item.id)}
              >
                <span />
              </button>
            </div>
          );
        })}
      </div>

      <div className="sh-tools-actions">
        <button type="button" className="sh-tools-reset" onClick={resetSettings}>
          <RotateCcw size={17} /> Enable all
        </button>
        <button type="button" className="sh-tools-save" onClick={saveSettings}>
          <Save size={17} /> Save Settings
        </button>
      </div>

      {savedMessage && <div className="sh-tools-success">{savedMessage}</div>}
    </div>
  );
}
