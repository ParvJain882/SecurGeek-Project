import React, { useState, useEffect } from 'react';
import { Shield, Lightbulb, Users, ArrowRight, CheckCircle, Brain, Target, BookOpen, X } from 'lucide-react';
import { ChatBot } from './components/ChatBot';
import { BookingForm } from './components/BookingForm';
import { ContactForm } from './components/ContactForm';
import { NewsletterForm } from './components/NewsletterForm';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { AuthForm } from './components/AuthForm';
import { useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CoursePlayer } from './components/CoursePlayer';
import { CoursesListing } from './components/CoursesListing';
import { CourseDetail } from './components/CourseDetail';
import { AuthGuard } from './components/AuthGuard';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const { user, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'signin') {
      setShowAuthForm(true);
      setIsSignUp(false);
      
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  const handleAuthClick = () => {
    if (user) {
      // If user is logged in, sign out
      signOut();
      toast.success('Successfully signed out!');
    } else {
      // If user is not logged in, show auth form
      setShowAuthForm(true);
    }
  };

  const services = [
    {
      icon: <Shield className="w-12 h-12 text-blue-500" />,
      title: "Cybersecurity Foundations",
      description: "Learn cybersecurity on the go! Our audio training program covers fundamental security concepts, threat awareness, and best practices - perfect for busy professionals.",
      path: "/course/cybersecurity-basics"
    },
    {
      icon: <Target size={40} className="text-blue-600" />,
      title: "Social Engineering Defense Series",
      description: "Audio lessons on recognizing and preventing social engineering attacks. Real-world scenarios and practical insights to protect against manipulation tactics.",
      path: "/course/phishing-simulations"
    },
    {
      icon: <BookOpen size={40} className="text-blue-600" />,
      title: "Compliance & Privacy Essentials",
      description: "Stay compliant while commuting! Bite-sized audio lessons on data privacy regulations, compliance requirements, and industry standards.",
      path: "/course/compliance-training"
    }
  ];

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Toaster position="top-right" />
        
        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
                <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield size={32} className="text-blue-400" />
                    <span className="text-xl font-bold">SecurGeek</span>
                  </div>
                  <div className="hidden md:flex space-x-8">
                    <a href="#services" className="hover:text-blue-300">Training Programs</a>
                    <a href="#solutions" className="hover:text-blue-300">Solutions</a>
                    <button 
                      onClick={() => setShowContactForm(true)} 
                      className="hover:text-blue-300"
                    >
                      Contact
                    </button>
                  </div>
                  <button 
                    onClick={handleAuthClick}
                    className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                  >
                    {user ? 'Sign Out' : 'Sign In / Sign Up'}
                  </button>
                </nav>
                
                <div className="container mx-auto px-6 py-20">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6">
                      Learn Cybersecurity Anywhere, Anytime
                    </h1>
                    <p className="text-xl text-blue-100 mb-8">
                      Transform your commute into a cybersecurity masterclass. 
                      Quality audio courses designed for busy professionals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link 
                        to="/courses"
                        className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-medium 
                          transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center"
                      >
                        Start Learning <ArrowRight className="ml-2" size={20} />
                      </Link>
                      <Link 
                        to="/course/preview"
                        className="bg-white bg-opacity-10 hover:bg-opacity-20 px-8 py-3 rounded-lg font-medium 
                          transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center"
                      >
                        Preview Lessons
                      </Link>
                    </div>
                    <div className="mt-12 flex items-center justify-center space-x-8">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold">100+</h3>
                        <p className="text-blue-200">Audio Lessons</p>
                      </div>
                      <div className="text-center">
                        <h3 className="text-3xl font-bold">15min</h3>
                        <p className="text-blue-200">Per Episode</p>
                      </div>
                      <div className="text-center">
                        <h3 className="text-3xl font-bold">24/7</h3>
                        <p className="text-blue-200">Access</p>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* Features Section */}
              <section className="py-20">
                <div className="container mx-auto px-6">
                  <h2 className="text-3xl font-bold text-center mb-12">Why Audio Learning?</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center p-6">
                      <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Learn While Mobile</h3>
                      <p className="text-gray-600">
                        Turn your commute, workout, or daily walk into a productive learning session
                      </p>
                    </div>
                    <div className="text-center p-6">
                      <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Real-World Applications</h3>
                      <p className="text-gray-600">
                        Practical examples and actionable security strategies you can implement immediately
                      </p>
                    </div>
                    <div className="text-center p-6">
                      <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Bite-Sized Episodes</h3>
                      <p className="text-gray-600">
                        Concise 15-minute lessons designed for optimal retention and engagement
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Services Section */}
              <section id="services" className="py-20">
                <div className="container mx-auto px-6">
                  <h2 className="text-3xl font-bold text-center mb-12">Training Programs</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                      <div 
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          {service.icon}
                          <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                        </div>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            expandedService === index ? 'max-h-96' : 'max-h-0'
                          }`}
                        >
                          <p className="text-gray-600 mb-4">{service.description}</p>
                        </div>
                        <button
                          onClick={() => setExpandedService(expandedService === index ? null : index)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm focus:outline-none"
                        >
                          {expandedService === index ? 'Show Less' : 'Know More'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Why Choose Us Section */}
              <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-6">
                  <h2 className="text-3xl font-bold text-center mb-16">Why Choose Our Training?</h2>
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      {[
                        "Customized training for SMEs",
                        "Interactive learning modules",
                        "Real-world scenario simulations",
                        "Progress tracking & reporting",
                        "Multilingual support",
                        "Mobile-friendly platform"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                        alt="Corporate Training Session"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="bg-blue-900 text-white py-20">
                <div className="container mx-auto px-6 text-center">
                  <h2 className="text-3xl font-bold mb-8">Ready to Strengthen Your Security Culture?</h2>
                  <p className="text-xl mb-8 max-w-2xl mx-auto">
                    Start building your human firewall today with our comprehensive security awareness training programs.
                  </p>
                </div>
              </section>

              {/* Footer */}
              <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="container mx-auto px-6">
                  <div className="grid md:grid-cols-4 gap-8">
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Shield size={24} className="text-blue-400" />
                        <span className="text-lg font-bold text-white">SecurGeek</span>
                      </div>
                      <p className="text-sm">
                        Your trusted partner in cybersecurity training and awareness for small and medium-scale enterprises.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-4">Training Programs</h3>
                      <ul className="space-y-2 text-sm">
                        <li>Security Awareness</li>
                        <li>Phishing Simulations</li>
                        <li>Compliance Training</li>
                        <li>Custom Workshops</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-4">Company</h3>
                      <ul className="space-y-2 text-sm">
                        <li>About Us</li>
                        <li>
                          <button 
                            onClick={() => setShowContactForm(true)}
                            className="hover:text-blue-300"
                          >
                            Contact
                          </button>
                        </li>
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-4">Contact</h3>
                      <ul className="space-y-2 text-sm">
                        <li>securgeek@gmail.com</li>
                        <li>+91 8826038451</li>
                        <li>Manipal University Jaipur</li>
                        <li>Rajasthan-303007</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="text-center mb-4">
                      <h4 className="text-white font-bold mb-2 text-xl transform hover:scale-105 transition-transform duration-200">
                        Subscribe to Our Newsletter
                      </h4>
                      <p className="text-sm mb-6 text-blue-300">
                        Stay updated with the latest in cybersecurity training and get exclusive tips
                      </p>
                      <div className="max-w-md mx-auto transform hover:scale-102 transition-all duration-200 hover:shadow-lg rounded-lg">
                        <NewsletterForm />
                      </div>
                    </div>
                    <div className="text-sm text-center mt-8">
                      © {new Date().getFullYear()} SecurGeek. All rights reserved.
                    </div>
                  </div>
                </div>
              </footer>

              {/* Chatbot */}
              <ChatBot />

              {/* Show auth form only if user is not logged in */}
              {showAuthForm && !user && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800">
                          {isSignUp ? 'Hi there!' : 'Sign In'}
                        </h2>
                        {!isSignUp && (
                          <p className="text-gray-600 text-lg mt-1">
                            Welcome Back!
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => setShowAuthForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <AuthForm />
                  </div>
                </div>
              )}

              {/* Modal for Contact Form */}
              {showContactForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Contact Us</h2>
                      <button 
                        onClick={() => setShowContactForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <ContactForm />
                  </div>
                </div>
              )}
            </>
          } />
          
          {/* Protect courses routes with AuthGuard */}
          <Route 
            path="/courses" 
            element={
              <AuthGuard>
                <CoursesListing />
              </AuthGuard>
            } 
          />
          <Route 
            path="/courses/:courseId" 
            element={
              <AuthGuard>
                <CourseDetail />
              </AuthGuard>
            } 
          />
          <Route 
            path="/course/:courseId" 
            element={
              <AuthGuard>
                <ErrorBoundary>
                  <CoursePlayer />
                </ErrorBoundary>
              </AuthGuard>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;