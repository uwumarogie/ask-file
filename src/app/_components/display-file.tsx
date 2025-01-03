import React from "react";
import Image from "next/image";

function extractFileType(fileType: string) {
  if (fileType.length === 0) {
    return "unknown";
  }
  if (fileType.includes("pdf")) {
    return "pdf";
  }
}

function deleteFile(fileName: string) {
  console.log(fileName);
}
export function DisplayFile({ file }: { file: File }) {
  const fileType = extractFileType(file.type);
  return (
    <div className="flex flex-col space-y-5 border-4 border-dashed border-black rounded-2xl text-black p-4">
      <div className="flex flex-row relative">
        <div className="flex flex-row space-x-3 iitems-center">
          <FileImage fileType={fileType} />
          <div className="flex flex-col space-y-5">
            <p className="font-semibold text-lg">{file.name}</p>
            <p className="text-gray-800">
              {Math.round(file.size / 1_000_000)} MB
            </p>
          </div>
        </div>
        <button
          onClick={() => deleteFile(file.name)}
          className="top-6 absolute right-0 bottom-96"
        >
          <Image
            src="/icons/delete-file-icon.svg"
            alt="Trash icon"
            width={24}
            height={24}
          />
        </button>
      </div>
      <ProgessBar />
    </div>
  );
}

function ProgessBar() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const duration = 5000;
    const intervalTime = 100;
    const increment = intervalTime / duration;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + increment;
        if (newProgress >= 1) {
          clearInterval(interval);
          return 1;
        }
        return newProgress;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center space-x-5">
      <progress
        value={progress}
        max={1}
        className="flex rounded-2xl w-96 text-black"
      />
      <span>{Math.round(progress * 100)} %</span>
    </div>
  );
}

function FileImage({ fileType }: { fileType?: string }) {
  return (
    <Image
      src={`/icons/files/${fileType}-file-icon.jpg`}
      alt="Upload file icon"
      width={100}
      height={100}
    />
  );
}
