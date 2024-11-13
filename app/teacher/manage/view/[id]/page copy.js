"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ViewHomework() {
  const { id: homeworkId } = useParams();
  const [homework, setHomework] = useState(null);
  const [studentsViewed, setStudentsViewed] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch the homework details based on the ID
  useEffect(() => {
    if (!homeworkId) {
      setError("Homework ID is missing from the URL.");
      setLoading(false);
      return;
    }

    async function fetchHomeworkDetails() {
      try {
        const response = await fetch(`/api/assignments/${homeworkId}`);
        if (!response.ok) {
          const errorMessage = await response.json();
          setError(`Failed to fetch homework details: ${errorMessage.error}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setHomework(data);

        // Fetch students who viewed the homework
        const studentsResponse = await fetch(`/api/assignments/${homeworkId}/students-viewed`);
        if (!studentsResponse.ok) {
          const studentsErrorMessage = await studentsResponse.json();
          setError(`Failed to fetch students who viewed homework: ${studentsErrorMessage.error}`);
          setLoading(false);
          return;
        }

        const studentsData = await studentsResponse.json();
        setStudentsViewed(studentsData);
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching homework details.");
        console.error("Error fetching homework:", err);
        setLoading(false);
      }
    }

    fetchHomeworkDetails();
  }, [homeworkId]);

  const handleViewFiles = (studentId) => {
    // Implement the logic to view files and responses
    console.log(`Viewing files for student with ID: ${studentId}`);
    // For example, navigate to another route or open a modal
    // router.push(`/view-files/${studentId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!homework) return <p>No homework found.</p>;

  return (
    <div className="flex justify-center pt-12 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Homework Details</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title:</label>
            <p className="text-lg font-semibold">{homework.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <p className="text-lg">{homework.description}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date:</label>
            <p className="text-lg">
              {new Date(homework.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category:</label>
            <p className="text-lg">
              {homework.category?.name || "No Category"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Students Who Viewed:</label>
            {studentsViewed.length > 0 ? (
              <table className="min-w-full mt-4 border-collapse">
                <thead>
                  <tr>
                    <th className="border-b text-left px-4 py-2">ID</th>
                    <th className="border-b text-left px-4 py-2">Name</th>
                    <th className="border-b text-left px-4 py-2">Login Code</th>
                    <th className="border-b text-left px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsViewed.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-100">
                      <td className="border-b px-4 py-2">{student.id}</td>
                      <td className="border-b px-4 py-2">{student.name}</td>
                      <td className="border-b px-4 py-2">{student.loginCode}</td>
                      <td className="border-b px-4 py-2">
                      <button
  onClick={() => router.push(`/teacher/manage/responses/${student.id}?homeworkId=${homeworkId}`)}
  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
>
  View Files
</button>



                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-lg">No students have viewed this homework.</p>
            )}
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => router.push("/teacher/dashboard")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
