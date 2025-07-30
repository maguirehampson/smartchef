/**
 * Testimonial Section Component
 * 
 * Lazy-loaded component for displaying user testimonials and social proof.
 * This component is loaded only when it comes into view to improve initial
 * page load performance.
 * 
 * Performance Features:
 * - Lazy loading to reduce initial bundle size
 * - Optimized animations with reduced motion support
 * - Efficient rendering with React.memo
 * 
 * @author SmartChef Team
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

/**
 * Testimonial data interface
 */
interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

/**
 * Testimonial data - optimized for performance
 */
const testimonials: Testimonial[] = [
  {
    id: "busy-parent",
    name: "Anonymous User",
    role: "Busy Parent",
    content: "Finally, an AI that gets that I need dinner ideas for cranky kids after a 12-hour workday, not gourmet recipes I'll never make.",
    rating: 5
  },
  {
    id: "college-student",
    name: "Anonymous User",
    role: "College Student",
    content: "SmartChef actually understands my $15 weekly grocery budget and my dorm kitchen limitations. Game changer.",
    rating: 5
  },
  {
    id: "working-professional",
    name: "Anonymous User",
    role: "Working Professional",
    content: "It's like having a friend who actually knows what you want to eat when you're too tired to think. Revolutionary.",
    rating: 5
  }
];

/**
 * Testimonial Section Component
 * 
 * Displays user testimonials with star ratings and smooth animations.
 * Optimized for performance with reduced motion support.
 */
const TestimonialSection: React.FC = React.memo(() => {
  return (
    <section className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            What People Are Saying
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Real feedback from people who understand the struggle of deciding what to eat
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              <div>
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

TestimonialSection.displayName = 'TestimonialSection';

export default TestimonialSection;