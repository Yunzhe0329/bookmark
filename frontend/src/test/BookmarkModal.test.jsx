import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BookmarkModal } from '../Modals'

const noop = () => {}

describe('BookmarkModal', () => {
  it('URL 空白按儲存 → 呼叫 toast 錯誤，不呼叫 onSave', async () => {
    const onSave = vi.fn()
    const toast  = vi.fn()
    render(<BookmarkModal mode="create" onClose={noop} onSave={onSave} toast={toast} />)

    fireEvent.click(screen.getByRole('button', { name: '新增' }))

    await waitFor(() => expect(toast).toHaveBeenCalledWith('請輸入網址', 'error'))
    expect(onSave).not.toHaveBeenCalled()
  })

  it('輸入 tag 後按 Enter → tag 出現在畫面', async () => {
    render(<BookmarkModal mode="create" onClose={noop} onSave={vi.fn()} toast={noop} />)

    fireEvent.change(screen.getByPlaceholderText('輸入標籤後按 Enter'), { target: { value: 'react' } })
    fireEvent.keyDown(screen.getByPlaceholderText('輸入標籤後按 Enter'), { key: 'Enter' })

    expect(screen.getByText('react')).toBeInTheDocument()
  })

  it('點 tag 的 × → tag 從畫面消失', async () => {
    render(<BookmarkModal mode="create" onClose={noop} onSave={vi.fn()} toast={noop} />)

    // 先加一個 tag
    fireEvent.change(screen.getByPlaceholderText('輸入標籤後按 Enter'), { target: { value: 'vue' } })
    fireEvent.keyDown(screen.getByPlaceholderText('輸入標籤後按 Enter'), { key: 'Enter' })
    expect(screen.getByText('vue')).toBeInTheDocument()

    // 點 × 移除
    fireEvent.click(screen.getByRole('button', { name: 'Remove vue' }))
    expect(screen.queryByText('vue')).not.toBeInTheDocument()
  })

  it('填完 URL 按儲存 → 呼叫 onSave 並帶正確資料', async () => {
    const onSave = vi.fn().mockResolvedValueOnce()
    render(<BookmarkModal mode="create" onClose={noop} onSave={onSave} toast={noop} />)

    fireEvent.change(screen.getByPlaceholderText('https://example.com'), { target: { value: 'https://react.dev' } })
    fireEvent.change(screen.getByPlaceholderText('留空將自動使用網頁標題'), { target: { value: 'React' } })
    fireEvent.click(screen.getByRole('button', { name: '新增' }))

    await waitFor(() => expect(onSave).toHaveBeenCalledWith({
      url: 'https://react.dev',
      title: 'React',
      description: '',
      tags: [],
    }))
  })
})
