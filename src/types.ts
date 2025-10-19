export type ID = string;

export type FileItem = {
  id: ID;
  name: string;
  type: "file";
  mime: string;
  size: number;
  dataUrl?: string;
};

export type FolderItem = {
  id: ID;
  name: string;
  type: "folder";
  children: Array<FolderItem | FileItem>;
  files?: Array<FileItem>;
};

export type NodeItem = FolderItem | FileItem;
