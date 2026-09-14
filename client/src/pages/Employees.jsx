import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../../api/employees";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  position: "",
  department: "",
  salary: "",
  hireDate: "",
  status: "ACTIVE",
};

const Employees = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showEmployeeModal, setShowEmployeeModal] =
    useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [formData, setFormData] = useState({
    ...initialFormData,
  });

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [openMenuId, setOpenMenuId] = useState(null);

  const [deletingEmployee, setDeletingEmployee] =
    useState(null);
  const [deleting, setDeleting] = useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  /* =========================================================
     LOAD EMPLOYEES
  ========================================================= */

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getEmployees();

        setEmployees(response.data || []);
      } catch (error) {
        console.error(
          "Failed to load employees:",
          error
        );

        setError(
          error.message ||
            "Failed to load employees."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  /* =========================================================
     OPEN ADD MODAL FROM DASHBOARD
  ========================================================= */

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setEditingEmployee(null);
      setFormData({ ...initialFormData });
      setFormError("");
      setShowEmployeeModal(true);

      searchParams.delete("add");
      setSearchParams(searchParams, {
        replace: true,
      });
    }
  }, [searchParams, setSearchParams]);

  /* =========================================================
     FILTER EMPLOYEES
  ========================================================= */

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const fullName =
        `${employee.firstName || ""} ${
          employee.lastName || ""
        }`.toLowerCase();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        employee.email
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.position
          ?.toLowerCase()
          .includes(searchValue) ||
        employee.department
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const departmentCount = new Set(
    employees
      .map((employee) => employee.department)
      .filter(Boolean)
  ).size;

  /* =========================================================
     HELPERS
  ========================================================= */

  const getStatusLabel = (status) => {
    if (status === "ON_LEAVE") {
      return "On leave";
    }

    if (status === "INACTIVE") {
      return "Inactive";
    }

    return "Active";
  };

  const getStatusClass = (status) => {
    if (status === "ACTIVE") {
      return "active-status";
    }

    if (status === "ON_LEAVE") {
      return "leave-status";
    }

    return "inactive-status";
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatSalary = (salary) => {
    if (
      salary === null ||
      salary === undefined ||
      salary === ""
    ) {
      return "Not specified";
    }

    const numericSalary = Number(salary);

    if (Number.isNaN(numericSalary)) {
      return salary;
    }

    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(numericSalary);
  };

  const getInitials = (employee) => {
    const firstInitial =
      employee.firstName?.charAt(0) || "";

    const lastInitial =
      employee.lastName?.charAt(0) || "";

    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  /* =========================================================
     FORM HANDLERS
  ========================================================= */

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
    });

    setFormError("");
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    resetForm();
    setShowEmployeeModal(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);

    setFormData({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      position: employee.position || "",
      department: employee.department || "",
      salary: employee.salary ?? "",
      hireDate: employee.hireDate
        ? employee.hireDate.slice(0, 10)
        : "",
      status: employee.status || "ACTIVE",
    });

    setFormError("");
    setShowEmployeeModal(true);
  };

  const closeEmployeeModal = () => {
    if (submitting) {
      return;
    }

    setShowEmployeeModal(false);
    setEditingEmployee(null);
    resetForm();
  };

  /* =========================================================
     CREATE / UPDATE
  ========================================================= */

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setFormError("");

      const employeeData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone:
          formData.phone.trim() || undefined,
        position: formData.position.trim(),
        department: formData.department.trim(),
        salary: formData.salary
          ? Number(formData.salary)
          : undefined,
        hireDate: formData.hireDate,
        status: formData.status,
      };

      if (editingEmployee) {
        const response = await updateEmployee(
          editingEmployee.id,
          employeeData
        );

        setEmployees((current) =>
          current.map((employee) =>
            employee.id === editingEmployee.id
              ? response.data
              : employee
          )
        );
      } else {
        const response = await createEmployee(
          employeeData
        );

        setEmployees((current) => [
          response.data,
          ...current,
        ]);
      }

      setShowEmployeeModal(false);
      setEditingEmployee(null);
      resetForm();
    } catch (error) {
      console.error(
        "Failed to save employee:",
        error
      );

      setFormError(
        error.message ||
          "Failed to save employee."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee || deleting) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteEmployee(
        deletingEmployee.id
      );

      setEmployees((current) =>
        current.filter(
          (employee) =>
            employee.id !== deletingEmployee.id
        )
      );

      if (
        selectedEmployee?.id ===
        deletingEmployee.id
      ) {
        setSelectedEmployee(null);
      }

      setDeletingEmployee(null);
      setOpenMenuId(null);
    } catch (error) {
      console.error(
        "Failed to delete employee:",
        error
      );

      setError(
        error.message ||
          "Failed to delete employee."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
     DETAILS
  ========================================================= */

  const openDetails = (employee) => {
    setSelectedEmployee(employee);
    setOpenMenuId(null);
  };

  const closeDetails = () => {
    setSelectedEmployee(null);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="employees-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="employees-header">
        <div className="employees-heading">
          <div className="employees-title-row">
            <div>
              <span className="dashboard-eyebrow">
                TEAM
              </span>

              <h1>Employees</h1>

              <p>
                Manage your organization's employee
                records.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="add-employee-button"
          onClick={openAddModal}
        >
          <Plus size={17} />
          Add employee
        </button>
      </header>

      {/* =====================================================
          MINI STATS
      ===================================================== */}

      <section className="employees-mini-stats">
        <div className="employees-mini-stat">
          <div className="mini-stat-icon">
            <Users size={17} />
          </div>

          <div>
            <span>Total employees</span>

            <strong>
              {loading
                ? "—"
                : employees.length}
            </strong>
          </div>
        </div>

        <div className="employees-mini-stat">
          <div className="mini-stat-icon">
            <BriefcaseBusiness size={17} />
          </div>

          <div>
            <span>Departments</span>

            <strong>
              {loading
                ? "—"
                : departmentCount}
            </strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          EMPLOYEE TABLE
      ===================================================== */}

      <section className="employees-panel">
        <div className="employees-toolbar">
          <div className="employee-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch("")}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="employee-filter">
            <select
              className="filter-button"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >
              <option value="ALL">
                All employees
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="ON_LEAVE">
                On leave
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>

            <ChevronDown
              size={15}
              className="filter-chevron"
            />
          </div>
        </div>

        <div className="employees-table-wrapper">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Position</th>
                <th>Department</th>
                <th>Status</th>
                <th>Hire date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="table-message"
                  >
                    <div className="table-message-content">
                      <span className="loading-spinner" />
                      Loading employees...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="6"
                    className="table-message error"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="table-message"
                  >
                    <div className="empty-table-state">
                      <div className="empty-state-icon">
                        <Users size={21} />
                      </div>

                      <strong>
                        No employees found
                      </strong>

                      <span>
                        Try changing your search or
                        filter.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(
                  (employee) => (
                    <tr key={employee.id}>
                      <td>
                        <div className="table-employee">
                          <div className="table-avatar">
                            {getInitials(
                              employee
                            )}
                          </div>

                          <div>
                            <button
                              type="button"
                              className="employee-name-button"
                              onClick={() =>
                                openDetails(
                                  employee
                                )
                              }
                            >
                              {employee.firstName}{" "}
                              {employee.lastName}
                            </button>

                            <span>
                              {employee.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {employee.position}
                      </td>

                      <td>
                        {employee.department}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            employee.status
                          )}`}
                        >
                          {getStatusLabel(
                            employee.status
                          )}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          employee.hireDate
                        )}
                      </td>

                      <td>
                        <div className="employee-actions">
                          <button
                            type="button"
                            className="table-menu"
                            title="Employee options"
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId ===
                                  employee.id
                                  ? null
                                  : employee.id
                              )
                            }
                          >
                            <MoreHorizontal
                              size={18}
                            />
                          </button>

                          {openMenuId ===
                            employee.id && (
                            <div className="employee-action-menu">
                              <button
                                type="button"
                                onClick={() =>
                                  openDetails(
                                    employee
                                  )
                                }
                              >
                                <UserRound
                                  size={15}
                                />
                                View details
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  openEditModal(
                                    employee
                                  );
                                  setOpenMenuId(
                                    null
                                  );
                                }}
                              >
                                <Pencil
                                  size={15}
                                />
                                Edit employee
                              </button>

                              <button
                                type="button"
                                className="delete-action"
                                onClick={() => {
                                  setDeletingEmployee(
                                    employee
                                  );
                                  setOpenMenuId(
                                    null
                                  );
                                }}
                              >
                                <Trash2
                                  size={15}
                                />
                                Delete employee
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================
          ADD / EDIT EMPLOYEE MODAL
      ===================================================== */}

      {showEmployeeModal && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closeEmployeeModal();
            }
          }}
        >
          <div
            className="employee-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-modal-title"
          >
            <div className="modal-header">
              <div>
                <span className="modal-label">
                  TEAM
                </span>

                <h2 id="employee-modal-title">
                  {editingEmployee
                    ? "Edit employee"
                    : "Add employee"}
                </h2>

                <p>
                  {editingEmployee
                    ? "Update this employee's information."
                    : "Add a new employee to your organization."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeEmployeeModal}
                disabled={submitting}
                title="Close"
              >
                <X size={19} />
              </button>
            </div>

            {formError && (
              <div
                className="form-error"
                role="alert"
              >
                {formError}
              </div>
            )}

            <form
              className="employee-form"
              onSubmit={handleSubmitEmployee}
            >
              <div className="form-section">
                <span className="form-section-title">
                  Personal information
                </span>

                <div className="form-grid">
                  <div className="employee-form-group">
                    <label htmlFor="firstName">
                      First name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Jane"
                      value={
                        formData.firstName
                      }
                      onChange={
                        handleFormChange
                      }
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="employee-form-group">
                    <label htmlFor="lastName">
                      Last name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Smith"
                      value={
                        formData.lastName
                      }
                      onChange={
                        handleFormChange
                      }
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="employee-form-group">
                    <label htmlFor="email">
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@example.com"
                      value={
                        formData.email
                      }
                      onChange={
                        handleFormChange
                      }
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="employee-form-group">
                    <label htmlFor="phone">
                      Phone number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <span className="form-section-title">
                  Employment details
                </span>

                <div className="form-grid">
                  <div className="employee-form-group">
                    <label htmlFor="position">
                      Position
                    </label>

                    <input
                      id="position"
                      name="position"
                      type="text"
                      placeholder="Software Engineer"
                      value={
                        formData.position
                      }
                      onChange={
                        handleFormChange
                      }
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="employee-form-group">
                    <label htmlFor="department">
                      Department
                    </label>

                    <input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="Engineering"
                      value={
                        formData.department
                      }
                      onChange={
                        handleFormChange
                      }
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="employee-form-group">
                    <label htmlFor="salary">
                      Salary
                    </label>

                    <input
                      id="salary"
                      name="salary"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="150000"
                      value={
                        formData.salary
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={submitting}
                    />
                  </div>

                  <div className="employee-form-group">
                    <label htmlFor="hireDate">
                      Hire date
                    </label>

                    <input
                      id="hireDate"
                      name="hireDate"
                      type="date"
                      value={
                        formData.hireDate
                      }
                      onChange={
                        handleFormChange
                      }
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="employee-form-group">
                    <label htmlFor="status">
                      Status
                    </label>

                    <select
                      id="status"
                      name="status"
                      value={
                        formData.status
                      }
                      onChange={
                        handleFormChange
                      }
                      disabled={submitting}
                    >
                      <option value="ACTIVE">
                        Active
                      </option>

                      <option value="ON_LEAVE">
                        On leave
                      </option>

                      <option value="INACTIVE">
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeEmployeeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="button-spinner" />
                  ) : (
                    <Plus size={16} />
                  )}

                  {submitting
                    ? editingEmployee
                      ? "Saving..."
                      : "Adding..."
                    : editingEmployee
                      ? "Save changes"
                      : "Add employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          EMPLOYEE DETAILS MODAL
      ===================================================== */}

      {selectedEmployee && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closeDetails();
            }
          }}
        >
          <div
            className="employee-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-details-title"
          >
            <div className="details-header">
              <div className="details-profile">
                <div className="details-avatar">
                  {getInitials(
                    selectedEmployee
                  )}
                </div>

                <div>
                  <span className="modal-label">
                    EMPLOYEE PROFILE
                  </span>

                  <h2 id="employee-details-title">
                    {selectedEmployee.firstName}{" "}
                    {selectedEmployee.lastName}
                  </h2>

                  <p>
                    {selectedEmployee.position}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeDetails}
                title="Close"
              >
                <X size={19} />
              </button>
            </div>

            <div className="details-status-row">
              <span
                className={`status-badge ${getStatusClass(
                  selectedEmployee.status
                )}`}
              >
                {getStatusLabel(
                  selectedEmployee.status
                )}
              </span>
            </div>

            <div className="employee-details-grid">
              <div className="employee-detail-item">
                <div className="detail-icon">
                  <Mail size={17} />
                </div>

                <div>
                  <span>Email address</span>

                  <strong>
                    {selectedEmployee.email ||
                      "Not specified"}
                  </strong>
                </div>
              </div>

              <div className="employee-detail-item">
                <div className="detail-icon">
                  <Phone size={17} />
                </div>

                <div>
                  <span>Phone number</span>

                  <strong>
                    {selectedEmployee.phone ||
                      "Not specified"}
                  </strong>
                </div>
              </div>

              <div className="employee-detail-item">
                <div className="detail-icon">
                  <BriefcaseBusiness size={17} />
                </div>

                <div>
                  <span>Department</span>

                  <strong>
                    {selectedEmployee.department ||
                      "Not specified"}
                  </strong>
                </div>
              </div>

              <div className="employee-detail-item">
                <div className="detail-icon">
                  <UserRound size={17} />
                </div>

                <div>
                  <span>Position</span>

                  <strong>
                    {selectedEmployee.position ||
                      "Not specified"}
                  </strong>
                </div>
              </div>

              <div className="employee-detail-item">
                <div className="detail-icon">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <span>Hire date</span>

                  <strong>
                    {formatDate(
                      selectedEmployee.hireDate
                    )}
                  </strong>
                </div>
              </div>

              <div className="employee-detail-item">
                <div className="detail-icon">
                  <BriefcaseBusiness size={17} />
                </div>

                <div>
                  <span>Salary</span>

                  <strong>
                    {formatSalary(
                      selectedEmployee.salary
                    )}
                  </strong>
                </div>
              </div>
            </div>

            <div className="details-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={closeDetails}
              >
                Close
              </button>

              <button
                type="button"
                className="modal-submit"
                onClick={() => {
                  closeDetails();
                  openEditModal(
                    selectedEmployee
                  );
                }}
              >
                <Pencil size={16} />
                Edit employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION
      ===================================================== */}

      {deletingEmployee && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !deleting
            ) {
              setDeletingEmployee(null);
            }
          }}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-employee-title"
          >
            <div className="delete-modal-content">
              <div className="delete-icon">
                <Trash2 size={20} />
              </div>

              <span className="modal-label">
                REMOVE EMPLOYEE
              </span>

              <h2 id="delete-employee-title">
                Delete employee?
              </h2>

              <p>
                Are you sure you want to delete{" "}
                <strong>
                  {deletingEmployee.firstName}{" "}
                  {deletingEmployee.lastName}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel"
                onClick={() =>
                  setDeletingEmployee(null)
                }
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-confirm-button"
                onClick={
                  handleDeleteEmployee
                }
                disabled={deleting}
              >
                {deleting ? (
                  <span className="button-spinner" />
                ) : (
                  <Trash2 size={16} />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;