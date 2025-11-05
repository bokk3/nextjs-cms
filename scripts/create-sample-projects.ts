import { prisma } from '../src/lib/db'

async function createSampleProjects() {
  try {
    console.log('🎨 Creating sample featured projects...')

    // Get the default language and content type
    const defaultLanguage = await prisma.language.findFirst({
      where: { isDefault: true }
    })

    const contentType = await prisma.contentType.findFirst({
      where: { name: 'projects' }
    })

    if (!defaultLanguage || !contentType) {
      console.error('❌ Default language or content type not found')
      return
    }

    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { 
        userRole: { 
          role: 'admin' 
        } 
      }
    })

    if (!adminUser) {
      console.error('❌ Admin user not found')
      return
    }

    // Sample projects data
    const sampleProjects = [
      {
        title: 'Handcrafted Oak Dining Table',
        description: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'A stunning solid oak dining table crafted from sustainably sourced timber. Features hand-carved details and a natural oil finish that highlights the beautiful grain patterns. Seats 8 comfortably and built to last generations.'
                }
              ]
            }
          ]
        },
        materials: ['Solid Oak', 'Natural Oil Finish', 'Hand-forged Hardware']
      },
      {
        title: 'Custom Kitchen Cabinets',
        description: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Bespoke kitchen cabinetry designed to maximize space and functionality. Featuring soft-close drawers, hidden storage solutions, and a timeless shaker-style design in painted hardwood.'
                }
              ]
            }
          ]
        },
        materials: ['Painted Hardwood', 'Soft-close Hardware', 'Quartz Countertops']
      },
      {
        title: 'Artisan Bookshelf',
        description: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Floor-to-ceiling bookshelf with adjustable shelving and integrated lighting. Crafted from reclaimed walnut with traditional joinery techniques for a piece that\'s both functional and beautiful.'
                }
              ]
            }
          ]
        },
        materials: ['Reclaimed Walnut', 'LED Strip Lighting', 'Brass Accents']
      },
      {
        title: 'Live Edge Coffee Table',
        description: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Unique live edge coffee table showcasing the natural beauty of the wood. Each piece is one-of-a-kind, featuring the organic edge of the tree and supported by sleek steel legs.'
                }
              ]
            }
          ]
        },
        materials: ['Live Edge Maple', 'Steel Base', 'Protective Finish']
      }
    ]

    // Create the projects
    for (const projectData of sampleProjects) {
      const project = await prisma.project.create({
        data: {
          contentTypeId: contentType.id,
          featured: true,
          published: true,
          createdBy: adminUser.id,
          translations: {
            create: {
              languageId: defaultLanguage.id,
              title: projectData.title,
              description: projectData.description,
              materials: projectData.materials
            }
          }
        }
      })

      console.log(`✅ Created project: ${projectData.title}`)
    }

    console.log('🎉 Sample projects created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating sample projects:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleProjects()