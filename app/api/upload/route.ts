import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// This route cannot be statically exported
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log('Upload request received');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    console.log('Received file:', file ? {
      name: file.name,
      type: file.type,
      size: file.size,
    } : 'No file');

    if (!file) {
      console.error('No file provided in form data');
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size, 'bytes');
      return NextResponse.json(
        { success: false, error: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }

    try {
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      
      // Generate a unique filename with timestamp and original extension
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `img-${timestamp}.${fileExt}`;
      
      // Define paths - ensure forward slashes for URLs
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      const filePath = join(uploadsDir, fileName);
      const publicUrl = `/uploads/${fileName}`;
      
      console.log('Saving file to:', filePath);
      
      try {
        // Ensure uploads directory exists
        await mkdir(uploadsDir, { recursive: true });
        console.log('Uploads directory verified/created');
        
        // Write the file using Uint8Array
        await writeFile(filePath, buffer);
        console.log('File saved successfully');
        
        return NextResponse.json({
          success: true,
          url: publicUrl,
          message: 'File uploaded successfully',
        });
      } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: `Error saving file: ${error instanceof Error ? error.message : 'Unknown error'}`,
            details: process.env.NODE_ENV === 'development' ? error : undefined
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Error processing file:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: process.env.NODE_ENV === 'development' ? error : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling upload request:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Error handling upload: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
