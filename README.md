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

The annotation tool is designed to be configurable, allowing you to define your own set of standardized variables and their associated vocabularies (standardized terms). All possible configurations for the tool are stored in the `configs` directory, with one subdirectory per configuration.

To add a new configuration:

1. Create a new subdirectory under `configs/` (e.g., `configs/SomeConfig/`)
2. Add a [`config.json` file](#configuring-variables-in-configjson) in your new subdirectory that defines your standardized variables
3. Add any required vocabulary files (e.g., `sexTerms.json`) in the same subdirectory
4. Reference these term files in your `config.json` using the `term_file` field

The tool will automatically detect and load your new configuration, making it available in the configuration selector on the Upload page of the annotation tool.

### Configuring variables in config.json

The `config.json` file defines the standardized variables available in the annotation tool. Each variable is configured with specific fields that determine its behavior and available standardized term options.

#### Variable Configuration Fields

| Field Name                | Description                                                                                                                                                                                                                            | Required | Type                                              | Default Value | Example                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------- | ------------- | ------------------------------ |
| `identifier`              | Unique identifier for the variable, as a prefixed URI representing a concept from a vocabulary (where the prefix denotes the vocabulary namespace)                                                                                     | Yes      | string                                            | -             | `"nb:ParticipantID"`           |
| `label`                   | Human-readable label for the variable                                                                                                                                                                                                  | Yes      | string                                            | -             | `"Subject ID"`                 |
| `data_type`               | Specifies if the variable is categorical, continuous, or neither                                                                                                                                                                       | Yes      | one of `"Categorical"`, `"Continuous"`, or null\* | -             | `"Categorical"`                |
| `is_multi_column_measure` | Indicates if the variable represents a single measure that may have one or more subparts, measured across multiple columns (e.g., subscale scores from a single assessment)                                                            | No       | boolean                                           | `false`       | `true`                         |
| `term_file`               | (Categorical variables only) Path to the vocabulary JSON file containing allowed standardized term options for variable instances, relative to the configuration's subdirectory                                                        | No       | string \| null                                    | `null`        | `"sexTerms.json"`              |
| `identifies`              | Indicates if the variable describes unique observation identifiers (e.g., participant or session IDs). Use this field to specify what column values are expected to uniquely identify (e.g., "participant", "session"), if applicable. | No       | string                                            | `null`        | `"participant"`                |
| `formats`                 | (Continuous variables only) Array of allowed format options for column values                                                                                                                                                          | No       | list of Format objects                            | `[]`          | See Format Configuration below |

\*Note: `data_type` should be set to `null` for variables that are about unique observation identifiers (e.g., Subject ID, Session ID).

#### Format Configuration

When specifying `formats` for continuous variables, each format object must have the following fields:

| Field Name | Description                                                                                             | Required | Type            | Default Value | Example            |
| ---------- | ------------------------------------------------------------------------------------------------------- | -------- | --------------- | ------------- | ------------------ |
| `termURL`  | Unique identifier for the format, as a prefixed URI (where the prefix denotes the vocabulary namespace) | Yes      | string          | -             | `"nb:FromFloat"`   |
| `label`    | Human-readable name for the format                                                                      | Yes      | string          | -             | `"float"`          |
| `examples` | Array of example values in this format                                                                  | No       | list of strings | `[]`          | `["24.2", "32.3"]` |

For an example `formats` field, see the Example Configuration below.

#### Example Configuration

```json
{
  "standardized_variables": [
    "Subject ID": {
      "identifier": "nb:ParticipantID",
      "label": "Subject ID",
      "data_type": null,
      "is_multi_column_measurement": false,
      "can_have_multiple_columns": false,
      "required": true,
      "term_file": null,
      "identifies": "participant"
    },
    {
      "identifier": "nb:Age",
      "label": "Age",
      "data_type": "Continuous",
      "is_multi_column_measurement": false,
      "can_have_multiple_columns": false,
      "required": false,
      "term_file": null,
      "formats": [
        {
          "termURL": "nb:FromFloat",
          "label": "float",
          "examples": ["24.2", "32.3"]
        },
        {
          "termURL": "nb:FromEuro",
          "label": "euro",
          "examples": ["24,2", "32,3"]
        }
      ]
    },
    {
      "identifier": "nb:Diagnosis",
      "label": "Diagnosis",
      "data_type": "Categorical",
      "is_multi_column_measurement": false,
      "can_have_multiple_columns": true,
      "required": false,
      "term_file": "diagnosisTerms.json"
    }
  ]
}
```

#### Adding Term Files

Term files are only used for categorical variables because they require a predefined set of standardized terms:

1. Create a JSON file in the config directory (e.g., `sexTerms.json`)
2. The file should contain an array of term objects with `identifier` and `label` fields
3. Reference the file in the variable's `term_file` field

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
