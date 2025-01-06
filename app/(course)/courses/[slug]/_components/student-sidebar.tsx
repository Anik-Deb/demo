// @ts-nocheck
"use client";

import { ChevronDown, FileTextIcon, PlayCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import StudentSidebarLessons from "./student-sidebar-lessons";

export default function StudentSidebar({
  lesson,
  videoUrl,
  courseSlug,
  currentLessonSlug
}) {
  const { lessonSlug } = useParams(); // This works because the component is now client-side.

  return (
    <div className="p-3 relative max-h-[90vh] overflow-y-auto ">
      <h1 className="text-xl font-bold mb-4">Course Lessons</h1>

      {/* show lessons */}
      {lesson.map((item, index) => (
        <StudentSidebarLessons
          key={item?.id}
          value={item?.id}
          item={item}
          lessonSlug={lessonSlug}
          index={index}
          courseSlug={courseSlug}
          videoUrl={videoUrl}
          isActive={lesson.slug === currentLessonSlug}
          isLast={index === lesson.length - 1}
        />
      ))}
    </div>
  );
}
