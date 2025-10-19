import { useMemo, useState } from "react";
import { FolderTree } from "./components/FolderTree";
import { MainDisplayPanel } from "./components/MainDisplayPanel";
import { PreviewPanel } from "./components/PreviewPanel";
import { SearchBar } from "./components/SearchBar";
import { useFileTree } from "./hooks";
import type { FileItem, FolderItem, ID, NodeItem } from "./types";

export default function DataRoomMVP() {
  const { tree, setTree, findNodeById, deleteNode, addChildToFolder, renameNode, genId } = useFileTree();
  const [expandedFolders, setExpandedFolders] = useState<Set<ID>>(new Set(["root"]));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFileId, setSelectedFileId] = useState<ID | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<ID>(tree.id);

  function findMatchingFiles(node: NodeItem, term: string): FileItem[] {
    if (node.type === "file") {
      return node.name.toLowerCase().includes(term.toLowerCase()) ? [node] : [];
    }
    return node.children.flatMap((child) => findMatchingFiles(child, term));
  }

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return findMatchingFiles(tree, searchTerm);
  }, [searchTerm, tree]);

  const selectedFolder = useMemo(() => {
    const { node } = findNodeById(tree, selectedFolderId);
    return node && node.type === "folder" ? node : tree;
  }, [tree, selectedFolderId, findNodeById]);

  function toggleFolder(id: ID) {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  async function handleFileUpload(files: FileList | null, targetFolderId: ID) {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/pdf") {
      alert("Only PDF files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const fileItem: FileItem = {
        id: genId("file"),
        name: file.name,
        type: "file",
        mime: file.type,
        size: file.size,
        dataUrl,
      };
      const copy = structuredClone(tree);
      addChildToFolder(copy, targetFolderId, fileItem);
      setTree(copy);
      setSelectedFileId(fileItem.id);
      const blob = new Blob([file], { type: file.type });
      setPreviewUrl(URL.createObjectURL(blob));
    };
    reader.readAsDataURL(file);
  }

  function handleCreateFolder(parentId: ID) {
    const name = prompt("Folder name", "New folder");
    if (!name) return;

    const newFolder: FolderItem = { id: genId("folder"), name, type: "folder", children: [] };
    const copy = structuredClone(tree);

    addChildToFolder(copy, parentId, newFolder);
    setTree(copy);
    setExpandedFolders((prev) => new Set(prev).add(parentId));
  }

  function handleDeleteNode(id: ID) {
    if (!confirm("Are you sure you want to delete this and its contents?")) return;

    const copy = structuredClone(tree);
    deleteNode(copy, id);
    setTree(copy);
    setPreviewUrl(null);
    setSelectedFileId(null);
    // if deleting the currently selected folder, reset selection to root
    if (selectedFolderId === id) setSelectedFolderId(tree.id);
  }

  function handleRename(id: ID) {
    const { node } = findNodeById(tree, id);
    if (!node) return;

    const newName = prompt("New name", node.name);
    if (!newName) return;

    const copy = structuredClone(tree);
    renameNode(copy, id, newName);
    setTree(copy);
  }

  function handleSelectFile(file: FileItem) {
    setSelectedFileId(file.id);
    if (!file.dataUrl) return setPreviewUrl(null);

    const arr = file.dataUrl.split(",");
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);

    const blob = new Blob([u8arr], { type: file.mime });
    setPreviewUrl(URL.createObjectURL(blob));
  }

  return (
    <div className="h-screen w-full p-4 bg-gray-50">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex justify-between gap-4">
        {/* LEFT: Folder tree */}
        <div className="bg-white p-4 rounded-2xl w-1/3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Folders</h3>
            <button
              className="text-sm px-2 py-1 border rounded"
              onClick={() => handleCreateFolder(selectedFolderId)}
            >
              New
            </button>
          </div>

          <FolderTree
            expandedFolders={expandedFolders}
            handleCreateFolder={handleCreateFolder}
            handleDeleteNode={handleDeleteNode}
            handleRename={handleRename}
            node={tree}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
            toggleFolder={toggleFolder}
          />
        </div>

        {/* MAIN */}
        <MainDisplayPanel
          handleCreateFolder={handleCreateFolder}
          handleDeleteNode={handleDeleteNode}
          handleFileUpload={handleFileUpload}
          handleRename={handleRename}
          handleSelectFile={handleSelectFile}
          searchResults={searchResults}
          searchTerm={searchTerm}
          selectedFolder={selectedFolder}
          setSelectedFolderId={setSelectedFolderId}
        />

        {/* RIGHT: Preview */}
        <PreviewPanel
          findNodeById={findNodeById}
          previewUrl={previewUrl}
          selectedFileId={selectedFileId}
          setPreviewUrl={setPreviewUrl}
          setSelectedFileId={setSelectedFileId}
          tree={tree}
        />
      </div>
    </div>
  );
}
