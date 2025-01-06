// @ts-nocheck
"use client";

import { useState } from "react";
import { FileTextIcon, PlayCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const StudentSidebarLessons = ({
  item,
  lessonSlug,
  courseSlug,
  index,
  videoUrl,
  isLast, // Receive isLast prop
  isActive, // Receive isActive prop
}) => {
  const [activeVideoUrl, setActiveVideoUrl] = useState(videoUrl);
  const router = useRouter();

  const handlePlayClick = () => {
    // Update the active video URL
    setActiveVideoUrl(item?.videoUrl);
    // Push the new lesson route
    router.push(`/courses/${courseSlug}/${item?.slug}`);
  };

  return (
    <div className="bg-white">
      <div
        className={`cursor-pointer flex items-start gap-2 py-3 rounded-md transition-all ${
          !isLast ? "border-b border-gray-100" : "" // Conditionally apply border
        } ${isActive ? "text-teal-700 font-semibold" : "text-gray-600"}`}
        onClick={() => handlePlayClick()}
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

        <div className="text-sm flex gap-2">
          {/* <span className="min-w-max text-nowrap">Lesson {index + 1}:</span> */}
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
