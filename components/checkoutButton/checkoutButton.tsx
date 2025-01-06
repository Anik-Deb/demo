
// @ts-nocheck

"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import axios from "axios";

export default function CheckoutButton({
  course,
  className,
  courseId,
  priceId,
  children,
  checked,
  ...props
}: {
  course?: any;
  className?: string;
  courseId: string;
  priceId: string | null;
  children?: React.ReactNode;
  checked?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession(); // Use session from NextAuth.js
  const router = useRouter();
  const pathname = usePathname();

  // Get userId from session data
  const userId = session?.user?.id || null;

  const onClick = async () => {
    try {
      setIsLoading(true);

      const isFreeCourse = Boolean(
        course.prices.find((price) => price?.isFree === true)
      );

      if (!isFreeCourse) {
        const response = await axios.post(`/api/courses/${courseId}/payment`, {
          priceId,
          teacherId: course?.teacherId,
        });
        window.location.assign(response.data.url);
      } else {
        const response = await axios.post(
          `/api/freecourse?courseId=${courseId}`,
          { userId }
        );

        if (response.data.success) {
          window.location.assign(
            `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}/${course.lessons[0]?.slug}?success=1`
          );
        } else {
          toast.error(response.data.error || "Purchase failed.");
        }
      }
    } catch (error) {
      console.log("Error from checkout button:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // Use session data to determine user login state
  useEffect(() => {
    if (status === "authenticated" && !userId) {
      router.refresh();
    }
  }, [status, userId, router]);

  return userId ? (
    <Button
      {...props}
      onClick={onClick}
      disabled={isLoading || !checked || !userId}
      className="w-full flex bg-teal-600 text-white py-2 rounded mb-2"
    >
      {isLoading && <Loader2Icon className="h-4 w-4 animate-spin mr-2" />}
      {children || <span>এনরোল করুন</span>}
    </Button>
  ) : (
    <Link href={`/signin?redirect=${encodeURIComponent(pathname)}`}>
      <Button
        {...props}
        className="w-full flex bg-teal-600 text-white py-2 rounded mb-2"
      >
        {children || <span>এনরোল করুন</span>}
      </Button>
    </Link>
  );
}