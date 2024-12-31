// @ts-nocheck
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { redirect } from "next/navigation";
import { Chart } from "./_components/chart";
import { DataCard } from "./_components/data-card";

const AnalyticsPage = async () => {
  const session = await getServerUserSession();

  if (!session || !session.userId) {
    redirect("/");
    return;
  }

  const teacherId = session.userId;

  try {
    // Get all teacher revenue data filtered by teacherId
    const teacherRevenueData = await db.teacherRevenue.findMany({
      where: {
        teacherId: teacherId,
      },
    });

    // Calculate total revenue and sales count
    const totalRevenue = teacherRevenueData.reduce(
      (acc, revenue) => acc + revenue.amountEarned,
      0
    );

    const totalSalesCount = teacherRevenueData.length; // Count of revenue objects

    // Get all courses taught by the teacher
    const courses = await db.course.findMany({
      where: {
        teacherId: teacherId,
      },
    });

    // Prepare an array to hold sales per course
    const courseSales = await Promise.all(
      courses.map(async (course) => {
        const salesData = await db.teacherRevenue.aggregate({
          _sum: {
            amountEarned: true,
          },
          where: {
            teacherId: teacherId,
            purchase: {
              courseId: course.id,
            },
          },
        });

        return {
          name: course.title, // Updated to use the correct property
          total: salesData._sum.amountEarned || 0,
        };
      })
    );

    // Prepare revenue and sales data
    const revenueData = {
      data: courseSales,
      totalRevenue: totalRevenue || 0,
      totalSalesCount: totalSalesCount || 0,
    };

    return (
      // <div>
      //   <h2>Teacher Revenue</h2>
      //   <p>
      //     <strong>Total Revenue: </strong>${revenueData.totalRevenue.toFixed(2)}
      //   </p>
      //   <p>
      //     <strong>Total Sales Count: </strong>
      //     {revenueData.totalSalesCount}
      //   </p>
      //   <h3>Total Sales per Course:</h3>
      //   <ul>
      //     {revenueData.data.map((course) => (
      //       <li key={course.courseName}>
      //         {course.courseName}: ${course.totalSales.toFixed(2)}
      //       </li>
      //     ))}
      //   </ul>
      // </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <DataCard
            label="Total Revenue"
            value={revenueData?.totalRevenue}
            shouldFormat
          />
          <DataCard label="Total Sales" value={revenueData?.totalSalesCount} />
        </div>
        <Chart data={revenueData?.data} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching revenue and sales data:", error);
    return <p>Error fetching revenue data.</p>;
  }
};

export default AnalyticsPage;
