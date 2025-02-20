// @ts-nocheck
"use client";

import * as z from "zod";
import Uploader2 from "@/components/uploader";
import VdocipherPlayer from "@/components/VdocipherPlayer";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";
import { Pencil, PlusCircle, Video, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface LessonVideoFormProps {
  initialData: Lesson;
  courseId: string;
  lessonId: string;
}

// Helper function to check if the URL is a YouTube or embedded video URL
const isYouTubeUrl = (url: string) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\//;

  return youtubeRegex.test(url) || vimeoRegex.test(url);
};

const formSchema = z.object({
  videoUrl: z.string().min(1, "Video URL is required"),
  duration: z.number().min(0, "Duration must be a positive number").optional(),
});

export default function VdocipherVideoForm({
  initialData,
  courseId,
  lessonId,
}: LessonVideoFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [videoStatus, setVideoStatus] = useState(initialData.videoStatus);
  const [isLoading, setIsLoading] = useState(false);

  // Check if videoUrl is a YouTube URL and set it to null if so
  const [videoUrl, setVideoUrl] = useState(() => {
    return isYouTubeUrl(initialData.videoUrl) ? null : initialData.videoUrl;
  });

  const toggleEdit = () => setIsEditing((current) => !current);

  // Function to handle video URL and duration update on upload
  const handleVideoUpdate = async (videoId: string, duration: number) => {
    console.log("videoId :", videoId, "duration :", duration);

    try {
      const values = {
        videoUrl: videoId,
        duration: duration,
      };

      formSchema.parse(values);

      await axios.patch(`/api/courses/${courseId}/lessons/${lessonId}`, values);

      toast.success("Lesson video updated successfully");
      router.refresh();
      toggleEdit();
    } catch (error) {
      console.error("Error updating video URL or duration:", error);
      if (error instanceof z.ZodError) {
        toast.error("Invalid video URL or duration");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  // console.log('lessonid');

  // Function to refresh video status manually
  const refreshVideoStatus = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `/api/courses/${courseId}/lessons/${lessonId}`
      );
      setVideoStatus(data.videoStatus);
    } catch (error) {
      console.error("Error fetching video status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (videoStatus !== "ready" && videoUrl) {
      const interval = setInterval(refreshVideoStatus, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoStatus, videoUrl, courseId, lessonId]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing &&
        (!videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : videoStatus === "ready" ? (
          <div className="relative aspect-video mt-2">
            <VdocipherPlayer videoId={initialData?.videoUrl || ""} />
          </div>
        ) : (
          <div className="flex flex-col gap-2 border border-gray-300 items-center justify-center h-60 bg-slate-100 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
            <p className="text-gray-500 text-sm">
              Video is processing. It may take a few minutes!
            </p>
            <p className="text-gray-500 text-sm">
              Current Status:{" "}
              <span className="font-semibold">{videoStatus}</span>
            </p>
            <Button
              onClick={refreshVideoStatus}
              disabled={isLoading}
              variant="ghost"
              className="mt-1"
              title="Refresh"
            >
              {isLoading ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                <RefreshCw className="h-6 w-6 text-slate-500" />
              )}
            </Button>
          </div>
        ))}

      {isEditing && (
        <div className="mt-2">
          <Uploader2
            videoTitle={initialData?.title || "Title of video"}
            onUploaded={handleVideoUpdate}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this chapter&apos;s video. Only{" "}
            <span className="font-bold">MP4</span> videos are allowed.
          </div>
        </div>
      )}

      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if the
          video does not appear.
        </div>
      )}
    </div>
  );
}
