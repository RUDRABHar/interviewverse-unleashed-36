
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') as string;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') as string;

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
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not set in environment variables');
    }

    // Initialize Supabase client using environment variables
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Parse the request body
    const { session_id, question_id, user_answer } = await req.json();

    if (!session_id || !question_id || !user_answer) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: session_id, question_id, or user_answer' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the question data
    const { data: questionData, error: questionError } = await supabase
      .from('interview_questions')
      .select('question_text, question_type, category, expected_answer_format')
      .eq('id', question_id)
      .single();

    if (questionError) {
      console.error('Error fetching question data:', questionError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch question data' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Construct the prompt for Gemini
    const prompt = `
You are an expert interview evaluator.

Evaluate the following:

Question Type: ${questionData.question_type}

Category: ${questionData.category}

Question: "${questionData.question_text}"

Expected Format: ${questionData.expected_answer_format || 'Not specified'}

User Answer: "${user_answer}"

Your task:

Evaluate the answer's quality (accuracy, depth, clarity, structure).

Give clear, actionable feedback.

If technical: mark it as correct/incorrect/partially correct.

If subjective: give a score from 0 to 10.

Use a consistent JSON format as output.

Respond only with:

{
"is_correct": true | false | null,
"score": 0-10,
"ai_feedback": "Detailed feedback in professional tone. Highlight strengths and suggest improvements."
}`;

    // Call the Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const geminiData = await response.json();
    
    if (!geminiData.candidates || !geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API: ' + JSON.stringify(geminiData));
    }

    // Extract the evaluation from the response
    const evaluationText = geminiData.candidates[0].content.parts[0].text;
    let evaluation;

    try {
      // Try to find JSON in the text response
      const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (e) {
      console.error('Error parsing Gemini response:', e);
      // Fallback to a default evaluation
      evaluation = {
        is_correct: null,
        score: 5,
        ai_feedback: "The evaluation system couldn't analyze this response. Please review manually."
      };
    }

    // Store the evaluation in the database
    const { data: updateData, error: updateError } = await supabase
      .from('user_answers')
      .update({
        is_correct: evaluation.is_correct,
        ai_feedback: evaluation.ai_feedback
      })
      .eq('question_id', question_id)
      .eq('session_id', session_id);

    if (updateError) {
      console.error('Error updating user answer with evaluation:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to store evaluation' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, evaluation }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-interview-answers function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
