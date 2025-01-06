// @ts-nocheck
// Import required components and icons
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDuration } from "@/lib/formatDuration";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { FileIcon, CodeIcon } from "lucide-react";

// Course inclusion section, using a Shadcn Card component
// This card presents course features, with icons and text aligned
const CourseInclusions = ({ course }) => {
  let courseDuration = course?.totalDuration / 60;
  // console.log("includes page");

  let formattedDuration = formatDuration(courseDuration);
  return (
    <>
      {courseDuration !== 0 && (
        <div className="md:py-4 pt-6">
          <Card className="p-0 border-none shadow-none">
            <CardContent className="flex items-start p-0">
              {/* Left section for video and coding exercises */}
              <div className="mr-10">
                <CardHeader className="p-0">
                  {/* Title for course inclusions */}
                  <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    This Course Includes
                  </h1>
                </CardHeader>

                {/* List of course items */}
                <ul className="space-y-2">
                  {/* Each list item includes an icon and description */}
                  {formattedDuration && (
                    <li className="flex gap-2 items-center">
                      <FileIcon className="w-4 h-4 stroke-gray-400" />
                      <span>{formattedDuration} on-demand video</span>
                    </li>
                  )}

                  <li className="flex gap-2 items-center">
                    <CodeIcon className="w-4 h-4 stroke-gray-400" />
                    <span>Quiz</span>
                  </li>
                </ul>
              </div>

              {/* Right section for assignments and other inclusions */}
              <div>
                {/* Additional course items */}
                <ul className="space-y-2 mt-12">
                  <li className="flex gap-2 items-center">
                    <CodeIcon className="w-4 h-4 stroke-gray-400" />
                    <span>Assignments</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CourseInclusions;
