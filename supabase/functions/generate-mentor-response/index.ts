
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers
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
    // Get the request body
    const { message, performanceData } = await req.json();
    
    // Get API key from environment variable
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!apiKey) {
      throw new Error('Missing Gemini API key');
    }
    
    // Construct the prompt with the user's performance data
    const prompt = `
      Act as an elite interview mentor AI for a student.

      You have access to the user's anonymized interview performance data.
      
      Analyze their history and answer their question honestly. Provide:
      - Context (e.g., "You've improved in Backend since last month")
      - Insight (e.g., "But you tend to spend too much time on MCQs")
      - Suggestion (e.g., "Try a 3-question session focused on speed")
      
      Be warm, motivating, clear, and realistic.
      
      DATA:
      ${JSON.stringify(performanceData, null, 2)}
      
      QUESTION: ${message}
    `;

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from Gemini response
    const generatedText = data.candidates[0]?.content?.parts?.[0]?.text || 
      "I'm sorry, I couldn't generate a response right now. Please try again.";

    // Return the generated response
    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-mentor-response function:', error);
    
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error',
      response: "I'm having trouble connecting to my knowledge base right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
