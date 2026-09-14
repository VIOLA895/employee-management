import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");

    try {
      await login(formData);
    } catch (error) {
      setError(
        error?.message ||
          "Unable to sign in. Please check your details and try again."
      );
    }
  };

  const handleForgotPassword = () => {
    setError("Password recovery is not available yet.");
  };

  return (
    <main className="login-page">
      <div className="login-background-shape shape-one" />
      <div className="login-background-shape shape-two" />

      <section className="login-container">
        <div className="login-showcase">
          <div className="brand">
            <div className="brand-icon">
              <BriefcaseBusiness size={21} strokeWidth={2.2} />
            </div>
            <span>WorkForce</span>
          </div>

          <div className="showcase-content">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Employee management made simple
            </span>

            <h1>
              Your people.
              <br />
              <span>Managed better.</span>
            </h1>

            <p>
              Keep your team organized, productive, and connected from one
              simple workspace.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Users size={18} />
                </div>
                <div>
                  <strong>Manage your team</strong>
                  <span>Employee records in one place</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>Secure by design</strong>
                  <span>Keep sensitive information protected</span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <strong>Stay organized</strong>
                  <span>Track roles, departments and status</span>
                </div>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <span>© 2026 WorkForce</span>
            <span>Built for modern teams</span>
          </div>
        </div>

        <div className="login-panel">
          <div className="mobile-brand">
            <div className="brand-icon">
              <BriefcaseBusiness size={20} />
            </div>
            <span>WorkForce</span>
          </div>

          <div className="login-header">
            <span className="login-label">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>
              Enter your details below to continue to your workspace.
            </p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">Password</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Sign in"}
              </span>

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="login-security">
            <ShieldCheck size={15} />
            <span>
              Your information is securely protected
            </span>
          </div>
          <p className="register-login-link">
  Don't have an account?{" "}
  <button
    type="button"
    onClick={() => window.location.href = "/register"}
    disabled={loading}
  >
    Create account
  </button>
</p>
        </div>
      </section>
    </main>
  );
};

export default Login;