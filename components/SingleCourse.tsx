// @ts-nocheck

"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { convertNumberToBangla } from "@/lib/convertNumberToBangla";
import { CourseProgress } from "./course-progress";
import { Preview } from "./preview";
import { Play } from "lucide-react";
import { SingleCardButton } from "./single-card-button";
import { useEffect, useState } from "react";

export default function SingleCourse({ course, userId, fetchProgress = true }) {
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
  } = course;

  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  const offer = 35; // This will come from the database
  const isPurchased = purchases && purchases.length > 0;
  const isAuthenticated = !!userId;

  useEffect(() => {
    if (userId && fetchProgress && course.id) {
      setLoading(true);
      const apiUrl = `/api/user/userprogress?userId=${userId}&courseId=${course.id}`;

      fetch(apiUrl, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error fetching user progress");
          }
          return response.json();
        })
        .then((data) => {
          setUserProgress(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user progress:", error);
          // Handle error, possibly show a message to the user
        });
    }
  }, [userId, course.id, fetchProgress]);

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
        <div className="flex flex-row justify-between items-center w-full flex-wrap gap-2 text-xs">
          <Link
            href={`/courses/category?categoryId=${course?.category?.id}`}
            className="relative bg-blue-100 text-blue-800 text-xs font-medium rounded-[44px] flex items-center gap-1 px-3 py-1"
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
      <SingleCardButton
        isAuthenticated={isAuthenticated}
        progress={progress}
        nextLessonSlug={nextLessonSlug}
        slug={slug}
        lessons={lessons}
        loading={loading}
      />
    </div>
  );
}
