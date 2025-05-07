import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSkillGalaxyData } from '@/hooks/useSkillGalaxyData';
import { SkillGalaxyView } from '@/components/skill-galaxy/SkillGalaxyView';
import { SkillModal } from '@/components/skill-galaxy/SkillModal';
import { ViewToggle } from '@/components/skill-galaxy/ViewToggle';
import { GalaxyControls } from '@/components/skill-galaxy/GalaxyControls';

const SkillGalaxy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'galaxy' | 'neural'>('galaxy');
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPerfMode, setIsPerfMode] = useState(false);
  const { skills, loading, error, refetch } = useSkillGalaxyData();

  // First-time user detection - simplified to avoid database issues
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  useEffect(() => {
    // Show the onboarding overlay on first render, then hide it
    // We'll just use local state instead of database tracking for now
    const hasSeenGalaxy = localStorage.getItem('has_visited_galaxy');
    if (!hasSeenGalaxy) {
      setIsFirstVisit(true);
      localStorage.setItem('has_visited_galaxy', 'true');
    } else {
      setIsFirstVisit(false);
    }
  }, []);

  const handleSkillClick = (skill: any) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleRetakeInterview = () => {
    if (!selectedSkill) return;
    
    navigate('/interviews', {
      state: {
        prefill: {
          type: 'technical',
          domain: selectedSkill.name,
          difficulty: selectedSkill.score < 40 ? 'easy' : selectedSkill.score < 70 ? 'medium' : 'hard',
          questionCount: 5,
          launchSource: '3d_visualizer'
        }
      }
    });
    
    toast({
      title: "Interview setup initiated",
      description: `Preparing a ${selectedSkill.name} interview for you.`,
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-b-4 border-interview-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Unable to load your skill data</h2>
        <p className="text-gray-500 mb-4">We encountered an error while loading your skills visualization.</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-interview-primary text-white rounded-lg hover:bg-interview-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative">
      {/* 3D Canvas Container */}
      <div className="absolute inset-0">
        <SkillGalaxyView 
          skills={skills} 
          viewMode={viewMode} 
          onSkillClick={handleSkillClick} 
          lowPerformanceMode={isPerfMode}
        />
      </div>

      {/* Overlay Controls */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-4">
        <ViewToggle 
          currentView={viewMode} 
          onChange={(mode) => setViewMode(mode as 'galaxy' | 'neural')} 
        />
        <GalaxyControls 
          lowPerformanceMode={isPerfMode} 
          setLowPerformanceMode={setIsPerfMode} 
        />
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRetake={handleRetakeInterview}
        />
      )}

      {/* First-time onboarding overlay */}
      {isFirstVisit && (
        <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center">
          <div className="bg-gray-900 p-8 max-w-lg rounded-xl border border-interview-primary">
            <h2 className="text-2xl font-bold mb-4 text-white">Welcome to Your Skill Galaxy</h2>
            <p className="text-gray-300 mb-6">
              This 3D visualization maps your interview skills as an interactive galaxy. Each glowing node 
              represents a skill area, with brightness indicating your proficiency.
            </p>
            <ul className="mb-6 text-gray-300 space-y-2">
              <li>• Click and drag to rotate the view</li>
              <li>• Scroll to zoom in/out</li>
              <li>• Click on any skill to see details and feedback</li>
              <li>• Toggle between galaxy and neural views</li>
            </ul>
            <button 
              onClick={() => setIsFirstVisit(false)}
              className="w-full py-3 bg-interview-primary text-white rounded-lg hover:bg-interview-primary/90"
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGalaxy;
