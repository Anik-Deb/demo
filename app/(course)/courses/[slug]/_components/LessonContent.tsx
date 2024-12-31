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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AuthorBio from "./author-bio";
import Review from "./review";
import MoreCourses from "./more-course";
import RelatedCourse from "./related-course";
import { useSearchParams } from "next/navigation";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`flex-1 py-3 transition duration-200 ${
            activeTab === tab.value
              ? "border-b-2 border-teal-700 text-teal-700"
              : "text-gray-600 hover:text-teal-600 focus:outline-none"
          }`}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export const LessonContent = ({
  lesson,
  course,
  nextLesson,
  userProgress,
  purchase,
  userId,
  relatedCourses,
}) => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState(lesson.videoUrl);
  const isLocked = !lesson.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  const [activeTab, setActiveTab] = useState("content");

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const failed = searchParams.get("failed");

  const tabs = [
    { label: "Lesson Content", value: "content" },
    { label: "Course Description", value: "description" },
    { label: "Rating", value: "rating" },
  ];

  // State to manage the notification message
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    // Determine message based on URL parameters
    if (success) {
      setNotificationMessage("Course purchase completed successfully");
    } else if (canceled) {
      setNotificationMessage("Course purchase canceled");
    } else if (failed) {
      setNotificationMessage("Course purchase failed");
    } else {
      setNotificationMessage(null); // No message if parameters do not match
    }
  }, [success, canceled, failed]);

  // Function to extract video ID from different YouTube URL formats
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
    <div>
      {/* Course title */}
      {notificationMessage && (
        <NotificationHandler message={notificationMessage} />
      )}
      <div className="bg-[#105650]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 px-6 py-3 lg:px-8">
          <h1 className="text-xl font-semibold text-white">{course.title}</h1>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8">
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1">
            {/* dynamic Video */}
            {currentVideoUrl && (
              <div className="mb-4">
                {
                  // Check the type of video URL and render the appropriate player
                  isYouTubeVideo && youtubeVideoId ? (
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1`}
                        title="YouTube Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
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
                              <div className="min-h-[150px] text-red-400 border border-red-200 rounded-md flex justify-center items-center">
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
                      <RatingForm courseId={course?.id} userId={userId} />
                    )}
                  </div>
                </div>
              </div>

              <div className="hidden md:block">
                <RelatedCourse courses={relatedCourses} />
              </div>
              {/* 
              <AuthorBio />
              <Review />
              <MoreCourses /> 
              */}
            </div>
          </div>
          {/* Sidebar */}
          <div className="flex-initial w-full relative lg:w-96 z-10">
            <div className="w-full h-full ">
              <div className="sticky bg-white top-4">
                <div className="border border-gray-200 min-h-[80vh]">
                  <Sidebar
                    videoUrl={currentVideoUrl}
                    onVideoUrlUpdate={setCurrentVideoUrl}
                    course={course}
                    access={!!purchase}
                    lesson={course.lessons}
                    userId={userId}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="block md:hidden">
            <RelatedCourse courses={relatedCourses} />
          </div>
        </div>
      </div>
    </div>
  );
};
