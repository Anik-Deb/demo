
// @ts-nocheck

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutButton({
  course,
  className,
  courseId,
  userId,
  priceId,
  children,
  checked,
  ...props
}: {
  course?: any;
  className?: string;
  courseId: string;
  userId: string | null;
  priceId: string | null;
  children?: React.ReactNode;
  checked?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const isFreeCourse = Boolean(
        course.prices.find((price) => price?.isFree === true)
      );

      console.log("isFreeCourse", isFreeCourse);

      if (!isFreeCourse) {
        // For aamarPay
        // TODO: send priceId into payment API
        const response = await axios.post(`/api/courses/${courseId}/payment`, {
          priceId,
          teacherId: course?.teacherId,
        });
        const result = window.location.assign(response.data.url);
      } else {
        // For free course purchase
        const response = await axios.post(
          `/api/freecourse?courseId=${courseId}`,
          { userId }
        );

        if (response.data.success) {
          // Redirect to lesson details page
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
    <Link href="/signin">
      <Button
        {...props}
        className="w-full flex bg-teal-600 text-white py-2 rounded mb-2"
      >
        {children || <span>এনরোল করুন</span>}
      </Button>
    </Link>
  );
}
