import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the import based on your db setup

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;

  if (!courseId) {
    return NextResponse.json(
      { error: "Valid Course ID is required" },
      { status: 400 }
    );
  }

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { studentIds: true },
    });

    const enrolledStudents = course?.studentIds?.length || 0;

    return NextResponse.json({ enrolledStudents });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
