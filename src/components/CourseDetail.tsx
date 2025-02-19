import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Shield, Target, BookOpen, Clock, BookOpen as Book, DollarSign, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

interface Course {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  duration: string;
  modules: number;
  lessons: number;
  price: number;
}

// Add an interface for enrollment status
interface EnrollmentStatus {
  isEnrolled: boolean;
  isLoading: boolean;
}

export function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>({
    isEnrolled: false,
    isLoading: true
  });

  // Fetch course data when component mounts
  useEffect(() => {
    async function fetchCourse() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (error) throw error;
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  // Check enrollment status when component mounts
  useEffect(() => {
    if (user) {
      checkEnrollmentStatus();
    } else {
      setEnrollmentStatus({ isEnrolled: false, isLoading: false });
    }
  }, [user, courseId]);

  const checkEnrollmentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_courses')
        .select('enrolled')
        .eq('user_id', user?.id)
        .eq('course_id', courseId)
        .single();

      if (error) throw error;
      setEnrollmentStatus({
        isEnrolled: data?.enrolled || false,
        isLoading: false
      });
    } catch (error) {
      console.error('Error checking enrollment:', error);
      setEnrollmentStatus({ isEnrolled: false, isLoading: false });
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrollmentStatus(prev => ({ ...prev, isLoading: true }));

      // Check if already enrolled
      const { data: existingEnrollment, error: checkError } = await supabase
        .from('user_courses')
        .select('*')
        .eq('user_id', user!.id)
        .eq('course_id', courseId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingEnrollment?.enrolled) {
        toast.error('You are already enrolled in this course');
        setEnrollmentStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Create new enrollment
      const { error: enrollError } = await supabase
        .from('user_courses')
        .insert([
          {
            user_id: user!.id,
            course_id: courseId,
            enrolled: true,
            enrolled_at: new Date().toISOString()
          }
        ]);

      if (enrollError) throw enrollError;

      setEnrollmentStatus({ isEnrolled: true, isLoading: false });
      toast.success('Successfully enrolled in the course!');
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast.error(error.message || 'Failed to enroll in the course');
      setEnrollmentStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handlePreviewOrStart = () => {
    // Navigate to the course player route
    navigate(`/course/${courseId}`); // Note: using /course/ not /courses/
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h1>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
          <Link 
            to="/courses" 
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
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
            <p className="text-xl text-blue-100">{course.short_description}</p>
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
              <p className="text-gray-600">{course.full_description}</p>
              
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

            <div className="flex gap-4">
              {enrollmentStatus.isEnrolled ? (
                <>
                  <button
                    disabled
                    className="w-full md:w-auto px-8 py-3 bg-green-50 text-green-700 rounded-lg font-medium 
                      border border-green-200 cursor-not-allowed"
                  >
                    Enrolled
                  </button>
                  <button
                    onClick={handlePreviewOrStart}
                    className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium 
                      transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:scale-105
                      flex items-center justify-center gap-2"
                  >
                    Go to Course <Play size={16} />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrollmentStatus.isLoading}
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium 
                    transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:scale-105
                    disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {enrollmentStatus.isLoading ? 'Checking...' : 'Enroll Now'}
                </button>
              )}
              {!enrollmentStatus.isEnrolled && (
                <button
                  onClick={handlePreviewOrStart}
                  className="w-full md:w-auto px-8 py-3 bg-blue-100 text-blue-700 rounded-lg font-medium 
                    transition-all duration-200 hover:bg-blue-200
                    flex items-center justify-center gap-2"
                >
                  Preview Lessons <Play size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 