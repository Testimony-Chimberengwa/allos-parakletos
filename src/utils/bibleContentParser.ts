export interface ParsedBibleVerse {
  id: string
  number: string
  text: string
}

export interface ParsedBibleContent {
  heading: string | null
  verses: ParsedBibleVerse[]
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function parseBibleChapterContent(html: string): ParsedBibleContent {
  const parser = new DOMParser()
  const documentNode = parser.parseFromString(`<div>${html}</div>`, 'text/html')
  const container = documentNode.body.firstElementChild

  if (!container) {
    return { heading: null, verses: [] }
  }

  const verseMap = new Map<string, ParsedBibleVerse>()
  const verseOrder: string[] = []
  let heading: string | null = null
  let currentVerseId: string | null = null

  const ensureVerse = (verseId: string, number?: string) => {
    if (!verseMap.has(verseId)) {
      verseMap.set(verseId, {
        id: verseId,
        number: number || '',
        text: '',
      })
      verseOrder.push(verseId)
    }

    const verse = verseMap.get(verseId)
    if (verse && number && !verse.number) {
      verse.number = number
    }

    currentVerseId = verseId
    return verse
  }

  const appendText = (verseId: string, text: string) => {
    const verse = ensureVerse(verseId)

    if (!verse) {
      return
    }

    const normalized = normalizeText(text)
    if (!normalized) {
      return
    }

    verse.text = verse.text ? `${verse.text} ${normalized}` : normalized
  }

  const paragraphNodes = Array.from(container.querySelectorAll('p'))

  for (const paragraph of paragraphNodes) {
    if (!heading && paragraph.classList.contains('s1')) {
      heading = normalizeText(paragraph.textContent || '')
      continue
    }

    const paragraphText = normalizeText(paragraph.textContent || '')
    if (!paragraphText) {
      continue
    }

    const childNodes = Array.from(paragraph.childNodes)
    let sawVerseMarker = false

    for (const childNode of childNodes) {
      if (childNode.nodeType === Node.TEXT_NODE) {
        const text = normalizeText(childNode.textContent || '')
        if (text && currentVerseId) {
          appendText(currentVerseId, text)
        }
        continue
      }

      if (childNode.nodeType !== Node.ELEMENT_NODE) {
        continue
      }

      const element = childNode as HTMLElement
      const verseId = element.getAttribute('data-verse-id')
      const verseNumberElement = element.querySelector('[data-number]')
      const verseNumber = normalizeText(verseNumberElement?.textContent || '')
      const text = normalizeText(element.textContent || '')

      if (verseId && verseNumber) {
        ensureVerse(verseId, verseNumber)
        sawVerseMarker = true
        continue
      }

      if (verseId && text) {
        appendText(verseId, text)
        sawVerseMarker = true
        continue
      }

      if (text && currentVerseId) {
        appendText(currentVerseId, text)
        sawVerseMarker = true
      }
    }

    if (!sawVerseMarker && currentVerseId) {
      appendText(currentVerseId, paragraphText)
    }
  }

  return {
    heading,
    verses: verseOrder
      .map((verseId) => verseMap.get(verseId))
      .filter((verse): verse is ParsedBibleVerse => Boolean(verse)),
  }
}