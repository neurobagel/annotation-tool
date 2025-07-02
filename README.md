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
[Configuration](#configuration) |
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

## Configuration

The annotation tool is designed to be configurable, allowing you to define your own set of standardized variables and their associated vocabularies. All configurations are stored in the `configs` directory, with each configuration having its own subdirectory.

To add a new configuration:

1. Create a new directory under `configs/` (e.g., `configs/MyConfig/`)
2. Add a `config.json` file in your new directory that defines your standardized variables
3. Add any required vocabulary files (e.g., `sexTerms.json`) in the same directory
4. Reference these vocabulary files in your `config.json` using the `vocab_file` field

The tool will automatically detect and load your new configuration, making it available in the configuration selector.

### Configuring Variables in config.json

The `config.json` file defines the standardized variables available in the annotation tool. Each variable is configured with specific fields that determine its behavior and available options.

#### Variable Configuration Fields

| Field Name                    | Description                                                                                                   | Required | Type             | Default Value | Example                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ---------------- | ------------- | ------------------------------ |
| `identifier`                  | Unique identifier for the variable                                                                            | Yes      | string           | -             | `"nb:ParticipantID"`           |
| `label`                       | Human-readable label for the variable                                                                         | Yes      | string           | -             | `"Subject ID"`                 |
| `data_type`                   | Specifies if the variable is categorical or continuous                                                        | Yes      | string \| null\* | -             | `"Categorical"`                |
| `is_multi_column_measurement` | Indicates if the variable can be measured across multiple columns                                             | No       | boolean          | `false`       | `true`                         |
| `vocab_file`                  | Path to the vocabulary file containing allowed terms for categorical variables (relative to config directory) | No       | string \| null   | `null`        | `"sexTerms.json"`              |
| `identifies`                  | Indicates if the variable is about unique observation identifiers (e.g., participant or session IDs)          | No       | string           | `null`        | `"participant"`                |
| `formats`                     | Array of allowed format options for continuous variables                                                      | No       | Format[]         | `[]`          | See Format Configuration below |

\*Note: `data_type` should be set to `null` for variables that are about unique observation identifiers (e.g., Subject ID, Session ID).

#### Format Configuration

When specifying formats for continuous variables, each format object has the following structure:

| Field Name | Description                            | Required | Type     | Default Value | Example            |
| ---------- | -------------------------------------- | -------- | -------- | ------------- | ------------------ |
| `termURL`  | Unique identifier for the format       | Yes      | string   | -             | `"nb:FromFloat"`   |
| `label`    | Human-readable name for the format     | Yes      | string   | -             | `"float"`          |
| `examples` | Array of example values in this format | No       | string[] | `[]`          | `["24.2", "32.3"]` |

#### Example Configuration

```json
{
  "standardizedVariables": {
    "Subject ID": {
      "identifier": "nb:ParticipantID",
      "label": "Subject ID",
      "data_type": null,
      "is_multi_column_measurement": false,
      "vocab_file": null,
      "identifies": "participant"
    },
    "Age": {
      "identifier": "nb:Age",
      "label": "Age",
      "data_type": "Continuous",
      "is_multi_column_measurement": false,
      "vocab_file": null,
      "formats": [
        {
          "termURL": "nb:FromFloat",
          "label": "float",
          "examples": ["24.2", "32.3"]
        }
      ]
    }
  }
}
```

#### Adding Vocabulary Files

For categorical variables that require a predefined set of terms:

1. Create a JSON file in the config directory (e.g., `sexTerms.json`)
2. The file should contain an array of term objects with `identifier` and `label` fields
3. Reference the file in the variable's `vocab_file` field

Example vocabulary file (`sexTerms.json`):

```json
[
  {
    "identifier": "nb:Male",
    "label": "Male"
  },
  {
    "identifier": "nb:Female",
    "label": "Female"
  }
]
```

## Testing

The Annotation tool uses [Cypress](https://www.cypress.io/) for integration and component testing, and [Vitest](https://vitest.dev/) for unit testing.

## License

The Neurobagel Annotation tool uses the [MIT License](https://github.com/neurobagel/annotation-tool/blob/main/LICENSE).
