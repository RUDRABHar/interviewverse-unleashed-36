
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  score: number;
  practiceCount: number;
  lastPracticed: string;
  importance: number;
  color: string;
  position: [number, number, number];
  orbit: number;
  size: number;
}

export const useSkillGalaxyData = () => {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSkillData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }
      
      // Fetch all interview sessions and answers for this user
      const { data: sessions, error: sessionError } = await supabase
        .from('interview_sessions')
        .select(`
          id, 
          interview_type,
          domain,
          score,
          completed_at,
          status,
          user_answers (
            question_id,
            is_correct,
            ai_feedback,
            time_taken,
            interview_questions (
              category,
              question_type
            )
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (sessionError) throw sessionError;

      // Process the data to extract skills
      const skillsMap = new Map();
      
      // Helper function to categorize skills by their domain and type
      const categorizeSkill = (domain: string, type: string) => {
        if (!domain) return null;
        
        const skillKey = domain.toLowerCase();
        
        if (!skillsMap.has(skillKey)) {
          // Initialize a new skill record
          const categoryMap: Record<string, string> = {
            'javascript': 'frontend',
            'react': 'frontend',
            'python': 'backend',
            'java': 'backend',
            'system design': 'architecture',
            'data structures': 'algorithms',
            'algorithms': 'algorithms',
            'behavioral': 'soft-skills',
            'communication': 'soft-skills'
          };
          
          // Determine category and color
          const category = categoryMap[skillKey] || 'other';
          const colorMap: Record<string, string> = {
            'frontend': '#4f46e5', // indigo
            'backend': '#10b981', // emerald
            'architecture': '#f59e0b', // amber
            'algorithms': '#ef4444', // red
            'soft-skills': '#8b5cf6', // violet
            'other': '#6b7280', // gray
          };
          
          // Calculate a pseudo-random position in the 3D space based on the skill name
          // This ensures consistent positioning between renders
          const hash = Array.from(skillKey).reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
          }, 0);
          
          const orbit = (Math.abs(hash) % 5) + 5; // Orbit radius between 5-10
          const theta = (Math.abs(hash) % 360) * (Math.PI / 180);
          const phi = ((Math.abs(hash) >> 8) % 180) * (Math.PI / 180);
          
          const x = orbit * Math.sin(phi) * Math.cos(theta);
          const y = orbit * Math.sin(phi) * Math.sin(theta);
          const z = orbit * Math.cos(phi);
          
          skillsMap.set(skillKey, {
            id: skillKey,
            name: domain,
            category: category,
            score: 0,
            practiceCount: 0,
            lastPracticed: null,
            importance: 1,
            color: colorMap[category],
            position: [x, y, z] as [number, number, number],
            orbit: orbit,
            size: 1
          });
        }
        
        return skillsMap.get(skillKey);
      };

      // Process each session to calculate skill scores
      sessions?.forEach(session => {
        if (!session.domain) return;
        
        const skill = categorizeSkill(session.domain, session.interview_type);
        if (!skill) return;
        
        // Update the skill data based on the session
        skill.practiceCount++;
        
        if (session.completed_at && (!skill.lastPracticed || new Date(session.completed_at) > new Date(skill.lastPracticed))) {
          skill.lastPracticed = session.completed_at;
        }
        
        // Calculate score components
        if (session.status === 'completed' && session.score !== null) {
          // Use the session score directly if available
          skill.score = Math.max(skill.score, session.score);
        } else if (session.user_answers && session.user_answers.length > 0) {
          // Calculate score from answers if no direct score
          const answers = session.user_answers;
          const totalQuestions = answers.length;
          const correctAnswers = answers.filter(a => a.is_correct).length;
          const attemptedAnswers = answers.filter(a => a.answer_text).length;
          const skippedAnswers = totalQuestions - attemptedAnswers;
          
          // Calculate score using the formula from requirements
          const scoreCalc = (
            (correctAnswers * 3) +
            (attemptedAnswers * 1.5) -
            (skippedAnswers * 2) -
            (session.status === 'disqualified' ? 10 : 0)
          ) / (totalQuestions * 3) * 100;
          
          skill.score = Math.round(Math.max(skill.score, Math.max(0, Math.min(100, scoreCalc))));
        }
        
        // Update size based on practice frequency (normalized between 1-3)
        skill.size = Math.min(3, 1 + (skill.practiceCount * 0.1));
        
        // Calculate importance/recency based on last practice date
        if (skill.lastPracticed) {
          const daysSincePractice = (new Date().getTime() - new Date(skill.lastPracticed).getTime()) / (1000 * 3600 * 24);
          skill.importance = Math.max(0.5, Math.min(2, 2 - (daysSincePractice / 30))); // Scale between 0.5-2 based on recency
        }
      });

      // If no data is found, provide some default skills for visualization
      if (skillsMap.size === 0) {
        const defaultSkills = [
          { id: 'javascript', name: 'JavaScript', category: 'frontend', color: '#4f46e5', orbit: 7 },
          { id: 'python', name: 'Python', category: 'backend', color: '#10b981', orbit: 9 },
          { id: 'system-design', name: 'System Design', category: 'architecture', color: '#f59e0b', orbit: 11 },
          { id: 'algorithms', name: 'Algorithms', category: 'algorithms', color: '#ef4444', orbit: 5 },
          { id: 'communication', name: 'Communication', category: 'soft-skills', color: '#8b5cf6', orbit: 13 }
        ];
        
        defaultSkills.forEach(skill => {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          skillsMap.set(skill.id, {
            ...skill,
            score: 0,
            practiceCount: 0,
            lastPracticed: null,
            importance: 1,
            position: [
              skill.orbit * Math.sin(phi) * Math.cos(theta),
              skill.orbit * Math.sin(phi) * Math.sin(theta),
              skill.orbit * Math.cos(phi)
            ] as [number, number, number],
            size: 1
          });
        });
      }
      
      setSkills(Array.from(skillsMap.values()));
      setLoading(false);
      
    } catch (err: any) {
      console.error('Error fetching skill data:', err);
      setError(err);
      setLoading(false);
    }
  };

  // Fetch data initially
  useEffect(() => {
    fetchSkillData();
  }, []);

  return {
    skills,
    loading,
    error,
    refetch: fetchSkillData
  };
};
