import { createClient } from "./client"

export const BUCKET_NAME = 'event-images'

/**
 * Uploads an image file to the Supabase Storage 'event-images' bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadEventImage(file: File): Promise<string> {
    const supabase = createClient()

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        throw new Error('You must be logged in to upload an image')
    }

    // Generate a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${session.user.id}/${fileName}`

    // Upload the file
    const { error: uploadError, data } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        })

    if (uploadError) {
        console.error('Error uploading image to Supabase:', uploadError)
        throw new Error(`Failed to upload image: ${uploadError.message}`)
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path)

    return publicUrl
}
