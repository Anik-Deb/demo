// @ts-nocheck

"use client";

import { CoursesList } from "@/components/courses-list";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define the type for the props
interface CategoryPaginationProps {
  items: any[];
  searchParams: { page?: string; categoryId?: string };
  url: string;
}

export function CategoryPagination({
  items,
  searchParams,
  completedCourses,
  coursesInProgress,
  userId,
  url,
}: CategoryPaginationProps) {
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.page || "1")
  );

  useEffect(() => {
    setCurrentPage(Number(searchParams.page || 1));
  }, [searchParams.page]);

  const router = useRouter();

  // Create a mapping for completed and in-progress courses
  const courseUpdatesMap = {};

  // Add completedCourses to the map
  completedCourses.forEach((course) => {
    courseUpdatesMap[course.id] = course; // Assuming 'id' is the unique identifier
  });

  // Add coursesInProgress to the map
  coursesInProgress.forEach((course) => {
    courseUpdatesMap[course.id] = course; // Assuming 'id' is the unique identifier
  });

  // Update items array
  const updatedItems = items.map((item) =>
    courseUpdatesMap[item.id] ? courseUpdatesMap[item.id] : item
  );

  // Pagination logic
  const itemsPerPage = 4;
  const totalItems = updatedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = updatedItems.slice(startIndex, endIndex);

  const handlePageChange = (item: number) => {
    const page = item;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if (searchParams.categoryId) {
        router.push(
          `${url}?categoryId=${searchParams.categoryId}&page=${page}`
        );
      } else {
        router.push(`${url}?page=${page}`);
      }
    }
  };



  return (
    <div>
      {/* Pass updated items to CoursesList */}
      <CoursesList userId={userId} items={currentItems} />

      {/* Pagination */}
      {totalItems > itemsPerPage && (
        <div className="">
          <Separator className="mt-12" />
          <Pagination className="flex justify-end mt-6">
            <PaginationContent>
              <PaginationItem>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-1 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-1 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0 disabled:opacity-50"
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
