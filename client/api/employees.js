import api from "./api";

export const getEmployees = async () => {
  return api("/employees");
};

export const createEmployee = async (employeeData) => {
  return api("/employees", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });
};

export const updateEmployee = async (id, employeeData) => {
  return api(`/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(employeeData),
  });
};

export const deleteEmployee = async (id) => {
  return api(`/employees/${id}`, {
    method: "DELETE",
  });
};