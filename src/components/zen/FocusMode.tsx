import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { scaleIn } from '@/lib/animations';
import type { Task } from '@/store/taskStore';
interface FocusModeProps {
  task?: Task;
  onComplete: (id: string) => void;
  onExit: () => void;
  onSkip: () => void;
}
export function FocusMode({ task, onComplete, onExit, onSkip }: FocusModeProps) {
  if (!task) {
    return (
      <motion.div 
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
      >
        <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-12 h-12 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">All caught up!</h2>
        <p className="text-muted-foreground text-lg max-w-md">
          You've cleared your active tasks. Take a break or add more tasks to continue.
        </p>
        <Button onClick={onExit} size="lg" variant="outline" className="mt-8">
          Return to Dashboard
        </Button>
      </motion.div>
    );
  }
  return (
    <motion.div
      key={task.id}
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      <div className="absolute top-0 right-0 p-4">
        <Button variant="ghost" size="icon" onClick={onExit} className="rounded-full hover:bg-secondary">
          <X className="w-6 h-6" />
        </Button>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8 max-w-3xl"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide uppercase">
          Current Focus
        </span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-balance">
          {task.text}
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12">
          <Button 
            size="lg" 
            className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            onClick={() => onComplete(task.id)}
          >
            <CheckCircle2 className="mr-2 w-6 h-6" />
            Mark Complete
          </Button>
          <Button 
            variant="ghost" 
            size="lg"
            className="h-14 px-8 text-lg rounded-full text-muted-foreground hover:text-foreground"
            onClick={onSkip}
          >
            Skip for now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}