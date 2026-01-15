import React, { useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout, Zap, CheckCircle2, ListTodo, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Toaster, toast } from 'sonner';
// Components
import { TaskInput } from '@/components/zen/TaskInput';
import { TaskItem } from '@/components/zen/TaskItem';
import { FocusMode } from '@/components/zen/FocusMode';
// Store
import { useTaskStore } from '@/store/taskStore';
// Animations
import { staggerContainer, fadeIn, slideUp } from '@/lib/animations';
export function HomePage() {
  // Zustand Selectors (Primitive values only)
  const tasks = useTaskStore((s) => s.tasks);
  const isFocusMode = useTaskStore((s) => s.isFocusMode);
  const isLoading = useTaskStore((s) => s.isLoading);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const setFocusMode = useTaskStore((s) => s.setFocusMode);
  const clearCompleted = useTaskStore((s) => s.clearCompleted);
  // Initial Fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  // Derived State
  const activeTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);
  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks.length / tasks.length) * 100);
  }, [tasks.length, completedTasks.length]);
  // Handlers
  const handleAddTask = (text: string) => {
    addTask(text);
    toast.success('Task added');
  };
  const handleToggleTask = (id: string) => {
    toggleTask(id);
    // No toast here to keep it snappy, visual feedback is enough
  };
  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast.info('Task deleted');
  };
  const handleFocusComplete = (id: string) => {
    toggleTask(id);
    toast.success('Great job! Task completed.');
  };
  // Get top priority task for focus mode
  const focusTask = activeTasks[0];
  return (
    <AppLayout container={false} className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen flex flex-col">
        {/* Header Actions */}
        <header className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">ZenTasks</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </header>
        <AnimatePresence mode="wait">
          {isFocusMode ? (
            <FocusMode
              key="focus-mode"
              task={focusTask}
              onComplete={handleFocusComplete}
              onExit={() => setFocusMode(false)}
              onSkip={() => {
                toast.info("Returning to list view");
                setFocusMode(false);
              }}
            />
          ) : (
            <motion.div
              key="dashboard"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col"
            >
              {/* Welcome & Progress */}
              <motion.div variants={slideUp} className="mb-10 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    You have {activeTasks.length} active {activeTasks.length === 1 ? 'task' : 'tasks'} today.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>Daily Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setFocusMode(true)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0"
                    disabled={activeTasks.length === 0}
                  >
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    Enter Focus Mode
                  </Button>
                  {completedTasks.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={clearCompleted}
                      className="flex-none"
                      title="Clear completed tasks"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Clear Done
                    </Button>
                  )}
                </div>
              </motion.div>
              {/* Input */}
              <motion.div variants={slideUp} className="mb-8 sticky top-4 z-10">
                <TaskInput onAdd={handleAddTask} />
              </motion.div>
              {/* Task List */}
              <motion.div variants={fadeIn} className="space-y-8 flex-1">
                {/* Loading State */}
                {isLoading && tasks.length === 0 && (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                )}
                {/* Active Tasks */}
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {activeTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggleTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </AnimatePresence>
                  {!isLoading && activeTasks.length === 0 && completedTasks.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ListTodo className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-lg font-medium">No tasks yet</p>
                      <p className="text-sm">Add a task above to get started</p>
                    </motion.div>
                  )}
                </div>
                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <div className="pt-8">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                      Completed ({completedTasks.length})
                    </h3>
                    <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
                      <AnimatePresence mode="popLayout" initial={false}>
                        {completedTasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={handleToggleTask}
                            onDelete={handleDeleteTask}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster position="bottom-center" />
    </AppLayout>
  );
}