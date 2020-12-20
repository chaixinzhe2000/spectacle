import uniqid from 'uniqid'

export function generateNodeId() {
  return uniqid('n.')
}

export function generateAnchorId() {
  return uniqid('a.')
}

export function generateLinkId() {
  return uniqid('l.')
}