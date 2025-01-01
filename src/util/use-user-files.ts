import React from "react";
import { getFilesFromUser } from "@/actions/get-files-from-user";
export type File = {
  file_id: string;
  file_name: string;
};
export function useUserFile(userId?: string) {
  const [files, setFiles] = React.useState<Array<File>>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (!userId) {
      setFiles([]);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    getFilesFromUser(userId)
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

  console.log(files);

  return { files, isLoading, hasError };
}
