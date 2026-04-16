import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  FileType,
  Presentation,
  File,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceUploaderProps {
  onUpload: (file: File) => Promise<any>;
  isUploading?: boolean;
  className?: string;
}

const ACCEPTED_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "text/plain": [".txt"],
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.toLowerCase().split(".").pop();
  switch (ext) {
    case "pdf":
      return <FileText className="h-8 w-8 text-red-500" />;
    case "docx":
      return <FileType className="h-8 w-8 text-blue-500" />;
    case "pptx":
      return <Presentation className="h-8 w-8 text-orange-500" />;
    case "txt":
      return <File className="h-8 w-8 text-gray-500" />;
    default:
      return <File className="h-8 w-8 text-gray-500" />;
  }
};

export function SourceUploader({ onUpload, isUploading, className }: SourceUploaderProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploadedFile(file);
      setUploadStatus("uploading");
      setErrorMessage("");

      try {
        await onUpload(file);
        setUploadStatus("success");
        setTimeout(() => {
          setUploadStatus("idle");
          setUploadedFile(null);
        }, 2000);
      } catch (error: any) {
        setUploadStatus("error");
        setErrorMessage(error.message || "Upload failed");
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled: isUploading || uploadStatus === "uploading",
  });

  return (
    <Card className={cn("border-2 border-dashed transition-colors", className, {
      "border-primary bg-primary/5": isDragActive,
      "border-muted-foreground/25 hover:border-primary/50": !isDragActive && uploadStatus === "idle",
      "border-green-500 bg-green-50 dark:bg-green-950/20": uploadStatus === "success",
      "border-red-500 bg-red-50 dark:bg-red-950/20": uploadStatus === "error",
    })}>
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className="flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[200px]"
        >
          <input {...getInputProps()} />

          {uploadStatus === "idle" && !isDragActive && (
            <>
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports PDF, DOCX, PPTX, and TXT files
                </p>
              </div>
              <Button variant="outline" className="mt-2">
                Browse Files
              </Button>
            </>
          )}

          {isDragActive && (
            <>
              <div className="p-4 rounded-full bg-primary/20 animate-pulse">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-medium text-primary">Drop your file here</p>
            </>
          )}

          {uploadStatus === "uploading" && uploadedFile && (
            <>
              <div className="flex items-center gap-3">
                {getFileIcon(uploadedFile.name)}
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="w-full max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm">Parsing document...</span>
                </div>
                <Progress value={undefined} className="h-2" />
              </div>
            </>
          )}

          {uploadStatus === "success" && uploadedFile && (
            <>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">Upload complete!</p>
                  <p className="text-sm text-muted-foreground">{uploadedFile.name}</p>
                </div>
              </div>
            </>
          )}

          {uploadStatus === "error" && (
            <>
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="font-medium text-red-700 dark:text-red-400">Upload failed</p>
                  <p className="text-sm text-muted-foreground">{errorMessage}</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setUploadStatus("idle")}>
                Try Again
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
