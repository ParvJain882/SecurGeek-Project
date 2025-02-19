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
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    
    audio.addEventListener('loadedmetadata', () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    });

    audio.addEventListener('error', () => {
      console.error('Error loading audio:', url);
      resolve('--:--');
    });

    audio.src = url;
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
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

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
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 5,
          title: "Impact of Cyberattacks on Business Operations",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 6,
          title: "Case Studies of Cybersecurity Breaches",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
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
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 8,
          title: "Ransomware",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 9,
          title: "Social Engineering",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 10,
          title: "Malware & Viruses",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 11,
          title: "Insider Threats",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
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
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 13,
          title: "Why Data Privacy Matters",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 14,
          title: "How Cybercriminals Exploit Unprotected Data",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
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
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 16,
          title: "Recognizing & Avoiding Suspicious Content",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 17,
          title: "Safe Use of Business & Personal Devices",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
          completed: false
        },
        {
          id: 18,
          title: "Reporting Security Incidents",
          duration: "15:00",
          videoUrl: "/audios/1.1.mp3",
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

  // Update the useEffect for fetching audio durations
  useEffect(() => {
    const fetchDurations = async () => {
      const durations: AudioDurations = {};
      
      for (const module of courseModules) {
        for (const lesson of module.lessons) {
          try {
            const duration = await getAudioDuration(lesson.videoUrl);
            durations[lesson.videoUrl] = duration;
          } catch (error) {
            console.error(`Failed to get duration for ${lesson.videoUrl}:`, error);
            durations[lesson.videoUrl] = '00:00';
          }
        }
      }
      
      setAudioDurations(durations);
    };

    fetchDurations();
  }, []);

  // Update the useEffect for audio handling
  useEffect(() => {
    if (currentVideo && audioRef.current) {
      // Clear previous audio
      audioRef.current.pause();
      audioRef.current.src = currentVideo;
      audioRef.current.load();
      
      // Add proper event listeners with cleanup
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      const handleLoadStart = () => setIsBuffering(true);
      const handleCanPlay = () => setIsBuffering(false);
      const handleError = (e: Event) => {
        setError('Error loading audio file');
        setIsBuffering(false);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);

      // Cleanup function
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [currentVideo]);

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

  // Update the handleLessonClick function
  const handleLessonClick = async (lesson: Lesson) => {
    if (currentLessonId === lesson.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Clean up existing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }

      // Create and configure new audio element
      const audio = new Audio();
      audio.preload = 'auto';
      
      const loadPromise = new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
      });

      audio.src = lesson.videoUrl;
      
      // Wait for audio to be ready
      await loadPromise;
      
      audioRef.current = audio;
      setCurrentVideo(lesson.videoUrl);
      setCurrentLessonId(lesson.id);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(audio.duration);
      setIsAudioLoaded(true);
      setIsLoading(false);
      
    } catch (err) {
      console.error('Audio loading error:', err);
      setError('Failed to load audio file. Please check your internet connection and try again.');
      setIsLoading(false);
      setIsAudioLoaded(false);
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

  // Update the play/pause handler
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Playback failed:", error);
            setError('Failed to play audio');
          });
        }
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Play/Pause error:", error);
      setError('Playback error occurred');
    }
  };

  // Update renderMainPlayer to use togglePlayPause
  const renderMainPlayer = () => {
    if (!currentVideo) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4">
        <audio
          ref={audioRef}
          src={currentVideo}
          onLoadedData={() => setIsAudioLoaded(true)}
          onError={() => {
            setError('Failed to load audio');
            setIsLoading(false);
          }}
          style={{ display: 'none' }}
        />
        
        {/* Player controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePlayPause}
              disabled={!isAudioLoaded}
              className={`p-2 rounded-full ${!isAudioLoaded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            {/* Time display */}
            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
          
          {/* Volume control */}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (audioRef.current) {
                  audioRef.current.volume = newVolume;
                }
              }}
              className="w-20"
            />
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

  // Update the audio event listeners useEffect
  useEffect(() => {
    if (!audioRef.current || !currentVideo) return;

    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('Error playing audio');
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentVideo]);

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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Close
            </button>
            <button
              onClick={() => {
                setError(null);
                const lesson = courseModules
                  .flatMap(m => m.lessons)
                  .find(l => l.id === currentLessonId);
                if (lesson) handleLessonClick(lesson);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
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
          <div className="relative aspect-video rounded-xl overflow-hidden mb-6 flex flex-col shadow-xl">
            {/* Background image */}
            <div className="absolute inset-0">
              <img 
                src="/images/imagedummy.webp"
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay for better contrast with controls */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Main display area */}
            <div className="relative flex-1 flex items-center justify-center">
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