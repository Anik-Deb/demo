// @ts-nocheck

import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the path to where your database instance is located.

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId || Array.isArray(teacherId)) {
      return NextResponse.json(
        { message: "Valid teacherId is required" },
        { status: 400 }
      );
    }

    // Get the total revenue for the teacher from the TeacherRevenue model
    const teacherRevenue = await db.teacherRevenue.aggregate({
      _sum: {
        amountEarned: true,
      },
      where: {
        userId: teacherId,
      },
    });

    // Get total sales for all purchases related to the teacher's courses
    const totalSales = await db.purchase.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        course: {
          teacherId: teacherId,
        },
      },
    });

    // Respond with the revenue and total sales data
    return NextResponse.json({
      revenue: teacherRevenue._sum.amountEarned || 0,
      totalSales: totalSales._sum.amount || 0,
    });
  } catch (error) {
    console.error("Error calculating revenue and sales:", error);
    return NextResponse.json(
      { message: "Error calculating revenue and sales" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-static"; // Optional: If you want to improve caching for static responses
