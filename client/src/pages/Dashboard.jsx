import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getEmployees } from "../../api/employees";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setEmployeesLoading(true);
        setEmployeesError("");

        const response = await getEmployees();

        setEmployees(response.data || []);
      } catch (error) {
        console.error("Failed to load employees:", error);

        setEmployeesError(
          error.message || "Failed to load employees."
        );
      } finally {
        setEmployeesLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const activeEmployees = employees.filter(
    (employee) => employee.status === "ACTIVE"
  ).length;

  const employeesOnLeave = employees.filter(
    (employee) => employee.status === "ON_LEAVE"
  ).length;

  const departmentCount = new Set(
    employees
      .map((employee) => employee.department)
      .filter(Boolean)
  ).size;

  const searchResults = employees.filter((employee) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return false;

    const fullName =
      `${employee.firstName || ""} ${employee.lastName || ""}`
        .toLowerCase();

    const email = employee.email?.toLowerCase() || "";
    const position = employee.position?.toLowerCase() || "";
    const department = employee.department?.toLowerCase() || "";

    return (
      fullName.includes(search) ||
      email.includes(search) ||
      position.includes(search) ||
      department.includes(search)
    );
  });

  const showSearchResults =
    searchFocused && searchTerm.trim().length > 0;

  const handleSearchResult = () => {
    setSearchTerm("");
    setSearchFocused(false);
    navigate("/employees");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <>
      {/* HEADER */}

      <header className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">
            OVERVIEW
          </span>

          <h1>
            Good to see you,{" "}
            {user?.name?.split(" ")[0] || "there"}.
          </h1>

          <p>
            Here’s what’s happening with your team today.
          </p>
        </div>

        <div className="dashboard-header-actions">
          {/* SEARCH */}

          <div
            className="dashboard-search-wrapper"
            onFocus={() => setSearchFocused(true)}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget
                )
              ) {
                setSearchFocused(false);
              }
            }}
          >
            <div className="dashboard-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                aria-label="Search employees"
              />

              {searchTerm ? (
                <button
                  type="button"
                  className="dashboard-search-clear"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              ) : (
                <kbd>⌘ K</kbd>
              )}
            </div>

            {showSearchResults && (
              <div className="dashboard-search-results">
                {employeesLoading ? (
                  <div className="dashboard-search-message">
                    Searching employees...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="dashboard-search-message">
                    No employees found.
                  </div>
                ) : (
                  <>
                    <div className="dashboard-search-label">
                      EMPLOYEES
                    </div>

                    {searchResults
                      .slice(0, 5)
                      .map((employee) => {
                        const firstInitial =
                          employee.firstName?.charAt(0) || "";

                        const lastInitial =
                          employee.lastName?.charAt(0) || "";

                        const initials =
                          `${firstInitial}${lastInitial}`.toUpperCase();

                        return (
                          <button
                            type="button"
                            className="dashboard-search-result"
                            key={employee.id}
                            onMouseDown={(event) =>
                              event.preventDefault()
                            }
                            onClick={handleSearchResult}
                          >
                            <div className="search-result-avatar">
                              {initials}
                            </div>

                            <div className="search-result-info">
                              <strong>
                                {employee.firstName}{" "}
                                {employee.lastName}
                              </strong>

                              <span>
                                {employee.position ||
                                  employee.department}
                              </span>
                            </div>

                            <ChevronRight size={15} />
                          </button>
                        );
                      })}

                    {searchResults.length > 5 && (
                      <button
                        type="button"
                        className="dashboard-search-view-all"
                        onMouseDown={(event) =>
                          event.preventDefault()
                        }
                        onClick={handleSearchResult}
                      >
                        View all employees
                        <ChevronRight size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* ADD EMPLOYEE */}

          <button
            type="button"
            className="add-employee-button"
            onClick={() =>
              navigate("/employees?add=true")
            }
          >
            <Plus size={17} />
            Add employee
          </button>
        </div>
      </header>

      {/* STATISTICS */}

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-card-top">
            <span>Total employees</span>

            <div className="stat-icon">
              <Users size={18} />
            </div>
          </div>

          <div className="stat-value">
            {employeesLoading
              ? "—"
              : employees.length}
          </div>

          <div className="stat-change positive">
            <span>All employees</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Active employees</span>

            <div className="stat-icon">
              <Activity size={18} />
            </div>
          </div>

          <div className="stat-value">
            {employeesLoading
              ? "—"
              : activeEmployees}
          </div>

          <div className="stat-change positive">
            <span>Currently active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>On leave</span>

            <div className="stat-icon">
              <CalendarDays size={18} />
            </div>
          </div>

          <div className="stat-value">
            {employeesLoading
              ? "—"
              : employeesOnLeave}
          </div>

          <div className="stat-change neutral">
            <span>Currently on leave</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span>Departments</span>

            <div className="stat-icon">
              <BriefcaseBusiness size={18} />
            </div>
          </div>

          <div className="stat-value">
            {employeesLoading
              ? "—"
              : departmentCount}
          </div>

          <div className="stat-change neutral">
            <span>Across the organization</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD GRID */}

      <div className="dashboard-grid">
        {/* RECENT EMPLOYEES */}

        <section className="dashboard-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                TEAM
              </span>

              <h2>Recent employees</h2>
            </div>

            <button
              type="button"
              className="panel-action"
              onClick={() => navigate("/employees")}
            >
              View all
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="employee-list">
            {employeesLoading ? (
              <div className="employee-list-message">
                Loading employees...
              </div>
            ) : employeesError ? (
              <div className="employee-list-message error">
                {employeesError}
              </div>
            ) : employees.length === 0 ? (
              <div className="employee-list-message">
                No employees found.
              </div>
            ) : (
              employees
                .slice(0, 5)
                .map((employee) => {
                  const firstInitial =
                    employee.firstName?.charAt(0) || "";

                  const lastInitial =
                    employee.lastName?.charAt(0) || "";

                  const initials =
                    `${firstInitial}${lastInitial}`.toUpperCase();

                  const statusClass =
                    employee.status === "ACTIVE"
                      ? "active-status"
                      : employee.status === "ON_LEAVE"
                        ? "leave-status"
                        : "";

                  const statusLabel =
                    employee.status === "ON_LEAVE"
                      ? "On leave"
                      : employee.status === "INACTIVE"
                        ? "Inactive"
                        : "Active";

                  return (
                    <div
                      className="employee-row"
                      key={employee.id}
                    >
                      <div className="employee-avatar">
                        {initials}
                      </div>

                      <div className="employee-info">
                        <strong>
                          {employee.firstName}{" "}
                          {employee.lastName}
                        </strong>

                        <span>
                          {employee.position}
                        </span>
                      </div>

                      <span className="employee-department">
                        {employee.department}
                      </span>

                      <span
                        className={`status-badge ${statusClass}`}
                      >
                        {statusLabel}
                      </span>

                      <button
                        type="button"
                        className="row-menu"
                        title="Employee options"
                        onClick={() =>
                          navigate("/employees")
                        }
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </section>

        {/* RECENT ACTIVITY */}

        <section className="dashboard-panel activity-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                ACTIVITY
              </span>

              <h2>Recent activity</h2>
            </div>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot" />

              <div>
                <strong>
                  Employee records are up to date
                </strong>

                <span>
                  Connected to your database
                </span>
              </div>
            </div>

            {employees.length > 0 && (
              <div className="activity-item">
                <div className="activity-dot" />

                <div>
                  <strong>
                    {employees.length}{" "}
                    {employees.length === 1
                      ? "employee"
                      : "employees"}{" "}
                    in your workspace
                  </strong>

                  <span>
                    Current employee records
                  </span>
                </div>
              </div>
            )}

            <div className="activity-item">
              <div className="activity-dot" />

              <div>
                <strong>
                  Dashboard connected successfully
                </strong>

                <span>
                  Employee Management System
                </span>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-dot" />

              <div>
                <strong>
                  Welcome to WorkForce
                </strong>

                <span>
                  Your workspace is ready
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;