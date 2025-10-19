import { useEffect, useState } from "react";
import { genId, loadTree, saveTree } from "./utils/storage";
import type { FolderItem, ID, NodeItem } from "./types";

function findNodeById(root: FolderItem, id: ID): { node: NodeItem | null; parent: FolderItem | null } {
  if (root.id === id) return { node: root, parent: null };
  const stack: { node: NodeItem; parent: FolderItem }[] = [];
  for (const child of root.children) stack.push({ node: child, parent: root });
  while (stack.length) {
    const { node, parent } = stack.pop()!;
    if (node.id === id) return { node, parent };
    if (node.type === "folder") {
      for (const c of node.children) stack.push({ node: c, parent: node });
    }
  }
  return { node: null, parent: null };
}

function deleteNode(root: FolderItem, id: ID): boolean {
  const { parent } = findNodeById(root, id);
  if (!parent) return false;
  parent.children = parent.children.filter((c) => c.id !== id);
  return true;
}

function addChildToFolder(root: FolderItem, folderId: ID, child: NodeItem): boolean {
  const { node } = findNodeById(root, folderId);
  if (!node || node.type !== "folder") return false;
  node.children.push(child);
  return true;
}

function renameNode(root: FolderItem, id: ID, newName: string): boolean {
  const { node } = findNodeById(root, id);
  if (!node) return false;
  node.name = newName;
  return true;
}

export function useFileTree() {
  const [tree, setTree] = useState<FolderItem>(() => loadTree());

  useEffect(() => {
    saveTree(tree);
  }, [tree]);

  return {
    tree,
    setTree,
    findNodeById,
    deleteNode,
    addChildToFolder,
    renameNode,
    genId,
  };
}
