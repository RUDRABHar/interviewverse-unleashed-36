
import React from 'react';
import { cn } from '@/lib/utils';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-interview-primary">Interview</span>
              <span className="text-interview-blue">Xpert</span>
            </h3>
            <p className="text-gray-600 mb-4">
              Your AI-powered companion for interview success.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-interview-primary">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-interview-primary">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-interview-primary">Home</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-interview-primary">How it Works</a></li>
              <li><a href="#features" className="text-gray-600 hover:text-interview-primary">Features</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-interview-primary">Pricing</a></li>
              <li><a href="#faqs" className="text-gray-600 hover:text-interview-primary">FAQs</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-interview-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-interview-primary">Terms of Use</a></li>
              <li><a href="#" className="text-gray-600 hover:text-interview-primary">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-interview-primary">GDPR Compliance</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="text-gray-600">
                <a href="mailto:support@interviewxpert.ai" className="hover:text-interview-primary">support@interviewxpert.ai</a>
              </li>
              <li className="text-gray-600">
                <a href="tel:+123456789" className="hover:text-interview-primary">+1 (234) 567-89</a>
              </li>
              <li className="text-gray-600">
                1234 Innovation Drive<br />
                Tech Valley, CA 94043
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} InterviewXpert. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0">
            AI-powered interviews to help you land your dream job
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
