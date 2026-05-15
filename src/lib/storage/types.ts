export type StoragePath = string;

export type UploadImageInput = {
  file: File;
  directory: string;
  fileName: string;
};

export interface StorageProvider {
  normalizePath(path: StoragePath): StoragePath;
  getPublicUrl(path: StoragePath): string;
}

export interface WritableStorageProvider extends StorageProvider {
  uploadImage(input: UploadImageInput): Promise<StoragePath>;
}
