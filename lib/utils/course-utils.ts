// // @ts-nocheck

// export const checkCourseAccess = async (courseSlug: string, userId: number) => {
//   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/access`;
//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ courseSlug, userId }),
//       cache: "force-cache", // Prevent caching for sensitive data
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return {
//         access: false,
//         message: errorData.error || "Access denied",
//       };
//     }

//     const data = await response.json();
//     return {
//       access: data.access,
//     };
//   } catch (error) {
//     console.error("Error checking course access via API", error);
//     return {
//       access: false,
//       message: "Error occurred while checking access",
//     };
//   }
// };

// export const getCourseBySlug = async (courseSlug: string, userId?: number) => {
//   const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/front/courses/course`;
//   try {
//     const body = {
//       courseSlug,
//       ...(userId ? { userId } : {}),
//     };

//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//       cache: "force-cache", // Prevent caching for sensitive data
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || "Invalid request");
//     }

//     const course = await response.json();
//     return course;
//   } catch (error) {
//     console.error("Error fetching course", error);
//     throw new Error("Error occurred while fetching course");
//   }
// };

