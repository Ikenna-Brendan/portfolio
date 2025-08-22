import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export async function POST(request: Request) {
  try {
    // Configure Cloudinary if in production
    if (process.env.NODE_ENV === 'production') {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl: string;

    if (process.env.NODE_ENV === 'production') {
      // Upload to Cloudinary in production
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio' },
          (error: Error | undefined, result: UploadApiResponse | undefined) => {
            if (error) reject(error);
            else if (!result) reject(new Error('No result from Cloudinary'));
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      publicUrl = result.secure_url;
    } else {
      // Save locally in development
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const fileExtension = file.name.split('.').pop();
      const fileName = `${randomUUID()}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);

await writeFile(filePath, new Uint8Array(buffer));
      publicUrl = `/uploads/${fileName}`;
    }
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
