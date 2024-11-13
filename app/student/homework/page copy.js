"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { serialize } from 'cookie';

export default function StudentHomework() {
  const [homeworkList, setHomeworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();
  const [userName, setUserName] = useState('');

useEffect(() => {
  const userName = document.cookie.match('(^|;)\\s*name\\s*=\\s*([^;]+)')?.pop() || '';
  setUserName(userName);
}, []);

  // Check if the user is a student and redirect accordingly
  useEffect(() => {
    // Verify session status and role
    const checkSession = () => {
      const userName = document.cookie.match('(^|;)\\s*name\\s*=\\s*([^;]+)')?.pop() || '';
      const userRole = document.cookie.match('(^|;)\\s*role\\s*=\\s*([^;]+)')?.pop() || '';
      const userId = document.cookie.match('(^|;)\\s*id\\s*=\\s*([^;]+)')?.pop() || '';
  
      if (!userRole || !userId) {
        //router.push('/login');
      } else if (userRole !== 'student') {
        router.push('/');
      } else {
        console.log(`Welcome ${userName} (ID: ${userId})`);
      }
      alert(`Welcome, ${userName} (ID: ${userId})! You are logged in as a ${userRole}.`);
    };
    
  
    checkSession();
  }, [router]);
  

  useEffect(() => {
    async function fetchHomework() {
      try {
        const response = await fetch('/api/assignments');
        if (!response.ok) {
          throw new Error('Failed to fetch homework');
        }
        const data = await response.json();
        setHomeworkList(data);
      } catch (error) {
        console.error("Error fetching homework:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchHomework();
    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredHomework = homeworkList.filter((homework) => {
    const matchesCategory = selectedCategory
      ? homework.category && homework.category.id === parseInt(selectedCategory)
      : true;
    const matchesSearch = homework.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const categoryColors = {
    1: "bg-red-500",
    2: "bg-green-500",
    3: "bg-blue-500",
    4: "bg-yellow-500",
    5: "bg-purple-500",
    6: "bg-pink-500",
    7: "bg-indigo-500",
    8: "bg-teal-500",
    9: "bg-orange-500",
    10: "bg-cyan-500",
    11: "bg-lime-500",
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Homework Assignments</h1>

      <p className="text-red-600 text-3xl"> {userName}</p>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border rounded"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHomework.map((homework) => {
          const categoryColor = categoryColors[homework.category?.id] || "bg-gray-500";

          return (
            <div key={homework.id} className="bg-white border rounded-lg shadow-lg p-4">
              <div className="h-32 w-full bg-gray-200 rounded-md mb-4 flex flex-col justify-between">
                <div className={`p-2 ${categoryColor} text-white font-semibold text-center rounded-t-md`}>
                  {homework.category ? homework.category.name : 'No Category'}
                </div>
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-500">{homework.title}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-2">{homework.description}</p>
              <p className="text-gray-500 mb-4">
                Due Date: {new Date(homework.dueDate).toLocaleDateString()}
              </p>
              {homework.teacher && (
                <p className="text-gray-500">Created by: {homework.teacher.name}</p>
              )}
              <Link href={`/student/homework/${homework.id}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  View Details
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
