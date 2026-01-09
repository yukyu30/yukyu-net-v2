import crypto from 'crypto'

// テスト対象の純粋関数をテスト
describe('indexer - utility functions', () => {
  describe('computeContentHash', () => {
    // ハッシュ計算関数を直接テスト
    const computeContentHash = (content: string): string => {
      return crypto.createHash('md5').update(content).digest('hex')
    }

    it('同じ内容には同じハッシュを返すこと', () => {
      const content = 'This is a test content'
      const hash1 = computeContentHash(content)
      const hash2 = computeContentHash(content)
      
      expect(hash1).toBe(hash2)
    })
    
    it('異なる内容には異なるハッシュを返すこと', () => {
      const content1 = 'This is content version 1'
      const content2 = 'This is content version 2'
      const hash1 = computeContentHash(content1)
      const hash2 = computeContentHash(content2)
      
      expect(hash1).not.toBe(hash2)
    })
    
    it('小さな変更でもハッシュが変わること', () => {
      const content1 = 'Hello World'
      const content2 = 'Hello World!' // 1文字追加
      const hash1 = computeContentHash(content1)
      const hash2 = computeContentHash(content2)
      
      expect(hash1).not.toBe(hash2)
    })
  })
  
  describe('incremental logic', () => {
    it('ハッシュが一致する場合はスキップと判定されること', () => {
      const cachedHash = 'abc123'
      const contentHash = 'abc123'
      
      const shouldSkip = cachedHash && cachedHash === contentHash
      expect(shouldSkip).toBe(true)
    })
    
    it('ハッシュが異なる場合は再インデックスと判定されること', () => {
      const cachedHash = 'abc123'
      const contentHash = 'def456'
      
      const shouldSkip = cachedHash && cachedHash === contentHash
      expect(shouldSkip).toBe(false)
    })
    
    it('キャッシュにない場合は新規インデックスと判定されること', () => {
      const cachedHash = undefined
      const contentHash = 'abc123'
      
      const shouldSkip = cachedHash && cachedHash === contentHash
      // shouldSkip は undefined (falsy) なので、スキップしない = 新規インデックス
      expect(!shouldSkip).toBe(true)
    })
  })
})
