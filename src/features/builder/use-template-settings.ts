'use client'

import { useState, useSyncExternalStore } from 'react'

// localStorage is an input boundary: reject incomplete or malformed saved data.
function matchesDefaults(value: unknown, defaults: unknown): boolean {
  if (Array.isArray(defaults)) {
    return Array.isArray(value) && value.every((item) => matchesDefaults(item, defaults[0]))
  }
  if (defaults !== null && typeof defaults === 'object') {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      && Object.entries(defaults).every(([key, example]) => matchesDefaults((value as Record<string, unknown>)[key], example))
  }
  return typeof value === typeof defaults && (typeof value !== 'number' || Number.isFinite(value))
}

export function useTemplateSettings<T extends object>(id: string, defaults: T, validate: (settings: T) => boolean) {
  const [store] = useState(() => {
    const key = `paperize:template:${id}:v1`
    const initial = { settings: defaults, restored: false, storageError: null as string | null }
    let snapshot = initial
    const listeners = new Set<() => void>()

    function notify() {
      listeners.forEach((listener) => listener())
    }

    function restore() {
      let saved: string | null
      try {
        saved = localStorage.getItem(key)
      } catch {
        // Browser policies can disable storage; keep editing available.
        snapshot = { ...initial, restored: true, storageError: '浏览器未允许本地存储，本次配置无法保存。' }
        return
      }
      let parsed: unknown
      try {
        parsed = saved === null ? null : JSON.parse(saved)
      } catch {
        parsed = null
      }
      const settings = matchesDefaults(parsed, defaults) && validate(parsed as T) ? parsed as T : defaults
      snapshot = { settings, restored: true, storageError: null }
    }

    return {
      getSnapshot: () => snapshot,
      // Hydration starts from the same defaults as the server render.
      getServerSnapshot: () => initial,
      subscribe(listener: () => void) {
        listeners.add(listener)
        if (!snapshot.restored) {
          restore()
          notify()
        }
        return () => { listeners.delete(listener) }
      },
      updateSettings(patch: Partial<T>) {
        if (!snapshot.restored) restore()
        const settings = { ...snapshot.settings, ...patch }
        const serialized = JSON.stringify(settings)
        let storageError: string | null = null
        try {
          localStorage.setItem(key, serialized)
        } catch {
          storageError = '本地保存失败，请检查浏览器存储权限或可用空间。'
        }
        snapshot = { settings, restored: true, storageError }
        notify()
      },
    }
  })
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  return { ...snapshot, updateSettings: store.updateSettings }
}

export function validMargins(margins: Record<string, number>) {
  return Object.values(margins).every((value) => value >= 5 && value <= 30)
}

export function validColor(color: string) {
  return /^#[0-9a-f]{6}$/i.test(color)
}

export function validTracingOptions(options: {
  cellSize: number; rowGap: number; tracingCount: number; color: string; tracingColor: string; tracingWidth: string
}) {
  return options.cellSize >= 8 && options.cellSize <= 25
    && options.rowGap >= 0 && options.rowGap <= 10
    && Number.isInteger(options.tracingCount) && options.tracingCount >= 0 && options.tracingCount <= 25
    && validColor(options.color) && validColor(options.tracingColor)
    && ['0.8', '1.2', '2'].includes(options.tracingWidth)
}
