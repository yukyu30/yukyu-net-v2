import { getFramesForStatus, getAnimationSpeed, ChatStatus } from './creature-frames'

describe('creature-frames', () => {
  describe('getFramesForStatus', () => {
    it('通常時（idle）はアイドルフレームを返す', () => {
      const frames = getFramesForStatus('idle')
      expect(frames).toEqual(['▘', '▝', '▗', '▖'])
    })

    it('searchingステータス時は検索フレーム（キョロキョロ）を返す', () => {
      const frames = getFramesForStatus('searching')
      expect(frames).toEqual(['◠', '◡'])
    })

    it('thinkingステータス時は思考フレーム（ぐるぐる）を返す', () => {
      const frames = getFramesForStatus('thinking')
      expect(frames).toEqual(['▚', '▞'])
    })

    it('readingステータス時は読込フレーム（パクパク）を返す', () => {
      const frames = getFramesForStatus('reading')
      expect(frames).toEqual(['▁', '▃', '▅', '▇'])
    })

    it('foundステータス時は発見フレーム（ワクワク）を返す', () => {
      const frames = getFramesForStatus('found')
      expect(frames).toEqual(['▛', '▜', '▟', '▙'])
    })

    it('未知のステータスはアイドルフレームを返す', () => {
      const frames = getFramesForStatus('unknown' as ChatStatus)
      expect(frames).toEqual(['▘', '▝', '▗', '▖'])
    })
  })

  describe('getAnimationSpeed', () => {
    it('通常時（idle）は500msを返す', () => {
      const speed = getAnimationSpeed('idle')
      expect(speed).toBe(500)
    })

    it('searchingステータス時は200msを返す', () => {
      const speed = getAnimationSpeed('searching')
      expect(speed).toBe(200)
    })

    it('thinkingステータス時は150msを返す', () => {
      const speed = getAnimationSpeed('thinking')
      expect(speed).toBe(150)
    })

    it('readingステータス時は250msを返す', () => {
      const speed = getAnimationSpeed('reading')
      expect(speed).toBe(250)
    })

    it('foundステータス時は100msを返す', () => {
      const speed = getAnimationSpeed('found')
      expect(speed).toBe(100)
    })
  })
})
