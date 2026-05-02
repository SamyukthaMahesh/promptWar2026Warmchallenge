# Manual Testing Guide — TaskBoard Pro

This document provides step-by-step test cases to verify all features of the TaskBoard Pro application.

---

## Test Environment

- Browser: Any modern browser (Chrome, Edge, Firefox)
- URL (Live): https://task-board-app-712574756217.us-central1.run.app/
- URL (Local): Open `index.html` directly in browser

---

## Test Execution Status

All test cases were executed manually on the deployed application.

Result: PASS

Tested on:

- Browser: Chrome
- Deployment: Google Cloud Run
- URL: https://task-board-app-712574756217.us-central1.run.app/

## TC-01: Create Task

**Steps:**

1. Click the **"New Task"** button in the header.
2. Leave the Task Title empty and click **"Save Task"**.
3. **Expected:** Form is rejected. An alert says "Task title cannot be empty!" or the browser prevents submission.
4. Fill in: Title = "Fix Login Bug", Creator = "Alice", Assignee = "Bob", Priority = "High", Due Date = yesterday, Status = "To Do".
5. Click **"Save Task"**.
6. **Expected:** Task card appears in the **To Do** column with a red "HIGH" priority badge and an **Overdue** due date label.

---

## TC-02: Edit Task

**Steps:**

1. Hover over a task card to reveal the edit (pencil) icon.
2. Click the edit icon.
3. **Expected:** Modal opens pre-filled with the task's existing values.
4. Change the Title to "Fix Login Bug v2", Priority to "Low", Due Date to next week.
5. Click **"Save Task"**.
6. **Expected:** The card updates immediately. Priority badge turns green, due date no longer shows "Overdue".

---

## TC-03: Delete Task

**Steps:**

1. Hover over a task card to reveal the delete (trash) icon.
2. Click the delete icon.
3. **Expected:** A confirmation prompt appears ("Are you sure you want to delete this task?").
4. Click **OK**.
5. **Expected:** The task is permanently removed from the board. Column counter decrements. Progress percentage recalculates.

---

## TC-04: Drag and Drop Across Columns

**Steps:**

1. Create a task assigned to "Alice" in the **To Do** column.
2. Click and drag the card to the **In Progress** column.
3. **Expected:** Card moves. "To Do" counter decrements by 1, "In Progress" counter increments by 1.
4. Drag the card to the **Unassigned** column.
5. **Expected:** Card moves. Assignee field is automatically cleared ("Unassigned" shown on card).
6. Drag the card to the **Done** column.
7. **Expected:** Card moves. Progress percentage updates (e.g., 1/1 tasks done — 100%).

---

## TC-05: Search and Filter

**Steps:**

1. Create two tasks: "Fix Login Bug" (assigned to "Alice") and "Write Unit Tests" (assigned to "Bob").
2. Type **"Fix"** in the search bar.
3. **Expected:** Only the "Fix Login Bug" card is visible. Other cards are hidden.
4. Type **"Alice"** in the search bar.
5. **Expected:** Only cards assigned to "Alice" are visible.
6. Clear the search bar completely.
7. **Expected:** All tasks return to the board instantly.

---

## TC-06: Priority Badge Rendering

**Steps:**

1. Create three tasks: one with Priority = Low, one with Medium, one with High.
2. **Expected:**
   - Low → Green badge with text "low"
   - Medium → Orange/yellow badge with text "medium"
   - High → Red badge with text "high"
3. **Accessibility Check:** Badges must display text labels, not just colors.

---

## TC-07: Due Date — Overdue Logic

**Steps:**

1. Create a task with Due Date set to **yesterday** (any past date). Status = "To Do".
2. **Expected:** The due date on the card appears red with "(Overdue)" label.
3. Create another task with Due Date set to **next week**.
4. **Expected:** The due date appears in normal styling. No "Overdue" label.
5. Drag the overdue task to the **Done** column.
6. **Expected:** "Overdue" label disappears (tasks in Done are never marked overdue).

---

## TC-08: Progress Percentage

**Steps:**

1. Ensure there are 4 tasks total, with 2 in the **Done** column.
2. **Expected:** Header shows "2/4 tasks done (50%)" and the green progress bar is at 50%.
3. Drag a third task to Done.
4. **Expected:** Updates to "3/4 tasks done (75%)".
5. Delete all tasks.
6. **Expected:** Resets to "0/0 tasks done (0%)".

---

## TC-09: Column Counters

**Steps:**

1. Create tasks in different columns.
2. **Expected:** Each column header shows an accurate count of its contained tasks.
3. Drag a task between columns.
4. **Expected:** Counters update immediately on both source and destination columns.

---

## TC-10: localStorage Persistence After Refresh

**Steps:**

1. Create 3 tasks with different priorities, statuses, and due dates.
2. Refresh the browser (F5 or Ctrl+R).
3. **Expected:** All 3 tasks are still visible with all their data intact (title, assignee, priority, due date, status, column position).
4. Delete a task and refresh.
5. **Expected:** The deleted task does not return.

---

## TC-11: Empty Board Behavior

**Steps:**

1. Delete all tasks from the board.
2. **Expected:**
   - All column counters show "0".
   - Progress bar shows "0/0 tasks done (0%)".
   - Unassigned badge has no red highlight.
   - Board columns remain visible (board does not break or disappear).

---

## TC-12: Keyboard Accessibility Navigation

**Steps:**

1. Press **Tab** from the top of the page.
2. **Expected:** Focus moves through interactive elements in logical order: Search Input → Progress Stats → Unassigned Badge → New Task Button → Column headers → Task Cards.
3. Press **Enter** or **Space** on the **"New Task"** button while focused.
4. **Expected:** The modal opens.
5. Press **Tab** inside the modal to move through form fields.
6. **Expected:** Each field (Title, Creator, Assignee, Priority, Due Date, Status, Cancel, Save) is reachable and has a visible focus outline (purple border).
7. Press **Escape** or click outside the modal.
8. **Expected:** Modal closes.
