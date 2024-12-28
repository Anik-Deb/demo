// @ts-nocheck

import Hero from "./_components/hero";
import WhatYouLearn from "./_components/what-you-learn";
import CourseDetails from "./_components/course-details";
import CourseLesson from "./_components/course-lesson";
import Requirements from "./_components/requirements";
import CourseDescription from "./_components/course-description";
import RelatedCourse from "./_components/related-course";
import NotificationHandler from "@/components/notificationHandler/NotificationHandler";
import { getCourseData } from "@/lib/utils/ssr-utils";
import Sidebar from "./_components/sidebar";
import { getRating } from "@/services/testCourses";

export default async function CoursePage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = decodeURIComponent(params.slug);

  // Fetch the course data using the helper function
  const { access, relatedCourses, course, userId } = await getCourseData(slug);

  if (!course) {
    // Handle the case where the course isn't found
    return { notFound: true };
  }

  // Redirect if the user has access to the first lesson
  if (access && course) {
    const redirectUrl = `/courses/${course.slug}/${
      course.lessons?.[0]?.slug || ""
    }`;
    return <meta httpEquiv="refresh" content={`0; url=${redirectUrl}`} />;
  }

  // Fetch average rating server-side
  const ratingData = await getRating(course.id);
  console.log("course slug page");
  // Render the Course Page
  return (
    <div>
      <Hero course={course} ratingData={ratingData} />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="w-full flex flex-col-reverse lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1">
            <main className="min-h-screen">
              <NotificationHandler />
              <WhatYouLearn course={course} />
              <CourseDetails course={course} />
              <CourseLesson course={course} access={access} />
              <Requirements course={course} />
              <CourseDescription course={course} />
              <RelatedCourse courses={relatedCourses} />
            </main>
          </div>
          <div className="flex-initial w-full relative lg:w-96 z-10">
            <div className="w-full h-full lg:-mt-[360px]">
              <div className="sticky bg-white top-4 shadow-lg">
                <div className="border border-gray-200">
                  <Sidebar
                    course={course}
                    access={access}
                    userId={userId} // Pass userId to Sidebar
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
