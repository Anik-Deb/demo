// @ts-nocheck

import CheckoutButton from "@/components/checkoutButton/checkoutButton";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { RadioGroup } from "@/components/ui/radio-group";
import moment from "moment";
import { db } from "@/lib/db";

const SingleCoursePrice = async ({ course, userId }) => {
  const isDiscountExpired = (expiresAt) => {
    const currentDate = new Date();
    const discountExpiryDate = new Date(expiresAt);
    return currentDate.getTime() > discountExpiryDate.getTime();
  };
console.log("single course price");
  return (
    <>
      <div>
        <RadioGroup defaultValue={course.prices[0].id}>
          {course.prices.map((price) => (
            <div
              key={price.id}
              className="flex items-start space-x-2 gap-2 border border-gray-200 rounded-md mb-2 p-2 cursor-pointer "
            >
              <RadioGroupItem value={price.id} id={price.id} />
              {isDiscountExpired(price?.discountExpiresOn) ? (
                <Label
                  className="w-full flex flex-col items-start gap-1 cursor-pointer"
                  htmlFor={price.id}
                >
                  {price?.isFree ? (
                    <div className="flex gap-1 items-center">
                      <span>Free</span>
                    </div>
                  ) : (
                    <div className="flex gap-1 items-center">
                      <span>৳ {price.regularAmount}</span>
                      <span className="text-sm text-gray-500">
                        {" / "}
                        {price.frequency.toLowerCase()}
                      </span>
                    </div>
                  )}
                </Label>
              ) : (
                <Label
                  className="w-full flex flex-col items-start gap-1 cursor-pointer"
                  htmlFor={price.id}
                >
                  <div className="flex gap-1 items-center">
                    <span>৳ {price.discountedAmount}</span>
                    <span className="text-sm text-gray-500 line-through">
                      {price.regularAmount}
                    </span>
                    <span className="text-sm text-gray-500">
                      {" / "}
                      {price.frequency.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex gap-1 text-xs">
                    <span className="text-gray-500">offer expires on:</span>
                    <span>
                      {moment(price.discountExpiresOn).format("MMM Do YYYY")}
                    </span>
                  </div>
                </Label>
              )}
            </div>
          ))}
        </RadioGroup>

        <CheckoutButton
          userId={userId}
          courseId={course.id}
          priceId={course.prices[0].id} // Use default price
          checked={true} // TODO: Pass actual checkbox state
        />
      </div>

      <p className="text-center text-xs text-gray-700 mb-2">
        30-Day Money-Back Guarantee
      </p>
      <p className="text-center text-xs text-gray-700 mb-6">
        Full Lifetime Access
      </p>
    </>
  );
};

export default SingleCoursePrice;

export async function getServerSideProps(context) {
  const { courseId } = context.params; // Assumes a route like `/course/[courseId]`
  const userId = context.req.session?.user?.id || null; // Get user from session

  // Fetch course details from the database
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      prices: true,
    },
  });

  if (!course) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      course,
      userId,
    },
  };
}
