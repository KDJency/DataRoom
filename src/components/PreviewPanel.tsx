import React from "react";
import type { FileItem, FolderItem, ID } from "../types";

type PreviewPanelProps = {
  previewUrl: string | null;
  selectedFileId: ID | null;
  tree: FolderItem;
  findNodeById: (root: FolderItem, id: ID) => { node: FileItem | FolderItem | null; parent: FolderItem | null };
  setPreviewUrl: (url: string | null) => void;
  setSelectedFileId: (id: ID | null) => void;
};

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  previewUrl,
  selectedFileId,
  tree,
  findNodeById,
  setPreviewUrl,
  setSelectedFileId,
}: PreviewPanelProps) => {
  return (
    <div className="bg-white p-4 rounded-2xl w-1/3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Preview</h3>
        <button
          className="px-2 py-1 border rounded text-sm"
          onClick={() => {
            setPreviewUrl(null);
            setSelectedFileId(null);
          }}
        >
          Clear
        </button>
      </div>

      <div className="mt-3">
        {previewUrl ? (
          <iframe src={previewUrl} className="w-full h-[60vh] border rounded" title="pdf-preview" />
        ) : (
          <div className="text-sm text-gray-500">Select a PDF to view it here.</div>
        )}
      </div>

      <div className="mt-4 text-sm">
        {selectedFileId ? (
          (() => {
            const { node } = findNodeById(tree, selectedFileId);
            if (!node || node.type !== "file") {
              return <div className="text-gray-500">No file selected</div>;
            }

            return (
              <div>
                <div>{node.name}</div>
                <div className="text-xs text-gray-500">
                  {node.mime} • {node.size} bytes
                </div>
              </div>
            );
          })()
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
