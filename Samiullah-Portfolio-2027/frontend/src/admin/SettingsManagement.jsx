import { useEffect, useState } from "react";
import { UserRound, LockKeyhole, ShieldCheck, Save, RefreshCw } from "lucide-react";
import "./SettingsManagement.css";

const API = "http://localhost:8001/api/admin-settings.php";

export default function SettingsManagement() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadSettings() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API, { credentials: "include" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not load settings.");
      setUsername(data.admin.username || "");
    } catch (err) {
      setError(err.message || "Connection error.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(API, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Update failed.");

      setMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Connection error.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="settings-loading"><RefreshCw /> Loading account settings...</div>;

  return (
    <section className="settings-page">
      <div className="settings-heading">
        <div className="settings-heading-icon"><ShieldCheck size={25} /></div>
        <div>
          <span className="settings-eyebrow">ACCOUNT & SECURITY</span>
          <h2>Admin Settings</h2>
          <p>Manage your administrator username and password securely.</p>
        </div>
      </div>

      <form className="settings-card" onSubmit={handleSubmit}>
        <div className="settings-card-title">
          <UserRound size={20} />
          <div><h3>Account Information</h3><p>Change your administrator username.</p></div>
        </div>

        <label className="settings-label" htmlFor="settings-username">Admin Username</label>
        <input
          id="settings-username"
          className="settings-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          minLength={3}
          maxLength={100}
          required
          autoComplete="username"
        />

        <div className="settings-section-divider" />

        <div className="settings-card-title">
          <LockKeyhole size={20} />
          <div><h3>Security & Password</h3><p>Confirm your current password before saving changes.</p></div>
        </div>

        <label className="settings-label" htmlFor="current-password">Current Password</label>
        <input
          id="current-password"
          className="settings-input"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <label className="settings-label" htmlFor="new-password">New Password <span>(optional)</span></label>
        <input
          id="new-password"
          className="settings-input"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />

        <label className="settings-label" htmlFor="confirm-password">Confirm New Password</label>
        <input
          id="confirm-password"
          className="settings-input"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Repeat your new password"
        />

        <div className="settings-security-note">
          <ShieldCheck size={18} />
          Passwords are stored securely using PHP password hashing.
        </div>

        {error && <div className="settings-alert settings-alert-error">{error}</div>}
        {message && <div className="settings-alert settings-alert-success">{message}</div>}

        <div className="settings-actions">
          <button className="settings-save-button" type="submit" disabled={saving}>
            <Save size={17} /> {saving ? "Saving..." : "Save Account Settings"}
          </button>
        </div>
      </form>
    </section>
  );
}
