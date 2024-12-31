// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

const NotificationHandler = ({ message }) => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const failed = searchParams.get("failed");

  // Ref to track if the toast has already been shown
  const toastShown = useRef(false);

  // console.log("success", success);

  useEffect(() => {
    if (success && !toastShown.current) {
      toast.success(message); 
      toastShown.current = true; // Mark as shown
    } else if (canceled && !toastShown.current) {
      toast.error(message);
      toastShown.current = true; // Mark as shown
    } else if (failed && !toastShown.current) {
      toast.error(message);
      toastShown.current = true; // Mark as shown
    }
  }, [success, canceled, failed]); // Add dependencies

  return null; // Return nothing from this component
};

export default NotificationHandler;
