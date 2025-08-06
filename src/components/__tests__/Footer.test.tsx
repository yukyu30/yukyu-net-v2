import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('グリッドレイアウトのフッターを表示する', () => {
    render(<Footer variant="grid" />)
    
    expect(screen.getByText(/© \d{4} DecoBoco Digital/)).toBeInTheDocument()
    expect(screen.getByText('GRID LAYOUT')).toBeInTheDocument()
    expect(screen.getByText('V1.0')).toBeInTheDocument()
  })

  it('記事ページのフッターを表示する', () => {
    render(<Footer variant="article" />)
    
    expect(screen.getByText(/© \d{4} DecoBoco Digital/)).toBeInTheDocument()
    expect(screen.getByText('ARTICLE VIEW')).toBeInTheDocument()
    expect(screen.getByText('V1.0')).toBeInTheDocument()
  })
})