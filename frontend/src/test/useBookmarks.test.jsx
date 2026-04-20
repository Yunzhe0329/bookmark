import { renderHook, act, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useBookmarks } from '../hooks'
import api from '../api/client'

vi.mock('../api/client')

const MOCK_BM = { id: 1, url: 'https://a.com', title: 'A', description: '', tags: [] }

describe('useBookmarks', () => {
  beforeEach(() => vi.clearAllMocks())

  it('初始化時自動呼叫 GET /api/bookmarks', async () => {
    api.get.mockResolvedValueOnce({ data: [MOCK_BM] })
    const { result } = renderHook(() => useBookmarks())
    expect(result.current.bookmarks).toBeNull()           // 載入中
    await waitFor(() => expect(result.current.bookmarks).toHaveLength(1))
    expect(api.get).toHaveBeenCalledWith('/api/bookmarks')
  })

  it('GET 失敗時 bookmarks 為空陣列', async () => {
    api.get.mockRejectedValueOnce(new Error('network error'))
    const { result } = renderHook(() => useBookmarks())
    await waitFor(() => expect(result.current.bookmarks).toEqual([]))
    expect(result.current.error).toBeTruthy()
  })

  it('createBookmark 呼叫 POST 並加入列表', async () => {
    api.get.mockResolvedValueOnce({ data: [] })
    const newBm = { ...MOCK_BM, id: 2, tags: ['dev'] }
    api.post
      .mockResolvedValueOnce({ data: { ...newBm, tags: [] } })  // POST bookmark
      .mockResolvedValueOnce({ data: newBm })                    // POST tag
    const { result } = renderHook(() => useBookmarks())
    await waitFor(() => expect(result.current.bookmarks).toEqual([]))

    await act(async () => {
      await result.current.createBookmark({ url: 'https://b.com', title: 'B', description: '', tags: ['dev'] })
    })
    expect(result.current.bookmarks).toHaveLength(1)
    expect(result.current.bookmarks[0].tags).toEqual(['dev'])
  })

  it('deleteBookmark 呼叫 DELETE 並從列表移除', async () => {
    api.get.mockResolvedValueOnce({ data: [MOCK_BM] })
    api.delete.mockResolvedValueOnce({})
    const { result } = renderHook(() => useBookmarks())
    await waitFor(() => expect(result.current.bookmarks).toHaveLength(1))

    await act(async () => { await result.current.deleteBookmark(1) })
    expect(result.current.bookmarks).toHaveLength(0)
    expect(api.delete).toHaveBeenCalledWith('/api/bookmarks/1')
  })
})
