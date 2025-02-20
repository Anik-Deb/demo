// @ts-nocheck

"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import VideoPopUp from "./VideoPopUp";

export default function CourseLesson({ course }) {
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const visibleLessonCount = 10;
  const [visibleLessons, setVisibleLessons] = useState(visibleLessonCount); // Start with 10 lessons visible
  const handleToggleVisibility = () => {
    if (visibleLessons === visibleLessonCount) {
      setVisibleLessons(course.lessons.length); // Show all lessons
    } else {
      setVisibleLessons(visibleLessonCount); // Show only the first 10 lessons
    }
  };


  return (
    <div className="my-6">
      <h1 className="text-2xl font-bold mb-4">Course Lessons</h1>
      <div type="single" className="">
        {course.lessons.slice(0, visibleLessons).map((lesson, i) => (
          <div key={lesson.id} value={lesson.id}>
            <div className="p-4 bg-gray-100 mb-3 border">
              <div className="flex items-start w-full">
                {lesson.isFree ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => handleLessonClick(lesson)}
                        className="text-sm text-black flex justify-between w-full gap-4"
                      >
                        <div className="w-full flex gap-2">
                          {lesson.videoUrl !== null ? (
                            <PlayCircle className="w-5 h-5 text-gray-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-500" />
                          )}
                          <div>
                            <p className="text-sm text-black capitalize text-start">
                              {lesson?.title?.trim()}
                            </p>
                            {lesson.description && (
                              <p
                                className="text-sm mt-2 text-gray-600"
                                dangerouslySetInnerHTML={{
                                  __html: lesson?.description,
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">Free</div>
                      </button>
                    </DialogTrigger>
                    {selectedLesson && (
                      <VideoPopUp
                        course={{
                          id: course.id,
                          title: course.title,
                          previewVideoUrl: selectedLesson.videoUrl || "", // Dummy video
                          lesson: selectedLesson, // Pass the lesson
                        }}
                      />
                    )}
                  </Dialog>
                ) : (
                  <div className="flex justify-between w-full gap-4">
                    <div className="w-full flex gap-2">
                      {lesson.videoUrl !== null ? (
                        <PlayCircle className="w-5 h-5 text-gray-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <p className="text-sm text-black capitalize">
                          {lesson?.title}
                        </p>
                        {lesson.description && (
                          <p
                            className="text-sm mt-2 text-gray-600"
                            dangerouslySetInnerHTML={{
                              __html: lesson?.description,
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div>
                      <Lock className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>
                )}
                {/* {lesson.videoUrl !== null ? (
                  <span className="text-gray-500">
                    {lesson?.duration || ""}
                  </span>
                ) : (
                  <span></span>
                )} */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      {course.lessons.length > visibleLessonCount && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleToggleVisibility}
            className="flex items-center justify-center gap-2 px-4 py-2 transition ease-in border bg-gray-100 rounded-md hover:bg-gray-800 hover:text-white w-full"
          >
            {visibleLessons === visibleLessonCount ? (
              <>
                {course.lessons.length - visibleLessons} More Lessons
                <ChevronDown className="h-5 w-5" />
              </>
            ) : (
              <>
                Show Less
                <ChevronUp className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
