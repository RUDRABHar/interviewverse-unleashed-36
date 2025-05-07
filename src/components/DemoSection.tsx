
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <section className="section-padding bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-sora font-bold text-white mb-4">See InterviewXpert in Action</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Watch how our AI conducts a realistic interview and provides real-time feedback
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto">
          {/* Video container */}
          <div className="relative aspect-video bg-gray-900">
            {/* Example video placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button 
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all flex items-center justify-center"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </Button>
            </div>
            
            {/* Video info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-lg font-medium">Mock Interview: Product Manager Position</h3>
              <div className="flex items-center mt-2">
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-interview-blue w-1/3 rounded-full" />
                </div>
                <span className="text-white/80 ml-2 text-sm">1:24 / 4:30</span>
              </div>
            </div>
          </div>
          
          {/* Transcript and feedback section */}
          <div className="p-6 bg-white/5">
            <div className="mb-4">
              <h4 className="text-white text-sm font-medium mb-2">Question:</h4>
              <p className="text-white/80">Tell me about a time you had to make a difficult decision with limited information.</p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-white text-sm font-medium mb-2">Answer Transcript:</h4>
              <p className="text-white/80">When I was leading the product team at my previous company, we had to decide whether to delay a launch to fix non-critical bugs or to release on schedule...</p>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-medium mb-2">Real-time Feedback:</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-interview-blue text-xl font-bold mb-1">8/10</div>
                  <div className="text-white text-xs">Content</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-interview-violet text-xl font-bold mb-1">7/10</div>
                  <div className="text-white text-xs">Structure</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="text-interview-indigo text-xl font-bold mb-1">9/10</div>
                  <div className="text-white text-xs">Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
