import React from 'react';

const TaskCard = ({ task, onStatusChange }) => (
  <div className="bg-gray-100 p-3 rounded-md shadow-sm mb-3">
    <p className="font-medium">{task.title}</p>
    <div className="text-xs mt-2 space-x-2">
      {task.status !== 'todo' && (
        <button onClick={() => onStatusChange(task._id, 'todo')} className="hover:underline text-gray-500">Todo</button>
      )}
      {task.status !== 'in-progress' && (
        <button onClick={() => onStatusChange(task._id, 'in-progress')} className="hover:underline text-yellow-600">In Progress</button>
      )}
      {task.status !== 'done' && (
        <button onClick={() => onStatusChange(task._id, 'done')} className="hover:underline text-green-600">Done</button>
      )}
    </div>
  </div>
);

const TaskBoard = ({ tasks, onStatusChange }) => {
  const columns = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    done: tasks.filter(t => t.status === 'done'),
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-3 border-b pb-2">📋 Todo</h3>
          {columns.todo.map(task => <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} />)}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-3 border-b pb-2">⏳ In Progress</h3>
          {columns['in-progress'].map(task => <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} />)}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-3 border-b pb-2">✅ Done</h3>
          {columns.done.map(task => <TaskCard key={task._id} task={task} onStatusChange={onStatusChange} />)}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;