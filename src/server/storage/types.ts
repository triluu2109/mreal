export type StoragePath = string;

export type UploadImageInput = {
  file: File;
  /** Thư mục relative, ví dụ: "listings/rent/RENT-001" */
  directory: string;
  fileName: string;
};

export interface StorageProvider {
  /** Normalize path thành relative (không có leading slash, không có domain) */
  normalizePath(path: StoragePath): StoragePath;
  /** Trả về URL công khai để trình duyệt tải ảnh */
  getPublicUrl(path: StoragePath): string;
}

export interface WritableStorageProvider extends StorageProvider {
  uploadImage(input: UploadImageInput): Promise<StoragePath>;
  /** Xóa file khỏi storage (optional — local provider có thể bỏ qua) */
  deleteFile?(path: StoragePath): Promise<void>;
}
