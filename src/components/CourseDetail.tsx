import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Target, BookOpen, Clock, BookOpen as Book, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const courses = {
  'cybersecurity-basics': {
    id: 'cybersecurity-basics',
    icon: <Shield className="w-20 h-20 text-blue-500" />,
    title: "Cybersecurity Basics & Awareness",
    shortDescription: "Essential cybersecurity training for SME employees",
    fullDescription: "A comprehensive introduction to cybersecurity fundamentals designed specifically for small and medium enterprise employees. Learn about critical security concepts, common threats, data protection, and best practices through engaging audio lessons that fit into your busy schedule.",
    duration: "4.5 hours",
    modules: 5,
    lessons: 18,
    price: "$49.99",
    highlights: [
      "Understanding cybersecurity fundamentals",
      "SME-specific security challenges",
      "Common cyber threats and prevention",
      "Data sensitivity and privacy",
      "Employee security best practices",
      "Real-world case studies",
      "Practical security measures",
      "Incident reporting procedures"
    ]
  },
  // ... add other courses similarly
};

export function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const course = courses[courseId as keyof typeof courses];

  const handleEnroll = () => {
    if (!user) {
      toast.error('Please sign in to enroll in this course');
      return;
    }
    // Here you would typically make an API call to enroll the user
    // For now, we'll just navigate to the course player
    navigate(`/course/${courseId}`);
    toast.success('Successfully enrolled in the course!');
  };

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-12">
            <div className="flex items-center space-x-6 mb-6">
              {course.icon}
              <h1 className="text-4xl font-bold">{course.title}</h1>
            </div>
            <p className="text-xl text-blue-100">{course.shortDescription}</p>
          </div>
          
          <div className="p-12">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="flex items-center space-x-3">
                <Clock className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Book className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Lessons</p>
                  <p className="font-medium">{course.lessons} lessons</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">{course.price}</p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-12">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-600">{course.fullDescription}</p>
              
              <h3 className="text-xl font-bold mt-8 mb-4">What You'll Learn</h3>
              <ul className="grid md:grid-cols-2 gap-4">
                {course.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <Shield className="text-blue-500" size={16} />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleEnroll}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium 
                transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:scale-105"
            >
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 