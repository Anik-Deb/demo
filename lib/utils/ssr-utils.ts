// @ts-nocheck
import { getRelatedCourses } from "@/actions/get-related-courses";
import { getServerUserSession } from "../getServerUserSession";
import {
  checkCourseAccess,
  getCourseBySlug,
} from "./course-utils";

export async function getCourseData(slug: string) {
  const { userId } = await getServerUserSession();

  let access = false;
  let relatedCourses = [];
  let course;

  try {
    // Check if user has access to the course
    if (userId) {
      const hasAccess = await checkCourseAccess(slug, userId);
      access = hasAccess.access;
    }

    // Fetch course details by slug
    course = await getCourseBySlug(slug, userId);
    
    // Fetch related courses if the user is authenticated and course exists
    if (userId && course) {
      relatedCourses = await getRelatedCourses({
        userId,
        categoryId: course.categoryId,
        currentCourseId: course.id,
      });
    }
  } catch (error) {
    console.error("Error fetching course data:", error);
    return { notFound: true }; // Handle errors by returning 404
  }

  return { access, relatedCourses, course, userId }; // Return userId
}
