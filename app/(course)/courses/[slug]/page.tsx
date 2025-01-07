// @ts-nocheck

import Hero from "./_components/hero";
import Sidebar from "./_components/sidebar";
import WhatYouLearn from "./_components/what-you-learn";
import CourseDetails from "./_components/course-details";
import CourseLesson from "./_components/course-lesson";
import Requirements from "./_components/requirements";
import CourseDescription from "./_components/course-description";
import RelatedCourse from "./_components/related-course";
import AuthorBio from "./_components/author-bio";
import Review from "./_components/review";
import MoreCourses from "./_components/more-course";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getRelatedCourses } from "@/actions/get-related-courses";
import { redirect } from "next/navigation";
import { getRating } from "@/services/testCourses";
import NotificationHandler from "@/components/notificationHandler/NotificationHandler";
import { getCourseBySlug } from "@/actions/get-course-by-slug";
import { checkCourseAccess } from "@/actions/get-course-access";

// CoursePage component
export default async function CoursePage({ params }) {
  const { userId } = await getServerUserSession();
  const { slug } = params;

  // Initialize access variable and call check access
  let access = null;
  if (userId) {
    const hasCourseAccess = await checkCourseAccess(slug, userId);
    access = hasCourseAccess.access;
  }

  // Fetch course data using the slug, possibly without userId
  const course = await getCourseBySlug(slug, userId);
  if (access) redirect(`/courses/${slug}/${course?.lessons[0]?.slug}`);
  const relatedCourses = await getRelatedCourses({
    userId: userId ? userId : undefined, // Pass undefined if userId does not exist
    categoryId: course.categoryId,
    currentCourseId: course.id,
  });
  // Fetch average rating server-side
  const ratingData = await getRating(course.id);

  return (
    <div>
      <Hero course={course} ratingData={ratingData} />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="w-full flex flex-col-reverse lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1">
            <main className="min-h-screen">
              <WhatYouLearn course={course} />
              <CourseDetails course={course} />
              <CourseLesson course={course} access={access} />
              <Requirements course={course} />
              <CourseDescription course={course} />
              {relatedCourses.length && (
                <RelatedCourse courses={relatedCourses} />
              )}
            </main>
          </div>
          <div className="flex-initial w-full relative lg:w-96 z-10">
            <div className="w-full h-full lg:-mt-[318px]">
              <div className="sticky bg-white top-4 shadow-lg">
                <div className="border border-gray-200">
                  <Sidebar
                    course={course}
                    access={access}
                    userId={userId}
                    lesson={course.lessons}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
