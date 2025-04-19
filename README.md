<div align="center">

# Annotation Tool

[![Website](https://img.shields.io/website?label=staging%20app&up_message=live&style=flat-square&url=https%3A%2F%2Fstaging-annotation.netlify.app)](https://staging-annotation.netlify.app/)
[![Main branch checks status](https://img.shields.io/github/check-runs/neurobagel/annotation-tool/main?style=flat-square&logo=github)](https://github.com/neurobagel/annotation-tool/actions?query=branch:main)
[![Tests status](https://img.shields.io/github/actions/workflow/status/neurobagel/annotation-tool/tests.yaml?branch=main&style=flat-square&logo=github&label=tests)](https://github.com/neurobagel/annotation-tool/actions/workflows/tests.yaml)
[![Codecov](https://img.shields.io/codecov/c/github/neurobagel/annotation-tool?style=flat-square&logo=codecov&link=https%3A%2F%2Fapp.codecov.io%2Fgh%2Fneurobagel%2Fannotation-tool)](https://app.codecov.io/gh/neurobagel/annotation-tool)
[![Node version](https://img.shields.io/badge/node-20-green?style=flat-square&logo=nodedotjs)](https://nodejs.org/en)
[![License](https://img.shields.io/github/license/neurobagel/annotation-tool?style=flat-square&color=purple&link=LICENSE)](LICENSE)

The annotation tool is a React application, developed in [TypeScript](https://www.typescriptlang.org/) using a variety of tools including [Vite](https://vitejs.dev/), [Cypress](https://www.cypress.io/), and [MUI](https://mui.com/).

[Quickstart](#quickstart) |
[Local Installation](#local-installation) |
[Usage](#usage) |
[Testing](#testing) |
[License](#license)

</div>

## Quickstart

The staging version of the annotation tool is hosted at [https://staging-annotation.netlify.app/](https://staging-annotation.netlify.app/).

## Local Installation

### Building and running

```bash
# Install dependencies
$ npm install

# Serve with hot module replacement at localhost:5173
$ npm run dev

# Build for production and launch server
$ npm run build
$ npm run preview
```

## Usage

1. Upload your data table (.tsv) file (and/or data dictionary)
2. Annotate the columns
   - Add/edit the column description
   - Select the data type (categorical or continuous) of the column
   - Map columns to Neurobagel standardized variables
3. Annotate the values of the annotated columns
   - Add/edit levels' description (if column data type is categorical) or units description (if column data type is continuous)
4. Download an annotated version of a BIDS-valid data dictionary for your dataset

## Testing

The Annotation tool uses [Cypress](https://www.cypress.io/) for integration and component testing, and [Vitest](https://vitest.dev/) for unit testing.

## License

The Neurobagel Annotation tool uses the [MIT License](https://github.com/neurobagel/annotation-tool/blob/main/LICENSE).
