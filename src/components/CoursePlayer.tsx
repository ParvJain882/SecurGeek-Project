import React, { useState, useEffect, useRef } from 'react';
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

interface AudioDurations {
  [key: string]: string;
}

const getAudioDuration = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };
    audio.onerror = () => reject('Error loading audio');
    audio.load();
  });
};

export function CoursePlayer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [currentVideo, setCurrentVideo] = useState('');
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioDurations, setAudioDurations] = useState<AudioDurations>({});
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);

  // Move courseModules before the useEffects
  const courseModules: Module[] = [
    {
      id: 1,
      title: "Introduction to Cybersecurity",
      duration: "45 mins",
      completed: false,
      lessons: [
        {
          id: 1,
          title: "Introduction to Cybersecurity",
          duration: "45:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.1.wav",
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: "Importance of Cybersecurity for SMEs",
      duration: "45 mins",
      completed: false,
      lessons: [
        {
          id: 4,
          title: "Common Cyber Risks Faced by SMEs",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.2.1.wav",
          completed: false
        },
        {
          id: 5,
          title: "Impact of Cyberattacks on Business Operations",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.2.2.wav",
          completed: false
        },
        {
          id: 6,
          title: "Case Studies of Cybersecurity Breaches",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.2.3.wav",
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: "Common Cyber Threats",
      duration: "75 mins",
      completed: false,
      lessons: [
        {
          id: 7,
          title: "Phishing Attacks",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.3.1.wav",
          completed: false
        },
        {
          id: 8,
          title: "Ransomware",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.3.2.wav",
          completed: false
        },
        {
          id: 9,
          title: "Social Engineering",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.3.3.wav",
          completed: false
        },
        {
          id: 10,
          title: "Malware & Viruses",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.3.4.wav",
          completed: false
        },
        {
          id: 11,
          title: "Insider Threats",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.3.5.wav",
          completed: false
        }
      ]
    },
    {
      id: 4,
      title: "Understanding Data Sensitivity & Privacy",
      duration: "45 mins",
      completed: false,
      lessons: [
        {
          id: 12,
          title: "What is Sensitive Data?",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.4.1.wav",
          completed: false
        },
        {
          id: 13,
          title: "Why Data Privacy Matters",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.4.2.wav",
          completed: false
        },
        {
          id: 14,
          title: "How Cybercriminals Exploit Unprotected Data",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.4.3.wav",
          completed: false
        }
      ]
    },
    {
      id: 5,
      title: "Cybersecurity Best Practices for Employees",
      duration: "60 mins",
      completed: false,
      lessons: [
        {
          id: 15,
          title: "Using Secure Passwords & Authentication",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.5.1.wav",
          completed: false
        },
        {
          id: 16,
          title: "Recognizing & Avoiding Suspicious Content",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.5.2.wav",
          completed: false
        },
        {
          id: 17,
          title: "Safe Use of Business & Personal Devices",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.5.3.wav",
          completed: false
        },
        {
          id: 18,
          title: "Reporting Security Incidents",
          duration: "15:00",
          videoUrl: "/courses/cybersecurityBasics&Awareness/1.5.4.wav",
          completed: false
        }
      ]
    }
  ];

  // Update first useEffect to include courseId dependency
  useEffect(() => {
    // Redirect to home if not authenticated
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  // Update second useEffect to set initial lesson
  useEffect(() => {
    if (courseModules.length > 0 && courseModules[0].lessons.length > 0) {
      const firstLesson = courseModules[0].lessons[0];
      setCurrentVideo(firstLesson.videoUrl);
      setCurrentLessonId(firstLesson.id); // Also set the initial lesson ID
      setExpandedModule(courseModules[0].id);
    }
  }, []);

  // Update third useEffect to include courseModules dependency
  useEffect(() => {
    const loadAllDurations = async () => {
      const durations: AudioDurations = {};
      
      for (const module of courseModules) {
        for (const lesson of module.lessons) {
          try {
            const duration = await getAudioDuration(lesson.videoUrl);
            durations[lesson.videoUrl] = duration;
          } catch (error) {
            console.error(`Error loading duration for ${lesson.videoUrl}:`, error);
            durations[lesson.videoUrl] = '--:--';
          }
        }
      }
      
      setAudioDurations(durations);
    };

    loadAllDurations();
  }, [courseModules]);

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

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLessonClick = async (videoUrl: string, lessonId: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update the URL to use the correct path
      const audioUrl = `${window.location.origin}${videoUrl}`;
      const response = await fetch(audioUrl);
      
      if (!response.ok) {
        throw new Error('Audio file not found');
      }
      
      setCurrentVideo(audioUrl);
      setCurrentLessonId(lessonId);
      
      // Expand the module containing this lesson
      const moduleId = courseModules.find(m => 
        m.lessons.some(l => l.id === lessonId)
      )?.id;
      if (moduleId) setExpandedModule(moduleId);

      if (!audioDurations[audioUrl]) {
        const duration = await getAudioDuration(audioUrl);
        setAudioDurations(prev => ({
          ...prev,
          [audioUrl]: duration
        }));
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      setError('Failed to load audio file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Video Player Section */}
      <div className="flex-1 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-4 px-6">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Shield size={24} className="text-blue-400" />
              <span className="font-bold text-xl">SecurGeek</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-blue-200">{user?.email}</span>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-medium 
                  transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Exit Course
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col max-w-6xl mx-auto w-full">
          <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 aspect-video rounded-xl overflow-hidden mb-6 flex flex-col shadow-xl">
            {/* Main display area */}
            <div className="flex-1 flex items-center justify-center">
              {currentVideo ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Play size={48} className="text-blue-400 opacity-80" />
                </div>
              ) : (
                <div className="text-white flex flex-col items-center">
                  <Play size={48} className="text-blue-400" />
                  <p className="mt-2 text-blue-200">Select a lesson to start learning</p>
                </div>
              )}
            </div>
            
            {/* Audio Controls */}
            {currentVideo && (
              <div className="w-full bg-gray-900 bg-opacity-90 border-t border-blue-900">
                <div className="px-6 py-3">
                  <audio 
                    className="w-full"
                    controls
                    autoPlay
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    onError={(e) => {
                      console.error('Audio error:', e);
                      setError('Error playing audio file');
                    }}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadedData={() => setIsLoading(false)}
                    src={currentVideo}
                  >
                    <source src={currentVideo} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                  {isLoading && (
                    <div className="text-blue-400 text-sm mt-2 flex items-center justify-center">
                      <span className="animate-pulse">Loading audio...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h1 className="text-3xl font-bold mb-3 text-gray-800">Cybersecurity Basics & Awareness</h1>
            <p className="text-gray-600 text-lg">
              Master the fundamentals of cybersecurity, understand common threats, and learn essential practices to protect yourself and your organization in the digital world.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mt-4 text-center border border-red-100">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-96 bg-white border-l border-gray-100 overflow-y-auto shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Course Content</h2>
          <div className="space-y-4">
            {courseModules.map((module) => {
              const isActiveModule = module.lessons.some(lesson => lesson.id === currentLessonId);
              return (
                <div 
                  key={module.id} 
                  className={`border border-gray-100 rounded-xl overflow-hidden shadow-sm
                    ${isActiveModule ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                >
                  <button
                    onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                    className={`w-full p-4 flex items-center justify-between 
                      ${isActiveModule ? 'bg-blue-50' : 'hover:bg-blue-50'} 
                      transition-colors duration-200`}
                  >
                    <div className="flex items-center space-x-3">
                      {module.completed ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-blue-300" />
                      )}
                      <span className="font-medium text-gray-800">{module.title}</span>
                    </div>
                    {expandedModule === module.id ? (
                      <ChevronDown size={20} className="text-blue-500" />
                    ) : (
                      <ChevronRight size={20} className="text-blue-500" />
                    )}
                  </button>
                  {expandedModule === module.id && (
                    <div className="border-t border-gray-100">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson.videoUrl, lesson.id)}
                          className={`w-full p-4 flex items-center space-x-3 text-left transition-colors duration-200
                            ${lesson.id === currentLessonId 
                              ? 'bg-blue-100 hover:bg-blue-200' 
                              : 'hover:bg-blue-50'}`}
                        >
                          {lesson.completed ? (
                            <CheckCircle className="text-green-500" size={16} />
                          ) : lesson.id === currentLessonId ? (
                            <Play size={16} className="text-blue-600 animate-pulse" />
                          ) : (
                            <Play size={16} className="text-blue-500" />
                          )}
                          <div>
                            <p className={`font-medium ${lesson.id === currentLessonId ? 'text-blue-700' : 'text-gray-700'}`}>
                              {lesson.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {audioDurations[lesson.videoUrl] || 'Loading...'}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 