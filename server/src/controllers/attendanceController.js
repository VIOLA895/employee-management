import prisma from "../utils/prisma.js";

const getDateKey = (date = new Date()) => {
  const value = new Date(date);

  return new Date(
    Date.UTC(
      value.getFullYear(),
      value.getMonth(),
      value.getDate()
    )
  );
};

export const getAttendance = async (req, res) => {
  try {
    const date = getDateKey(req.query.date);

    const employees = await prisma.employee.findMany({
      orderBy: {
        firstName: "asc",
      },
    });

    const attendance = await prisma.attendance.findMany({
      where: {
        date,
      },
      include: {
        employee: true,
      },
    });

    const attendanceMap = new Map(
      attendance.map((record) => [record.employeeId, record])
    );

    const records = employees.map((employee) => {
      const record = attendanceMap.get(employee.id);

      return {
        employee,
        attendance: record || null,
      };
    });

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("Get attendance error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance",
    });
  }
};

export const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const now = new Date();
    const date = getDateKey(now);

    const employee = await prisma.employee.findUnique({
      where: {
        id: Number(employeeId),
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existing = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: Number(employeeId),
          date,
        },
      },
    });

    if (existing?.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Employee has already checked in",
      });
    }

    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: Number(employeeId),
          date,
        },
      },
      update: {
        checkIn: now,
        status: "PRESENT",
      },
      create: {
        employeeId: Number(employeeId),
        date,
        checkIn: now,
        status: "PRESENT",
      },
      include: {
        employee: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Employee checked in successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Check-in error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check in employee",
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    const date = getDateKey();

    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: Number(employeeId),
          date,
        },
      },
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "Employee has not checked in today",
      });
    }

    if (!attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: "Employee has not checked in today",
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: "Employee has already checked out",
      });
    }

    const updated = await prisma.attendance.update({
      where: {
        id: attendance.id,
      },
      data: {
        checkOut: new Date(),
      },
      include: {
        employee: true,
      },
    });

    res.json({
      success: true,
      message: "Employee checked out successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Check-out error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check out employee",
    });
  }
};