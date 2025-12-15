import { motion } from "motion/react";
import { ArrowRight, Command } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { AISearchDialogSimplified } from "./AISearchDialogSimplified";
import { homePageAssets, animationConfig, homePageText } from "./homePageConfig";
import coverImage from "../assets/home_cover_page.png";
import aiIcon from "../assets/ai_chat.png";

interface CoverPageProps {
  onModuleSelect: (module: string) => void;
}

export function CoverPage({ onModuleSelect }: CoverPageProps) {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation every time component mounts (navigates to home)
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, []);

  return (
    <div 
      className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        background: 'conic-gradient(from 0deg, #4f46e5, #818cf8, #c7d2fe, #4f46e5)'
      }}
    >
      {/* Animated Hexagon Background Image - Slides in from right with pixel-perfect coverage */}
      <motion.div
        key={`background-${animationKey}`}
        className="absolute inset-0 w-full h-full"
        initial={{ x: "100%", opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: animationConfig.background.opacity,
          }}
        transition={{
          duration: animationConfig.background.duration,
          ease: animationConfig.background.ease,
        }}
      >
        <motion.div
          key={`shake-${animationKey}`}
          className="w-full h-full dark:opacity-50"
          initial={{ scale: 1.05 }}
          animate={{ 
            scale: [1.05, 1.07, 1.03, 1.06, 1.04, 1.05],
          }}
          transition={{
            delay: 1.2,
            duration: 0.6,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            ease: "easeInOut"
          }}
        >
          <img
            src={coverImage}
            alt="Virima Hexagon Pattern"
            className="w-full h-full object-cover"
            style={{
              minWidth: '100%',
              minHeight: '100%',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Content Overlay - Centered and Responsive */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          {/* Virima Brand - Perfectly Centered with Fade In */}
          <motion.div
            key={`title-${animationKey}`}
            className="mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: animationConfig.title.delay,
              duration: animationConfig.title.duration,
              ease: animationConfig.title.ease
            }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-slate-900 dark:text-white tracking-tight">
              {homePageText.brand}
            </h1>
          </motion.div>

          {/* Tagline - Fade In */}
          <motion.div
            key={`tagline-${animationKey}`}
            className="mb-3 sm:mb-4 md:mb-5 lg:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: animationConfig.tagline.delay,
              duration: animationConfig.tagline.duration,
              ease: animationConfig.tagline.ease
            }}
          >
            <p className="text-xl sm:text-2xl md:text-2xl lg:text-3xl text-slate-900 dark:text-slate-100 leading-relaxed px-2">
              {homePageText.tagline}
            </p>
          </motion.div>

          {/* Description - Fade In */}
          <motion.p
            key={`description-${animationKey}`}
            className="text-base sm:text-lg md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-5 sm:mb-6 md:mb-7 lg:mb-8 max-w-3xl mx-auto leading-relaxed px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: animationConfig.description.delay,
              duration: animationConfig.description.duration,
              ease: animationConfig.description.ease
            }}
          >
            {homePageText.description}
          </motion.p>

          {/* Search CTA - Fade In with Scale */}
          <motion.div
            key={`search-${animationKey}`}
            className="max-w-2xl mx-auto mb-4 sm:mb-5 md:mb-6 lg:mb-8 px-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: animationConfig.search.delay,
              duration: animationConfig.search.duration,
              ease: animationConfig.search.ease
            }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSearchDialogOpen(true)}
              className="w-full max-w-xl mx-auto flex items-center gap-2 sm:gap-3 justify-start text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-emerald-50/80 dark:hover:bg-emerald-900/30 border-2 border-slate-200 dark:border-slate-600 hover:border-emerald-400 dark:hover:border-emerald-500 h-14 sm:h-16 px-4 sm:px-6 text-sm sm:text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 group"
            >
              <img
                src={aiIcon}
                alt="AI"
                className="h-6 w-6 sm:h-7.5 sm:w-7.5 group-hover:scale-110 transition-transform duration-300"
                style={{ imageRendering: "crisp-edges" }}
              />
              <span className="text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors duration-300 hidden sm:inline">
                {homePageText.searchPlaceholder}
              </span>
              <span className="text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors duration-300 sm:hidden">
                {homePageText.searchPlaceholderMobile}
              </span>
              <div className="ml-auto flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                <Command className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span>K</span>
              </div>
            </Button>
          </motion.div>

          {/* Get Started Button - Fade In with Scale */}
          <motion.div
            key={`button-${animationKey}`}
            className="flex justify-center px-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: animationConfig.button.delay,
              duration: animationConfig.button.duration,
              ease: animationConfig.button.ease
            }}
          >
            <Button
              size="lg"
              onClick={() => onModuleSelect('admin')}
              className="relative bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base shadow-2xl shadow-green-500/40 hover:shadow-green-500/50 transition-all duration-300 hover:scale-105 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative">{homePageText.getStartedButton}</span>
              <ArrowRight className="relative ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade - responsive */}
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent pointer-events-none"></div>

      {/* AI Search Dialog */}
      <AISearchDialogSimplified
        isOpen={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
      />
    </div>
  );
}