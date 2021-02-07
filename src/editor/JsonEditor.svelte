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
    console.log("Configure JSON language support with schemas for Monaco");
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
                description: "The user's last name.",
              }
            },
          },
        },
      ],
    });

    console.log("Creating new monaco JSON editor object");
    const jsonLines = [
      "{",
      '\t"name": "User"',
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
    console.log("Disposing monaco JSON editor " + editor);
    if (editor) {
      editor.dispose();
      editor = null;
    }
  }

  function loadJsonData(customEvent) {
    editor.setValue(customEvent.detail);
  }

  function loadJsonSchema(customEvent) {
    const model = monaco.editor.createModel(customEvent.detail, "json");
    editor.setModel(model);
  }

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(async () => {
    console.log("JsonEditor.onMount");
    initMonaco();
    return dispose;
  });

  //-- Exported functions ------------------------------------------------------------

  export const jsonEditor = {
    getValue() {
      console.log("JsonEditor.getValue " + editor.getValue());
      if (editor != null) {
        return editor.getValue();
      } else {
        return null;
      }
    },
  };
</script>

<!-- HTML ------------------------------------------------------------------------ -->

<!-- We have only one div container for the editor -->
<div id="container-{id}" class="code-editor" />
<!-- And an invisible file reader -->
<FileReader
  accept=".json"
  bind:fileReader={fileReaderData}
  on:load={loadJsonData}
/>
<FileReader
  accept=".json"
  bind:fileReader={fileReaderSchema}
  on:load={loadJsonSchema}
/>

<!-- CSS ------------------------------------------------------------------------- -->
<style>
  div.code-editor {
    width: 100%;
    min-height: 200px;
    border: 1px solid grey;
  }
</style>
