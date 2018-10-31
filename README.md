# Mini React

## Technologies

- TypeScript
- Rollup
- Webpack
- Jest
- Testcafe

## Setup

#### Install Node.js and Yarn
- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)


#### Install project dependencies:

`yarn`


## Running Application Example

There are several tasks that we can run:

- `yarn dev`: Build the library for dev purposes and start a dev server with the Example app
- `yarn build:lib`: Build the library for production


## Unit Tests

I used **Jest** for the unit tests and, right now, the code coverage is pretty good:
`97.79%` **Statements**
`90.38%` **Branches**
`100.0%` **Functions**
`97.67%` **Lines**

To run the Unit tests:

- `yarn test:unit`: Run the unit tests on every test case
- `yarn test:unit:watch`: Run the unit tests on watch mode
- `yarn test:unit:coverage`: Generates a coverage report inside the `coverage` folder
- `yarn test:unit:coverage:open`: Generates a coverage report and open it on your web browser


## E2E Tests

To make sure that the App is rendering correctly on every browser, I created some simple E2E tests. They were done using **TestCafe**. The tests are not a complete solution, but have some small tests to guarantee that the elements were actually rendered by Chrome, Chrome Canary, Firefox and Safari. I didn't include MS Edge because I ran the tests on a Mac machine and I also didn't have a remote test environment, like Saucelabs or Browserstacks :(. But it should work, tho.

To run the E2E tests:

- `yarn test:e2e:firefox-headless`: Run the test on Firefox in Headless mode (without open the browser tab)
- `yarn test:e2e:chrome-headless`: Run the test on Chrome in Headless mode (without open the browser tab)
- `yarn test:e2e:chrome-canary-headless`: Run the test on Chrome Canary in Headless mode (without open the browser tab)
- `yarn test:e2e:safari`: Run the test on Safari opening on a full browser
- `yarn test:e2e:firefox`: Run the test on Firefox opening on a full browser
- `yarn test:e2e:chrome`: Run the test on Chrome opening on a full browser
- `yarn test:e2e:chrome-canary`: Run the test on Chrome Canary opening on a full browser
- `yarn test:e2e:all`: Run every single tests on every full web browser
- `yarn test:e2e:all-headless`: Run every single tests on every browser in Headless mode

It's worth to notice that, if you don't have a Chrome Canary on your machine, the `test:e2e:all` and `test:e2e:all-headless` will fail, as it depends on them. As an alternative, we can replace Chrome Canary with Chrome, like that: `yarn test:e2e:firefox-headless; yarn test:e2e:chrome-headless`


## Project Features
You can check out the project features, development process and design decisions in the `docs` folder.


## Project Structure

- `__tests__`: Contain all the test files
  - `e2e`: The E2E tests. They are very simple.
  - `unit`: The complete Unit tests, separated by each file representing another inside the `src` folder

- `.vscode`: Built in configurations to debug Jest and Testcafe through VSCode (sorry, Sublime Text!)
- `docs`: The documentation about the project features, process and design decisions
- `example`: The example App, tweaked to match the Figma Layout

- `src`: All the library code
  - `core`: Core stuff. Things that doesn't really depends on browser API's
  - `dom`: All code that will use the **DOM** API
  - `typings`: TypeScript typings (they are not complete)
  - `utils`: Utils functions that are used by `core` and `dom`

- `babel.config.js`: Babel config for the Example App
- `jest.config.js`: Jest configuration for Unit Tests (they also run in TypeScript)
- `rollup.config.js`: Rollup configuration for the build tools of the library (they will generate files for CommonJS, UMD, ESM and a Minified version to embed on a index.html)
- `webpack.config.js`: Webpack config for the Example App
- `package.json`: Dependencies. It's worth to know that the Library do not have any 3rd party dependency. Only the Example App that relies on **Emotion** (a more performant alternative to Styled Components) library for Styling.
- `tsconfig.json`: TypeScript configuration
- `tslint.json`: TypeScript lint (it's not complete)


## Code Style

The library uses [Airbnb JavaScript Code Style](https://github.com/airbnb/javascript)


## Troubleshooting

If you're running into problems you can try to fix clearing some internal caches:

- `yarn clear`: Removes and install all yarn dependencies again


## That's it

I hope you'll enjoy it. :)
