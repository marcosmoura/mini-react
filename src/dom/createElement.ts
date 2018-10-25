import patchDom from './patchDom'

function createElementByText ({ textContent }: TVNode): Text | null {
  if (textContent) {
    return document.createTextNode(textContent.toString())
  }

  return null
}

function createElementByTagName (vNode: TVNode): TElement {
  const rawEl: HTMLElement = document.createElement(vNode.tagName as string)
  const domEl: HTMLElement = patchDom(rawEl, vNode, vNode, true)

  return domEl
}

function createElement (vNode: TVNode): TElement {
  if (vNode.type === 'element') {
    return createElementByTagName(vNode)
  }

  return createElementByText(vNode)
}

export default createElement
