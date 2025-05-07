
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skill, score, category, practiceCount, stats } = await req.json();
    
    // Generate feedback based on the skill data
    let insight = '';
    
    // Simple template-based feedback generation
    if (score < 30) {
      insight = `Your ${skill} skills are at a beginning stage with ${Math.round(score)}% proficiency. `;
      insight += `Focus on fundamentals of ${category} and consider basic ${skill} exercises to build a foundation.`;
    } else if (score < 60) {
      insight = `You've achieved an intermediate level in ${skill} with ${Math.round(score)}% proficiency. `;
      insight += `Work on more complex ${category} challenges to strengthen your skills.`;
    } else if (score < 85) {
      insight = `You're advanced in ${skill} with ${Math.round(score)}% proficiency. `;
      insight += `Tackle expert-level ${category} problems and diversify your approach to become a specialist.`;
    } else {
      insight = `You've reached expert level in ${skill} with ${Math.round(score)}% proficiency. `;
      insight += `Keep your ${category} skills sharp with bleeding-edge techniques and mentor others.`;
    }
    
    // Add practice frequency feedback
    if (practiceCount === 0) {
      insight += ` You haven't practiced this skill yet - schedule your first session soon!`;
    } else if (practiceCount < 3) {
      insight += ` Increase your practice frequency to see faster improvement.`;
    } else {
      insight += ` You're consistently practicing this skill - great work!`;
    }

    return new Response(
      JSON.stringify({
        insight: insight
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
