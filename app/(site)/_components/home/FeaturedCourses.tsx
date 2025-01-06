import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import SingleCourse from "@/components/SingleCourse";
import Link from "next/link";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { getProgress } from "@/actions/get-progress";

const FeaturedCourses = async () => {
  const { userId } = await getServerUserSession();
  const courses = await db.course.findMany({
    take: 4,
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      prices: true,
      isPublished: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      lessons: {
        select: {
          id: true,
          title: true,
          isPublished: true,
          slug: true,
          description: true,
          videoUrl: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  // If user is logged in, get their purchased courses
  const purchasedCourses = userId
    ? await db.purchase.findMany({
        where: { userId, purchaseType: "SINGLE_COURSE" },
        select: { courseId: true },
      })
    : [];

  const purchasedCourseIds = purchasedCourses.map(
    (purchase) => purchase.courseId
  );

  // Fetch progress for each course if the user is logged in
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const progress = purchasedCourseIds.includes(course.id)
        ? await getProgress(userId, course.id)
        : null;
      return { ...course, progress };
    })
  );
  return (
    <div>
      {userId ? (
        // If Logged In, Display Courses with Progress
        <section>
          {coursesWithProgress.length === 0 ? (
            <div className="text-center mt-8">
              <p className="text-gray-400 border border-gray-200 p-2 rounded-md">
                কোন কোর্স পাওয়া যায়নি!
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {coursesWithProgress.slice(0, 4).map((course, i) => (
                <SingleCourse course={course} key={i} userId={userId} />
              ))}
            </div>
          )}
          {/* Show Load More if More Than 8 Courses */}
          {coursesWithProgress.length > 4 && (
            <div className="text-center mt-12">
              <Link href={`/courses/category?page=1`}>
                <Button className="mx-auto flex gap-2 border-teal-500 hover:bg-white bg-white border font-bold text-teal-500 hover:opacity-70">
                  আরও দেখুন
                  <ArrowRight className="w-4 h-4 stroke-teal-500" />
                </Button>
              </Link>
            </div>
          )}
        </section>
      ) : (
        // If Not Logged In, Display Courses Without Progress
        <section>
          {courses.length === 0 ? (
            <div className="text-center mt-8">
              <p className="text-gray-400 border border-gray-200 p-2 rounded-md">
                কোন কোর্স পাওয়া যায়নি!
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {courses.slice(0, 4).map((course, i) => (
                <SingleCourse course={course} key={i} userId={userId} />
              ))}
            </div>
          )}
          {/* Show Load More */}
          {
            // Show Load More if More Than 4 Courses
            courses.length > 4 && (
              <div className="text-center mt-12">
                <Link href={`/courses/category?page=1`}>
                  <Button className="mx-auto flex gap-2 border-teal-600 hover:bg-white bg-white border hover:opacity-70 font-bold text-teal-600">
                    আরও দেখুন
                    <ArrowRight className="w-4 h-4 stroke-teal-600" />
                  </Button>
                </Link>
              </div>
            )
          }
        </section>
      )}
    </div>
  );
};

export default FeaturedCourses;
