import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-middleware'
import { prisma } from '@/lib/db'
import { TranslationService } from '@/lib/translation-service'

/**
 * GET /api/admin/languages - Get all languages (admin only, includes inactive)
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const languages = await prisma.language.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { isActive: 'desc' },
        { code: 'asc' }
      ]
    })

    // Get translation coverage for each language
    const languagesWithCoverage = await Promise.all(
      languages.map(async (lang) => {
        const coverage = await TranslationService.getTranslationCoverage(lang.code)
        return {
          ...lang,
          coverage
        }
      })
    )

    return NextResponse.json(languagesWithCoverage)
  } catch (error: any) {
    console.error('Error fetching languages:', error)
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/languages - Create a new language (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const { code, name, isDefault, isActive } = body

    if (!code || !name) {
      return NextResponse.json(
        { error: 'Code and name are required' },
        { status: 400 }
      )
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.language.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      })
    }

    const language = await prisma.language.create({
      data: {
        code,
        name,
        isDefault: isDefault || false,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(language)
  } catch (error: any) {
    console.error('Error creating language:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Language code already exists' },
        { status: 409 }
      )
    }
    if (error.status === 401 || error.status === 403) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: error.status }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create language' },
      { status: 500 }
    )
  }
}


