import React, { useState } from 'react';
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

function App() {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const { user, signOut } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);

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
      title: "Cybersecurity Basics & Awareness",
      description: "Master the fundamentals of cybersecurity, understand common threats, and learn essential practices to protect yourself and your organization in the digital world.",
      path: "/course/cybersecurity-basics"
    },
    {
      icon: <Target size={40} className="text-blue-600" />,
      title: "Phishing Simulations",
      description: "Real-world phishing scenarios to test and improve your team's threat detection abilities.",
      path: "/course/phishing-simulations"
    },
    {
      icon: <BookOpen size={40} className="text-blue-600" />,
      title: "Compliance Training",
      description: "Role-specific training modules ensuring compliance with industry regulations and standards.",
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
                  <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                      Build Your Human Firewall
                    </h1>
                    <p className="text-xl mb-8 text-blue-100">
                      Transform your employees into your strongest security asset. Comprehensive cybersecurity training solutions 
                      tailored for small and medium-scale enterprises.
                    </p>
                    <button 
                      onClick={() => setShowAuthForm(true)}
                      className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-medium inline-flex items-center space-x-2 transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                      <span>Sign In / Sign Up</span>
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </header>

              {/* Services Section */}
              <section id="services" className="py-20">
                <div className="container mx-auto px-6">
                  <h2 className="text-3xl font-bold text-center mb-16">Our Training Programs</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                      <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="mb-4">{service.icon}</div>
                        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        {user ? (
                          <Link 
                            to={service.path}
                            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Start Learning →
                          </Link>
                        ) : (
                          <button
                            onClick={() => setShowAuthForm(true)}
                            className="inline-block text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Sign in to Start Learning →
                          </button>
                        )}
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
                  <button 
                    onClick={() => setShowAuthForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
                  >
                    <span>Schedule Training Demo</span>
                    <ArrowRight size={20} />
                  </button>
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
                      <h4 className="text-white font-bold mb-2">Subscribe to Our Newsletter</h4>
                      <p className="text-sm mb-4">Stay updated with the latest in cybersecurity training</p>
                      <div className="max-w-md mx-auto">
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
          
          <Route path="/course/:courseId" element={<CoursePlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;