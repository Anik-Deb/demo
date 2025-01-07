// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { VdocipherVideoPlayer } from "../chapters/[chapterId]/_components/vdocipher-video-player";
import CourseDescription from "./course-description";
import Sidebar from "./sidebar";
import { CourseProgressButton } from "../chapters/[chapterId]/_components/course-progress-button";
import RatingForm from "./RatingForm";
import { Preview } from "@/components/preview";
import NotificationHandler from "@/components/notificationHandler/NotificationHandler";
import AuthorBio from "./author-bio";
import Review from "./review";
import MoreCourses from "./more-course";
import RelatedCourse from "./related-course";
import { useSearchParams } from "next/navigation";
import { useGetAllLessonsMutation } from "@/lib/redux/Actions/lessons";
import StudentSidebar from "./student-sidebar";
import { useLessonContext } from "@/lib/utils/LessonContext";
import { Loader, Loader2Icon } from "lucide-react";
import { TabNavigation } from "./details-tab-navigation";

export const LessonContent = () => {
  const {
    lesson,
    course,
    nextLesson,
    userProgress,
    purchase,
    userId,
    loading,
    setLoading,
  } = useLessonContext();

  const [currentVideoUrl, setCurrentVideoUrl] = useState(lesson.videoUrl);
  const [activeTab, setActiveTab] = useState("content");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLocked = !lesson.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  const handleLessonChange = () => {
    setLoading(true); // Set loading state when lesson is being changed
  };

  useEffect(() => {
    if (lesson.videoUrl !== currentVideoUrl) {
      setLoading(true); // Start loading when video URL changes
      setCurrentVideoUrl(lesson.videoUrl); // Update video URL
    }

    // Stop loading once video URL is updated
    if (lesson.videoUrl === currentVideoUrl) {
      setLoading(false);
    }
  }, [lesson, currentVideoUrl]);

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const failed = searchParams.get("failed");

  const tabs = [
    { label: "Lesson Content", value: "content" },
    { label: "Course Description", value: "description" },
    { label: "Rating", value: "rating" },
  ];

  // Fetch rating
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(
          `/api/courses/ratings?courseId=${course.id}&userId=${userId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error fetching rating");
        }

        const ratingData = await response.json();
        setRatingValue(ratingData.value || 0);
      } catch (err: any) {
        setError(err.message || "Failed to fetch rating");
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [course?.id, userId]);

  // Handle rating submission and update local state
  const handleRatingSubmit = async (newRating: number) => {
    try {
      const response = await fetch("/api/courses/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: newRating,
          courseId: course?.id,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error submitting rating");
      }

      setRatingValue(newRating); // Update the local state with the new rating
    } catch (error) {
      // Handle submission error if needed
      console.error(error);
    }
  };

  useEffect(() => {
    // Determine message based on URL parameters
    if (success) {
      setNotificationMessage("Enrollment successful!");
    } else if (canceled) {
      setNotificationMessage("Enrollment canceled");
    } else if (failed) {
      setNotificationMessage("Enrollment failed");
    } else {
      setNotificationMessage(null); // No message if parameters do not match
    }
  }, [success, canceled, failed]);

  // Function to extract video ID from different YouTube URLs formats
  const getYouTubeVideoId = (url: string) => {
    const youtubeRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/[^\/]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  // Determine video type
  const isYouTubeVideo =
    currentVideoUrl?.includes("youtube.com") ||
    currentVideoUrl?.includes("youtu.be");
  const isEmbeddedVideo = currentVideoUrl?.startsWith("http");
  const isVdoCipherVideo = currentVideoUrl?.includes("vdocipher.com");
  const isDirectVideo = currentVideoUrl?.endsWith(".mp4");

  // Extract video ID for YouTube
  const youtubeVideoId = isYouTubeVideo
    ? getYouTubeVideoId(currentVideoUrl)
    : null;

  return (
    <>
      {notificationMessage && (
        <NotificationHandler message={notificationMessage} />
      )}

      <div>
        {/* dynamic Video */}
        {loading ? (
          <div className="flex-1">
            <div className="h-[450px] w-full bg-gray-200 rounded-md flex justify-center items-center animate-pulse backdrop-blur-sm mb-4">
              <Loader className="h-5 w-5 animate-spin" />
            </div>
          </div>
        ) : (
          <div className="transition-opacity duration-700 ease-in-out opacity-100">
            {currentVideoUrl && (
              <div className="mb-4 transition-opacity duration-700 ease-in-out opacity-100">
                {
                  // Check the type of video URL and render the appropriate player
                  isYouTubeVideo && youtubeVideoId ? (
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0`}
                        title="YouTube Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                        loading="lazy"
                      />
                    </div>
                  ) : isEmbeddedVideo ? (
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <iframe
                        className="w-full h-full"
                        src={currentVideoUrl}
                        frameBorder="0"
                        allowFullScreen
                        title="Embedded Video"
                        loading="lazy"
                      ></iframe>
                    </div>
                  ) : isDirectVideo ? (
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <video className="w-full h-full" controls autoPlay muted>
                        <source src={currentVideoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <VdocipherVideoPlayer
                      chapterId={lesson.id}
                      title={lesson.title}
                      courseId={course.id || ""}
                      nextChapterId={null}
                      videoUrl={currentVideoUrl}
                      videoStatus={lesson.videoStatus || ""}
                      isLocked={isLocked}
                      completeOnEnd={completeOnEnd}
                    />
                  )
                }
              </div>
            )}
          </div>
        )}
        {/* dynamic course Content */}
        <div className="min-h-auto md:min-h-auto ">
          <div className="flex flex-row flex-wrap gap-x-4 items-center justify-between">
            <h1 className="text-xl font-semibold text-black capitalize truncat">
              {lesson.title}
            </h1>
            <div className="flex  justify-start mt-2 mb-4">
              <CourseProgressButton
                course={course}
                lessonId={lesson.id}
                courseId={course.id}
                nextLessonId={nextLesson?.id}
                isCompleted={userProgress?.isCompleted}
                userId={userId}
              />
            </div>
          </div>
          <div>
            {/* tab content */}
            <div>
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="pt-4">
                {activeTab === "content" && (
                  <div className="mx-auto flex max-w-7xl min-h-[150px] items-center justify-between gap-x-6">
                    <div className="w-full max-w-[51rem]">
                      <div className="w-full">
                        {lesson?.textContent ? (
                          <Preview value={lesson.textContent} />
                        ) : (
                          <div className="min-h-[150px] text-gray-400 border border-gray-200 rounded-md flex justify-center items-center">
                            <p>কোন কনটেন্ট পাওয়া যায়নি!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "description" && (
                  <CourseDescription course={course} />
                )}

                {activeTab === "rating" && (
                  <RatingForm
                    courseId={course?.id}
                    userId={userId}
                    initialRating={ratingValue}
                    onRatingSubmit={handleRatingSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
