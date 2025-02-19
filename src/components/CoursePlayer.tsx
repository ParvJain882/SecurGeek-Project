import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronDown, Play, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
  return new Promise((resolve) => {
    // Default duration if audio can't be loaded
    resolve("15:00");
  });
};

const validateAudioFile = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error validating audio file:', error);
    return false;
  }
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [moduleDurations, setModuleDurations] = useState<{ [key: number]: number }>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [volume, setVolume] = useState(1);

  // Update the courseModules data to use the correct MP3 file path
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
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
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
          videoUrl: "/audios/1.2.1.mp3",
          completed: false
        },
        {
          id: 5,
          title: "Impact of Cyberattacks on Business Operations",
          duration: "15:00",
          videoUrl: "/audios/1.2.2.mp3",
          completed: false
        },
        {
          id: 6,
          title: "Case Studies of Cybersecurity Breaches",
          duration: "15:00",
          videoUrl: "/audios/1.2.3.mp3",
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
          videoUrl: "/audios/1.3.1.mp3",
          completed: false
        },
        {
          id: 8,
          title: "Ransomware",
          duration: "15:00",
          videoUrl: "/audios/1.3.2.mp3",
          completed: false
        },
        {
          id: 9,
          title: "Social Engineering",
          duration: "15:00",
          videoUrl: "/audios/1.3.3.mp3",
          completed: false
        },
        {
          id: 10,
          title: "Malware & Viruses",
          duration: "15:00",
          videoUrl: "/audios/1.3.4.mp3",
          completed: false
        },
        {
          id: 11,
          title: "Insider Threats",
          duration: "15:00",
          videoUrl: "/audios/1.3.5.mp3",
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
          videoUrl: "/audios/1.4.1.mp3",
          completed: false
        },
        {
          id: 13,
          title: "Why Data Privacy Matters",
          duration: "15:00",
          videoUrl: "/audios/1.4.2.mp3",
          completed: false
        },
        {
          id: 14,
          title: "How Cybercriminals Exploit Unprotected Data",
          duration: "15:00",
          videoUrl: "/audios/1.4.3.mp3",
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
          videoUrl: "/audios/1.5.1.mp3",
          completed: false
        },
        {
          id: 16,
          title: "Recognizing & Avoiding Suspicious Content",
          duration: "15:00",
          videoUrl: "/audios/1.5.2.mp3",
          completed: false
        },
        {
          id: 17,
          title: "Safe Use of Business & Personal Devices",
          duration: "15:00",
          videoUrl: "/audios/1.5.3.mp3",
          completed: false
        },
        {
          id: 18,
          title: "Reporting Security Incidents",
          duration: "15:00",
          videoUrl: "/audios/1.5.4.mp3",
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

  // Add event listeners for audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });

      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });
    }
  }, [currentVideo]); // Add dependency on currentVideo

  // Add a loading timeout handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        setError('Loading took too long. Please try again.');
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      }, 10000); // 10 second timeout
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

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

  const handleLessonClick = async (lesson: Lesson) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Clean up previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
        audioRef.current = null;
      }

      setCurrentLessonId(lesson.id);
      
      // Construct the correct audio URL with error handling
      const audioPath = lesson.videoUrl.startsWith('/') 
        ? lesson.videoUrl 
        : `/${lesson.videoUrl}`;
      const fullAudioUrl = `${window.location.origin}${audioPath}`;
      
      console.log('Attempting to load audio from:', fullAudioUrl);

      // Validate that the audio file exists
      const fileExists = await validateAudioFile(fullAudioUrl);
      if (!fileExists) {
        throw new Error(`Audio file not found at ${audioPath}`);
      }

      // Create and configure new audio element
      const audio = new Audio();
      audio.preload = 'auto';
      
      const loadPromise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Audio loading timed out'));
        }, 10000);

        const onCanPlayThrough = () => {
          clearTimeout(timeoutId);
          if (audio.duration && !isNaN(audio.duration)) {
            setDuration(audio.duration);
            resolve(true);
          }
        };

        const onError = (e: Event) => {
          clearTimeout(timeoutId);
          const audioElement = e.target as HTMLAudioElement;
          console.error('Audio loading error:', audioElement.error);
          reject(new Error(`Audio loading failed: ${audioElement.error?.message || 'Unknown error'}`));
        };

        audio.addEventListener('canplaythrough', onCanPlayThrough, { once: true });
        audio.addEventListener('error', onError, { once: true });
      });

      // Set source and begin loading
      audio.src = fullAudioUrl;
      audio.volume = volume;
      audioRef.current = audio;

      // Add playback event listeners
      audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.currentTime)) {
          setCurrentTime(audio.currentTime);
        }
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      audio.addEventListener('waiting', () => setIsBuffering(true));
      audio.addEventListener('playing', () => setIsBuffering(false));

      // Start loading the audio
      audio.load();
      await loadPromise;
      
      console.log('Audio loaded successfully');
      setIsLoading(false);

    } catch (error: any) {
      console.error('Error in handleLessonClick:', error);
      setError(error.message || 'Unable to load audio. Please try again.');
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.src = '';
        audioRef.current.load();
        audioRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to update module durations
  const updateModuleDuration = (lesson: Lesson, duration: number) => {
    const module = courseModules.find(m => 
      m.lessons.some(l => l.id === lesson.id)
    );
    
    if (module) {
      setModuleDurations(prev => {
        const currentDuration = prev[module.id] || 0;
        return {
          ...prev,
          [module.id]: currentDuration + duration
        };
      });
    }
  };

  // Add this function to handle initial module loading
  useEffect(() => {
    if (courseModules.length > 0 && courseModules[0].lessons.length > 0) {
      const firstLesson = courseModules[0].lessons[0];
      handleLessonClick(firstLesson).catch(error => {
        console.error('Error loading initial lesson:', error);
        setError('Failed to load initial lesson. Please refresh the page.');
      });
    }
  }, []); // Only run once on mount

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(time, duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      const volume = Math.max(0, Math.min(newVolume, 1));
      audioRef.current.volume = volume;
      setVolume(volume);
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
      setError('Playback failed. Please try again.');
    }
  };

  // Update renderMainPlayer to use togglePlayPause
  const renderMainPlayer = () => {
    if (!currentVideo) return null;
    
    const currentLesson = courseModules
      .flatMap(module => module.lessons)
      .find(lesson => lesson.id === currentLessonId);

    return (
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex flex-col space-y-2">
          {/* Progress bar */}
          <div className="relative w-full h-1 bg-gray-200 rounded cursor-pointer group"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const percent = (e.clientX - rect.left) / rect.width;
                 handleSeek(percent * duration);
               }}>
            <div 
              className="absolute h-full bg-blue-500 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div className="absolute h-3 w-3 bg-blue-600 rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
                 style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          
          {/* Time display */}
          <div className="flex justify-between text-white/80 text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            {/* Skip backward 10s */}
            <button 
              onClick={() => handleSkip(-10)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14l-7-7 7-7z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button 
              onClick={togglePlayPause}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              disabled={!audioRef.current || isLoading}
            >
              {isPlaying ? (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Skip forward 10s */}
            <button 
              onClick={() => handleSkip(10)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14l7-7-7-7z" />
              </svg>
            </button>

            {/* Volume control */}
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to format time
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);

  // Add loading state check
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audio content...</p>
        </div>
      </div>
    );
  }

  // Add error state UI
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Course</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add this function to render error state
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg max-w-md text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Audio</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              if (currentLessonId) {
                const lesson = courseModules
                  .flatMap(m => m.lessons)
                  .find(l => l.id === currentLessonId);
                if (lesson) handleLessonClick(lesson);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
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
                  {isPlaying ? (
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <Play size={48} className="text-white/80" />
                  )}
                </div>
              ) : (
                <div className="text-white flex flex-col items-center">
                  <Play size={48} className="text-blue-400" />
                  <p className="mt-2 text-blue-200">Select a lesson to start learning</p>
                </div>
              )}
            </div>
            
            {renderMainPlayer()}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h1 className="text-3xl font-bold mb-3 text-gray-800">Cybersecurity Basics & Awareness</h1>
            <p className="text-gray-600 text-lg">
              Master the fundamentals of cybersecurity, understand common threats, and learn essential practices to protect yourself and your organization in the digital world.
            </p>
          </div>
          
          {renderError()}
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-96 bg-white border-l border-gray-100 overflow-y-auto shadow-xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Course Content</h2>
          <div className="space-y-4">
            {courseModules.map((module) => {
              const isActiveModule = module.lessons.some(lesson => lesson.id === currentLessonId);
              const moduleDuration = formatTime(moduleDurations[module.id] || 0);
              
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
                      <div>
                        <span className="font-medium text-gray-800">{module.title}</span>
                        <p className="text-sm text-gray-500">{moduleDuration}</p>
                      </div>
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
                          onClick={() => handleLessonClick(lesson)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors duration-200
                            ${lesson.id === currentLessonId ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-blue-50'}`}
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