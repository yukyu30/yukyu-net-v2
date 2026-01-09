import { render, screen, act } from '@testing-library/react'
import CreatureChat from '../CreatureChat'

// next/navigation をモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// react-markdown をモック
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <span>{children}</span>,
}))

// scrollIntoView をモック
Element.prototype.scrollIntoView = jest.fn()

describe('CreatureChat', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('ステータスに応じたフレームアニメーション', () => {
    it('通常時はアイドルフレーム（ゆっくり回転）が表示される', () => {
      render(<CreatureChat />)

      // アイドルフレーム: ['▘', '▝', '▗', '▖']
      const creature = screen.getByTestId('creature-frame')
      expect(creature.textContent).toMatch(/[▘▝▗▖]/)
    })
  })
})
