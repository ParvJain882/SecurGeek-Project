import React from 'react';
import { Shield, Target, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const courses = [
  {
    id: 'cybersecurity-basics',
    icon: <Shield className="w-16 h-16 text-blue-500" />,
    title: "Cybersecurity Basics & Awareness",
    shortDescription: "Essential cybersecurity training for SME employees",
    fullDescription: "A comprehensive introduction to cybersecurity fundamentals designed specifically for small and medium enterprise employees. Learn about critical security concepts, common threats, data protection, and best practices through engaging audio lessons that fit into your busy schedule.",
    duration: "4.5 hours",
    modules: 5,
    lessons: 18,
    price: "$49.99"
  },
  {
    id: 'social-engineering',
    icon: <Target className="w-16 h-16 text-blue-600" />,
    title: "Social Engineering Defense Series",
    shortDescription: "Protect against manipulation tactics with real-world scenarios.",
    fullDescription: "Understand and defend against social engineering attacks through practical audio lessons. Learn to identify common tactics, protect sensitive information, and build a security-conscious mindset. Real-world examples and actionable strategies included.",
    duration: "3 hours",
    modules: 4,
    lessons: 12,
    price: "$39.99"
  },
  {
    id: 'compliance-privacy',
    icon: <BookOpen className="w-16 h-16 text-blue-600" />,
    title: "Compliance & Privacy Essentials",
    shortDescription: "Master data privacy regulations and compliance requirements.",
    fullDescription: "Stay up-to-date with the latest data privacy regulations and compliance requirements. This course covers essential frameworks, best practices for data protection, and practical implementation strategies. Perfect for professionals dealing with sensitive data.",
    duration: "5 hours",
    modules: 6,
    lessons: 18,
    price: "$59.99"
  }
];

export function CoursesListing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCourseClick = (e: React.MouseEvent, courseId: string) => {
    if (!user) {
      e.preventDefault();
      toast.error('Please sign in to view course details');
      navigate('/?auth=signin&autoOpen=true');
      return;
    }
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Available Courses</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id}
              onClick={(e) => handleCourseClick(e, course.id)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  {course.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.shortDescription}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{course.duration}</span>
                  <span>{course.lessons} lessons</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 