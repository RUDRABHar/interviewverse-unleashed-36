
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: 'How does the AI interviewer actually work?',
    answer: 'Our AI interviewer uses a combination of natural language processing and machine learning models trained on thousands of real interviews. It analyzes your responses for content relevance, delivery, and structure, then provides feedback based on industry best practices and successful interview patterns.'
  },
  {
    question: 'Is my interview data kept private?',
    answer: 'Absolutely. Your privacy is our priority. All interview data is encrypted and stored securely. We never share your personal information or interview responses with third parties. You can also delete your data at any time from your account settings.'
  },
  {
    question: 'Can I practice for specific companies or roles?',
    answer: 'Yes! InterviewXpert offers customized interview experiences for hundreds of companies and roles. Simply select your target company and position, and our AI will tailor questions based on known interview patterns and requirements for that specific opportunity.'
  },
  {
    question: 'How accurate is the feedback compared to real interviewers?',
    answer: 'Our AI feedback has been calibrated using data from thousands of actual interviews and hiring decisions. In blind tests, InterviewXpert feedback matched professional interviewer assessments with over 92% accuracy across technical, behavioral, and communication dimensions.'
  },
  {
    question: "Do you offer refunds if I'm not satisfied?",
    answer: "Yes, we offer a 14-day money-back guarantee on all premium plans. If you're not completely satisfied with InterviewXpert, simply contact our support team within 14 days of purchase for a full refund, no questions asked."
  },
  {
    question: 'Can I use InterviewXpert on mobile devices?',
    answer: 'InterviewXpert is fully responsive and works seamlessly on desktops, tablets, and smartphones. We also offer dedicated mobile apps for iOS and Android that allow you to practice interviews on the go, even without an internet connection.'
  },
];

const FAQs = () => {
  return (
    <section id="faqs" className="section-padding">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-700">
            Everything you need to know about InterviewXpert
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-lg shadow-sm border border-gray-100 px-6"
            >
              <AccordionTrigger className="text-left py-4 font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQs;
