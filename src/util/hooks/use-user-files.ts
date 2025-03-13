import React from "react";
import { fetchUserFiles } from "@/actions/fetch-user-files";
export type File = {
  file_id: string;
  file_name: string;
};
export function useUserFile(userId?: string) {
  const [files, setFiles] = React.useState<Array<File>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const fetchFiles = React.useCallback(async () => {
    if (!userId) {
      setFiles([]);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    fetchUserFiles(userId)
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
  }, [userId]);

  React.useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, isLoading, hasError, refetch: fetchFiles };
}
