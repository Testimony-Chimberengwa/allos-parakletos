import axios from 'axios'
import type { BibleVersion, Book, Chapter, Verse } from '../types'

const API_BASE_URL = import.meta.env.VITE_BIBLE_API_BASE_URL
const API_KEY = import.meta.env.VITE_BIBLE_API_KEY
const FREE_BIBLE_API_BASE_URL = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles'

// Known IDs confirmed for this API key: AMP, KJV, NLT
const PREFERRED_VERSION_IDS = [
  'd6e14a625393b4da-01', // NLT
  'de4e12af7f28f599-01', // KJV
  'de4e12af7f28f599-02', // KJV alt
  'a81b73293d3080c9-01', // AMP
]

const PREFERRED_ABBREVIATIONS = ['NLT', 'KJV', 'AMP', 'ENGKJV', 'KJVA', 'NLTCE', 'NLTUK']

function normalizeAbbreviation(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toUpperCase()
}

function isPreferredVersion(version: BibleVersion): boolean {
  const normalizedAbbreviation = normalizeAbbreviation(version.abbreviation)
  const normalizedName = version.name.toUpperCase()

  return (
    PREFERRED_VERSION_IDS.includes(version.id) ||
    PREFERRED_ABBREVIATIONS.includes(normalizedAbbreviation) ||
    normalizedName.includes('KING JAMES') ||
    normalizedName.includes('NEW LIVING') ||
    normalizedName.includes('AMPLIFIED')
  )
}

function sortVersionsForReading(versions: BibleVersion[]): BibleVersion[] {
  return [...versions].sort((a, b) => {
    const aIdIndex = PREFERRED_VERSION_IDS.indexOf(a.id)
    const bIdIndex = PREFERRED_VERSION_IDS.indexOf(b.id)

    if (aIdIndex !== -1 || bIdIndex !== -1) {
      if (aIdIndex === -1) return 1
      if (bIdIndex === -1) return -1
      return aIdIndex - bIdIndex
    }

    const aPreferred = isPreferredVersion(a)
    const bPreferred = isPreferredVersion(b)

    if (aPreferred !== bPreferred) {
      return aPreferred ? -1 : 1
    }

    return a.name.localeCompare(b.name)
  })
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getFreeFallbackVersion(versionAbbreviation: string): string {
  const normalized = normalizeAbbreviation(versionAbbreviation)

  if (normalized.includes('KJV')) return 'en-kjv'
  if (normalized.includes('ASV')) return 'en-asv'

  // Fallback for NLT/AMP and other unavailable copyrighted versions.
  return 'en-web'
}

function toFreeBookSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function toChapterNumber(chapterId: string): string | null {
  const candidate = chapterId.split('.').pop() || ''
  return /^\d+$/.test(candidate) ? candidate : null
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'api-key': API_KEY,
  },
})

export const bibleService = {
  // Get all Bible versions
  async getVersions(): Promise<BibleVersion[]> {
    try {
      const response = await apiClient.get('/v1/bibles')
      return sortVersionsForReading(response.data.data)
    } catch (error) {
      console.error('Error fetching Bible versions:', error)
      throw error
    }
  },

  // Get reading-priority versions (NLT, KJV, AMP) for this key
  async getPreferredVersions(): Promise<BibleVersion[]> {
    const versions = await this.getVersions()
    const preferred = versions.filter(isPreferredVersion)
    return preferred.length > 0 ? preferred : versions
  },

  // Get specific Bible version
  async getVersion(bibleId: string): Promise<BibleVersion> {
    try {
      const response = await apiClient.get(`/v1/bibles/${bibleId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching Bible version:', error)
      throw error
    }
  },

  // Get books for a specific Bible version
  async getBooks(bibleId: string): Promise<Book[]> {
    try {
      const response = await apiClient.get(`/v1/bibles/${bibleId}/books`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  },

  // Get chapters for a book
  async getChapters(bibleId: string, bookId: string): Promise<Chapter[]> {
    try {
      const response = await apiClient.get(`/v1/bibles/${bibleId}/books/${bookId}/chapters`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching chapters:', error)
      throw error
    }
  },

  // Get verses for a chapter
  async getVerses(bibleId: string, chapterId: string): Promise<Verse[]> {
    try {
      const response = await apiClient.get(`/v1/bibles/${bibleId}/chapters/${chapterId}/verses`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching verses:', error)
      throw error
    }
  },

  // Get chapter content with verses
  async getChapterContent(
    bibleId: string,
    chapterId: string,
    options?: { includeVerseNumbers?: boolean; includeVerseSpans?: boolean }
  ): Promise<Chapter> {
    try {
      const params = new URLSearchParams()
      if (options?.includeVerseNumbers) params.append('include-verse-numbers', 'true')
      if (options?.includeVerseSpans) params.append('include-verse-spans', 'true')
      
      const response = await apiClient.get(
        `/v1/bibles/${bibleId}/chapters/${chapterId}?${params.toString()}`
      )
      return response.data.data
    } catch (error) {
      console.error('Error fetching chapter content:', error)
      throw error
    }
  },

  async getChapterContentWithFallback(input: {
    bibleId: string
    chapterId: string
    versionAbbreviation: string
    bookName: string
    options?: { includeVerseNumbers?: boolean; includeVerseSpans?: boolean }
  }): Promise<{ chapter: Chapter; source: 'primary' | 'fallback' }> {
    try {
      const chapter = await this.getChapterContent(input.bibleId, input.chapterId, input.options)
      return { chapter, source: 'primary' }
    } catch (primaryError) {
      const chapterNumber = toChapterNumber(input.chapterId)
      if (!chapterNumber) {
        throw primaryError
      }

      const fallbackVersion = getFreeFallbackVersion(input.versionAbbreviation)
      const bookSlug = toFreeBookSlug(input.bookName)
      const fallbackUrl = `${FREE_BIBLE_API_BASE_URL}/${fallbackVersion}/books/${bookSlug}/chapters/${chapterNumber}.json`

      try {
        const fallbackResponse = await axios.get(fallbackUrl)
        const fallbackVerses = fallbackResponse.data?.data as Array<{
          verse: string
          text: string
        }>

        if (!Array.isArray(fallbackVerses) || fallbackVerses.length === 0) {
          throw new Error('Fallback chapter response did not contain verses.')
        }

        const fallbackHtml = fallbackVerses
          .map((verse) => {
            const number = escapeHtml(String(verse.verse || ''))
            const text = escapeHtml(String(verse.text || ''))
            return `<p class="pm"><span class="verse-span" data-verse-id="${bookSlug}.${chapterNumber}.${number}"><span data-number="${number}" class="v">${number}</span></span><span class="verse-span" data-verse-id="${bookSlug}.${chapterNumber}.${number}">${text}</span></p>`
          })
          .join('')

        return {
          chapter: {
            id: input.chapterId,
            bibleId: input.bibleId,
            number: chapterNumber,
            bookId: input.bookName,
            content: fallbackHtml,
          },
          source: 'fallback',
        }
      } catch (fallbackError) {
        console.error('Fallback chapter fetch failed:', fallbackError)
        throw primaryError
      }
    }
  },

  // Search verses
  async searchVerses(
    bibleId: string,
    query: string,
    limit: number = 10
  ): Promise<Verse[]> {
    try {
      const response = await apiClient.get(`/v1/bibles/${bibleId}/search`, {
        params: {
          query,
          limit,
        },
      })
      return response.data.data
    } catch (error) {
      console.error('Error searching verses:', error)
      throw error
    }
  },

  // Get specific verse
  async getVerse(bibleId: string, verseId: string): Promise<Verse> {
    try {
      const response = await apiClient.get(`/v1/bibles/${bibleId}/verses/${verseId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching verse:', error)
      throw error
    }
  },
}
