import React, { useState, useEffect } from 'react';
import { Leaf, Cpu, Activity, Database, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOADING_STEPS = [
  { text: 'Initializing industrial factory profile...', icon: Database },
  { text: 'Parsing raw material weights and lifecycle indices...', icon: Cpu },
  { text: 'Calculating electricity Scope 2 grid emission intensities...', icon: Activity },
  { text: 'Evaluating thermal fuel Scope 1 direct output values...', icon: TrendingUp },
  { text: 'Comparing metrics with international industry averages...', icon: Leaf },
  { text: 'Sourcing cost-saving energy optimization guidelines from Gemini...', icon: Sparkles },
  { text: 'Formulating federal environmental regulatory compliance logs...', icon: Database },
  { text: 'Constructing carbon trajectory projections through 2030...', icon: TrendingUp },
];

export const Loader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    // Progress increment timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98; // Hold just before 100% until API completes
        return prev + Math.floor(Math.random() * 5) + 2;
      });
    }, 450);

    // Step message cycle timer
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const StepIcon = LOADING_STEPS[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/90 dark:bg-slate-950/90 backdrop-blur-md p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center">
        
        {/* Animated outer circle logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-xl w-24 h-24 -m-2 animate-pulse" />
          <div className="relative w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Leaf className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white font-display mb-2">
          Consulting EcoManufacture AI
        </h3>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono tracking-wider uppercase mb-6 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-spin" /> Deep Environmental Reasoning Active
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden border border-gray-200/20">
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        {/* Reassuring loading steps display */}
        <div className="h-20 w-full flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400">
                <StepIcon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                {LOADING_STEPS[currentStep].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-6">
          Estimated completion: ~15 seconds • Scope 1 & 2 analysis
        </span>
      </div>
    </div>
  );
};
