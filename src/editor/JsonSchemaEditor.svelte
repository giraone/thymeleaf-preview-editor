<script>
  import { onMount } from 'svelte';
  import FileReader from '../util/FileReader.svelte';

  // The id of the container (div or h)
  export let id = Math.floor(Math.random() * 1000000);
  // The default JSON content
  export let defaultContent = '{}';

  // The monaco editor object
  let editor;
  // The FileReader-Component objects (JSON data, JSON schema)
  let fileReaderData;

  // From https://json-schema.org/draft-07/schema (15.02.2021)
  const jsonSchemaSchema = `
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://json-schema.org/draft-07/schema#",
  "title": "Core schema meta-schema",
  "definitions": {
    "schemaArray": {
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "#"
      }
    },
    "nonNegativeInteger": {
      "type": "integer",
      "minimum": 0
    },
    "nonNegativeIntegerDefault0": {
      "allOf": [
        {
          "$ref": "#/definitions/nonNegativeInteger"
        },
        {
          "default": 0
        }
      ]
    },
    "simpleTypes": {
      "enum": [
        "array",
        "boolean",
        "integer",
        "null",
        "number",
        "object",
        "string"
      ]
    },
    "stringArray": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true,
      "default": []
    }
  },
  "type": [
    "object",
    "boolean"
  ],
  "properties": {
    "$id": {
      "type": "string",
      "format": "uri-reference"
    },
    "$schema": {
      "type": "string",
      "format": "uri"
    },
    "$ref": {
      "type": "string",
      "format": "uri-reference"
    },
    "$comment": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "default": true,
    "readOnly": {
      "type": "boolean",
      "default": false
    },
    "writeOnly": {
      "type": "boolean",
      "default": false
    },
    "examples": {
      "type": "array",
      "items": true
    },
    "multipleOf": {
      "type": "number",
      "exclusiveMinimum": 0
    },
    "maximum": {
      "type": "number"
    },
    "exclusiveMaximum": {
      "type": "number"
    },
    "minimum": {
      "type": "number"
    },
    "exclusiveMinimum": {
      "type": "number"
    },
    "maxLength": {
      "$ref": "#/definitions/nonNegativeInteger"
    },
    "minLength": {
      "$ref": "#/definitions/nonNegativeIntegerDefault0"
    },
    "pattern": {
      "type": "string",
      "format": "regex"
    },
    "additionalItems": {
      "$ref": "#"
    },
    "items": {
      "anyOf": [
        {
          "$ref": "#"
        },
        {
          "$ref": "#/definitions/schemaArray"
        }
      ],
      "default": true
    },
    "maxItems": {
      "$ref": "#/definitions/nonNegativeInteger"
    },
    "minItems": {
      "$ref": "#/definitions/nonNegativeIntegerDefault0"
    },
    "uniqueItems": {
      "type": "boolean",
      "default": false
    },
    "contains": {
      "$ref": "#"
    },
    "maxProperties": {
      "$ref": "#/definitions/nonNegativeInteger"
    },
    "minProperties": {
      "$ref": "#/definitions/nonNegativeIntegerDefault0"
    },
    "required": {
      "$ref": "#/definitions/stringArray"
    },
    "additionalProperties": {
      "$ref": "#"
    },
    "definitions": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#"
      },
      "default": {}
    },
    "properties": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#"
      },
      "default": {}
    },
    "patternProperties": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#"
      },
      "propertyNames": {
        "format": "regex"
      },
      "default": {}
    },
    "dependencies": {
      "type": "object",
      "additionalProperties": {
        "anyOf": [
          {
            "$ref": "#"
          },
          {
            "$ref": "#/definitions/stringArray"
          }
        ]
      }
    },
    "propertyNames": {
      "$ref": "#"
    },
    "const": true,
    "enum": {
      "type": "array",
      "items": true,
      "minItems": 1,
      "uniqueItems": true
    },
    "type": {
      "anyOf": [
        {
          "$ref": "#/definitions/simpleTypes"
        },
        {
          "type": "array",
          "items": {
            "$ref": "#/definitions/simpleTypes"
          },
          "minItems": 1,
          "uniqueItems": true
        }
      ]
    },
    "format": {
      "type": "string"
    },
    "contentMediaType": {
      "type": "string"
    },
    "contentEncoding": {
      "type": "string"
    },
    "if": {
      "$ref": "#"
    },
    "then": {
      "$ref": "#"
    },
    "else": {
      "$ref": "#"
    },
    "allOf": {
      "$ref": "#/definitions/schemaArray"
    },
    "anyOf": {
      "$ref": "#/definitions/schemaArray"
    },
    "oneOf": {
      "$ref": "#/definitions/schemaArray"
    },
    "not": {
      "$ref": "#"
    }
  },
  "default": true
}
  `;

  function initMonaco() {
    // configure the JSON language support with schemas and schema associations
    const jsonSchemaUriString = 'http://json-schema.org/draft-07/schema#';
    const modelUri = monaco.Uri.parse(jsonSchemaUriString); // URI for JSON Schema
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: jsonSchemaUriString, // id of the first schema
          fileMatch: [modelUri.toString()], // associate with our model
          schema: jsonSchemaSchema
        }
      ]
    });

    const model = monaco.editor.createModel(defaultContent, 'json', modelUri);
    // The monaco editor object
    editor = monaco.editor.create(document.getElementById('container-' + id), {
      language: 'json',
      theme: 'vs-dark',
      lineNumbers: 'on',
      automaticLayout: true, // built-in auto resize to parent container
      scrollBeyondLastLine: false,
      readOnly: false,
      model: model,
      formatOnPaste: true,
      formatOnType: true
    });

    editor.addAction({
      id: 'loadFile',
      label: 'Load JSON Schema file ...',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.O],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.0,
      run: function () {
        fileReaderData.open();
        return null;
      }
    });

    editor.addAction({
      id: 'saveFile',
      label: 'Save JSON Schema file ...',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.2,
      run: saveJsonData
    });
  }

  function dispose() {
    // Dispose editor via Svelte's onmount return
    // console.log("Disposing monaco JSON editor " + editor);
    if (editor) {
      editor.dispose();
      editor = null;
    }
  }

  function saveJsonData() {
    saveFile(editor.getValue(), 'application/json', 'file-schema.json');
  }

  function loadJsonData(jsonData) {
    editor.setValue(jsonData);
  }

  function onLoadJsonData(customEvent) {
    loadJsonData(customEvent.detail);
  }

  function loadJsonSchema(jsonData, jsonSchema) {
    editor.setSchema(jsonSchema);
    editor.setValue(jsonData);
  }

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(async () => {
    initMonaco();
    return dispose;
  });

  //-- Exported functions ------------------------------------------------------------

  export const jsonEditor = {
    getValue() {
      return editor.getValue();
    },
    setValue(value) {
      loadJsonData(value);
    },
    setSchema(value, schema) {
      loadJsonSchema(value, schema);
    }
  };
</script>

<!-- HTML ------------------------------------------------------------------------ -->

<!-- We have only one div container for the editor -->
<div id="container-{id}" class="code-editor"></div>
<!-- And two invisible file reader components -->
<FileReader accept=".json" bind:fileReader="{fileReaderData}" on:load="{onLoadJsonData}" />

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
