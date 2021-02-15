<script>
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import FileReader from "../util/FileReader.svelte";
  const dispatch = createEventDispatcher();

  // The id of the container (div or h)
  export let id = Math.floor(Math.random() * 1000000);
  // The monaco editor object
  let editor;
  // The FileReader-Component object
  let fileReader;


  function initMonaco() {
    editor = monaco.editor.create(document.getElementById("container-" + id), {
      value: [".strong {", "\tcolor: red;", "}"].join("\n"),
      language: "css",
      theme: "vs-dark",
      lineNumbers: "on",
      automaticLayout: true, // built-in auto resize to parent container 
      scrollBeyondLastLine: false,
      readOnly: false
    });

    editor.addAction({
      id: "loadFile",
      label: "Load CSS file ...",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.o],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.0,
      run: function () {
        fileReader.open();
        return null;
      },
    });

    editor.addAction({
      id: "saveFile",
      label: "Save CSS file ...",
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.01,
      run: saveCssData
    });

    editor.addAction({
      id: "process",
      label: "Process",
      keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyCode.F12 ],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.02,
      run: function (ed) {
        dispatch("process", { from: ed, name: "css", content: ed.getValue() });
        return null;
      }
    });
  }

  function dispose() {
    // Dispose editor via Svelte's onmount return
    // console.log("Disposing monaco CSS editor " + editor);
    if (editor) {
      editor.dispose();
      editor = null;
    }
  }

  function saveCssData() {
    saveFile(editor.getValue(), 'text/css', 'file.css');
  }

  function loadCssData(customEvent) {
    editor.setValue(customEvent.detail);
  }

  //-- Lifecycle functions -----------------------------------------------------------

    onMount(async () => {
    // console.log("CssEditor.onMount");
    initMonaco();
    return dispose;
  });

  //-- Exported functions ------------------------------------------------------------

  export const cssEditor = {
    getValue() {
      if (editor != null) {
        return editor.getValue();
      } else {
        return null;
      }
    },
    setValue(value) {
      if (editor != null) {
        editor.setValue(value);
      }
    }
  };

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<!-- We have only one div container for the editor -->
<div id="container-{id}" class="code-editor" />
<!-- And an invisible file reader component -->
<FileReader accept=".css" bind:fileReader={fileReader} on:load={loadCssData} />

<!-- CSS ------------------------------------------------------------------------- -->

<style>
  div.code-editor {
    width: 100%;
    height: 31vh;
    border: 1px solid grey;
  }
</style>
