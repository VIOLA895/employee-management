import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogIn,
  LogOut,
  RefreshCw,
  Users,
} from "lucide-react";

import {
  getAttendance,
  checkIn,
  checkOut,
} from "../../api/attendance";

const getToday = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  return localDate.toISOString().split("T")[0];
};

const formatTime = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateHours = (checkInTime, checkOutTime) => {
  if (!checkInTime) return "—";

  const start = new Date(checkInTime);
  const end = checkOutTime ? new Date(checkOutTime) : new Date();

  const hours = (end - start) / (1000 * 60 * 60);

  if (hours < 0) return "—";

  return `${hours.toFixed(1)}h`;
};

const Attendance = () => {
  const [date, setDate] = useState(getToday());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAttendance(date);
      setRecords(response.data || []);
    } catch (err) {
      console.error("Failed to load attendance:", err);
      setError(err.message || "Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [date]);

  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let onLeave = 0;
    let totalHours = 0;

    records.forEach(({ employee, attendance }) => {
      if (employee.status === "ON_LEAVE" || attendance?.status === "ON_LEAVE") {
        onLeave += 1;
      } else if (attendance?.status === "PRESENT") {
        present += 1;
      } else {
        absent += 1;
      }

      if (attendance?.checkIn) {
        const start = new Date(attendance.checkIn);
        const end = attendance.checkOut
          ? new Date(attendance.checkOut)
          : new Date();

        const hours = (end - start) / (1000 * 60 * 60);

        if (hours > 0) {
          totalHours += hours;
        }
      }
    });

    return {
      present,
      absent,
      onLeave,
      totalHours: totalHours.toFixed(1),
    };
  }, [records]);

  const handleCheckIn = async (employeeId) => {
    try {
      setActionId(employeeId);
      setError("");

      await checkIn(employeeId);
      await loadAttendance();
    } catch (err) {
      console.error("Check-in failed:", err);
      setError(err.message || "Failed to check in employee.");
    } finally {
      setActionId(null);
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      setActionId(employeeId);
      setError("");

      await checkOut(employeeId);
      await loadAttendance();
    } catch (err) {
      console.error("Check-out failed:", err);
      setError(err.message || "Failed to check out employee.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="attendance-page">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">ATTENDANCE</span>
          <h1>Attendance</h1>
          <p>Track employee attendance and working hours.</p>
        </div>

        <div className="attendance-toolbar">
          <div className="date-input-wrapper">
            <CalendarDays size={17} />
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadAttendance}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      {error && (
        <div className="attendance-error">
          {error}
        </div>
      )}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-top">
            <span>Present</span>
            <div className="stat-icon">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="stat-value">{stats.present}</div>

          <div className="stat-change positive">
            <span>Checked in</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Absent</span>
            <div className="stat-icon">
              <Users size={18} />
            </div>
          </div>

          <div className="stat-value">{stats.absent}</div>

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

          <div className="stat-value">{stats.onLeave}</div>

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

          <div className="stat-value">{stats.totalHours}h</div>

          <div className="stat-change neutral">
            <span>Total tracked</span>
          </div>
        </div>
      </div>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">DAILY RECORD</span>
            <h2>
              Attendance for{" "}
              {new Date(`${date}T00:00:00`).toLocaleDateString([], {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h2>
          </div>

          <span className="attendance-count">
            {records.length} employees
          </span>
        </div>

        {loading ? (
          <div className="employee-list-message">
            Loading attendance...
          </div>
        ) : records.length === 0 ? (
          <div className="employee-list-message">
            No employees found.
          </div>
        ) : (
          <div className="attendance-table-wrapper">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>STATUS</th>
                  <th>CHECK IN</th>
                  <th>CHECK OUT</th>
                  <th>HOURS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {records.map(({ employee, attendance }) => {
                  const isOnLeave =
                    employee.status === "ON_LEAVE" ||
                    attendance?.status === "ON_LEAVE";

                  const isPresent = attendance?.status === "PRESENT";
                  const hasCheckedIn = Boolean(attendance?.checkIn);
                  const hasCheckedOut = Boolean(attendance?.checkOut);
                  const isWorking = hasCheckedIn && !hasCheckedOut;

                  return (
                    <tr key={employee.id}>
                      <td>
                        <div className="attendance-employee">
                          <div className="employee-avatar">
                            {employee.firstName?.charAt(0)}
                            {employee.lastName?.charAt(0)}
                          </div>

                          <div>
                            <strong>
                              {employee.firstName} {employee.lastName}
                            </strong>
                            <span>{employee.position}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`attendance-status ${
                            isOnLeave
                              ? "leave"
                              : isPresent
                              ? "present"
                              : "absent"
                          }`}
                        >
                          {isOnLeave
                            ? "On leave"
                            : isPresent
                            ? "Present"
                            : "Absent"}
                        </span>
                      </td>

                      <td>{formatTime(attendance?.checkIn)}</td>

                      <td>{formatTime(attendance?.checkOut)}</td>

                      <td>
                        {calculateHours(
                          attendance?.checkIn,
                          attendance?.checkOut
                        )}
                      </td>

                      <td>
                        {isOnLeave ? (
                          <span className="attendance-muted">
                            Not available
                          </span>
                        ) : hasCheckedIn && !hasCheckedOut ? (
                          <button
                            type="button"
                            className="attendance-action checkout"
                            onClick={() => handleCheckOut(employee.id)}
                            disabled={actionId === employee.id}
                          >
                            <LogOut size={14} />
                            {actionId === employee.id
                              ? "Saving..."
                              : "Check out"}
                          </button>
                        ) : hasCheckedOut ? (
                          <span className="attendance-muted">
                            Completed
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="attendance-action checkin"
                            onClick={() => handleCheckIn(employee.id)}
                            disabled={actionId === employee.id}
                          >
                            <LogIn size={14} />
                            {actionId === employee.id
                              ? "Saving..."
                              : "Check in"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Attendance;