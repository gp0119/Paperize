export type PageMargins = {
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
}

export const defaultPageMargins: PageMargins = {
  marginTop: 14,
  marginRight: 14,
  marginBottom: 14,
  marginLeft: 14,
}

export function getContentWidth(margins: PageMargins) {
  return 210 - margins.marginLeft - margins.marginRight
}

export function getContentHeight(margins: PageMargins) {
  return 297 - margins.marginTop - margins.marginBottom
}
