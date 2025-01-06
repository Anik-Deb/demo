// @ts-nocheck
import axios from "axios";
export const getLesson = async (lessonSlug, userId) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/front/lessons/lesson`;

  try {
    const response = await axios.post(url, {
      lessonSlug,
      userId,
    });
    return {
      error: false,
      data: response.data,
    };
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return {
      error: true,
      message: error.response?.data?.error || error.message,
    };
  }
};
