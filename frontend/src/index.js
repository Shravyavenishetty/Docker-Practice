document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3001/api';
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
  
    // Fetch all tasks
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`);
        const tasks = await response.json();
        renderTasks(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    // Render tasks to DOM
    const renderTasks = (tasks) => {
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task._id, !task.completed));
        
        const taskText = document.createElement('span');
        taskText.textContent = task.title;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task._id));
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
      });
    };
  
    // Add new task
    const addTask = async (title) => {
      try {
        const response = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title }),
        });
        
        if (response.ok) {
          fetchTasks();
          taskInput.value = '';
        }
      } catch (error) {
        console.error('Error adding task:', error);
      }
    };
  
    // Toggle task completion
    const toggleTaskCompletion = async (id, completed) => {
      try {
        await fetch(`${API_URL}/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ completed }),
        });
        fetchTasks();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    };
  
    // Delete task
    const deleteTask = async (id) => {
      try {
        await fetch(`${API_URL}/tasks/${id}`, {
          method: 'DELETE',
        });
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };
  
    // Event listeners
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = taskInput.value.trim();
      if (title) {
        addTask(title);
      }
    });
  
    // Initialize
    fetchTasks();
  });