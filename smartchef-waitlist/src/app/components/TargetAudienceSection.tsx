/**
 * Target Audience Section Component
 * 
 * Lazy-loaded component for displaying target audience cards.
 * This component is loaded only when it comes into view to improve initial
 * page load performance.
 * 
 * Performance Features:
 * - Lazy loading to reduce initial bundle size
 * - Optimized animations with reduced motion support
 * - Efficient rendering with React.memo
 * 
 * @author Savr Team
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Zap, Target } from 'lucide-react';

/**
 * Target audience data interface
 */
interface TargetAudience {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  examples: string[];
}

/**
 * Target audience data - optimized for performance
 */
const targetAudiences: TargetAudience[] = [
  {
    icon: Users,
    title: "Busy Parents",
    description: "Juggling work, kids, and life while trying to feed everyone something decent",
    examples: ["Quick weeknight dinners", "Kid-friendly meals", "Batch cooking tips"]
  },
  {
    icon: Heart,
    title: "College Students",
    description: "Living on ramen budgets but craving real food that won't break the bank",
    examples: ["Dorm-friendly recipes", "Budget meal planning", "Healthy cheap eats"]
  },
  {
    icon: Zap,
    title: "Working Professionals",
    description: "Too tired to think about food but too hungry to skip meals",
    examples: ["15-minute meals", "Meal prep strategies", "Office lunch ideas"]
  },
  {
    icon: Target,
    title: "Food Enthusiasts",
    description: "Love cooking but want inspiration that matches your mood and pantry",
    examples: ["Creative recipe ideas", "Ingredient substitutions", "Cooking techniques"]
  }
];

/**
 * Target Audience Section Component
 * 
 * Displays target audience cards with icons and descriptions.
 * Optimized for performance with reduced motion support.
 */
const TargetAudienceSection: React.FC = React.memo(() => {
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Made For Real People
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                            Savr understands that everyone&apos;s food journey is different
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {targetAudiences.map((audience, index) => {
            const IconComponent = audience.icon;
            return (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-blue-500/30 transition-all duration-300 text-center"
              >
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <IconComponent className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{audience.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {audience.description}
                </p>
                <div className="space-y-2">
                  {audience.examples.map((example, i) => (
                    <div key={i} className="text-sm text-gray-400 bg-gray-800/50 rounded-lg px-3 py-2">
                      {example}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

TargetAudienceSection.displayName = 'TargetAudienceSection';

export default TargetAudienceSection;