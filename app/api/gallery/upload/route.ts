import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const category = formData.get('category') as string || 'default'
    const description = formData.get('description') as string || ''

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Create upload directories
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
    const categoryDir = path.join(uploadsDir, category)
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }
    
    if (!existsSync(categoryDir)) {
      await mkdir(categoryDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomSuffix = Math.round(Math.random() * 1e9)
    const extension = path.extname(image.name)
    const filename = `${timestamp}-${randomSuffix}${extension}`
    const filepath = path.join(categoryDir, filename)

    // Convert file to buffer and save
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return success response with file info
    const fileUrl = `/uploads/gallery/${category}/${filename}`
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
      category,
      description,
      size: image.size
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
} 