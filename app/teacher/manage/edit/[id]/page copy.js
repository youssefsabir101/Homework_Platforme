// app/teacher/manage/edit/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditHomework() {
  const { id: homeworkId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categories, setCategories] = useState([]); // State for categories
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // Message for user feedback
  const router = useRouter();

  // Fetch existing homework data
  useEffect(() => {
    if (!homeworkId) {
      setError("Homework ID is missing from the URL.");
      setLoading(false);
      return;
    }

    async function fetchHomework() {
      try {
        const response = await fetch(`/api/assignments/${homeworkId}`);
        if (!response.ok) {
          const errorMessage = await response.json();
          setError(`Failed to fetch homework data: ${errorMessage.error}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setDueDate(data.dueDate ? data.dueDate.split("T")[0] : "");
        setSelectedCategory(data.categoryId || ""); // Set the selected category
        setLoading(false);
      } catch (err) {
        setError("An error occurred while fetching homework data.");
        console.error("Error fetching homework:", err);
        setLoading(false);
      }
    }

    // Fetch categories for the select input
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoryData = await response.json();
        setCategories(categoryData);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchHomework();
    fetchCategories();
  }, [homeworkId]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/assignments/${homeworkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          categoryId: selectedCategory, // Include the selected category ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update homework");
      }

      setMessage("Homework updated successfully!");

      // Redirect to the teacher dashboard after a short delay
      setTimeout(() => {
        router.push("/teacher/dashboard");
      }, 2000);
    } catch (err) {
      setMessage("Error updating homework. Please try again.");
      console.error("Error updating homework:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex justify-center pt-12 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Homework</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title:</label>
            <input
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Update Homework
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-green-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
