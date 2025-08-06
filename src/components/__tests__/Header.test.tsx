import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
  it('インデックスページのヘッダーを表示する', () => {
    render(<Header postsCount={10} lastUpdate="2025-01-01" />)
    
    expect(screen.getByText('DecoBoco Digital')).toBeInTheDocument()
    expect(screen.getByText('ENTRIES: 10')).toBeInTheDocument()
    expect(screen.getByText('LAST UPDATE: 2025-01-01')).toBeInTheDocument()
    expect(screen.getByText('STATUS: ACTIVE')).toBeInTheDocument()
    expect(screen.getByText('RSS')).toBeInTheDocument()
  })

  it('記事ページのヘッダーを表示する', () => {
    render(<Header showBackButton={true} pageType="article" />)
    
    expect(screen.getByText('← INDEX')).toBeInTheDocument()
    expect(screen.getByText('ARTICLE VIEW')).toBeInTheDocument()
  })
})