import type { FileItem, FolderItem, ID } from "../types"

type MainDisplayPanelProps = {
  handleCreateFolder: (id: ID) => void,
  handleDeleteNode: (id: ID) => void,
  handleFileUpload: (files: FileList | null, id: ID) => void,
  handleRename: (id: ID) => void,
  handleSelectFile: (file: FileItem) => void,
  searchResults: Array<any>,
  searchTerm: string,
  selectedFolder: FolderItem,
  setSelectedFolderId: (id: ID) => void,
}

export const MainDisplayPanel: React.FC<MainDisplayPanelProps> = ({
  handleCreateFolder,
  handleDeleteNode,
  handleFileUpload,
  handleRename,
  handleSelectFile,
  searchResults,
  searchTerm,
  selectedFolder,
  setSelectedFolderId,
}: MainDisplayPanelProps) => {

  const renderSearchResults = () => {
    return <>
      <h3 className="text-lg font-bold mb-3">
        Search results for "{searchTerm}"
      </h3>
      {searchResults.length === 0 ? (
        <div className="text-gray-500">No matching files found.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {searchResults.map((file) => (
            <div key={file.id} className="p-3 border rounded flex items-center justify-between">
              <div className="truncate">
                <div className="font-medium" title={file.name}>📄 {file.name}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleSelectFile(file)} className="text-sm">View</button>
                <button onClick={() => handleRename(file.id)} className="text-sm">✏️</button>
                <button onClick={() => handleDeleteNode(file.id)} className="text-sm">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  }

  const renderUploadPdfButton = () => {
    return (
      <label className="border border-transparent rounded-md cursor-pointer text-base font-medium bg-gray-50 w-[123px] h-[43px] flex items-center justify-center hover:border-1 hover:border-indigo-500">
        <span>Upload PDF</span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files, selectedFolder.id)}
        />
      </label>
    )
  }

  const renderCreateNewFolderButton = () => {
    return (
      <button
        className="px-3 py-1 border rounded text-sm"
        onClick={() => handleCreateFolder(selectedFolder?.id)}
      >
        New Folder
      </button>
    )
  }

  const renderFolders = () => {
    return (
      selectedFolder?.children
        .filter((c) => c.type === "folder")
        .map((f) => (
          <div key={f.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">📁 {(f as FolderItem).name}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedFolderId(f.id)} className="text-sm">Open</button>
              <button onClick={() => handleRename(f.id)} className="text-sm">✏️</button>
              <button onClick={() => handleDeleteNode(f.id)} className="text-sm">🗑️</button>
            </div>
          </div>
        ))
    )
  }

  const renderFiles = () => {
    return (
      selectedFolder?.children
        .filter((c) => c.type === "file")
        .map((file) => (
          <div key={file.id} className="p-3 border rounded flex items-center justify-between">
            <div className="truncate">
              <div className="font-medium" title={`${file.name}`}>📄 {file.name}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleSelectFile(file as FileItem)} className="text-sm">View</button>
              <button onClick={() => handleRename(file.id)} className="text-sm">✏️</button>
              <button onClick={() => handleDeleteNode(file.id)} className="text-sm">🗑️</button>
            </div>
          </div>
        ))
    )
  }

  return (
    <main className="bg-white p-4 rounded-2xl flex-1 w-1/3">
      {searchTerm ? (renderSearchResults()) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{selectedFolder?.name}</h3>
            </div >
            <div className="flex items-center gap-2">
              {renderUploadPdfButton()}
              {renderCreateNewFolderButton()}
            </div>
          </div >

          <div className="mt-4 flex flex-col">
            {renderFolders()}
            {renderFiles()}
          </div>
        </>
      )}
    </main >
  )
}