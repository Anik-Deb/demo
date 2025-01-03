// @ts-nocheck

import { Category, Course } from "@prisma/client";
import { db } from "@/lib/db";

type CourseWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
};

type GetRelatedCoursesParams = {
  userId?: string | null;
  categoryId: string;
  currentCourseId: string;
  limit?: number;
};

export const getRelatedCourses = async ({
  userId,
  categoryId,
  currentCourseId,
  limit = 4,
}: GetRelatedCoursesParams): Promise<CourseWithCategory[]> => {
  try {
    // Initialize an array for purchased course IDs
    let purchasedCourseIds: string[] = []; // Step 1: Fetch IDs of purchased courses by the user if userId exists

    if (userId) {
      const purchasedCourses = await db.purchase.findMany({
        where: { userId },
        select: { courseId: true },
      });

      purchasedCourseIds = purchasedCourses.map(
        (purchase) => purchase.courseId
      );
    } // Step 2: Query related courses, excluding the current course and purchased courses if userId exists

    const relatedCourses = await db.course.findMany({
      where: {
        isPublished: true,
        categoryId,
        id: {
          not: currentCourseId, // Exclude the current course
          notIn: userId ? purchasedCourseIds : [], // Exclude purchased courses only if userId exists
        },
      },
      include: {
        category: true,
        prices: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return relatedCourses;
  } catch (error) {
    console.error("[GET_RELATED_COURSES]", error);
    return [];
  }
};