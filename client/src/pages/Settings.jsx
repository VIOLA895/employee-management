import {
  Bell,
  LockKeyhole,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="settings-page">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">SYSTEM</span>
          <h1>Settings</h1>
          <p>Manage your account and workspace preferences.</p>
        </div>
      </header>

      <div className="settings-grid">
        <section className="dashboard-panel settings-card">
          <div className="settings-card-icon">
            <UserRound size={19} />
          </div>

          <div>
            <span className="panel-label">ACCOUNT</span>
            <h2>Profile</h2>
            <p>Manage your personal account information.</p>
          </div>
        </section>

        <section className="dashboard-panel settings-card">
          <div className="settings-card-icon">
            <Bell size={19} />
          </div>

          <div>
            <span className="panel-label">NOTIFICATIONS</span>
            <h2>Notifications</h2>
            <p>Manage your notification preferences.</p>
          </div>
        </section>

        <section className="dashboard-panel settings-card">
          <div className="settings-card-icon">
            <LockKeyhole size={19} />
          </div>

          <div>
            <span className="panel-label">SECURITY</span>
            <h2>Password & security</h2>
            <p>Manage your password and account security.</p>
          </div>
        </section>

        <section className="dashboard-panel settings-card">
          <div className="settings-card-icon">
            <SettingsIcon size={19} />
          </div>

          <div>
            <span className="panel-label">WORKSPACE</span>
            <h2>Workspace settings</h2>
            <p>Configure your organization preferences.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;