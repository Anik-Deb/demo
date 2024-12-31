// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { CourseProgress } from "./course-progress";
import { Preview } from "./preview";
import { Play } from "lucide-react";


// Define the component as an async function
export default async function SingleCourse({
  course,
  userId,
  fetchProgress = true,
}) {
  let userProgress = [];

  if (userId && fetchProgress) {
    // Only call the API if userId is present
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/user/userprogress?userId=${userId}&courseId=${course.id}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("Error fetching user progress:", response);
      throw new Error("Error fetching user progress");
    }

    userProgress = await response.json();
  }

  const {
    id,
    slug,
    imageUrl,
    title,
    prices,
    description,
    category,
    progress,
    purchases,
    lessons,
  } = course; // Assume `course` is fetched from a database or API based on courseId

  // console.log("price", prices);

  const offer = 35; // This will come from the database

  // Check if the course is purchased and user is authenticated
  const isPurchased = purchases && purchases.length > 0;

  const isAuthenticated = !!userId;

  // Check for the completed lessons and find the next lesson
  const completedLessonIds = userProgress.map((progress) => progress.lessonId);
  const nextLesson = lessons.find(
    (lesson) => lesson.isPublished && !completedLessonIds.includes(lesson.id)
  );
  const nextLessonSlug = nextLesson ? nextLesson.slug : null;
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="relative border group">
        <div className="w-full md:w-full h-0 pb-[56.25%] md:pb-0 md:h-[160px] overflow-hidden ">
          <Image
            alt={title}
            className="object-cover"
            fill
            src={imageUrl}
            priority
          />
        </div>
        <Link
          href={
            isAuthenticated && progress !== null
              ? `/courses/${slug}/${lessons[0]?.slug}`
              : `/courses/${slug}`
          }
          className="absolute inset-0 flex items-center justify-center w-full h-full group"
        >
          <div className="flex items-center justify-center transition-all duration-300 hover:bg-[#0000003b] w-full h-full">
            <div className="bg-[#727374ab] p-3 rounded-full">
              <Play className="text-white rounded-full" size={16} />
            </div>
          </div>
        </Link>
      </div>

      <div className="p-4 mt-2">
        <div className="flex items-center gap-x-3 text-xs">
          <Link
            href={`/courses/category?categoryId=${course?.category?.id}`}
            className="relative bg-blue-100 text-blue-800 text-xs  font-medium rounded-[44px] flex items-center gap-1 px-3 py-1"
          >
            {category.name}
          </Link>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium rounded-[44px] flex items-center gap-1 px-3 py-1">
            {convertNumberToBangla(lessons.length) || 0} টি ক্লাস
          </span>
        </div>
        <div className="pt-4 pb-2">
          <Link
            href={
              isAuthenticated && progress !== null
                ? `/courses/${slug}/${lessons[0]?.slug}`
                : `/courses/${slug}`
            }
            className="text-lg font-semibold capitalize hover:text-teal-600 transition-colors duration-300"
          >
            {title}
          </Link>
        </div>
        <div className="text-sm text-gray-600">
          <Preview
            value={
              description.length > 200 ? description.slice(0, 200) : description
            }
          />
        </div>
      </div>
      {/* price */}
      <div className="p-4 mt-auto">
        {!progress && (
          <div className="text-left md:p-0 pt-0">
            {prices?.length > 0 ? (
              <>
                {prices[0]?.isFree ? (
                  <div className="text-md font-semibold text-gray-800">
                    <span>Free</span>
                  </div>
                ) : (
                  <div>
                    {prices[0].discountedAmount ? (
                      <div className="flex flex-row items-center justify-between text-left">
                        <div className="font-bold text-gray-800">
                          <span className="text-lg">
                            ৳{prices[0].discountedAmount}
                          </span>
                          <span
                            className={`text-sm text-gray-500 ${
                              prices[0].discountedAmount
                                ? "line-through ml-2"
                                : ""
                            }`}
                          >
                            {/* previous regular price */}৳
                            {prices[0].regularAmount}
                          </span>
                        </div>

                        <div className="text-xs text-[#F02D00] capitalize font-semibold">
                          Offer Expires on:{" "}
                          {new Date(
                            prices[0].discountExpiresOn
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <div className="font-bold text-gray-800">
                        <span className="text-lg">
                          ৳{prices[0].regularAmount}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        )}

        {isAuthenticated && progress !== null ? (
          <>
            <div className="mb-4">
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
              />
            </div>
            {nextLessonSlug ? (
              <Link href={`/courses/${slug}/${nextLessonSlug}`}>
                <Button className="w-full h-12 text-lg bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center hover:bg-teal-600">
                  চালিয়ে যান
                </Button>
              </Link>
            ) : (
              <Link
                href={`/courses/${slug}/${lessons[0]?.slug}`}
                className="mt-4"
              >
                <Button className="w-full h-12 text-lg bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center hover:bg-teal-500 hover:opacity-80">
                  চালিয়ে যান
                </Button>
              </Link>
            )}
          </>
        ) : (
          <div>
            <div className="flex items-center text-gray-500 mb-4"></div>
            <Link href={`/courses/${slug}`}>
              <Button
                type="button"
                className="w-full h-12 bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center hover:bg-teal-500 hover:opacity-80"
              >
                <span className="ml-2 text-lg">বিস্তারিত দেখুন</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
