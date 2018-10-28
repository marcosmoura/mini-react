function isValidTextContent (textContent: any): boolean {
  return ['string', 'number'].includes(typeof textContent)
}

export default isValidTextContent
