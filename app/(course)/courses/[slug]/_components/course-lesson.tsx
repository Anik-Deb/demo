// @ts-nocheck

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, FileText, Lock, PlayCircle } from "lucide-react";
import ClientCourseLesson from "./course-lesson-component";

export default async function CourseLesson({ course }) {
  // This assumes `course` is passed as a prop or fetched on the server
  console.log("lesssons page");
  return (
    <div className="my-6">
      <h1 className="text-2xl font-bold mb-4">Course Lessons</h1>
      <div type="single" collapsible className="">
        {course.lessons.map((lesson, i) => (
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
                            <PlayCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-green-500" />
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
                        <PlayCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-green-500" />
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
    </div>
  );
}
