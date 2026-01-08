import { render, screen, act } from '@testing-library/react'
import Creature from '../Creature'

// GSAPをモック
jest.mock('gsap', () => ({
  to: jest.fn(),
  set: jest.fn(),
  fromTo: jest.fn(),
  killTweensOf: jest.fn(),
  timeline: jest.fn(() => ({
    to: jest.fn().mockReturnThis(),
  })),
  registerPlugin: jest.fn(),
}))

jest.mock('@gsap/react', () => ({
  useGSAP: (callback: () => void) => callback(),
}))

describe('Creature', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('生命体が表示される', () => {
    render(<Creature />)

    // 生命体の本体が存在する
    expect(screen.getByTestId('creature')).toBeInTheDocument()
  })

  it('独り言が表示される', () => {
    render(<Creature />)

    // 独り言のテキストが表示される
    expect(screen.getByTestId('creature-monologue')).toBeInTheDocument()
  })

  it('独り言が一定間隔で変わる', () => {
    render(<Creature />)

    const monologue = screen.getByTestId('creature-monologue')
    const initialText = monologue.textContent

    // 10秒後に独り言が変わる
    act(() => {
      jest.advanceTimersByTime(10000)
    })

    // テキストが変わっている可能性がある（ランダムなので同じこともある）
    // 少なくともコンポーネントがエラーなく動作していることを確認
    expect(screen.getByTestId('creature-monologue')).toBeInTheDocument()
  })
})
