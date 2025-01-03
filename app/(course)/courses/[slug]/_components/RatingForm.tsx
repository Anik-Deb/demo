"use client";

import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button"; // Ensure Button component is correctly imported
import { Loader } from "lucide-react";
import { toast } from "react-hot-toast"; // Import toast correctly

interface RatingFormProps {
  courseId: string;
  userId: string;
}

const RatingForm: React.FC<RatingFormProps> = ({ courseId, userId }) => {
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false); // To track submission status

  // Fetch existing rating when the component mounts
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(
          `/api/courses/ratings?courseId=${courseId}&userId=${userId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error fetching rating");
        }

        const ratingData = await response.json();
        if (ratingData) {
          setRatingValue(ratingData.value); // Pre-set the rating value
          setHasSubmitted(true); // Mark that the user has submitted a rating
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch existing rating");
      }
    };

    fetchRating();
  }, [courseId, userId]);

  // Function to handle submitting the rating
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    // Validate rating value
    if (ratingValue < 1 || ratingValue > 5) {
      setError("Rating must be between 1 and 5!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/courses/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: ratingValue,
          courseId,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error submitting rating");
      }

      // Show success toast notification
      toast.success("Rating submitted successfully!");
      setHasSubmitted(true); // Mark as submitted
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle rating click
  const handleRatingClick = (value: number) => {
    setRatingValue(value); // Set the rating value when a star is clicked
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <h1 className="text-2xl font-bold mb-4">Rate this Course</h1>
      <div className="flex flex-col items-left gap-5">
        <div className="flex gap-3 cursor-pointer">
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              onClick={() => handleRatingClick(value)}
              aria-label={`Rate ${value} stars`}
              style={{
                fontSize: "24px",
                color: value <= ratingValue ? "gold" : "gray",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <Button
              className="bg-teal-700"
              disabled={loading || ratingValue === 0}
              type="submit"
            >
              {loading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : hasSubmitted ? (
                "Submit again"
              ) : (
                "Submit Rating"
              )}
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </form>
  );
};

export default RatingForm;
