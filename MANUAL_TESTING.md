# Manual Testing Guide

Follow these steps to manually verify the core functionality of the Kanban Board application.

### 1. Task Creation
- Click the "New Task" button.
- Leave "Task Title" empty and click "Save Task". **Expected:** The browser should prevent submission (HTML5 required validation).
- Fill in the Title, Creator, set Assignee to "John", Priority to "High", and Due Date to yesterday.
- Click "Save Task".
- **Expected:** A new task card appears in the "To Do" column. It should have a red "HIGH" priority badge, and the due date should be highlighted in red with "(Overdue)".

### 2. Editing & Data Persistence
- Click the edit (pencil) icon on the newly created task.
- Change the Priority to "Low" and Assignee to "Alice". Save.
- **Expected:** The card updates immediately. Priority badge turns green, and avatar updates to "AL".
- Refresh the browser.
- **Expected:** The task should persist with all updated details intact.

### 3. Drag and Drop Workflow
- Click and drag the task from "To Do" and drop it into the "In Progress" column.
- **Expected:** The task moves. The column counters update (To Do becomes 0, In Progress becomes 1).
- Drag the task to the "Unassigned" column.
- **Expected:** The task moves, and the Assignee is automatically cleared and changes to "Unassigned".
- Drag the task to the "Done" column.
- **Expected:** The task moves, and the Progress Percentage Tracker in the header updates accurately (e.g., to 100%).

### 4. Search and Filter
- Create a second task titled "Write Tests".
- Type "Write" into the search bar.
- **Expected:** Only the "Write Tests" task is visible.
- Type "Alice" into the search bar.
- **Expected:** Only the task assigned to Alice is visible.
- Clear the search bar completely.
- **Expected:** All tasks return to the board.

### 5. Deletion
- Click the delete (trash can) icon on a task.
- Confirm the deletion prompt.
- **Expected:** The task is removed from the board and the progress tracker recalculates. Refreshing the browser confirms it is permanently deleted.
