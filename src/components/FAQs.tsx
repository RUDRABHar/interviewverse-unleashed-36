
import React from 'react';
import { motion } from 'framer-motion';
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
    <section id="faqs" className="section-padding relative bg-gradient-to-br from-white to-interview-primary/5 dark:from-gray-900 dark:to-gray-800">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-interview-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-interview-blue/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Everything you need to know about InterviewXpert
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Accordion type="single" collapsible>
                <AccordionItem 
                  value={`item-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 px-6 overflow-hidden backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-left py-4 font-medium text-gray-800 dark:text-gray-200 hover:text-interview-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300 pb-4">
                    <div className="border-l-2 border-interview-primary/30 pl-4">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
