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
  let fileReaderData;


  function initMonaco() {
    console.log("Creating new monaco HTML editor object");
    editor = monaco.editor.create(document.getElementById("container-" + id), {
      value: ["<h1>Title</h1>", "<pre>Code</pre>"].join("\n"),
      language: "html",
      theme: "vs-dark",
      lineNumbers: "on",
      scrollBeyondLastLine: false,
      readOnly: false
    });

    editor.addAction({
      id: "loadFile",
      label: "Load HTML/Thymeleaf template file ...",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.o],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.0,
      run: function () {
        fileReaderData.open();
        return null;
      },
    });

    editor.addAction({
      id: "process",
      label: "Process",
      keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyCode.F12 ],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.1,
      run: function (ed) {
        dispatch("process", { from: ed, name: "html", content: ed.getValue() });
        return null;
      }
    });
  }

  function dispose() {
    // Dispose editor via Svelte's onmount return
    console.log("Disposing monaco HTML editor " + editor);
    if (editor) {
      editor.dispose();
      editor = null;
    }
  }

  function loadHtmlData(customEvent) {
    editor.setValue(customEvent.detail);
  }

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(async () => {
    console.log("HtmlEditor.onMount");
    initMonaco();
    return dispose;
  });

  //-- Exported functions ------------------------------------------------------------

  export const htmlEditor = {
    getValue() {
      console.log('HtmlEditor.getValue ' + editor.getValue());
      if (editor != null) {
        return editor.getValue();
      } else {
        return null;
      }
    }
  };

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<!-- We have only one div container for the editor -->
<div id="container-{id}" class="code-editor" />
<!-- And an invisible file reader -->
<FileReader accept=".html" bind:fileReader={fileReaderData} on:load={loadHtmlData} />

<!-- CSS ------------------------------------------------------------------------- -->

<style>
  div.code-editor {
    width: 100%;
    min-height: 300px;
    border: 1px solid grey;
  }
</style>
