import { useEffect, useMemo, useState } from 'react'
import { bibleService } from '../services/bibleService'
import { useAppStore } from '../store'
import { Card, VerseDisplay } from '../components'
import type { Book, Chapter } from '../types'
import { parseBibleChapterContent } from '../utils/bibleContentParser'

function normalizeSearch(value: string) {
  return value.trim().toLowerCase()
}

function formatChapterNumber(value: string | number) {
  return String(value).toUpperCase()
}

function BibleReader() {
  const { bibleVersions, selectedBibleVersion, setBibleVersions, setSelectedBibleVersion } = useAppStore()
  const [books, setBooks] = useState<Book[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedChapterId, setSelectedChapterId] = useState<string>('')
  const [chapterContent, setChapterContent] = useState<string>('')
  const [loadingBooks, setLoadingBooks] = useState(false)
  const [loadingChapter, setLoadingChapter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [readerError, setReaderError] = useState<string | null>(null)
  const [chapterSource, setChapterSource] = useState<'primary' | 'fallback' | null>(null)

  useEffect(() => {
    if (bibleVersions.length === 0) {
      bibleService
        .getPreferredVersions()
        .then((versions) => {
          setBibleVersions(versions)
          if (!selectedBibleVersion && versions.length > 0) {
            setSelectedBibleVersion(versions[0])
          }
        })
        .catch((error) => {
          console.error('Error loading Bible versions:', error)
          setReaderError('Unable to load Bible versions from the API.')
        })
    }
  }, [bibleVersions.length, selectedBibleVersion, setBibleVersions, setSelectedBibleVersion])

  useEffect(() => {
    if (!selectedBibleVersion) {
      return
    }

    let isActive = true

    setLoadingBooks(true)
    setSelectedBook(null)
    setChapters([])
    setSelectedChapterId('')
    setChapterContent('')
    setReaderError(null)

    bibleService
      .getBooks(selectedBibleVersion.id)
      .then((booksData) => {
        if (isActive) {
          setBooks(booksData)
        }
      })
      .catch((error) => {
        console.error('Error loading books:', error)
        if (isActive) {
          setReaderError('Unable to load books for this Bible version.')
        }
      })
      .finally(() => {
        if (isActive) {
          setLoadingBooks(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [selectedBibleVersion])

  const filteredBooks = useMemo(() => {
    const query = normalizeSearch(searchQuery)
    if (!query) {
      return books
    }

    return books.filter((book) => {
      return (
        normalizeSearch(book.name).includes(query) ||
        normalizeSearch(book.abbreviation).includes(query) ||
        normalizeSearch(book.nameLong).includes(query)
      )
    })
  }, [books, searchQuery])

  const parsedChapterContent = useMemo(() => parseBibleChapterContent(chapterContent), [chapterContent])

  const selectedChapter = useMemo(() => {
    return chapters.find((chapter) => chapter.id === selectedChapterId) || null
  }, [chapters, selectedChapterId])

  const selectedBibleVersionLabel = selectedBibleVersion
    ? `${selectedBibleVersion.abbreviation} - ${selectedBibleVersion.name}`
    : 'Select a Bible version'

  const handleVersionChange = (versionId: string) => {
    const version = bibleVersions.find((item) => item.id === versionId)
    if (version) {
      setSelectedBibleVersion(version)
    }
  }

  const loadChapter = async (chapterId: string) => {
    if (!selectedBibleVersion) {
      return
    }

    setSelectedChapterId(chapterId)
    setLoadingChapter(true)
    setReaderError(null)
    setChapterSource(null)

    try {
      if (!selectedBook) {
        throw new Error('No selected book available for chapter loading.')
      }

      const result = await bibleService.getChapterContentWithFallback({
        bibleId: selectedBibleVersion.id,
        chapterId,
        versionAbbreviation: selectedBibleVersion.abbreviation,
        bookName: selectedBook.name,
        options: {
          includeVerseNumbers: true,
          includeVerseSpans: true,
        },
      })
      setChapterContent(result.chapter.content || 'No text available for this chapter.')
      setChapterSource(result.source)
    } catch (error) {
      console.error('Error loading chapter content:', error)
      setReaderError('Unable to load chapter content. Try another chapter or version.')
    } finally {
      setLoadingChapter(false)
    }
  }

  const handleBookSelect = async (book: Book) => {
    if (!selectedBibleVersion) {
      return
    }

    setSelectedBook(book)
    setReaderError(null)
    setChapters([])
    setSelectedChapterId('')
    setChapterContent('')
    setLoadingChapter(true)

    try {
      const chapterList = await bibleService.getChapters(selectedBibleVersion.id, book.id)
      setChapters(chapterList)

      const firstReadableChapter =
        chapterList.find((chapter) => String(chapter.number) === '1') || chapterList[0]

      if (firstReadableChapter) {
        await loadChapter(firstReadableChapter.id)
      } else {
        setReaderError('No chapters available for this book.')
        setLoadingChapter(false)
      }
    } catch (error) {
      console.error('Error loading chapters:', error)
      setReaderError('Unable to load chapters for this book.')
      setLoadingChapter(false)
    }
  }

  return (
    <div className="pb-24 space-y-6">
      <Card elevated className="sticky top-4 z-20 backdrop-blur-md bg-surface/90">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="display font-display mb-2">Bible Reader</h1>
              <p className="text-lg text-on-surface/70">Choose a book, then move chapter by chapter</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {bibleVersions.slice(0, 3).map((version) => {
                const isActive = selectedBibleVersion?.id === version.id
                return (
                  <button
                    key={version.id}
                    type="button"
                    onClick={() => handleVersionChange(version.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-button'
                        : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    {version.abbreviation}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search books like Genesis, Psalms, John..."
              className="input-field"
            />
            <select
              className="input-field"
              value={selectedBibleVersion?.id || ''}
              onChange={(event) => handleVersionChange(event.target.value)}
            >
              {bibleVersions.map((version) => (
                <option key={version.id} value={version.id}>
                  {version.abbreviation} - {version.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <Card elevated>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="headline font-display text-2xl">Books</h2>
                  <p className="text-sm text-on-surface/60">Tap one book to expand its chapters</p>
                </div>
                <span className="label text-primary">{filteredBooks.length} books</span>
              </div>

              {loadingBooks ? (
                <div className="rounded-2xl bg-surface-container-low/60 p-4 text-on-surface/60">
                  Loading books...
                </div>
              ) : (
                <div className="max-h-[68vh] space-y-2 overflow-y-auto pr-1">
                  {filteredBooks.map((book) => {
                    const isSelected = selectedBook?.id === book.id

                    return (
                      <div key={book.id} className="rounded-2xl bg-surface-container-lowest/70 p-2 shadow-sm">
                        <button
                          type="button"
                          onClick={() => handleBookSelect(book)}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                            isSelected
                              ? 'bg-primary text-on-primary shadow-button'
                              : 'bg-surface-container-low hover:bg-surface-container'
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="font-display text-base font-semibold truncate">{book.name}</p>
                            <p className={`text-xs uppercase tracking-[0.16em] ${isSelected ? 'text-on-primary/80' : 'text-on-surface/60'}`}>
                              {book.abbreviation}
                            </p>
                          </div>
                          <span className={`text-xs font-semibold ${isSelected ? 'text-on-primary/90' : 'text-on-surface/50'}`}>
                            {isSelected ? 'Open' : 'Read'}
                          </span>
                        </button>

                        {isSelected && chapters.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-2 px-1 pb-1 md:grid-cols-4">
                            {chapters.map((chapter) => {
                              const isChapterActive = selectedChapterId === chapter.id

                              return (
                                <button
                                  key={chapter.id}
                                  type="button"
                                  onClick={() => void loadChapter(chapter.id)}
                                  className={`rounded-full px-3 py-2 text-sm font-semibold transition-all ${
                                    isChapterActive
                                      ? 'bg-secondary-container text-on-secondary-container shadow-sm'
                                      : 'bg-white/70 text-on-surface/70 hover:bg-white'
                                  }`}
                                >
                                  {formatChapterNumber(chapter.number)}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {!loadingBooks && filteredBooks.length === 0 && (
                    <div className="rounded-2xl bg-surface-container-low/60 p-4 text-on-surface/60">
                      No books match your search.
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </aside>

        <main className="space-y-4">
          <Card elevated>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="label text-primary mb-2">{selectedBibleVersionLabel}</p>
                <h2 className="headline font-display text-3xl">
                  {selectedBook ? selectedBook.name : 'Select a book to begin'}
                </h2>
                <p className="text-sm text-on-surface/60 mt-1">
                  {selectedBook
                    ? 'Choose a chapter below. The currently selected book stays open while the others remain collapsed.'
                    : 'Use the book rail on the left to open a book.'}
                </p>
                {chapterSource === 'fallback' && (
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary mt-2">
                    Backup source active: wldeh/bible-api (free)
                  </p>
                )}
              </div>

              {selectedChapter && (
                <div className="rounded-2xl bg-surface-container-low px-4 py-3 text-right">
                  <p className="label text-primary">Current Chapter</p>
                  <p className="title-lg font-display">Chapter {formatChapterNumber(selectedChapter.number)}</p>
                </div>
              )}
            </div>
          </Card>

          {readerError && (
            <Card>
              <p className="font-medium text-red-700">{readerError}</p>
            </Card>
          )}

          {!selectedBook && !readerError && (
            <Card elevated>
              <div className="rounded-3xl bg-surface-container-lowest p-8 text-center space-y-2">
                <p className="headline font-display">No book open yet</p>
                <p className="text-on-surface/60">
                  Search for a book, tap it once, and its chapters will expand in the sidebar.
                </p>
              </div>
            </Card>
          )}

          {selectedBook && loadingChapter && (
            <Card>
              <p className="text-on-surface/60">Loading chapter...</p>
            </Card>
          )}

          {selectedBook && !loadingChapter && parsedChapterContent.verses.length > 0 && (
            <div className="space-y-4">
              {parsedChapterContent.heading && (
                <Card elevated>
                  <div className="text-center space-y-2">
                    <p className="label text-primary">Chapter heading</p>
                    <h3 className="headline font-display text-3xl">{parsedChapterContent.heading}</h3>
                  </div>
                </Card>
              )}

              <div className="space-y-4">
                {parsedChapterContent.verses.map((verse) => (
                  <VerseDisplay
                    key={verse.id}
                    text={verse.text}
                    book={selectedBook.name}
                    chapter={selectedChapter ? Number(selectedChapter.number) || 1 : 1}
                    verse={verse.number}
                    version={selectedBibleVersion?.abbreviation || ''}
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default BibleReader
