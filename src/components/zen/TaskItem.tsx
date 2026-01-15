import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { listItemVariants } from '@/lib/animations';
import type { Task } from '@/store/taskStore';
interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
export const TaskItem = React.memo(({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <motion.div
      layout
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative flex items-center gap-4 p-4 bg-card hover:bg-accent/5 rounded-xl border border-transparent hover:border-border/50 transition-colors duration-200"
    >
      {/* Custom Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          task.completed
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary/50"
        )}
        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        <motion.div
          initial={false}
          animate={{ scale: task.completed ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </motion.div>
      </button>
      {/* Task Text */}
      <div className="flex-grow min-w-0">
        <span
          className={cn(
            "block text-lg font-medium transition-all duration-300 truncate",
            task.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
          )}
        >
          {task.text}
        </span>
      </div>
      {/* Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2">
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors focus:opacity-100 focus:outline-none"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
});
TaskItem.displayName = 'TaskItem';