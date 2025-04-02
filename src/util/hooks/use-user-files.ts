import React from "react";
import { fetchUserFiles } from "@/actions/fetch-user-files";
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

    fetchUserFiles()
      .then((response) => {
        setFiles(response.files);
        setHasError(response.hasError);
      })
      .catch((error) => {
        console.error(error);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [files]);

  React.useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, isLoading, hasError, refetch: fetchFiles };
}
