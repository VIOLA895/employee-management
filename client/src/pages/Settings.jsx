import { useState } from "react";
import {
  Bell,
  Check,
  LockKeyhole,
  Save,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (event) => {
    event.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="settings-page">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">SYSTEM</span>
          <h1>Settings</h1>
          <p>Manage your account and workspace preferences.</p>
        </div>
      </header>

      <div className="settings-layout">
        <aside className="settings-navigation dashboard-panel">
          <span className="panel-label">SETTINGS</span>

          <button type="button" className="settings-nav-item active">
            <UserRound size={17} />
            <span>Profile</span>
          </button>

          <button type="button" className="settings-nav-item">
            <Bell size={17} />
            <span>Notifications</span>
          </button>

          <button type="button" className="settings-nav-item">
            <LockKeyhole size={17} />
            <span>Password & security</span>
          </button>

          <button type="button" className="settings-nav-item">
            <SettingsIcon size={17} />
            <span>Workspace</span>
          </button>
        </aside>

        <main className="settings-content">
          <section className="dashboard-panel settings-section">
            <div className="settings-section-header">
              <div>
                <span className="panel-label">ACCOUNT</span>
                <h2>Profile information</h2>
                <p>
                  Update the information associated with your WorkForce account.
                </p>
              </div>

              <div className="settings-card-icon">
                <UserRound size={19} />
              </div>
            </div>

            <form className="settings-form" onSubmit={handleSave}>
              <div className="settings-avatar-large">
                {name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="settings-form-grid">
                <div className="settings-field">
                  <label htmlFor="name">FULL NAME</label>

                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="email">EMAIL ADDRESS</label>

                  <input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                  />

                  <span className="settings-field-note">
                    Email address cannot be changed here.
                  </span>
                </div>
              </div>

              <div className="settings-form-footer">
                <span className={saved ? "settings-saved" : "settings-save-note"}>
                  {saved ? (
                    <>
                      <Check size={14} />
                      Changes saved
                    </>
                  ) : (
                    "Keep your account information up to date."
                  )}
                </span>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={!name.trim()}
                >
                  <Save size={15} />
                  Save changes
                </button>
              </div>
            </form>
          </section>

          <section className="dashboard-panel settings-section">
            <div className="settings-section-header">
              <div>
                <span className="panel-label">SECURITY</span>
                <h2>Password & security</h2>
                <p>
                  Manage your password and keep your account secure.
                </p>
              </div>

              <div className="settings-card-icon">
                <LockKeyhole size={19} />
              </div>
            </div>

            <div className="settings-info-row">
              <div>
                <strong>Password</strong>
                <span>Change your account password.</span>
              </div>

              <button type="button" className="secondary-button">
                Change password
              </button>
            </div>
          </section>

          <section className="dashboard-panel settings-section">
            <div className="settings-section-header">
              <div>
                <span className="panel-label">NOTIFICATIONS</span>
                <h2>Notifications</h2>
                <p>
                  Control how WorkForce keeps you informed.
                </p>
              </div>

              <div className="settings-card-icon">
                <Bell size={19} />
              </div>
            </div>

            <div className="settings-toggle-row">
              <div>
                <strong>Attendance updates</strong>
                <span>
                  Receive updates when attendance records change.
                </span>
              </div>

              <label className="settings-switch">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>

            <div className="settings-toggle-row">
              <div>
                <strong>Employee updates</strong>
                <span>
                  Receive notifications about employee changes.
                </span>
              </div>

              <label className="settings-switch">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Settings;