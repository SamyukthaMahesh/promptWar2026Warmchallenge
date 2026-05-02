document.addEventListener('DOMContentLoaded', () => {
    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let draggedTaskId = null;

    // DOM Elements
    const elements = {
        unassignedBadge: document.getElementById('unassigned-badge'),
        unassignedCount: document.getElementById('unassigned-count'),
        createTaskBtn: document.getElementById('create-task-btn'),
        searchInput: document.getElementById('search-input'),
        progressText: document.getElementById('progress-text'),
        progressBarFill: document.getElementById('progress-bar-fill'),
        modal: document.getElementById('task-modal'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        cancelTaskBtn: document.getElementById('cancel-task-btn'),
        taskForm: document.getElementById('task-form'),
        modalTitle: document.getElementById('modal-title'),
        
        // Form inputs
        taskId: document.getElementById('task-id'),
        taskCreatedAt: document.getElementById('task-created-at'),
        taskTitle: document.getElementById('task-title'),
        taskCreator: document.getElementById('task-creator'),
        taskAssignee: document.getElementById('task-assignee'),
        taskPriority: document.getElementById('task-priority'),
        taskDueDate: document.getElementById('task-due-date'),
        taskStatus: document.getElementById('task-status'),

        // Lists
        listUnassigned: document.getElementById('list-unassigned'),
        listTodo: document.getElementById('list-todo'),
        listInprogress: document.getElementById('list-inprogress'),
        listDone: document.getElementById('list-done'),
    };

    // Columns configuration mapping
    const columnsConfig = {
        unassigned: { list: elements.listUnassigned, counter: document.querySelector('#col-unassigned .count') },
        todo: { list: elements.listTodo, counter: document.querySelector('#col-todo .count') },
        inprogress: { list: elements.listInprogress, counter: document.querySelector('#col-inprogress .count') },
        done: { list: elements.listDone, counter: document.querySelector('#col-done .count') }
    };

    // --- Initialization ---
    init();

    function init() {
        renderBoard();
        setupEventListeners();
        updateUnassignedCount();
    }

    // --- Core Logic ---
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateUnassignedCount();
        renderBoard();
    }

    function generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    // --- UI Updates ---
    function updateUnassignedCount() {
        const unassignedTasks = tasks.filter(t => t.status === 'unassigned' || !t.taskAssignee || t.taskAssignee.trim() === '');
        const count = unassignedTasks.length;
        
        elements.unassignedCount.textContent = count;
        
        if (count > 0) {
            elements.unassignedBadge.classList.add('has-unassigned');
            document.querySelector('.unassigned-count-pill').classList.add('has-unassigned');
        } else {
            elements.unassignedBadge.classList.remove('has-unassigned');
            document.querySelector('.unassigned-count-pill').classList.remove('has-unassigned');
        }

        // Also enforce that tasks with no assignee belong to the 'unassigned' status inherently
        // Or we just count them if they are in unassigned column
        const trueUnassignedCount = tasks.filter(t => t.status === 'unassigned').length;
        elements.unassignedCount.textContent = trueUnassignedCount;
        
        if (trueUnassignedCount > 0) {
            elements.unassignedBadge.classList.add('has-unassigned');
            columnsConfig.unassigned.counter.classList.add('has-unassigned');
        } else {
            elements.unassignedBadge.classList.remove('has-unassigned');
            columnsConfig.unassigned.counter.classList.remove('has-unassigned');
        }
    }

    function updateProgress() {
        if (tasks.length === 0) {
            elements.progressText.textContent = `0/0 tasks done (0%)`;
            elements.progressBarFill.style.width = `0%`;
            return;
        }
        const doneTasks = tasks.filter(t => t.status === 'done').length;
        const totalTasks = tasks.length;
        const percentage = Math.round((doneTasks / totalTasks) * 100);
        
        elements.progressText.textContent = `${doneTasks}/${totalTasks} tasks done (${percentage}%)`;
        elements.progressBarFill.style.width = `${percentage}%`;
    }

    function renderBoard() {
        // Clear all lists
        Object.values(columnsConfig).forEach(col => {
            col.list.innerHTML = '';
            col.counter.textContent = '0';
        });

        updateProgress();

        const searchTerm = elements.searchInput.value.toLowerCase().trim();

        // Populate lists
        tasks.forEach(task => {
            // Apply search filter (title, creator, assignee)
            if (searchTerm) {
                const titleMatch = task.taskTitle.toLowerCase().includes(searchTerm);
                const creatorMatch = task.taskCreator && task.taskCreator.toLowerCase().includes(searchTerm);
                const assigneeMatch = task.taskAssignee && task.taskAssignee.toLowerCase().includes(searchTerm);
                
                if (!titleMatch && !creatorMatch && !assigneeMatch) {
                    return; // skip rendering this task
                }
            }

            const card = createTaskCard(task);
            if (columnsConfig[task.status]) {
                columnsConfig[task.status].list.appendChild(card);
            }
        });

        // Update counters based on rendered tasks
        Object.keys(columnsConfig).forEach(status => {
            columnsConfig[status].counter.textContent = columnsConfig[status].list.children.length;
        });
    }

    function createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.dataset.id = task.id;

        const isUnassigned = !task.taskAssignee || task.taskAssignee.trim() === '';
        const assigneeInitials = isUnassigned ? '?' : getInitials(task.taskAssignee);
        const assigneeName = isUnassigned ? 'Unassigned' : task.taskAssignee;

        let priorityHtml = '';
        if (task.priority) {
            priorityHtml = `<div class="priority-badge priority-${task.priority}">${task.priority}</div>`;
        }

        let dueDateHtml = '';
        if (task.dueDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const dueDateObj = new Date(task.dueDate + 'T00:00:00'); // Ensure local timezone parsing
            
            const isOverdue = dueDateObj < today && task.status !== 'done';
            const overdueClass = isOverdue ? 'overdue' : '';
            const overdueText = isOverdue ? ' (Overdue)' : '';
            
            const dateStr = dueDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            dueDateHtml = `
                <div class="task-due-date ${overdueClass}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>${dateStr}${overdueText}</span>
                </div>
            `;
        }

        card.innerHTML = `
            ${priorityHtml}
            <div class="task-actions">
                <button class="icon-btn edit-btn" title="Edit" aria-label="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="icon-btn delete-btn" title="Delete" aria-label="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
            <div class="task-title">${task.taskTitle}</div>
            ${dueDateHtml}
            <div class="task-meta">
                <div class="task-assignee" title="${assigneeName}">
                    <div class="avatar ${isUnassigned ? 'unassigned' : ''}">${assigneeInitials}</div>
                    <span>${assigneeName}</span>
                </div>
                <div class="task-date">${formatDate(task.taskCreatedAt)}</div>
            </div>
        `;

        // Event Listeners for Drag and Drop
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        // Event Listeners for Actions
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(task);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
            }
        });

        return card;
    }

    // --- Modal Handling ---
    function openModal(task = null) {
        if (task) {
            elements.modalTitle.textContent = 'Edit Task';
            elements.taskId.value = task.id;
            elements.taskCreatedAt.value = task.taskCreatedAt;
            elements.taskTitle.value = task.taskTitle;
            elements.taskCreator.value = task.taskCreator || '';
            elements.taskAssignee.value = task.taskAssignee || '';
            elements.taskPriority.value = task.priority || 'medium';
            elements.taskDueDate.value = task.dueDate || '';
            elements.taskStatus.value = task.status;
        } else {
            elements.modalTitle.textContent = 'Create New Task';
            elements.taskForm.reset();
            elements.taskId.value = '';
            elements.taskCreatedAt.value = Date.now();
            elements.taskPriority.value = 'medium';
            elements.taskDueDate.value = '';
            elements.taskStatus.value = 'todo'; // default
        }
        elements.modal.classList.remove('hidden');
    }

    function closeModal() {
        elements.modal.classList.add('hidden');
    }

    // --- Drag and Drop ---
    function handleDragStart(e) {
        draggedTaskId = this.dataset.id;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        // Need to set data for Firefox
        e.dataTransfer.setData('text/plain', draggedTaskId);
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        document.querySelectorAll('.task-list').forEach(list => {
            list.classList.remove('drag-over');
        });
        draggedTaskId = null;
    }

    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Search
        elements.searchInput.addEventListener('input', () => {
            renderBoard();
        });

        // Modal toggles
        elements.createTaskBtn.addEventListener('click', () => openModal());
        elements.closeModalBtn.addEventListener('click', closeModal);
        elements.cancelTaskBtn.addEventListener('click', closeModal);

        // Click outside modal to close
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) closeModal();
        });

        // Form Submit
        elements.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let status = elements.taskStatus.value;
            let assignee = elements.taskAssignee.value.trim();

            // Auto-update status if assignee logic applies
            if (assignee === '' && status !== 'done') {
                status = 'unassigned';
            } else if (assignee !== '' && status === 'unassigned') {
                status = 'todo';
            }

            const taskData = {
                id: elements.taskId.value || generateId(),
                taskTitle: elements.taskTitle.value,
                taskCreator: elements.taskCreator.value,
                taskAssignee: assignee,
                priority: elements.taskPriority.value,
                dueDate: elements.taskDueDate.value,
                status: status,
                taskCreatedAt: parseInt(elements.taskCreatedAt.value) || Date.now()
            };

            if (elements.taskId.value) {
                // Edit
                const index = tasks.findIndex(t => t.id === taskData.id);
                if (index !== -1) tasks[index] = taskData;
            } else {
                // Create
                tasks.push(taskData);
            }

            saveTasks();
            closeModal();
        });

        // Drag and Drop Zone Listeners
        document.querySelectorAll('.task-list').forEach(list => {
            list.addEventListener('dragover', (e) => {
                e.preventDefault();
                list.classList.add('drag-over');
            });

            list.addEventListener('dragleave', () => {
                list.classList.remove('drag-over');
            });

            list.addEventListener('drop', (e) => {
                e.preventDefault();
                list.classList.remove('drag-over');
                
                if (!draggedTaskId) return;

                const targetStatus = list.parentElement.dataset.status;
                const taskIndex = tasks.findIndex(t => t.id === draggedTaskId);
                
                if (taskIndex !== -1 && tasks[taskIndex].status !== targetStatus) {
                    tasks[taskIndex].status = targetStatus;
                    
                    // Logic: If moved to unassigned, clear assignee
                    if (targetStatus === 'unassigned') {
                        tasks[taskIndex].taskAssignee = '';
                    }

                    saveTasks();
                }
            });
        });
    }
});
