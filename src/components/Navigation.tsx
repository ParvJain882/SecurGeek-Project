import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  const handleCoursesClick = useCallback((e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast.error('Please sign in to view courses');
      navigate('/?auth=signin');
      return;
    }
    navigate('/courses');
  }, [navigate]);

  return (
    <div>
      {/* Example for navigation links */}
      <button onClick={handleCoursesClick}>
        Courses
      </button>
    </div>
  );
};

export default Navigation; 