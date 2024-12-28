// @ts-nocheck
// "use client";
// import { useState } from "react";

export default function CourseDescription({ course }) {
  // const [isExpanded, setIsExpanded] = useState(false);
  // const toggleDescription = () => setIsExpanded(!isExpanded);

  // Limit the initial text shown
  const shortDescription = course.description?.substring(0, 1200); // Adjust length as needed
  console.log("descriptiom page");
  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold mb-4">Description</h1>
      <div>
        <p
          className="text-sm mb-4 text-black text-justify"
          dangerouslySetInnerHTML={{
            __html: `${shortDescription}...`,
          }}
        />
        {/* <button
          onClick={toggleDescription}
          className="text-blue-500 hover:underline text-sm"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button> */}
      </div>
    </div>
  );
}
