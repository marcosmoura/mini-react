import { Component, node } from '../dist/mini-react.umd'
import { css, injectGlobal } from 'emotion'
import LimitLabel from './LimitLabel'

const colors = {
  text: '#4A4A4A',
  lightBlue: '#B5CAE3',
  blue: '#278BFF',
  darkBlue: '#006AE5'
}

const defaultTransition = '.275s cubic-bezier(.4, 0, .2, 1)'

const appContainer = css`
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: ${colors.text};
  font-size: 16px;
  line-height: 19px;
`

const pageHeader = css`
  height: 54px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(181, 202, 227, .5);
  font-size: 12px;
  text-transform: uppercase;
`

const content = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const inputContainer = css`
  height: 60px;
  position: relative;
  border: dotted ${colors.lightBlue};
  border-width: 0 0 2px;
  transition: ${defaultTransition};
`

const inputContainerFocus = css`
  border-color: ${colors.darkBlue};
`

const inputLabel = css`
  position: relative;
  font-size: 48px;
  line-height: normal;

  strong {
    opacity: 0;
  }
`

const input = css`
  width: 100%;
  position: absolute;
  top: -2px;
  left: 3px;
  z-index: 1;
  -moz-appearance:textfield;
  border: none;
  background: none;
  color: ${colors.blue};
  font-family: inherit;
  font-size: 48px;
  font-weight: 700;
  text-align: center;

  &:focus {
    outline: none;
  }

  &::-webkit-inner-spin-button {
    display: none;
  }
`

const rangeContainer = css`
  width: 85%;
  max-width: 500px;
  margin-top: 80px;
  padding-top: 32px;
  display: flex;
  justify-content: space-between;
  position: relative;
`

const track = `
  height: 16px;
  position: absolute;
  top: -4px;
  left: 0;
  z-index: 1;
  appearance: none;
  pointer-events: none;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: ${colors.blue};
`

const rangeTrack = css`
  ${track}
`

injectGlobal`
  @supports (-moz-appearance: none) {
    #range-container div {
      display: none;
    }
  }
`

const thumb = `
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 2;
  appearance: none;
  border-radius: 50%;
  background-color: ${colors.darkBlue};
  border: none;
  box-shadow: 0 4px 5px rgba(0, 0, 0, .4);
  transition: ${defaultTransition};
`

const thumbActive = `
  width: 44px;
  height: 44px;
  box-shadow: 0 6px 8px rgba(0, 0, 0, .4);
`

const range = css`
  width: 100%;
  height: 8px;
  margin: 0;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 8px;
  appearance: none;
  background-color: ${colors.lightBlue};

  &:focus {
    outline: none;
  }

  &:active::-webkit-slider-thumb {
    ${thumbActive}
  }

  &:active::-moz-range-thumbActive {
    ${thumbActive}
  }

  &::-moz-range-thumb {
    ${thumb}
  }

  &::-webkit-slider-thumb {
    ${thumb}
  }

  &::-moz-range-track {
    background: none;
  }

  &::-moz-range-progress {
    ${track}
  }
`

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      definedLimit: 2500,
      maxLimit: 5000,
      inputFocus: false
    }
  }

  setDefinedLimit (e) {
    window.requestAnimationFrame(() => {
      let definedLimit = parseInt(e.target.value || 0, 10)

      if (definedLimit > this.state.maxLimit) {
        definedLimit = this.state.maxLimit
      }

      this.setState({ definedLimit })
    })
  }

  setInputFocus (inputFocus) {
    this.setState({ inputFocus })
  }

  getTrackWidth () {
    const { maxLimit, definedLimit } = this.state

    return definedLimit * 100 / maxLimit
  }

  render () {
    const { maxLimit, definedLimit, inputFocus } = this.state

    return node({
      tagName: 'div',
      id: 'app',
      class: appContainer,
      children: [
        node({
          tagName: 'h1',
          class: pageHeader,
          textContent: 'Ajuste de limite'
        }),
        node({
          tagName: 'div',
          id: 'app-content',
          class: content,
          children: [
            node({
              tagName: 'div',
              id: 'input-container',
              class: inputFocus ? `${inputContainer} ${inputContainerFocus}` : inputContainer,
              children: [
                node({
                  tagName: 'input',
                  class: input,
                  type: 'number',
                  max: maxLimit,
                  maxLength: maxLimit.toString().length,
                  value: definedLimit,
                  oninput: e => this.setDefinedLimit(e),
                  onfocus: e => this.setInputFocus(true),
                  onblur: e => this.setInputFocus(false)
                }),
                node({
                  tagName: 'div',
                  class: inputLabel,
                  id: 'input-label',
                  children: [
                    node({
                      textContent: 'R$ '
                    }),
                    node({
                      tagName: 'strong',
                      textContent: definedLimit
                    }),
                    node({
                      textContent: ',00'
                    })
                  ]
                })
              ]
            }),
            node({
              componentClass: LimitLabel,
              props: {
                maxLimit,
                definedLimit
              }
            }),
            node({
              tagName: 'div',
              class: rangeContainer,
              id: 'range-container',
              children: [
                node({
                  tagName: 'span',
                  textContent: 0
                }),
                node({
                  tagName: 'span',
                  textContent: maxLimit
                }),
                node({
                  tagName: 'div',
                  class: rangeTrack,
                  id: 'range-track',
                  style: `width: calc(${this.getTrackWidth()}%)`
                }),
                node({
                  tagName: 'input',
                  type: 'range',
                  class: range,
                  min: 0,
                  max: maxLimit,
                  value: definedLimit,
                  oninput: e => this.setDefinedLimit(e)
                })
              ]
            })
          ]
        })
      ],
    })
  }
}

export default App
