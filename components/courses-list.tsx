// @ts-nocheck
"use client";
import { Category, Course } from "@prisma/client";
import SingleCourse from "./SingleCourse";
import { usePathname } from "next/navigation";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
  userId: string | null;
}

export const CoursesList = ({ items, userId }: CoursesListProps) => {
  const pathname = usePathname();

  // Check if the URL contains "courses/category"
  const isCategoryPage = pathname.includes("courses/category");

  // Determine grid column classes
  const gridColumns = isCategoryPage
    ? "sm:grid-cols-3 md:grid-cols-3"
    : "sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4";

  return (
    <div>
      <div className={`grid ${gridColumns} gap-4`}>
        {items.map((item) => (
          <SingleCourse
            userId={userId}
            course={item}
            key={item.id}
            fetchProgress={true}
          />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center text-base text-muted-foreground py-28 text-gray-400 border border-gray-200 p-2 rounded-md">
          কোন কোর্স পাওয়া যায়নি!
        </div>
      )}
    </div>
  );
};
