import type { FolderItem } from "../types";

const STORAGE_KEY = "data-room-mvp-v1";

export const genId = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export const defaultTree: FolderItem = {
  id: "root",
  name: "Main",
  type: "folder",
  children: [],
};

export function loadTree(): FolderItem {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultTree);
    return JSON.parse(raw) as FolderItem;
  } catch {
    return structuredClone(defaultTree);
  }
}

export function saveTree(tree: FolderItem) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tree));
  }
  catch {
    console.log("error: file too large");
  }
}
