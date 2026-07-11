'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface LikeDislikeButtonsProps {
  handleVote: (action: 'like' | 'dislike') => void;
  userVote: 'like' | 'dislike' | null;
  showAnimation: 'like' | 'dislike' | null;
  ctaText?: string;
}

export default function LikeDislikeButtons({
  handleVote,
  userVote,
  showAnimation,
  ctaText,
}: LikeDislikeButtonsProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-8">
      {ctaText && <p className="text-lg text-muted-foreground">{ctaText}</p>}
      <div className="flex justify-center items-center space-x-4">
        <motion.button
          onClick={() => handleVote('like')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            userVote === 'like'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <ThumbsUp className="h-5 w-5" />
        </motion.button>
        <motion.button
          onClick={() => handleVote('dislike')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            userVote === 'dislike'
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <ThumbsDown className="h-5 w-5" />
        </motion.button>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -50, scale: 1.5 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute"
          >
            {showAnimation === 'like' ? '👍' : '👎'}
          </motion.div>
        )}
      </div>
    </div>
  );
}
