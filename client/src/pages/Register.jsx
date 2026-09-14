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
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../../api/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await registerRequest({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        error?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page register-page">
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
              Build your team.
              <br />
              <span>Manage it better.</span>
            </h1>

            <p>
              Create your WorkForce account and bring your employee
              management into one organized workspace.
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
            <span className="login-label">GET STARTED</span>
            <h2>Create your account</h2>
            <p>
              Set up your account to start managing your workforce.
            </p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="login-success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                autoComplete="name"
                required
                disabled={loading}
              />
            </div>

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
              <label htmlFor="password">Password</label>

              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? (
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
                {loading
                  ? "Creating account..."
                  : "Create account"}
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
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;