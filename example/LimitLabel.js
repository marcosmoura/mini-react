import { Component, node } from '../dist/mini-react.umd'
import { css } from 'emotion'

const label = css`
  margin: 9px 0 0;
`

class LimitLabel extends Component {
  render () {
    const { maxLimit, definedLimit } = this.props
    const totalValue = (maxLimit - definedLimit)

    return node({
      tagName: 'p',
      class: label,
      id: 'limit-label',
      children: [
        node({
          textContent: 'R$ '
        }),
        node({
          tagName: 'strong',
          textContent: totalValue + ',00'
        }),
        node({
          textContent: ' disponíveis'
        })
      ]
    })
  }
}

export default LimitLabel
