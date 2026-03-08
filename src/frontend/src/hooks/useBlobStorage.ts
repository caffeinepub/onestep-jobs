import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback, useState } from "react";
import { loadConfig } from "../config";
import { StorageClient } from "../utils/StorageClient";

export function useBlobStorage() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const config = await loadConfig();
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const agent = await HttpAgent.create({ host: config.backend_host });
      const storageGatewayUrl =
        (import.meta.env.STORAGE_GATEWAY_URL as string | undefined) ||
        "https://blob.caffeine.ai";

      const storageClient = new StorageClient(
        "resumes",
        storageGatewayUrl,
        config.backend_canister_id,
        config.project_id,
        agent,
      );

      const { hash } = await storageClient.putFile(bytes, (pct) => {
        setUploadProgress(pct);
      });

      return hash;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const getFileUrl = useCallback(async (blobId: string): Promise<string> => {
    const config = await loadConfig();

    const agent = await HttpAgent.create({ host: config.backend_host });
    const storageGatewayUrl =
      (import.meta.env.STORAGE_GATEWAY_URL as string | undefined) ||
      "https://blob.caffeine.ai";

    const storageClient = new StorageClient(
      "resumes",
      storageGatewayUrl,
      config.backend_canister_id,
      config.project_id,
      agent,
    );

    return storageClient.getDirectURL(blobId);
  }, []);

  return { uploadFile, getFileUrl, uploadProgress, isUploading };
}
