// @ts-nocheck
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import SingleCourse from "@/components/SingleCourse";
import Link from "next/link";
import SkeletonCard from "@/components/SkeletonCard";
import { Suspense } from "react";
import { getServerUserSession } from "@/lib/getServerUserSession";

export const revalidate = 3600; // Revalidate every hour

async function fetchFeaturedCourses() {
  // Fetch 4 courses for ISR
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

  return courses;
}

const FeaturedCourses = async () => {
  const { userId } = await getServerUserSession();
  // Pre-fetch featured courses for ISR
  const courses = await fetchFeaturedCourses();

  return (
    <div className="bg-gray-50" id="course">
      <div className="mx-auto max-w-7xl">
        <div className="pt-24 pb-16">
          <section id="page-title" className="px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                আমাদের কোর্স সমূহ
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                বর্তমান সময়ের সবচাইতে গুরুত্বপূর্ণ ও ডিমান্ডিং স্কিল নিয়ে চালু
                হচ্ছে এই কোর্স গুলো। নির্দিস্ট তারিখের মধ্যে নিবন্ধন কিংবা
                প্রি-এনরোলমেন্ট করুন। গ্রহণ করুন বিশেষ ছাড়।
              </p>
            </div>
            <section>
              {courses.length === 0 ? (
                <div className="text-center mt-8">
                  <p className="text-red-400 border border-red-200 p-2 rounded-md">
                    কোন কোর্স পাওয়া যায়নি!
                  </p>
                </div>
              ) : (
                <div className="mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                 
                    {courses.map((course, i) => (
                      <SingleCourse userId={userId} course={course} key={i} />
                    ))}
                  
                </div>
              )}
              {courses.length > 4 && (
                <div className="text-center mt-12">
                  <Link href={`/courses/category?page=1`}>
                    <Button className="mx-auto flex gap-2 border-teal-600 hover:bg-white bg-white border hover:opacity-70 font-bold text-teal-600">
                      আরও দেখুন
                      <ArrowRight className="w-4 h-4 stroke-teal-600" />
                    </Button>
                  </Link>
                </div>
              )}
            </section>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourses;
