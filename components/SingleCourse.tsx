// @ts-nocheck
import { Button } from "@/components/ui/button";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import Image from "next/image";
import Link from "next/link";
import { CourseProgress } from "./course-progress";
import { Preview } from "./preview";

export default async function SingleCourse({ course, userId }) {
  const {
    id,
    slug,
    imageUrl,
    title,
    price,
    description,
    category,
    progress,
    purchases,
    lessons,
  } = course;

  const offer = 35; // This will come from db.

  // Check if the course is purchased and user is authenticated
  const isPurchased = purchases && purchases.length > 0;
  const isAuthenticated = !!userId;

  const decodedSlug = lessons[0]?.slug
    ? decodeURIComponent(lessons[0].slug)
    : "";
  console.log("single page");
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
      <div className="relative border">
        <Image
          alt={title}
          className="object-cover"
          height={400}
          width={600}
          src={imageUrl}
          priority
        />

        {/* Video play icon */}
        <Link
          href={
            isAuthenticated && userId && progress !== null
              ? `/courses/${slug}/${decodedSlug}`
              : `/courses/${slug}`
          }
          className="absolute inset-0 flex items-center justify-center mt-4"
        >
          <Image
            alt=""
            src="/images/courses/video-icon.svg"
            height={100}
            width={100}
            priority
          />
        </Link>
      </div>

      <div className="mt-4 p-4">
        <div className="flex items-center gap-x-4 text-xs">
          <Link
            href={`/courses/category?categoryId=${course?.categoryId}`}
            className="relative bg-blue-100 text-blue-800 text-xs font-medium rounded-[44px] flex items-center gap-1 px-2 py-2"
          >
            {category.name}
          </Link>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium rounded-[44px] flex items-center gap-1 px-2 py-2">
            {convertNumberToBangla(lessons.length) || 0} টি ক্লাস
          </span>
        </div>

        {/* Course Title */}
        <div className="mb-2 mt-4">
          <Link
            href={
              isAuthenticated && userId && progress !== null
                ? `/courses/${slug}/${decodedSlug}`
                : `/courses/${slug}`
            }
            className="text-xl font-bold"
          >
            {title}
          </Link>
        </div>

        {/* Card Description */}
        <div className="text-sm text-gray-700 mb-4 mt-2">
          <Preview
            value={
              description.length > 200 ? description.slice(0, 200) : description
            }
          />
        </div>
      </div>

      <div className="p-4 mt-auto">
        {isAuthenticated && userId && progress !== null ? (
          <>
            <div className="mb-4">
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
              />
            </div>
            <Link href={`/courses/${slug}/${decodedSlug}`} className="mt-4">
              <Button className="w-full h-12 text-lg bg-teal-500 text-white font-bold py-2 rounded flex items-center justify-center hover:bg-teal-500 hover:opacity-80">
                চালিয়ে যান
              </Button>
            </Link>
          </>
        ) : (
          <div>
            <div className="flex items-center text-gray-500 mt-2 mb-4"></div>
            <Link href={`/courses/${slug}`} replace>
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
