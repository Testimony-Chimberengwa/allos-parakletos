import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
import { pipeline } from '@xenova/transformers'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const ASSISTANT_PORT = Number(process.env.ASSISTANT_PORT || 8787)
const BIBLE_API_BASE_URL = process.env.VITE_BIBLE_API_BASE_URL || 'https://rest.api.bible'
const BIBLE_API_KEY = process.env.VITE_BIBLE_API_KEY || ''

const VERSION_TO_BIBLE_ID = {
  NLT: 'd6e14a625393b4da-01',
  KJV: 'de4e12af7f28f599-01',
  AMP: 'a81b73293d3080c9-01',
}

const FREE_VERSION_BY_ABBREVIATION = {
  NLT: 'en-web',
  KJV: 'en-kjv',
  AMP: 'en-web',
}

const FALLBACK_VERSE_REFERENCES = [
  { reference: 'John 3:16', bookSlug: 'john', chapter: '3', verse: '16' },
  { reference: 'Romans 8:28', bookSlug: 'romans', chapter: '8', verse: '28' },
  { reference: 'Philippians 4:6', bookSlug: 'philippians', chapter: '4', verse: '6' },
  { reference: 'Philippians 4:13', bookSlug: 'philippians', chapter: '4', verse: '13' },
  { reference: 'Jeremiah 29:11', bookSlug: 'jeremiah', chapter: '29', verse: '11' },
  { reference: 'Isaiah 41:10', bookSlug: 'isaiah', chapter: '41', verse: '10' },
  { reference: 'Matthew 11:28', bookSlug: 'matthew', chapter: '11', verse: '28' },
  { reference: 'Psalm 23:1', bookSlug: 'psalms', chapter: '23', verse: '1' },
  { reference: 'Psalm 27:1', bookSlug: 'psalms', chapter: '27', verse: '1' },
  { reference: 'Psalm 46:1', bookSlug: 'psalms', chapter: '46', verse: '1' },
  { reference: 'Psalm 91:1', bookSlug: 'psalms', chapter: '91', verse: '1' },
  { reference: 'Proverbs 3:5', bookSlug: 'proverbs', chapter: '3', verse: '5' },
  { reference: 'Proverbs 3:6', bookSlug: 'proverbs', chapter: '3', verse: '6' },
  { reference: 'Joshua 1:9', bookSlug: 'joshua', chapter: '1', verse: '9' },
  { reference: '2 Timothy 1:7', bookSlug: '2timothy', chapter: '1', verse: '7' },
  { reference: '1 Corinthians 13:4', bookSlug: '1corinthians', chapter: '13', verse: '4' },
  { reference: '1 Corinthians 13:7', bookSlug: '1corinthians', chapter: '13', verse: '7' },
  { reference: 'Romans 12:2', bookSlug: 'romans', chapter: '12', verse: '2' },
  { reference: 'Ephesians 6:11', bookSlug: 'ephesians', chapter: '6', verse: '11' },
  { reference: 'Hebrews 11:1', bookSlug: 'hebrews', chapter: '11', verse: '1' },
  { reference: 'James 1:5', bookSlug: 'james', chapter: '1', verse: '5' },
  { reference: '1 Peter 5:7', bookSlug: '1peter', chapter: '5', verse: '7' },
  { reference: '1 John 1:9', bookSlug: '1john', chapter: '1', verse: '9' },
  { reference: '1 John 4:18', bookSlug: '1john', chapter: '4', verse: '18' },
  { reference: 'Revelation 21:4', bookSlug: 'revelation', chapter: '21', verse: '4' },
]

let extractorPromise
let fallbackCorpusPromise
const candidateEmbeddingCache = new Map()
const conversationSessions = new Map()

const VERSION_TO_BIBLE_GATEWAY = {
  KJV: 'KJV',
  NLT: 'NLT',
  AMP: 'AMP',
}

const TRUSTED_TOPIC_SOURCES = [
  {
    keywords: ['trinity', 'triune', 'father son holy spirit'],
    sources: [
      {
        title: 'What does the Bible teach about the Trinity?',
        url: 'https://www.gotquestions.org/Trinity-Bible.html',
        publisher: 'GotQuestions.org',
        reason: 'Concise doctrinal summary with verse references.',
      },
      {
        title: 'The Doctrine of the Trinity',
        url: 'https://www.thegospelcoalition.org/essay/the-doctrine-of-the-trinity/',
        publisher: 'The Gospel Coalition',
        reason: 'Long-form theological explanation.',
      },
    ],
  },
  {
    keywords: ['fear', 'anxiety', 'worry', 'afraid'],
    sources: [
      {
        title: 'OpenBible topic: anxiety',
        url: 'https://www.openbible.info/topics/anxiety',
        publisher: 'OpenBible.info',
        reason: 'Verse index for anxiety and fear topics.',
      },
    ],
  },
  {
    keywords: ['forgive', 'forgiveness', 'repent'],
    sources: [
      {
        title: 'OpenBible topic: forgiveness',
        url: 'https://www.openbible.info/topics/forgiveness',
        publisher: 'OpenBible.info',
        reason: 'Cross-reference list of forgiveness passages.',
      },
    ],
  },
  {
    keywords: ['prayer', 'pray'],
    sources: [
      {
        title: 'OpenBible topic: prayer',
        url: 'https://www.openbible.info/topics/prayer',
        publisher: 'OpenBible.info',
        reason: 'Prayer-focused scripture references.',
      },
    ],
  },
]

function normalizeVersion(input) {
  return (input || 'KJV').replace(/[^a-z0-9]/gi, '').toUpperCase()
}

function makeSessionId() {
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function sanitizeConversation(conversation) {
  if (!Array.isArray(conversation)) {
    return []
  }

  return conversation
    .map((turn) => {
      const role = turn?.role === 'assistant' ? 'assistant' : 'user'
      const content = String(turn?.content || '').trim()
      if (!content) {
        return null
      }
      return { role, content }
    })
    .filter(Boolean)
    .slice(-12)
}

function looksLikeFollowUp(question) {
  const normalized = question.toLowerCase()
  const words = normalized.split(/\s+/).filter(Boolean)

  if (words.length <= 6) {
    return true
  }

  return ['this', 'that', 'it', 'those', 'these', 'same', 'more on', 'what about', 'explain that'].some((marker) =>
    normalized.includes(marker)
  )
}

function buildContextualQuestion(question, conversation) {
  const normalizedQuestion = question.trim()
  if (!looksLikeFollowUp(normalizedQuestion)) {
    return normalizedQuestion
  }

  const previousUserTurn = [...conversation]
    .reverse()
    .find((turn) => turn.role === 'user' && turn.content.toLowerCase() !== normalizedQuestion.toLowerCase())

  if (!previousUserTurn) {
    return normalizedQuestion
  }

  return `${previousUserTurn.content}. Follow-up question: ${normalizedQuestion}`
}

function toBibleId(versionAbbreviation) {
  const normalized = normalizeVersion(versionAbbreviation)
  return VERSION_TO_BIBLE_ID[normalized] || VERSION_TO_BIBLE_ID.KJV
}

function toFreeVersion(versionAbbreviation) {
  const normalized = normalizeVersion(versionAbbreviation)
  return FREE_VERSION_BY_ABBREVIATION[normalized] || 'en-kjv'
}

function toBibleGatewayVersion(versionAbbreviation) {
  const normalized = normalizeVersion(versionAbbreviation)
  return VERSION_TO_BIBLE_GATEWAY[normalized] || 'KJV'
}

function dotProduct(a, b) {
  let sum = 0
  const size = Math.min(a.length, b.length)
  for (let i = 0; i < size; i += 1) {
    sum += a[i] * b[i]
  }
  return sum
}

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return extractorPromise
}

async function embedText(text) {
  const extractor = await getExtractor()
  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true,
  })

  return Array.from(output.data)
}

async function getCachedEmbedding(cacheKey, text) {
  if (candidateEmbeddingCache.has(cacheKey)) {
    return candidateEmbeddingCache.get(cacheKey)
  }

  const embedding = await embedText(text)
  candidateEmbeddingCache.set(cacheKey, embedding)
  return embedding
}

async function getPaidCandidates(question, bibleId, limit = 25) {
  if (!BIBLE_API_KEY) {
    throw new Error('Missing VITE_BIBLE_API_KEY in environment for paid search.')
  }

  const response = await axios.get(`${BIBLE_API_BASE_URL}/v1/bibles/${bibleId}/search`, {
    headers: {
      'api-key': BIBLE_API_KEY,
    },
    params: {
      query: question,
      limit,
    },
  })

  const verses = response.data?.data?.verses || []

  return verses.map((verse) => ({
    id: verse.id,
    reference: verse.reference,
    text: verse.text,
    source: 'api.bible',
  }))
}

async function fetchFreeVerse(ref, freeVersion) {
  const url = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${freeVersion}/books/${ref.bookSlug}/chapters/${ref.chapter}/verses/${ref.verse}.json`
  const response = await axios.get(url)
  return {
    id: `${ref.bookSlug}.${ref.chapter}.${ref.verse}`,
    reference: ref.reference,
    text: response.data?.text || '',
    source: 'free-bible-api',
  }
}

async function getFallbackCorpus(freeVersion) {
  if (!fallbackCorpusPromise) {
    fallbackCorpusPromise = Promise.allSettled(
      FALLBACK_VERSE_REFERENCES.map((ref) => fetchFreeVerse(ref, freeVersion))
    ).then((results) => {
      return results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
        .filter((entry) => entry.text && entry.text.trim().length > 0)
    })
  }

  return fallbackCorpusPromise
}

async function rankCandidates(question, candidates, maxResults = 5) {
  if (!candidates.length) {
    return []
  }

  const questionEmbedding = await embedText(question)

  const scored = []
  for (const candidate of candidates) {
    const candidateEmbedding = await getCachedEmbedding(candidate.id, candidate.text)
    const score = dotProduct(questionEmbedding, candidateEmbedding)
    scored.push({
      ...candidate,
      score,
    })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, maxResults)
}

function buildReferenceWebSources(matches, versionAbbreviation) {
  const version = toBibleGatewayVersion(versionAbbreviation)

  return matches.slice(0, 3).map((match) => {
    const passageQuery = encodeURIComponent(match.reference)
    return {
      title: `Read ${match.reference}`,
      url: `https://www.biblegateway.com/passage/?search=${passageQuery}&version=${version}`,
      publisher: 'BibleGateway',
      reason: 'Open the verse in a full Bible reading context.',
    }
  })
}

function buildTopicSources(question) {
  const normalized = question.toLowerCase()
  const sources = []

  for (const topic of TRUSTED_TOPIC_SOURCES) {
    if (topic.keywords.some((keyword) => normalized.includes(keyword))) {
      sources.push(...topic.sources)
    }
  }

  sources.push({
    title: 'Blue Letter Bible search',
    url: `https://www.blueletterbible.org/search/search.cfm?Criteria=${encodeURIComponent(question)}&t=KJV#s=s_primary_0_1`,
    publisher: 'Blue Letter Bible',
    reason: 'Cross-check passages and lexicon tools.',
  })

  return sources
}

function dedupeSources(sources) {
  const seen = new Set()
  const deduped = []

  for (const source of sources) {
    if (!source?.url || seen.has(source.url)) {
      continue
    }

    seen.add(source.url)
    deduped.push(source)
  }

  return deduped
}

function buildWebSources(question, matches, versionAbbreviation) {
  const sources = [
    ...buildReferenceWebSources(matches, versionAbbreviation),
    ...buildTopicSources(question),
  ]

  return dedupeSources(sources).slice(0, 6)
}

function buildAssistantAnswer(question, matches, source) {
  if (!matches.length) {
    return `I could not find a strong Scripture match for "${question}" yet. Try a clearer topic like fear, forgiveness, anxiety, healing, or faith.`
  }

  const top = matches[0]
  const second = matches[1]
  const third = matches[2]
  const lines = [
    `Best match: ${top.reference}`,
    top.text,
  ]

  if (second) {
    lines.push('', `Also read: ${second.reference}`)
  }

  if (third) {
    lines.push(`Another related verse: ${third.reference}`)
  }

  if (source === 'free-fallback') {
    lines.push('', 'Note: This response used the free backup Scripture source.')
  }

  return lines.join('\n')
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    model: 'all-MiniLM-L6-v2',
    paidApiConfigured: Boolean(BIBLE_API_KEY),
  })
})

app.post('/api/assistant/query', async (req, res) => {
  try {
    const question = String(req.body?.question || '').trim()
    const versionAbbreviation = String(req.body?.versionAbbreviation || 'KJV').trim()
    const requestedSessionId = String(req.body?.sessionId || '').trim()
    const sessionId = requestedSessionId || makeSessionId()
    const incomingConversation = sanitizeConversation(req.body?.conversation)
    const existingConversation = conversationSessions.get(sessionId) || []
    const mergedConversation = sanitizeConversation([...existingConversation, ...incomingConversation])

    if (!question) {
      return res.status(400).json({
        error: 'Question is required.',
      })
    }

    const contextualQuestion = buildContextualQuestion(question, mergedConversation)
    const bibleId = toBibleId(versionAbbreviation)
    let source = 'api.bible'
    let candidates = []

    try {
      candidates = await getPaidCandidates(contextualQuestion, bibleId, 25)
    } catch (error) {
      console.error('Paid candidate fetch failed:', error)
      source = 'free-fallback'
    }

    if (!candidates.length) {
      const freeVersion = toFreeVersion(versionAbbreviation)
      candidates = await getFallbackCorpus(freeVersion)
      source = 'free-fallback'
    }

    const matches = await rankCandidates(contextualQuestion, candidates, 5)
    const answer = buildAssistantAnswer(question, matches, source)
    const webSources = buildWebSources(question, matches, versionAbbreviation)

    conversationSessions.set(sessionId, sanitizeConversation([
      ...mergedConversation,
      { role: 'user', content: question },
      { role: 'assistant', content: answer },
    ]))

    return res.json({
      sessionId,
      question,
      contextualQuestion,
      answer,
      source,
      matches,
      webSources,
    })
  } catch (error) {
    console.error('Assistant query failed:', error)
    return res.status(500).json({
      error: 'Assistant service failed to process this request.',
    })
  }
})

app.listen(ASSISTANT_PORT, () => {
  console.log(`Bible assistant backend running on http://localhost:${ASSISTANT_PORT}`)
})
