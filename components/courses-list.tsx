import { Category, Course } from "@prisma/client";

import SingleCourse from "./SingleCourse";

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
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <SingleCourse userId={userId} course={item} key={item.id} />
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center text-base text-muted-foreground py-28 text-red-400 border border-red-200 p-2 rounded-md">
          কোন কোর্স পাওয়া যায়নি!
        </div>
      )}
    </div>
  );
};
