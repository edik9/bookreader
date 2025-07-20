import { storage } from "./firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  type UploadTaskSnapshot,
  StorageError,
  deleteObject
} from "firebase/storage"

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

export interface UploadResult {
  url: string
  path: string
  metadata: {
    size: number
    contentType: string
  }
}

export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Недопустимый тип файла: ${file.type}`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Файл слишком большой. Максимальный размер: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  const storageRef = ref(storage, path)
  const uploadTask = uploadBytesResumable(storageRef, file)
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(Math.round(progress))
      }, 
      (error: StorageError) => {
        console.error('Upload error:', error)
        reject(new Error(`Ошибка загрузки: ${error.message}`))
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve({
            url: downloadURL,
            path: uploadTask.snapshot.ref.fullPath,
            metadata: {
              size: file.size,
              contentType: file.type
            }
          })
        } catch (error) {
          console.error('Error getting download URL:', error)
          reject(new Error('Не удалось получить ссылку на файл'))
        }
      }
    )
  })
}

export async function deleteFile(path: string): Promise<void> {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
  } catch (error) {
    console.error(`Error getting file URL ${path}:`, error);
    throw error;
  }
}