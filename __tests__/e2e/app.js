import { Selector } from 'testcafe'

fixture('App Test').page('http://localhost:8080/')

test('Open Browser and check for initial render', async (browser) => {
  await browser
    .expect(Selector('body').exists).ok()
    .expect(Selector('#app').exists).ok()
    .expect(Selector('h1').exists).ok()
    .expect(Selector('#app-content').tagName).eql('div')
    .expect(Selector('#input-container').tagName).eql('div')
    .expect(Selector('#input-container input').exists).ok()
    .expect(Selector('#limit-label').tagName).eql('p')
    .expect(Selector('#input-label').tagName).eql('div')
    .expect(Selector('#range-container').tagName).eql('div')
    .expect(Selector('#range-container input').exists).ok()
    .expect(Selector('#range-track').tagName).eql('div')
})

test('Check Each element content', async (browser) => {
  await browser
    .expect(Selector('h1').innerText).eql('AJUSTE DE LIMITE')
    .expect(Selector('#input-container input').value).eql('2500')
    .expect(Selector('#range-container input').value).eql('2500')
    .expect(Selector('#input-label').innerText).eql('R$ 2500,00')
    .expect(Selector('#limit-label').innerText).eql('R$ 2500,00 disponíveis')
})

test('Change input values', async (browser) => {
  await browser
    .typeText(Selector('#input-container input'), '300', { replace: true })
    .expect(Selector('#input-container input').value).eql('300')
    .expect(Selector('#range-container input').value).eql('300')
    .expect(Selector('#input-label').innerText).eql('R$ 300,00')
    .expect(Selector('#limit-label').innerText).eql('R$ 4700,00 disponíveis')

    .typeText(Selector('#range-container input'), '1000', { replace: true })
    .expect(Selector('#input-container input').value).eql('1000')
    .expect(Selector('#range-container input').value).eql('1000')
    .expect(Selector('#input-label').innerText).eql('R$ 1000,00')
    .expect(Selector('#limit-label').innerText).eql('R$ 4000,00 disponíveis')
})
