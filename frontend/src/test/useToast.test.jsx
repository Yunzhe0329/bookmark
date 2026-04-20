import { renderHook, act } from '@testing-library/react'
import { useToast } from '../hooks'

describe('useToast', () => {
  it('add() 應新增一筆 toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => { result.current.add('測試訊息', 'info') })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].msg).toBe('測試訊息')
  })

  it('remove() 應移除指定 toast', () => {
    const { result } = renderHook(() => useToast())
    act(() => { result.current.add('訊息') })
    const id = result.current.toasts[0].id
    act(() => { result.current.remove(id) })
    expect(result.current.toasts).toHaveLength(0)
  })
})
