import OpenAI from 'openai'

// OpenAI APIをモック化
jest.mock('openai')
const MockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>

describe('embeddings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.OPENAI_API_KEY = 'test-api-key'
    // モジュールのキャッシュをクリア
    jest.resetModules()
  })

  afterEach(() => {
    delete process.env.OPENAI_API_KEY
  })

  describe('embedText', () => {
    it('単一テキストからEmbeddingを生成できること', async () => {
      // 1536次元のダミーベクトルを生成
      const mockEmbedding = Array(1536).fill(0).map(() => Math.random())

      MockedOpenAI.prototype.embeddings = {
        create: jest.fn().mockResolvedValue({
          data: [{ embedding: mockEmbedding }],
        }),
      } as unknown as OpenAI.Embeddings

      const { embedText } = await import('../embeddings')
      const result = await embedText('テスト文章')

      expect(result).toHaveLength(1536)
      expect(MockedOpenAI.prototype.embeddings.create).toHaveBeenCalledWith({
        model: 'text-embedding-3-small',
        input: 'テスト文章',
      })
    })

    it('生成されたEmbeddingが1536次元であること', async () => {
      const mockEmbedding = Array(1536).fill(0.1)

      MockedOpenAI.prototype.embeddings = {
        create: jest.fn().mockResolvedValue({
          data: [{ embedding: mockEmbedding }],
        }),
      } as unknown as OpenAI.Embeddings

      const { embedText } = await import('../embeddings')
      const result = await embedText('任意のテキスト')

      expect(result).toHaveLength(1536)
      expect(result.every((v) => typeof v === 'number')).toBe(true)
    })
  })

  describe('embedMany', () => {
    it('複数テキストから一括でEmbeddingを生成できること', async () => {
      const mockEmbeddings = [
        Array(1536).fill(0.1),
        Array(1536).fill(0.2),
        Array(1536).fill(0.3),
      ]

      MockedOpenAI.prototype.embeddings = {
        create: jest.fn().mockResolvedValue({
          data: mockEmbeddings.map((embedding) => ({ embedding })),
        }),
      } as unknown as OpenAI.Embeddings

      const { embedMany } = await import('../embeddings')
      const texts = ['テキスト1', 'テキスト2', 'テキスト3']
      const result = await embedMany(texts)

      expect(result).toHaveLength(3)
      expect(result[0]).toHaveLength(1536)
      expect(result[1]).toHaveLength(1536)
      expect(result[2]).toHaveLength(1536)
    })

    it('空配列を渡すと空配列が返ること', async () => {
      const { embedMany } = await import('../embeddings')
      const result = await embedMany([])

      expect(result).toEqual([])
    })
  })
})
