// @ts-nocheck
"use client";

import { useState } from "react";
import { FileTextIcon, PlayCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLessonContext } from "@/lib/utils/LessonContext";

const StudentSidebarLessons = ({
  item,
  lessonSlug,
  courseSlug,
  index,
  videoUrl,
  isLast,
  isActive,
}) => {
  const { setLoading } = useLessonContext(); // Use setLoading from context
  const router = useRouter();

  const handlePlayClick = () => {
    setLoading(true); // Show loader when lesson is clicked
    router.push(`/courses/${courseSlug}/${item?.slug}`);
  };

  return (
    <div className="bg-white">
      <div
        className={`cursor-pointer flex items-start gap-2 py-3 rounded-md transition-all ${
          !isLast ? "border-b border-gray-100" : ""
        } ${
          item.slug === lessonSlug
            ? "text-teal-700 font-semibold"
            : "text-gray-600"
        }`}
        onClick={handlePlayClick}
      >
        {item.videoUrl !== null ? (
          <PlayCircleIcon
            className={`w-5 h-5 min-w-[20px] ${
              item.slug === lessonSlug ? "text-teal-500" : "text-gray-500"
            }`}
          />
        ) : (
          <FileTextIcon
            className={`w-5 h-5 min-w-[20px] ${
              item.slug === lessonSlug ? "text-teal-500" : "text-gray-500"
            }`}
          />
        )}
        <div
          className={`text-sm flex gap-2 ${
            item.slug === lessonSlug ? "text-teal-500" : ""
          }`}
        >
          <p
            className="text-sm capitalize"
            dangerouslySetInnerHTML={{
              __html: item?.title || "Lesson Video",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentSidebarLessons;
