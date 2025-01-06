// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
};

// Function to check if the title is in English
const isEnglish = (text) => /^[a-zA-Z0-9\s-]+$/.test(text);

export const LessonTitleForm = ({ initialData, courseId, lessonId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = useForm({
    defaultValues: initialData,
  });

  const onSubmit = async ({ title }) => {
    setLoading(true);
    let slug;

    // Generate slug only if the title is in English
    if (isEnglish(title)) {
      slug = generateSlug(title); // Generate slug from title
    }

    try {
      // Pass either title with slug or just title
      await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        title,
        ...(slug && { slug }), // Conditionally include slug if it exists
      });

      toast.success("Lesson updated");
      toggleEdit(); // Toggle editing mode after successful update
      router.refresh(); // Refresh the router
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson title
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? <>Cancel</> : <>Edit title</>}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div>
                <Input
                  disabled={isSubmitting || loading}
                  placeholder="e.g. 'Introduction to the course'"
                  {...field}
                />
                <p className="text-red-500">
                  {/* Add validation message here if needed */}
                </p>
              </div>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button
              disabled={!isValid || isSubmitting || loading}
              type="submit"
            >
              {loading ? <Loader className="animate-spin h-4 w-4" /> : "Save"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
