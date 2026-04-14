interface VerseDisplayProps {
  className?: string
  text: string
  book: string
  chapter: number
  verse: number | string
  version: string
}

function VerseDisplay({ className = '', text, book, chapter, verse, version }: VerseDisplayProps) {
  return (
    <div className={`rounded-2xl bg-surface-container-lowest/80 p-5 shadow-sm ${className}`}>
      <div className="flex gap-4 md:gap-5">
        <div className="flex h-10 min-w-10 items-center justify-center rounded-full bg-primary text-on-primary text-sm font-bold shadow-button">
          {verse}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-[1.08rem] leading-8 md:text-[1.15rem] md:leading-9 text-on-surface font-body whitespace-pre-wrap">
            {text}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            {book} {chapter}:{verse} · {version}
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerseDisplay
