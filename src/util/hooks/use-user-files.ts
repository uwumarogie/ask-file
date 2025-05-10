import React from "react";

export type File = {
  file_id: string;
};
export function useUserFile() {
  const [files, setFiles] = React.useState<Array<File>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const fetchFiles = React.useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    const _context = await fetch("/api/get-files");
    const response = await _context.json();

    if (response.success) {
      setFiles(response.files);
      return;
    } else {
      setFiles([]);
      setHasError(true);
      return;
    }
  }, [files]);

  React.useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, isLoading, hasError, refetch: fetchFiles };
}
