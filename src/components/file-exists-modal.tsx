import { overwriteFileAcrossServices } from "@/actions/overwrite-file";

export function FileExistsModal({
  file,
  onClose,
  userId,
}: {
  file: File;
  onClose: () => void;
  userId: string;
}) {
  async function handleOverwrite() {
    await overwriteFileAcrossServices(file, userId);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">File Already Exists</h2>
        <p className="mb-4">
          A file with the name {file.name} already exists. Would you like to
          overwrite it?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleOverwrite}
          >
            Overwrite
          </button>
        </div>
      </div>
    </div>
  );
}
