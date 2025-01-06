// @ts-nocheck

import axios from "axios"; // Import axios
import { getServerUserSession } from "@/lib/getServerUserSession";
import { VdocipherVideoPlayer } from "../chapters/[chapterId]/_components/vdocipher-video-player";
import Sidebar from "../_components/sidebar";
import CourseDescription from "../_components/course-description";
import { LessonContent } from "../_components/LessonContent";
import { getCourseBySlug } from "@/actions/get-course-by-slug";
import { getRelatedCourses } from "@/actions/get-related-courses";
import { redirect } from "next/navigation";
import { checkCourseAccess } from "@/actions/get-course-access";
import { getLesson } from "@/lib/utils/GetLessons";

// Lesson page component
export default async function page({ params }) {
  const { userId } = await getServerUserSession();
  const { slug, lessonSlug } = params;
  // Fetch lesson, course access, and course data in parallel
  const [lessonResponse, accessResponse, courseResponse] = await Promise.all([
    getLesson(lessonSlug, userId), // Lesson data
    checkCourseAccess(slug, userId), // Course access data
    getCourseBySlug(slug, userId), // Course slug data
  ]);
  if (lessonResponse.error) {
    return <div>Lesson not found</div>;
  }
  
  const { lesson, course, attachments, nextLesson, userProgress, purchase } =
    lessonResponse.data;

  const hasCourseAccess = accessResponse.access;
  if (!hasCourseAccess) redirect(`/courses/${slug}`);


  let relatedCourses = [];
  if (userId) {
    const relatedCoursesPromise = getRelatedCourses({
      userId,
      categoryId: courseResponse.categoryId,
      currentCourseId: courseResponse.id,
    });
    relatedCourses = await relatedCoursesPromise;
  }

  return (
    <div>
      <LessonContent
        lesson={lesson}
        course={course}
        nextLesson={nextLesson}
        userProgress={userProgress}
        purchase={purchase}
        userId={userId}
        relatedCourses={relatedCourses}
      />
    </div>
  );
}
