<script>
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  import FileReader from '../util/FileReader.svelte';
  const dispatch = createEventDispatcher();

  // The id of the container (div or h)
  export let id = Math.floor(Math.random() * 1000000);
  // The default JSON content
  export let defaultContent = '{}';
  // The default JSON schema content
  export let defaultJSONSchemaContent = '{}';

  // The monaco editor object
  let editor;
  // The FileReader-Component objects (JSON data, JSON schema)
  let fileReaderData;
  let fileReaderSchema;
  // Hold the JSON Schema model
  let jsonSchemaModel;

  function initMonaco() {
    // configure the JSON language support with schemas and schema associations
    const jsonSchemaUriString = 'file://content/default-json-schema.json';
    const modelUri = monaco.Uri.parse(jsonSchemaUriString); // a made up unique URI for our model
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: jsonSchemaUriString, // id of the first schema
          fileMatch: [modelUri.toString()], // associate with our model
          schema: JSON.parse(defaultJSONSchemaContent)
        }
      ]
    });

    jsonSchemaModel = monaco.editor.createModel(defaultContent, 'json', modelUri);
    // The monaco editor object
    editor = monaco.editor.create(document.getElementById('container-' + id), {
      language: 'json',
      theme: 'vs-dark',
      lineNumbers: 'on',
      automaticLayout: true, // built-in auto resize to parent container
      scrollBeyondLastLine: false,
      readOnly: false,
      model: jsonSchemaModel
    });

    editor.addAction({
      id: 'loadFile',
      label: 'Load JSON file ...',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.O],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.0,
      run: function () {
        fileReaderData.open();
        return null;
      }
    });

    editor.addAction({
      id: 'loadSchema',
      label: 'Load JSON schema file ...',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Q],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.1,
      run: function () {
        fileReaderSchema.open();
        return null;
      }
    });

    editor.addAction({
      id: 'saveFile',
      label: 'Save JSON file ...',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.2,
      run: saveJsonData
    });

    editor.addAction({
      id: 'process',
      label: 'Process',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F12],
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.3,
      run: function (ed) {
        dispatch('process', { from: ed, name: 'json', content: ed.getValue() });
        return null;
      }
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
    saveFile(editor.getValue(), 'application/json', 'file.json');
  }

  function loadJsonData(data) {
    editor.setValue(data);
  }

  function loadJsonSchema(schema) {
    
    if (jsonSchemaModel != null && editor.getModel() != null) {
      editor.setModel(null); // Detach old model
      jsonSchemaModel = null;
      return;
    }
    
    const jsonSchema = JSON.parse(schema);
    let schemaUri = jsonSchema['$id'];
    if (schemaUri == null) {
      schemaUri = 'file://content/schema-' + Math.floor(Math.random() * 1000000) + '.json';
    }
    const modelUri = monaco.Uri.parse(schemaUri);
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: schemaUri, // id of the schema
          fileMatch: [modelUri.toString()], // associate with our model
          schema: jsonSchema
        }
      ]
    });

    if (jsonSchemaModel == null) {
      jsonSchemaModel = monaco.editor.createModel(schema, 'json', modelUri);
    } else {
      jsonSchemaModel.uri = modelUri;
    }
    editor.setModel(jsonSchemaModel);
  }

  function onLoadJsonData(customEvent) {
    loadJsonData(customEvent.detail);
  }

  function onLoadJsonSchema(customEvent) {
    loadJsonSchema(customEvent.detail);
  }

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(async () => {
    // console.log("JsonEditor.onMount");
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
<FileReader accept=".json" bind:fileReader="{fileReaderSchema}" on:load="{onLoadJsonSchema}" />

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
