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

// Check course access
const checkCourseAccess = async (courseSlug, userId) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/access`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseSlug, userId }),
    });

    if (!response.ok) {
      let errorMessage = "Access denied";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (error) {
        console.error("Error parsing error response:", error);
      }

      return {
        access: false,
        message: errorMessage,
      };
    }

    const data = await response.json();
    return {
      access: data.access,
    };
  } catch (error) {
    console.error("Error checking course access via API", error);
    return {
      access: false,
      message: "Error occurred while checking access",
    };
  }
};

// Get course by slug
const getCourseBySlug = async (courseSlug, userId) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/front/courses/course`;
  try {
    const body = { courseSlug };
    if (userId && !isNaN(userId)) {
      body.userId = userId; // Only include userId if it's valid
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorMessage = "Invalid request";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (error) {
        console.error("Error parsing error response:", error);
      }

      throw new Error(errorMessage);
    }

    const course = await response.json();
    return course;
  } catch (error) {
    console.error("Error fetching course", error);
    throw new Error("Error occurred while fetching course");
  }
};

// CoursePage component
export default async function CoursePage({ params }) {
  const { userId } = await getServerUserSession();
  const { slug } = params;

  // Initialize access variable
  let access = null;

  // Check course access if userId is defined
  // if (userId && !isNaN(userId)) {
  //   const hasCourseAccess = await checkCourseAccess(slug, userId);
  //   console.log("hasCourseAccess:", hasCourseAccess);
  //   access = hasCourseAccess.access;
  // }
  // TODO: handle properly
  if (userId) {
    const hasCourseAccess = await checkCourseAccess(slug, userId);
    // console.log("hasCourseAccess:", hasCourseAccess);
    access = hasCourseAccess.access;
  }

  // Fetch course data using the slug, possibly without userId
  const course = await getCourseBySlug(slug, userId);

  console.log("coursess:", course);
  

  if (access) redirect(`/courses/${slug}/${course?.lessons[0]?.slug}`);

  const relatedCourses = await getRelatedCourses({
    userId: userId ? userId : undefined, // Pass undefined if userId does not exist
    categoryId: course.categoryId,
    currentCourseId: course.id,
  });

  // Fetch average rating server-side
  const ratingData = await getRating(course.id);

  // console.log("course slug page");
  // Render the Course Page
  return (
    <div>
      <Hero course={course} ratingData={ratingData} />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="w-full flex flex-col-reverse lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1">
            <main className="min-h-screen">
              {/* <NotificationHandler /> */}
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
