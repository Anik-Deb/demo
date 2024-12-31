// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing" },
        { status: 400 }
      );
    }

    // Check if the user has already purchased the course
    const existingPurchase = await db.purchase.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });

    if (existingPurchase) {
      // If purchase exists, update the existing purchase record
      const updatedPurchase = await db.purchase.update({
        where: {
          id: existingPurchase.id,
        },
        data: {
          purchaseType: "SINGLE_COURSE", // Or any other fields you want to update
        },
      });

      console.log("Purchase record updated!");

      // Optionally, update teacher's revenue
      const course = await db.course.findUnique({
        where: { id: courseId },
      });

      if (course) {
        const teacherRevenueData = {
          userId: course.teacherId, // Assuming course.teacherId is the teacher's ID
          purchaseId: updatedPurchase.id,
          amountEarned: 0, // Free course, no revenue
        };

        await db.teacherRevenue.create({
          data: teacherRevenueData,
        });

        console.log("Teacher revenue updated with amountEarned = 0");
      }

      return NextResponse.json(
        { success: true, message: "Course purchase updated successfully!" },
        { status: 200 }
      );
    }

    // If no existing purchase, create a new one
    const purchase = await db.purchase.create({
      data: {
        userId: userId,
        courseId: courseId,
        purchaseType: "SINGLE_COURSE",
      },
    });

    console.log("Free course successfully purchased!");

    // Step 4: Update teacher's revenue (for free courses, amountEarned is 0)
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (course) {
      const teacherRevenueData = {
        userId: course.teacherId, // Assuming course.teacherId is the teacher's ID
        purchaseId: purchase.id,
        amountEarned: 0, // Free course, no revenue
      };

      await db.teacherRevenue.create({
        data: teacherRevenueData,
      });

      console.log("Teacher revenue updated with amountEarned = 0");
    }

    return NextResponse.json(
      { success: true, message: "Course purchased successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CALLBACK_ERROR]", error);

    // Handle specific database errors
    if (error.code === "P2002") {
      // Unique constraint violation (e.g., purchase already exists)
      return NextResponse.json(
        { error: "Purchase already exists for this course and user." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 400 }
    );
  }
}
