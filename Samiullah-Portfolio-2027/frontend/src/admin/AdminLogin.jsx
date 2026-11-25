import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Wifi
} from "lucide-react";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8001/api/admin-login.php",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            password
          })
        }
      );

      let rawText = await response.text();
      rawText = rawText.replace(/^\uFEFF/, "").trim();

      const data = JSON.parse(rawText);

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      navigate("/admin/dashboard", { replace: true });

    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);
      setError(
        err instanceof SyntaxError
          ? "Invalid server response. Please check the PHP API."
          : "Server Connection Error: " + err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="cyber-background">
        <div className="cyber-grid"></div>
        <div className="cyber-glow cyber-glow-one"></div>
        <div className="cyber-glow cyber-glow-two"></div>
        <div className="cyber-ring cyber-ring-one"></div>
        <div className="cyber-ring cyber-ring-two"></div>
        <div className="cyber-scanline"></div>
      </div>

      <div className="cyber-side-label cyber-side-left">
        <Cpu size={15} /> SYSTEM ACCESS
      </div>
      <div className="cyber-side-label cyber-side-right">
        <Wifi size={15} /> SECURE NETWORK
      </div>

      <section className="admin-login-card">
        <div className="login-top-line"></div>

        <div className="login-brand">
          <span className="brand-icon">SH</span>
          <span>HAKIMI <b>ADMIN</b></span>
          <span className="brand-online"></span>
        </div>

        <div className="login-avatar">
          {!imageError ? (
            <img
              src="/images/login_1.png"
              alt="Samiullah Hakimi"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="avatar-fallback">SH</span>
          )}
          <span className="avatar-status"></span>
        </div>

        <div className="login-heading">
          <span className="login-eyebrow">WELCOME BACK</span>
          <h1>Admin Login</h1>
          <p>Access your personal website control panel</p>
        </div>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="login-input-group">
            <label htmlFor="admin-username">USERNAME</label>
            <div className="login-input-wrapper">
              <UserRound className="input-icon" size={19} />
              <input
                id="admin-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="admin-password">PASSWORD</label>
            <div className="login-input-wrapper">
              <LockKeyhole className="input-icon" size={19} />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="admin-login-button"
            type="submit"
            disabled={loading}
          >
            <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
            {!loading && <ArrowRight size={19} />}
          </button>
        </form>

        <div className="login-security">
          <ShieldCheck size={16} />
          <span>SECURE ADMIN AREA</span>
          <span className="security-line"></span>
        </div>

        <footer className="admin-login-footer">
          © {new Date().getFullYear()} <strong>Samiullah Hakimi</strong>
          <span> • Personal Portfolio</span>
        </footer>
      </section>

      <div className="cyber-bottom-note">
        <span></span> HAKIMI DIGITAL SYSTEMS
      </div>
    </main>
  );
}

