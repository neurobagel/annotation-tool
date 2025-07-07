# Configuration Guide

This guide explains how to create and customize configurations for the annotation tool. Configurations define the standardized variables and vocabularies available to users during the annotation process. All configurations are centrally managed and distributed through the [Neurobagel communities repository](https://github.com/neurobagel/communities).

## Quick Setup

To create a new configuration:

1. Create a new directory and name it after the name of your configuration (e.g., `Enigma PD`)
2. Add a [`config.json` file](#configuring-variables-in-configjson) in your new directory that defines your standardized variables
3. Add any required vocabulary files (e.g., `sexTerms.json`) in the same directory
4. Reference these term files in your `config.json` using the `terms_file` field

The tool will automatically fetch and load new configurations, making it available in the configuration selector on the Upload page of the annotation tool.

## Configuring Variables in config.json

The `config.json` file defines the standardized variables available in the annotation tool. Each variable is configured with specific fields that determine its behavior and available standardized term options.

### Variable Configuration Fields

All standardized variables share a set of common fields, with additional type-specific fields depending on the `data_type`.

#### Common Fields (All Variable Types)

| Field Name                  | Description                                                                                                                                                                 | Required | Type                                        | Default Value | Example                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------- | ------------- | -------------------------------------------------------- |
| `name`                      | Human-readable name for the variable                                                                                                                                        | Yes      | string                                      | -             | `"Age"`                                                  |
| `id`                        | Unique identifier for the variable                                                                                                                                          | Yes      | string                                      | -             | `"Age"`                                                  |
| `data_type`                 | Specifies the variable type                                                                                                                                                 | Yes      | `"Categorical"` \| `"Continuous"` \| `null` | -             | `"Continuous"`                                           |
| `required`                  | Whether this variable must be present in the annotated dataset.                                                                                                             | No       | boolean                                     | `false`       | `true`                                                   |
| `description`               | Provides instructions or context for users about how to annotate or interpret this standardized variable.                                                                   | No       | string                                      | `null`        | `"Describe how to annotate this standardized variable."` |
| `is_multi_column_measure`   | Indicates if the variable represents a single measure that may have one or more subparts, measured across multiple columns (e.g., subscale scores from a single assessment) | No       | boolean                                     | `false`       | `true`                                                   |
| `can_have_multiple_columns` | Indicates if the variable can be mapped to multiple columns in the dataset (e.g., for multi-diagnosis or multi-assessment scenarios).                                       | No       | boolean                                     | `false`       | `true`                                                   |
| `same_as`                   | A URI indicating an equivalent concept in an external vocabulary or ontology.                                                                                               | No       | string \| null                              | `null`        | `"https://medra.org/terms/1234"`                         |

#### Type-Specific Fields

**Categorical Variables** (`data_type: "Categorical"`)
| Field Name | Description | Required | Type | Example |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | --------------- |
| `terms_file` | Path to the vocabulary JSON file containing allowed standardized term options for variable instances, relative to the configuration's directory | Yes | string | `"sexTerms.json"` |

**Continuous Variables** (`data_type: "Continuous"`)
| Field Name | Description | Required | Type | Example |
| ---------- | -------------------------------------- | -------- | ----------------------- | -------------------------- |
| `formats` | Array of allowed format options for column values | Yes | list of Format objects | See Format Configuration below |

**Other Variables** (`data_type: null`)

Variables with `data_type: null` are typically used for unique observation identifiers (e.g., Participant ID, Session ID) and multi-column measures (e.g., assessment tools). Multi-column measures require a `terms_file` to define the available standardized terms.

| Field Name   | Description                                                                                                                                     | Required | Type   | Example                  |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ------------------------ |
| `terms_file` | Path to the vocabulary JSON file containing allowed standardized term options for variable instances, relative to the configuration's directory | Yes\*    | string | `"assessmentTerms.json"` |

\*Required only for multi-column measures (`is_multi_column_measure: true`).

### Format Configuration

When specifying `formats` for continuous variables, each format object must have the following fields:

| Field Name | Description                            | Required | Type            | Default Value | Example            |
| ---------- | -------------------------------------- | -------- | --------------- | ------------- | ------------------ |
| `id`       | Unique identifier for the format       | Yes      | string          | -             | `"FromFloat"`      |
| `name`     | Human-readable name for the format     | Yes      | string          | -             | `"float"`          |
| `examples` | Array of example values in this format | No       | list of strings | `[]`          | `["24.2", "32.3"]` |

For an example `formats` field, see the Example Configuration below.

### Example Configuration

```json
[
  {
    "vocabulary_name": "Neurobagel Phenotypic Variables",
    "namespace_prefix": "nb",
    "namespace_url": "http://neurobagel.org/vocab/",
    "version": "1.0.0",
    "standardized_variables": [
      {
        "name": "Participant ID",
        "id": "ParticipantID",
        "data_type": null,
        "terms_file": null,
        "formats": null,
        "required": true,
        "description": "Describe how to annotate this standardized variable.",
        "is_multi_column_measure": false,
        "can_have_multiple_columns": false,
        "same_as": null
      },
      {
        "name": "Age",
        "id": "Age",
        "data_type": "Continuous",
        "terms_file": null,
        "formats": [
          {
            "id": "FromFloat",
            "name": "float",
            "examples": ["31.5"]
          },
          {
            "id": "FromEuro",
            "name": "euro",
            "examples": ["24,2", "32,3"]
          }
        ],
        "required": false,
        "description": "Describe how to annotate this standardized variable.",
        "is_multi_column_measure": false,
        "can_have_multiple_columns": false,
        "same_as": null
      },
      {
        "name": "Assessment tool",
        "id": "Assessment",
        "data_type": null,
        "terms_file": "assessmentsTerms.json",
        "formats": null,
        "required": false,
        "description": "Describe how to annotate this standardized variable.",
        "is_multi_column_measure": true,
        "can_have_multiple_columns": true,
        "same_as": "https://medra.org/terms/1234"
      },
      {
        "name": "Diagnosis",
        "id": "Diagnosis",
        "data_type": "Categorical",
        "terms_file": "diagnosisTerms.json",
        "formats": null,
        "required": false,
        "description": "Describe how to annotate this standardized variable.",
        "is_multi_column_measure": false,
        "can_have_multiple_columns": true,
        "same_as": null
      }
    ]
  }
]
```

## Adding Term Files

Term files are only used for categorical variables as they require a predefined set of standardized terms:

1. Create a JSON file in the config directory (e.g., `assessmentTerms.json`)
2. The file should contain an array of term objects with `id` and `name` fields
3. Reference the file in the variable's `terms_file` field

### Example Vocabulary File (`assessmentTerms.json`)

```json
[
  {
    "namespace_prefix": "epd",
    "namespace_url": "https://enigma-parkinson.org/id/",
    "vocabulary_name": "ENIGMA Parkinson's Assessments",
    "version": "1.0.0",
    "terms": [
      {
        "name": "Beck's Depression Inventory",
        "id": "1234",
        "abbreviation": "BDI",
        "description": "21 item self-report inventory for depression symptoms, short name BDI",
        "same_as": "https://snomedct.org/123124",
        "status": "approved"
      }
    ]
  }
]
```
