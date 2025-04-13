# Project Management Dashboard - Quick Start Guide

This quick start guide will help you get up and running with the Project Management Dashboard.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd project-management-dash
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:5173](http://localhost:5173) to see the application running.

## Using the Dashboard

### Navigation

- Use the sidebar to navigate between different views:
  - **Dashboard**: Overview of your project and tasks
  - **Board**: Kanban board for visualizing task workflow
  - **Tasks**: List view of all tasks with sorting and filtering
  - **Calendar**: Calendar view of tasks by due date
  - **Reports**: Data visualization and reports (coming soon)
  - **Team**: Team management (coming soon)
  - **Settings**: Application settings and preferences

### Managing Tasks

1. **Creating a Task**
   - Click the "Add Task" button in either the Dashboard, Board, or Tasks view
   - Fill in the task details:
     - Title (required)
     - Description
     - Status (Backlog, To Do, In Progress, Review, Done)
     - Priority (Low, Medium, High, Urgent)
     - Due Date
     - Tags

2. **Updating a Task**
   - Click on any task to open its detail view
   - Click the "Edit" button to modify any of the task's properties
   - Changes are saved automatically

3. **Moving Tasks (Board View)**
   - Drag and drop tasks between columns to change their status
   - Tasks will automatically update in the database

### Theme Settings

- Toggle between Light/Dark/System modes in the Settings page
- The theme toggle in the header also allows quick switching

## Customization

To customize the application, consider:

1. **Modifying the theme colors**:
   - Edit `tailwind.config.js` to change the primary color palette
   - Adjust the UI component styles in `src/index.css`

2. **Extending task properties**:
   - Modify the types in `src/types/index.ts`
   - Update the store in `src/store/taskStore.ts`
   - Adjust UI components that display task information

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details. 