// @ts-nocheck
// export const getTestCourses = async () => {
//   // Fetch data server-side
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`);
//   const data = await res.json();
//   return data;
// };

export const getRating = async (courseId) => {
  const ratingResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/ratings/averageRating?courseId=${courseId}`
  );
  const ratingData = await ratingResponse.json();
  return ratingData;
};
