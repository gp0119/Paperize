export type PageVisibility = {
  hideHeader: boolean
  hideTitle: boolean
  hideFooter: boolean
}

export const defaultPageVisibility: PageVisibility = {
  hideHeader: false,
  hideTitle: false,
  hideFooter: false,
}

export function getReservedHeight(visibility: PageVisibility, hasTitle: boolean, contentGap = 0) {
  const header = visibility.hideHeader ? 0 : 10
  const title = hasTitle && !visibility.hideTitle ? 18 : 0
  return header + title + (header || title ? contentGap : 0) + (visibility.hideFooter ? 0 : 8)
}
