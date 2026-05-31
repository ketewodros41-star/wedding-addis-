import { supabase } from './supabase';

/**
 * Uploads a file to Supabase Storage in the 'wedding-media' bucket.
 * @param file The file to upload
 * @param path The path within the bucket (e.g., 'invitations/my-slug.png')
 */
export async function uploadMedia(file: File, path: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${path}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('wedding-media')
        .upload(filePath, file, {
            upsert: true,
            contentType: file.type
        });

    if (error) {
        throw error;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('wedding-media')
        .getPublicUrl(filePath);

    return publicUrl;
}

/**
 * Deletes a file from Supabase Storage.
 * @param url The public URL of the file to delete
 */
export async function deleteMedia(url: string) {
    try {
        const path = url.split('/storage/v1/object/public/wedding-media/')[1];
        if (!path) return;

        const { error } = await supabase.storage
            .from('wedding-media')
            .remove([path]);

        if (error) throw error;
    } catch (err) {
        console.error('Error deleting media:', err);
    }
}
