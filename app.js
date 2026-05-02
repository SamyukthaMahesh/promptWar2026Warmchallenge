document.addEventListener('DOMContentLoaded', () => {
    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let draggedTaskId = null;

    // DOM Elements
    const elements = {
        unassignedBadge: document.getElementById('unassigned-badge'),
        unassignedCount: document.getElementById('unassigned-count'),
        createTaskBtn: document.getElementById('create-task-btn'),
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

    function renderBoard() {
        // Clear all lists
        Object.values(columnsConfig).forEach(col => {
            col.list.innerHTML = '';
            col.counter.textContent = '0';
        });

        // Populate lists
        tasks.forEach(task => {
            const card = createTaskCard(task);
            if (columnsConfig[task.status]) {
                columnsConfig[task.status].list.appendChild(card);
            }
        });

        // Update counters
        Object.keys(columnsConfig).forEach(status => {
            const count = tasks.filter(t => t.status === status).length;
            columnsConfig[status].counter.textContent = count;
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

        card.innerHTML = `
            <div class="task-actions">
                <button class="icon-btn edit-btn" title="Edit" aria-label="Edit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="icon-btn delete-btn" title="Delete" aria-label="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
            <div class="task-title">${task.taskTitle}</div>
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
            elements.taskStatus.value = task.status;
        } else {
            elements.modalTitle.textContent = 'Create New Task';
            elements.taskForm.reset();
            elements.taskId.value = '';
            elements.taskCreatedAt.value = Date.now();
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
