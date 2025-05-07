
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'Software Engineer at Google',
    image: '/placeholder.svg', // Using placeholder image
    company: 'google',
    quote: 'InterviewXpert helped me prepare for my technical interviews with real coding challenges and feedback. I aced my Google interview and got the job!'
  },
  {
    name: 'Michael Chen',
    position: 'Product Manager at Amazon',
    image: '/placeholder.svg', // Using placeholder image
    company: 'amazon',
    quote: 'The behavioral question preparation was spot-on. The AI gave me insights on how to structure my answers that made a huge difference in my interview performance.'
  },
  {
    name: 'Emily Rodriguez',
    position: 'UX Designer at Startup',
    image: '/placeholder.svg', // Using placeholder image
    company: 'startup',
    quote: 'As someone who gets nervous during interviews, the practice with InterviewXpert helped me build confidence. The real-time feedback helped me improve rapidly.'
  }
];

const Testimonials = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            See how InterviewXpert has helped candidates land their dream jobs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-card card-hover relative"
            >
              <div className="mb-6">
                <span className="text-5xl text-interview-primary/20 font-serif">"</span>
                <p className="text-gray-700 italic">
                  {testimonial.quote}
                </p>
              </div>
              
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.position}</p>
                </div>
              </div>
              
              <div className="absolute top-6 right-6 opacity-20">
                <span className="uppercase text-xs font-bold tracking-wider">
                  {testimonial.company}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
