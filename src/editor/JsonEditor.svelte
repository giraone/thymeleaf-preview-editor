<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import FileReader from "../util/FileReader.svelte";
  const dispatch = createEventDispatcher();

  // The id of the container (div or h)
  export let id = Math.floor(Math.random() * 1000000);
  // The monaco editor object
  let editor;
  // The FileReader-Component objects (JSON data, JSON schema)
  let fileReaderData;
  let fileReaderSchema;

  function initMonaco() {
    // console.log("Configure JSON language support with schemas for Monaco");
    // configure the JSON language support with schemas and schema associations
    const jsonSchemaUriString = "file://content/sample1/json-schema.json";
    const modelUri = monaco.Uri.parse(jsonSchemaUriString); // a made up unique URI for our model
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: jsonSchemaUriString, // id of the first schema
          fileMatch: [modelUri.toString()], // associate with our model
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                required: true,
                description: "The user's last name.",
              }
            },
          },
        },
      ],
    });

    // console.log("Creating new monaco JSON editor object");
    const jsonLines = [
      "{",
      '\t"name": "User of Thymeleaf Editor"',
      "}",
    ].join("\n");
    const model = monaco.editor.createModel(jsonLines, "json", modelUri);
    // The monaco editor object
    editor = monaco.editor.create(document.getElementById("container-" + id), {
      language: "json",
      theme: "vs-dark",
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      readOnly: false,
      model: model,
    });

    editor.addAction({
      id: "loadFile",
      label: "Load JSON file ...",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.O],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.0,
      run: function () {
        fileReaderData.open();
        return null;
      },
    });

    editor.addAction({
      id: "loadSchema",
      label: "Load JSON schema file ...",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Q],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.1,
      run: function () {
        fileReaderSchema.open();
        return null;
      },
    });

    editor.addAction({
      id: "process",
      label: "Process",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F12],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.2,
      run: function (ed) {
        dispatch("process", { from: ed, name: "json", content: ed.getValue() });
        return null;
      },
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

  function loadJsonData(data) {
    editor.setValue(data);
  }

  function loadJsonSchema(schema) {

    /*
    if (editor.getModel() != null) {
      editor.setModel(null); // Detach old model
      return;
    }
    */
    const jsonSchema = JSON.parse(schema);
    const schemaUri = jsonSchema['$id'];
    if (schemaUri == null) {
      schemaUri = "file://content/schema-" + Math.floor(Math.random() * 1000000) +".json";
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

    const model = monaco.editor.createModel(schema, "json", modelUri);
    editor.setModel(model);
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
<div id="container-{id}" class="code-editor" />
<!-- And two invisible file reader components -->
<FileReader
  accept=".json"
  bind:fileReader={fileReaderData}
  on:load={onLoadJsonData}
/>
<FileReader
  accept=".json"
  bind:fileReader={fileReaderSchema}
  on:load={onLoadJsonSchema}
/>

<!-- CSS ------------------------------------------------------------------------- -->
<style>
  div.code-editor {
    width: 100%;
    min-height: 200px;
    border: 1px solid grey;
  }
</style>
