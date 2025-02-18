import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Play, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface Module {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
}

export function CoursePlayer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [currentVideo, setCurrentVideo] = useState('');
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  
  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Add error state for invalid course
  if (!courseId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Mock course data (replace with actual API data)
  const courseModules: Module[] = [
    {
      id: 1,
      title: "Introduction to Cybersecurity",
      duration: "45 mins",
      completed: false,
      lessons: [
        {
          id: 1,
          title: "Understanding Cyber Threats",
          duration: "15:00",
          videoUrl: "https://your-video-url.com/1",
          completed: false
        },
        {
          id: 2,
          title: "Basic Security Principles",
          duration: "12:30",
          videoUrl: "https://your-video-url.com/2",
          completed: false
        }
      ]
    },
    // Add more modules as needed
  ];

  const handleLessonClick = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
  };

  return (
    <div className="flex h-screen bg-gray-100 pt-16">
      <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-10">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Shield size={24} className="text-blue-600" />
            <span className="font-bold text-gray-800">SecurGeek</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              Exit Course
            </button>
          </div>
        </div>
      </nav>

      {/* Video Player Section */}
      <div className="flex-1 p-6">
        <div className="bg-black aspect-video rounded-lg overflow-hidden mb-4">
          {currentVideo ? (
            <video 
              className="w-full h-full"
              controls
              src={currentVideo}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <Play size={48} />
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-2">Security Awareness Training</h1>
          <p className="text-gray-600">
            Learn essential cybersecurity practices to protect your organization.
          </p>
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Course Content</h2>
          <div className="space-y-4">
            {courseModules.map((module) => (
              <div key={module.id} className="border rounded-lg">
                <button
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    {module.completed ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className="font-medium">{module.title}</span>
                  </div>
                  {expandedModule === module.id ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
                {expandedModule === module.id && (
                  <div className="border-t">
                    {module.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson.videoUrl)}
                        className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 text-left"
                      >
                        {lesson.completed ? (
                          <CheckCircle className="text-green-500" size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                        <div>
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-sm text-gray-500">{lesson.duration}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 