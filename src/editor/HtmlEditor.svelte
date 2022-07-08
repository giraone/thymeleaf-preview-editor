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
      value: ["<!DOCTYPE html>",
            "<html lang=\"en\">",
            "<head>",
            " <meta charset='utf-8'>",
            " <meta name='viewport' content='width=device-width,initial-scale=1'>",
            " <style></style>",
            "</head>",
            "<body>",
            " <h1>Hello <span th:text=\"${name}\" class=\"strong\">World</span></h1>",
            "</body>",
            "</html>"
          ].join("\n"),
      language: "html",
      theme: "vs-dark",
      lineNumbers: "on",
      automaticLayout: true, // built-in auto resize to parent container
      scrollBeyondLastLine: false,
      readOnly: false,
      formatOnPaste: true
    });

    editor.addAction({
      id: "loadFile",
      label: "Load HTML/Thymeleaf template file ...",
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
      label: "Save HTML/Thymeleaf template file ...",
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.1,
      run: saveHtmlData
    });

    editor.addAction({
      id: "process",
      label: "Process",
      keybindings: [ monaco.KeyMod.CtrlCmd | monaco.KeyCode.F12 ],
      contextMenuGroupId: "navigation",
      contextMenuOrder: 1.2,
      run: function (ed) {
        dispatch("process", { from: ed, name: "html", content: ed.getValue() });
        return null;
      }
    });
  }

  function dispose() {
    // Dispose editor via Svelte's onmount return
    // console.log("Disposing monaco HTML editor " + editor);
    if (editor) {
      editor.dispose();
      editor = null;
    }
  }

  function saveHtmlData() {
    saveFile(editor.getValue(), 'text/html', 'file.html');
  }

  function loadHtmlData(customEvent) {
    editor.setValue(customEvent.detail);
  }

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(async () => {
    // console.log("HtmlEditor.onMount");
    initMonaco();
    return dispose;
  });

  //-- Exported functions ------------------------------------------------------------

  export const htmlEditor = {
    getValue() {
      // console.log('HtmlEditor.getValue ' + editor.getValue());
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
<FileReader accept=".html" bind:fileReader={fileReader} on:load={loadHtmlData} />

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
