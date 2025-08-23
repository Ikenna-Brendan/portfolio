import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    
    // Generate a unique filename with timestamp and original extension
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `img-${timestamp}.${fileExt}`;
    
    // Define paths
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadsDir, fileName);
    const publicUrl = `/uploads/${fileName}`;
    
    try {
      // Ensure uploads directory exists
      await mkdir(uploadsDir, { recursive: true });
      
      // Write the file using Uint8Array
      await writeFile(filePath, buffer);
      
      return NextResponse.json({
        success: true,
        url: publicUrl,
        message: 'File uploaded successfully',
      });
    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json(
        { success: false, error: 'Error saving file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { success: false, error: 'Error uploading file' },
      { status: 500 }
    );
  }
}
