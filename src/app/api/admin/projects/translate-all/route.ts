import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, AuthError } from '@/lib/auth-middleware'
import { ProjectService } from '@/lib/project-service'
import { TranslationAPIService } from '@/lib/translation-api-service'
import { ContentValidator } from '@/lib/content-validation'

export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin(req)

    const { projectIds } = await req.json()

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({ error: 'Invalid project IDs' }, { status: 400 })
    }

    // Fetch all active languages
    const { prisma } = await import('@/lib/db')
    const languages = await prisma.language.findMany({
      where: { isActive: true },
      orderBy: { isDefault: 'desc' }
    })

    const defaultLang = languages.find(l => l.isDefault)
    if (!defaultLang) {
      return NextResponse.json({ error: 'No default language found' }, { status: 400 })
    }

    const targetLangs = languages
      .filter(l => !l.isDefault && l.isActive)
      .map(l => l.code)

    if (targetLangs.length === 0) {
      return NextResponse.json({ error: 'No target languages available' }, { status: 400 })
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Process each project
    for (const projectId of projectIds) {
      try {
        const project = await ProjectService.getProjectById(projectId)
        if (!project) {
          results.failed++
          results.errors.push(`Project ${projectId} not found`)
          continue
        }

        // Find default language translation
        const defaultTranslation = project.translations.find(
          t => t.languageId === defaultLang.id
        )

        if (!defaultTranslation) {
          results.failed++
          results.errors.push(`Project ${projectId} has no default language translation`)
          continue
        }

        const updates: Array<{
          languageId: string
          title: string
          description: any
          materials: string[]
        }> = []

        // Translate title
        let titleTranslations: Record<string, string> = {}
        if (defaultTranslation.title) {
          try {
            const titleResponse = await TranslationAPIService.translateText(
              defaultTranslation.title,
              defaultLang.code,
              targetLangs
            )
            titleTranslations = titleResponse
            // Add delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 250))
          } catch (error) {
            console.error(`Error translating title for project ${projectId}:`, error)
          }
        }

        // Translate description (extract plain text, translate, reconstruct)
        let descriptionTranslations: Record<string, any> = {}
        if (defaultTranslation.description) {
          try {
            const plainText = ContentValidator.extractPlainText(defaultTranslation.description as any)
            if (plainText.trim()) {
              const descResponse = await TranslationAPIService.translateText(
                plainText,
                defaultLang.code,
                targetLangs
              )

              // Reconstruct rich text for each translation
              for (const [langCode, translatedText] of Object.entries(descResponse)) {
                if (translatedText && typeof translatedText === 'string' && translatedText.trim()) {
                  // Create a simple paragraph structure with translated text
                  const lines = translatedText.split('\n').filter(line => line.trim())
                  if (lines.length > 0) {
                    descriptionTranslations[langCode] = {
                      type: 'doc',
                      content: lines.map((line: string) => ({
                        type: 'paragraph',
                        content: [{ type: 'text', text: line }]
                      }))
                    }
                  }
                }
              }
              await new Promise(resolve => setTimeout(resolve, 250))
            }
          } catch (error) {
            console.error(`Error translating description for project ${projectId}:`, error)
          }
        }

        // Translate materials (join, translate, split)
        let materialsTranslations: Record<string, string[]> = {}
        if (defaultTranslation.materials && defaultTranslation.materials.length > 0) {
          try {
            const materialsText = defaultTranslation.materials.join(', ')
            const materialsResponse = await TranslationAPIService.translateText(
              materialsText,
              defaultLang.code,
              targetLangs
            )

            for (const [langCode, translatedText] of Object.entries(materialsResponse)) {
              if (translatedText && typeof translatedText === 'string') {
                materialsTranslations[langCode] = translatedText
                  .split(',')
                  .map(m => m.trim())
                  .filter(m => m)
              }
            }
            await new Promise(resolve => setTimeout(resolve, 250))
          } catch (error) {
            console.error(`Error translating materials for project ${projectId}:`, error)
          }
        }

        // Build updates for each target language
        for (const targetLang of languages.filter(l => targetLangs.includes(l.code))) {
          const existingTranslation = project.translations.find(
            t => t.languageId === targetLang.id
          )

          updates.push({
            languageId: targetLang.id,
            title: titleTranslations[targetLang.code] || existingTranslation?.title || defaultTranslation.title,
            description: descriptionTranslations[targetLang.code] || existingTranslation?.description || defaultTranslation.description,
            materials: materialsTranslations[targetLang.code] || existingTranslation?.materials || defaultTranslation.materials
          })
        }

        // Also preserve all existing translations that aren't being updated
        const existingTranslationIds = new Set(updates.map(u => u.languageId))
        for (const existingTranslation of project.translations) {
          if (!existingTranslationIds.has(existingTranslation.languageId)) {
            updates.push({
              languageId: existingTranslation.languageId,
              title: existingTranslation.title,
              description: existingTranslation.description,
              materials: existingTranslation.materials
            })
          }
        }

        // Update project with all translations (new + existing)
        await ProjectService.updateProject(projectId, {
          translations: updates
        })

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Project ${projectId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      results: {
        total: projectIds.length,
        success: results.success,
        failed: results.failed,
        errors: results.errors
      }
    })
  } catch (error) {
    console.error('Error in bulk project translation:', error)
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to translate projects' },
      { status: 500 }
    )
  }
}

