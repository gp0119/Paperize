export type PageMargins = {
  marginTop: number
  marginRight: number
  marginBottom: number
  marginLeft: number
}

export const defaultPageMargins: PageMargins = {
  marginTop: 20,
  marginRight: 14,
  marginBottom: 20,
  marginLeft: 14,
}

export function getContentWidth(margins: PageMargins) {
  return 210 - margins.marginLeft - margins.marginRight
}

export function getContentHeight(margins: PageMargins) {
  return 297 - margins.marginTop - margins.marginBottom
}
