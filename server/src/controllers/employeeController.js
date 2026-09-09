import prisma from "../utils/prisma.js";
import { employeeSchema } from "../utils/employeeValidation.js";

export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch employee",
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const validation = employeeSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const employee = await prisma.employee.create({
      data: validation.data,
    });

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Error creating employee:", error);

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "An employee with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create employee",
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    const validation = employeeSchema.partial().safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    if (Object.keys(validation.data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required to update an employee",
      });
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: validation.data,
    });

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "An employee with this email already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update employee",
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
    }

    await prisma.employee.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete employee",
    });
  }
};