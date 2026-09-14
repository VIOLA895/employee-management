import {
  CalendarDays,
  Clock3,
  Users,
  CheckCircle2,
} from "lucide-react";

const Attendance = () => {
  return (
    <div className="attendance-page">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">ATTENDANCE</span>
          <h1>Attendance</h1>
          <p>Track employee attendance and working hours.</p>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-top">
            <span>Present today</span>
            <div className="stat-icon">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="stat-value">0</div>

          <div className="stat-change positive">
            <span>Employees present</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Absent</span>
            <div className="stat-icon">
              <Users size={18} />
            </div>
          </div>

          <div className="stat-value">0</div>

          <div className="stat-change neutral">
            <span>Not checked in</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>On leave</span>
            <div className="stat-icon">
              <CalendarDays size={18} />
            </div>
          </div>

          <div className="stat-value">0</div>

          <div className="stat-change neutral">
            <span>Currently on leave</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Working hours</span>
            <div className="stat-icon">
              <Clock3 size={18} />
            </div>
          </div>

          <div className="stat-value">0h</div>

          <div className="stat-change neutral">
            <span>Today's total</span>
          </div>
        </div>
      </div>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">DAILY RECORD</span>
            <h2>Today's attendance</h2>
          </div>
        </div>

        <div className="employee-list-message">
          Attendance tracking will appear here.
        </div>
      </section>
    </div>
  );
};

export default Attendance;