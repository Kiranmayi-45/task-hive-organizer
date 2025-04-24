import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error('Task cannot be empty');
      return;
    }
    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [task, ...prev]);
    setNewTask('');
    toast.success('Task added successfully');
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success('Task deleted successfully');
  };

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div 
      className="min-h-screen p-4 bg-cover bg-center relative" 
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), 
          url(https://images.unsplash.com/photo-1531297484001-80022131f5a1)
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <Card className="p-6 bg-white/85 backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-slate-800 mb-6">Task Manager</h1>
          
          <form onSubmit={addTask} className="flex gap-2 mb-6">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">Add Task</span>
            </Button>
          </form>

          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              size="sm"
            >
              Completed
            </Button>
          </div>

          <div className="space-y-2">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`flex-1 ${
                    task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}
                >
                  {task.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <p className="text-center text-gray-500 py-4">No tasks found</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaskManager;
