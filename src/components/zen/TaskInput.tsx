import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface TaskInputProps {
  onAdd: (text: string) => void;
}
export function TaskInput({ onAdd }: TaskInputProps) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  }, [text, onAdd]);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative group rounded-2xl transition-all duration-300 bg-background",
        isFocused ? "shadow-lg ring-2 ring-primary/10" : "shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-center px-4 py-3 md:py-4">
        <Plus 
          className={cn(
            "w-6 h-6 mr-3 transition-colors duration-300",
            isFocused ? "text-primary" : "text-muted-foreground"
          )} 
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What needs to be done?"
          className="flex-grow bg-transparent border-none outline-none text-lg md:text-xl placeholder:text-muted-foreground/60 text-foreground"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className={cn(
            "ml-2 p-2 rounded-xl transition-all duration-200 font-medium text-sm",
            text.trim() 
              ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-95" 
              : "bg-transparent text-transparent cursor-default"
          )}
        >
          Add
        </button>
      </div>
    </motion.div>
  );
}