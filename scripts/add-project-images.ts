import { prisma } from '../src/lib/db'

async function addProjectImages() {
  try {
    console.log('🖼️ Adding placeholder images to projects...')

    // Get all projects
    const projects = await prisma.project.findMany({
      include: {
        translations: true,
        images: true
      }
    })

    // Sample placeholder images (you can replace these with real images later)
    const placeholderImages = [
      {
        originalUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        alt: 'Handcrafted wooden dining table'
      },
      {
        originalUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        alt: 'Modern kitchen cabinets'
      },
      {
        originalUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        alt: 'Custom wooden bookshelf'
      },
      {
        originalUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        alt: 'Live edge coffee table'
      }
    ]

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i]
      
      // Skip if project already has images
      if (project.images.length > 0) {
        console.log(`⏭️ Skipping ${project.translations[0]?.title} - already has images`)
        continue
      }

      // Add placeholder image
      const imageData = placeholderImages[i % placeholderImages.length]
      
      await prisma.projectImage.create({
        data: {
          projectId: project.id,
          originalUrl: imageData.originalUrl,
          thumbnailUrl: imageData.thumbnailUrl,
          alt: imageData.alt,
          order: 0
        }
      })

      console.log(`✅ Added image to: ${project.translations[0]?.title}`)
    }

    console.log('🎉 Project images added successfully!')
    console.log('📝 Note: These are placeholder images from Unsplash. Replace with actual project photos.')
    
  } catch (error) {
    console.error('❌ Error adding project images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addProjectImages()