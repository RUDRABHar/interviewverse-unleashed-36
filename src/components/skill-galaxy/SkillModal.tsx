
import React, { useEffect, useState } from 'react';
import { X, CalendarPlus, RefreshCcw } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface SkillModalProps {
  skill: any;
  isOpen: boolean;
  onClose: () => void;
  onRetake: () => void;
}

export const SkillModal: React.FC<SkillModalProps> = ({ skill, isOpen, onClose, onRetake }) => {
  const [insight, setInsight] = useState<string>('Loading AI feedback...');
  const [loadingInsight, setLoadingInsight] = useState<boolean>(true);
  const [stats, setStats] = useState({
    sessionsCount: 0,
    avgAccuracy: 0,
    avgTime: 0,
    lastPracticed: 'Never',
  });

  useEffect(() => {
    if (isOpen && skill) {
      fetchSkillStats();
      generateInsight();
    }
  }, [isOpen, skill]);

  const fetchSkillStats = async () => {
    if (!skill) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Fetch interview sessions for this skill
      const { data: sessions, error } = await supabase
        .from('interview_sessions')
        .select(`
          id, 
          score,
          completed_at,
          user_answers (
            is_correct,
            time_taken
          )
        `)
        .eq('user_id', user.id)
        .eq('domain', skill.name)
        .order('completed_at', { ascending: false });
      
      if (error) throw error;
      
      if (sessions && sessions.length > 0) {
        // Calculate statistics
        let totalAccuracy = 0;
        let totalTime = 0;
        let totalAnswers = 0;
        
        sessions.forEach(session => {
          if (session.score !== null) {
            totalAccuracy += session.score;
          }
          
          if (session.user_answers) {
            session.user_answers.forEach(answer => {
              if (answer.time_taken) {
                try {
                  const timeParts = answer.time_taken.toString().split(':');
                  const timeInSeconds = 
                    (parseInt(timeParts[0] || '0') * 3600) + 
                    (parseInt(timeParts[1] || '0') * 60) + 
                    parseInt(timeParts[2] || '0');
                  
                  totalTime += timeInSeconds;
                  totalAnswers++;
                } catch (e) {
                  console.error('Error parsing time:', e);
                }
              }
            });
          }
        });
        
        const avgAccuracy = sessions.length > 0 ? totalAccuracy / sessions.length : 0;
        const avgTime = totalAnswers > 0 ? totalTime / totalAnswers : 0;
        const lastPracticed = sessions[0].completed_at 
          ? new Date(sessions[0].completed_at).toLocaleDateString() 
          : 'Never';
        
        setStats({
          sessionsCount: sessions.length,
          avgAccuracy: Math.round(avgAccuracy),
          avgTime: Math.round(avgTime),
          lastPracticed,
        });
      }
    } catch (error) {
      console.error('Error fetching skill statistics:', error);
    }
  };
  
  const generateInsight = async () => {
    setLoadingInsight(true);
    
    try {
      // Attempt to call the Gemini AI via edge function
      const response = await supabase.functions.invoke('generate-skill-insight', {
        body: {
          skill: skill.name,
          score: skill.score,
          category: skill.category,
          practiceCount: skill.practiceCount,
          stats
        }
      });
      
      if (response.data && response.data.insight) {
        setInsight(response.data.insight);
      } else {
        // Fallback insights if API call fails
        const insightMessages = [
          `Your ${skill.name} skills show ${skill.score}% proficiency. Focus on more ${skill.category} practice exercises to improve further.`,
          `Based on your performance, consider dedicating more time to ${skill.name} to strengthen this skill area.`,
          `You're making progress with ${skill.name}. Continue practicing to reach expert level in this domain.`
        ];
        
        setInsight(insightMessages[Math.floor(Math.random() * insightMessages.length)]);
      }
    } catch (error) {
      console.error('Error generating insight:', error);
      setInsight(`Continue practicing ${skill.name} to improve your proficiency in this area.`);
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 border border-gray-800 text-white p-0 overflow-hidden">
        <div className="relative">
          {/* Header */}
          <div 
            className="p-6 pb-4 border-b border-gray-800"
            style={{
              background: `linear-gradient(to right, ${skill?.color || '#333'}33, #11172E)`,
              boxShadow: `inset 0 -10px 20px -10px ${skill?.color || '#333'}33`
            }}
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-2xl font-bold">{skill?.name}</h3>
            <p className="text-gray-400">
              {skill?.category.charAt(0).toUpperCase() + skill?.category.slice(1)} Skill
            </p>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {/* Skill score */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                  style={{
                    background: `conic-gradient(${skill?.color || '#333'} ${skill?.score || 0}%, transparent 0%)`,
                    boxShadow: `0 0 15px ${skill?.color || '#333'}66`
                  }}
                >
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-lg font-bold">
                    {Math.round(skill?.score || 0)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Proficiency Score</div>
                  <div className="text-lg font-semibold">
                    {skill?.score < 30 ? 'Beginner' : 
                     skill?.score < 60 ? 'Intermediate' : 
                     skill?.score < 85 ? 'Advanced' : 
                     'Expert'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-400">Practice Sessions</div>
                <div className="text-lg font-semibold">{stats.sessionsCount || 0}</div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 p-3 rounded">
                <div className="text-sm text-gray-400">Avg. Accuracy</div>
                <div className="text-lg">{stats.avgAccuracy}%</div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded">
                <div className="text-sm text-gray-400">Avg. Time</div>
                <div className="text-lg">{stats.avgTime} sec</div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded col-span-2">
                <div className="text-sm text-gray-400">Last Practiced</div>
                <div className="text-lg">{stats.lastPracticed}</div>
              </div>
            </div>
            
            {/* AI Insight */}
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mb-6">
              <h4 className="text-sm text-gray-400 mb-1">AI Insight</h4>
              <p className={`text-sm ${loadingInsight ? 'text-gray-500' : 'text-white'}`}>
                {insight}
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onRetake}
                className="flex-1 bg-interview-primary hover:bg-interview-primary/90 text-white py-2 px-4 rounded flex items-center justify-center"
              >
                <RefreshCcw size={18} className="mr-2" />
                Retake Interview
              </button>
              <button
                className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded flex items-center justify-center"
              >
                <CalendarPlus size={18} className="mr-2" />
                Schedule
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
