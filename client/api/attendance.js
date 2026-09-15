import api from "./api";

export const getAttendance = async (date) => {
  const query = date ? `?date=${date}` : "";

  return api(`/attendance${query}`);
};

export const checkIn = async (employeeId) => {
  return api("/attendance/check-in", {
    method: "POST",
    body: JSON.stringify({ employeeId }),
  });
};

export const checkOut = async (employeeId) => {
  return api("/attendance/check-out", {
    method: "POST",
    body: JSON.stringify({ employeeId }),
  });
};