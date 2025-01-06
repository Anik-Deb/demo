// @ts-nocheck

import { checkCourseAccess } from "@/actions/get-course-access";
import { getCourseBySlug } from "@/actions/get-course-by-slug";
import { getRelatedCourses } from "@/actions/get-related-courses";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getLesson } from "@/lib/utils/GetLessons";
import RelatedCourse from "../_components/related-course";
import StudentSidebar from "../_components/student-sidebar";
import { LessonProvider } from "@/lib/utils/LessonContext";

const Layout = async ({ children, params }) => {
  const { slug, lessonSlug } = params;
  const { userId } = await getServerUserSession();
  // Fetch lesson, course access, and course data in parallel
  const [lessonResponse, accessResponse, courseResponse] = await Promise.all([
    getLesson(lessonSlug, userId), // Lesson data
    checkCourseAccess(slug, userId), // Course access data
    getCourseBySlug(slug, userId), // Course slug data
  ]);
  if (lessonResponse.error) {
    return <div>Lesson not found</div>;
  }
  const { lesson, course, attachments, userProgress, purchase } =
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
  const contextValue = {
    lesson,
    course,
    userProgress,
    purchase,
    userId,
  };
  return (
    <LessonProvider value={contextValue}>
        <div>
          <div className="bg-[#105650]">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 px-6 py-3 lg:px-8">
              <h1 className="text-xl font-semibold text-white">
                {course.title}
              </h1>
            </div>
          </div>

          <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
            <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
              <div className="flex-1">
                {children}

                <div className="hidden md:block">
                  <RelatedCourse courses={relatedCourses} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="flex-initial w-full relative lg:w-96 z-10">
                <div className="w-full h-full ">
                  <div className="sticky bg-white top-4">
                    <div className="border border-gray-200 min-h-[80vh]">
                      <StudentSidebar
                        courseSlug={course?.slug}
                        lesson={course?.lessons}
                        videoUrl={lesson?.videoUrl}
                        currentLessonSlug={lesson?.slug}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="block md:hidden">
                <RelatedCourse courses={relatedCourses} />
              </div>
            </div>
          </div>
        </div>
    </LessonProvider>
  );
};

export default Layout;
