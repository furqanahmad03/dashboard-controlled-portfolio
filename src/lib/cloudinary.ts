import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "ml_default") // You can create a custom upload preset
  formData.append("folder", process.env.CLOUDINARY_FOLDER || "nextjs-app") // Folder from env

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  const data = await response.json()
  return data.secure_url
}

export const deleteImage = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId)
} 

// Helper function to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
    const urlParts = url.split('/')
    const uploadIndex = urlParts.findIndex(part => part === 'upload')
    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      // Skip version number and get the path after upload
      const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/')
      // Remove file extension
      const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '')
      return publicId
    }
    return null
  } catch (error) {
    console.error('Error extracting public ID from URL:', error)
    return null
  }
} 

export const uploadToCloudinary = async (buffer: Buffer, folder: string = "general"): Promise<{ url: string; publicId: string }> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${process.env.CLOUDINARY_FOLDER || "portfolio"}/${folder}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve({
            url: result!.secure_url,
            publicId: result!.public_id
          })
        }
      }
    )

    stream.end(buffer)
  })
}

// Comprehensive helper function for managing Cloudinary images
export interface CloudinaryImageData {
  url: string
  publicId: string
}

export interface CloudinaryOptions {
  folder?: string
  resourceType?: 'image' | 'video' | 'auto'
  transformation?: string
  overwrite?: boolean
}

/**
 * Uploads a file to Cloudinary and returns URL and public ID
 * @param file - File to upload (File, Buffer, or base64 string)
 * @param options - Upload options
 * @returns Promise<CloudinaryImageData>
 */
export const uploadFileToCloudinary = async (
  file: File | Buffer | string,
  options: CloudinaryOptions = {}
): Promise<CloudinaryImageData> => {
  try {
    const {
      folder = "general"
    } = options

    let buffer: Buffer

    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else if (typeof file === 'string') {
      // Handle base64 string
      if (file.startsWith('data:')) {
        const base64Data = file.split(',')[1]
        buffer = Buffer.from(base64Data, 'base64')
      } else {
        throw new Error('Invalid file format')
      }
    } else {
      buffer = file
    }

    const uploadResult = await uploadToCloudinary(buffer, folder)
    
    console.log(`✅ File uploaded to Cloudinary: ${uploadResult.publicId}`)
    return uploadResult
  } catch (error) {
    console.error('❌ Error uploading file to Cloudinary:', error)
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Deletes an image from Cloudinary using public ID or URL
 * @param identifier - Public ID or URL
 * @returns Promise<boolean> - true if successful
 */
export const deleteFileFromCloudinary = async (identifier: string): Promise<boolean> => {
  try {
    let publicId: string

    if (identifier.startsWith('http')) {
      // Extract public ID from URL
      const extractedId = extractPublicIdFromUrl(identifier)
      if (!extractedId) {
        console.warn('⚠️ Could not extract public ID from URL:', identifier)
        return false
      }
      else {
        publicId = extractedId
      }
    } else {
      // Use as public ID directly
      publicId = identifier
    }

    const result = await deleteImage(publicId)
    
    if (result.result === 'ok') {
      console.log(`✅ File deleted from Cloudinary: ${publicId}`)
      return true
    } else {
      console.warn('⚠️ Cloudinary deletion result:', result)
      return false
    }
  } catch (error) {
    console.error('❌ Error deleting file from Cloudinary:', error)
    return false
  }
}

/**
 * Replaces an image in Cloudinary (delete old + upload new)
 * @param newFile - New file to upload
 * @param oldIdentifier - Old image public ID or URL to delete
 * @param options - Upload options
 * @returns Promise<CloudinaryImageData>
 */
export const replaceFileInCloudinary = async (
  newFile: File | Buffer | string,
  oldIdentifier: string,
  options: CloudinaryOptions = {}
): Promise<CloudinaryImageData> => {
  try {
    // Delete old file first
    if (oldIdentifier) {
      await deleteFileFromCloudinary(oldIdentifier)
    }

    // Upload new file
    const uploadResult = await uploadFileToCloudinary(newFile, options)
    
    console.log(`✅ File replaced in Cloudinary: ${uploadResult.publicId}`)
    return uploadResult
  } catch (error) {
    console.error('❌ Error deleting file from Cloudinary:', error)
    throw new Error(`Failed to replace file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Batch delete multiple files from Cloudinary
 * @param identifiers - Array of public IDs or URLs
 * @returns Promise<{ success: string[], failed: string[] }>
 */
export const batchDeleteFromCloudinary = async (
  identifiers: string[]
): Promise<{ success: string[], failed: string[] }> => {
  const results = { success: [] as string[], failed: [] as string[] }

  for (const identifier of identifiers) {
    try {
      const success = await deleteFileFromCloudinary(identifier)
      if (success) {
        results.success.push(identifier)
      } else {
        results.failed.push(identifier)
      }
    } catch (error) {
      console.error(`❌ Error deleting ${identifier}:`, error)
      results.failed.push(identifier)
    }
  }

  console.log(`📊 Batch delete completed: ${results.success.length} successful, ${results.failed.length} failed`)
  return results
} 