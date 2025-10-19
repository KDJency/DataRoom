import React from "react";
import type { FolderItem, ID } from "../types";

type FolderTreeProps = {
  node: FolderItem;
  depth?: number;
  expandedFolders: Set<ID>;
  toggleFolder: (id: ID) => void;
  selectedFolderId: ID;
  setSelectedFolderId: (id: ID) => void;
  handleCreateFolder: (parentId: ID) => void;
  handleRename: (id: ID) => void;
  handleDeleteNode: (id: ID) => void;
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  node,
  depth = 0,
  expandedFolders,
  toggleFolder,
  selectedFolderId,
  setSelectedFolderId,
  handleCreateFolder,
  handleRename,
  handleDeleteNode,
}: FolderTreeProps) => {
  const isExpanded = expandedFolders.has(node.id);

  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <div className="flex items-center gap-2">
        <button onClick={() => toggleFolder(node.id)} className="text-xs">
          {isExpanded ? "▼" : "▶"}
        </button>
        <button
          className={`text-sm font-semibold ${selectedFolderId === node.id ? "text-blue-600" : ""}`}
          onClick={() => setSelectedFolderId(node.id)}
        >
          📁 {node.name}
        </button>
        <div className="flex gap-1">
          <button className="text-xs" onClick={() => handleCreateFolder(node.id)} title="New folder">➕</button>
          {node.id !== "root" && (
            <>
              <button className="text-xs" onClick={() => handleRename(node.id)} title="Rename">✏️</button>
              <button className="text-xs" onClick={() => handleDeleteNode(node.id)} title="Delete">🗑️</button>
            </>
          )}
        </div>
      </div>
      {isExpanded && (
        <div>
          {node.children
            .filter((c) => c.type === "folder")
            .map((f) => (
              <FolderTree
                key={f.id}
                node={f as FolderItem}
                depth={depth + 1}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                selectedFolderId={selectedFolderId}
                setSelectedFolderId={setSelectedFolderId}
                handleCreateFolder={handleCreateFolder}
                handleRename={handleRename}
                handleDeleteNode={handleDeleteNode}
              />
            ))}
        </div>
      )}
    </div>
  );
}
