# 📁 DataRoom MVP

A minimal **data room file manager** built with **React + TypeScript + Vite**.

This MVP allows users to:
- Create folders and upload PDF files.
- Browse a nested folder tree.
- Preview PDFs inline.
- Search for files across all nested folders.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/KDJency/DataRoom.git
cd dataroom-mvp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev

# This will start a local development server (default: http://localhost:5173)
```

### 4. Build for production
```bash
npm run build
```

### 5. Preview production build
```bash
npm run preview
```

## 🧩 Project Structure

src/
├── components/
│   ├── FolderTree.tsx        # Recursive folder rendering
│   ├── MainDisplayPanel.tsx  # Main section with folders and files
│   ├── PreviewPanel.tsx      # PDF viewer panel
│   ├── SearchBar.tsx         # Search files by name
│
├── hooks                     # Custom hook for tree CRUD operations
│
├── types.ts                  # Shared TypeScript types
│
├── App.tsx                   # Main entry point (DataRoomMVP)
│
└── main.tsx                  # React + Vite bootstrap


## 💡 Design Decisions

1. Vite + React + TypeScript

Vite provides extremely fast HMR and a smooth TypeScript experience. It’s ideal for a prototype like this, offering quick iteration without a heavy build setup.

2. Recursive Tree Structure

The file system is represented using two types:

type FileItem = { id, name, mime, size, ... }
type FolderItem = { id, name, children: Array<FileItem | FolderItem> }


This makes it simple to handle arbitrarily nested folders. The recursive rendering logic in FolderTree mirrors this structure for intuitive UI consistency.

3. Immutable Updates with structuredClone

Instead of mutating the tree directly, all CRUD operations create a deep copy (structuredClone).
This ensures React’s state updates are predictable and compatible with memoization.

4. Custom Hook: useFileTree

Encapsulates core logic for:

Generating IDs (genId)

Searching nodes by ID (findNodeById)

Adding/removing/renaming nodes

Keeping this logic in a hook improves reusability and separation of concerns.

5. PDF Preview

Uploaded files are stored as base64 Data URLs.
When selected, a Blob object is created dynamically so PDFs can be displayed in the browser without requiring backend storage.

6. Search Implementation

A recursive helper findMatchingFiles walks through the entire tree to find all files whose names match the search term (case-insensitive).

This avoids external state management libraries and keeps performance acceptable for MVP-scale datasets.

7. UI Simplicity (TailwindCSS)

TailwindCSS was chosen for its minimal setup and focus on utility-first styling.
All layout elements use consistent spacing, rounded corners, and neutral colors to prioritize readability.


## 🔍 Features Overview

Feature	Description
📁 Folder Creation	Create unlimited nested folders
📄 PDF Upload	Upload and view PDFs inside the browser
✏️ Rename / 🗑️ Delete	Manage files and folders inline
🔎 Global Search	Find any file by name (recursive search)
👁️ Preview Panel	Live PDF preview using URL.createObjectURL


## 🛠️ Tech Stack

React 18
TypeScript
Vite
TailwindCSS


## 🧾 License

This project is open-sourced under the MIT License.