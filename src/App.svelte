<script>
  import CssEditor from './editor/CssEditor.svelte';
  import HtmlEditor from './editor/HtmlEditor.svelte';
  import HtmlErrorMessages from './editor/HtmlErrorMessages.svelte';
  import HtmlPreview from './editor/HtmlPreview.svelte';
  import JsonSchemaEditor from './editor/JsonSchemaEditor.svelte';
  import JsonEditor from './editor/JsonEditor.svelte';
  import Navbar from './layout/Navbar.svelte';

  import { onMount } from 'svelte';

  export let processUrl = 'http://localhost:8080/api/json-to-html';

  let jsonSchemaEditor;
  let jsonDataEditor;
  let htmlEditor;
  let cssEditor;
  let htmlPreview;
  let htmlErrorMessages;

  const defaultJsonDataContent = ['{', '\t"name": "User of Thymeleaf Editor"', '}'].join('\n');

  const defaultJsonSchemaContent = '{}';

  const process = function () {
    const jsonContent = jsonDataEditor.getValue();
    const templateContent = htmlEditor.getValue();
    const cssContent = cssEditor.getValue();

    const formData = new FormData();
    formData.append('data', new Blob([jsonContent], { type: 'application/json;charset=UTF-8' }), 'data.json');
    formData.append('template', new Blob([templateContent], { type: 'text/html;charset=UTF-8' }), 'template.html');
    if (cssContent.length > 0) {
      formData.append('css', new Blob([cssContent], { type: 'text/css;charset=UTF-8' }), 'template.css');
    }

    // console.log('upload ' + jsonContent.length + ' ' + templateContent.length + ' ' + cssContent.length);

    const req = new XMLHttpRequest();
    
    req.open('POST', processUrl);
    req.setRequestHeader('Accept', 'text/html');

    req.onload = function () {
      console.log('-- ' + req.readyState + ' ' + req.status);
      if (req.status === 200) {
        showResponse({ htmlContent: req.responseText });
      } else {
        showResponse({
          errorMessages: 'Status Code: ' + req.status + '\r\nStatus Text: ' + req.statusText,
          htmlContent: req.responseText
        });
      }
    };
    req.onerror = function () {
      showResponse({ errorMessages: 'ERROR calling ' + processUrl});
    };

    req.send(formData);
  };

  function showResponse(dataSet) {
    
    if (dataSet.errorMessages) {
      let text = dataSet.errorMessages;
      if (dataSet.htmlContent) {
        text += '\r\n- - -\r\n' + dataSet.htmlContent;
      }
      htmlErrorMessages.showErrorMessages(text);
    }
    if (dataSet.htmlContent) {
      htmlPreview.showHtmlContent(dataSet.htmlContent);
      htmlErrorMessages.showErrorMessages(dataSet.htmlContent);
    }
  }

  const loadFolder = function (customEvent) {
    if (customEvent == null || customEvent.detail == null) {
      return;
    }
    const fileContents = customEvent.detail;
    if (fileContents.jsonSchema) {
      jsonSchemaEditor.setValue(fileContents.jsonSchema);
      jsonDataEditor.setSchema(fileContents.jsonSchema);
    }
    if (fileContents.jsonData) {
      jsonDataEditor.setValue(fileContents.jsonData);
    }
    if (fileContents.html) {
      htmlEditor.setValue(fileContents.html);
    }
    if (fileContents.css) {
      cssEditor.setValue(fileContents.css);
    }
  };

  const saveAll = function() {
    saveFile(htmlEditor.getValue(), 'text/html', 'file.html');
    saveFile(jsonDataEditor.getValue(), 'application/json', 'file.json');
    saveFile(cssEditor.getValue(), 'text/css', 'file.css');
    saveFile(jsonSchemaEditor.getValue(), 'application/json', 'file-schema.json');
  };

  function initResizer() {
    const col1 = document.getElementById("col1");
    const v1 = document.getElementById("v1");
    const col2 = document.getElementById("col2");
    const resizerV = new Resizer([col1, col2], [v1], 4, 20, false);
    resizerV.init();

    const row11 = document.getElementById("row11");
    const h11 = document.getElementById("h11");
    const row12 = document.getElementById("row12");
    const h12 = document.getElementById("h12");
    const row13 = document.getElementById("row13");
    const h13 = document.getElementById("h13");
    const row14 = document.getElementById("row14");
    const resizerH1 = new Resizer([row11, row12, row13, row14], [h11, h12, h13], 4, 60, true);
    resizerH1.init();

    const row21 = document.getElementById("row21");
    const h21 = document.getElementById("h21");
    const row22 = document.getElementById("row22");
    const resizerH2 = new Resizer([row21, row22], [h21], 4, 60, true);
    resizerH2.init();
  }

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(async () => {

    initResizer();
    process();
  });
</script>

<!-- HTML ------------------------------------------------------------------------ -->

<header>
  <Navbar title="Thymeleaf Editor/Preview" on:loadFolder="{loadFolder}" on:saveAll="{saveAll}" on:process="{process}" />
</header>
<main>
  <div class="column1" id="col1">
    <div class="card25-4" id="row11">
      <JsonSchemaEditor id="jsonSchemaEditor" bind:jsonEditor="{jsonSchemaEditor}" on:process="{process}" defaultContent="{defaultJsonSchemaContent}" />
    </div>
    <div class="horizontalBar" id="h11"></div>
    <div class="card25-4" id="row12">
      <JsonEditor id="jsonDataEditor" bind:jsonEditor="{jsonDataEditor}" on:process="{process}" defaultContent="{defaultJsonDataContent}" />
    </div>
    <div class="horizontalBar" id="h12"></div>
    <div class="card25-4" id="row13">
      <HtmlEditor id="htmlEditor" bind:htmlEditor on:process="{process}" />
    </div>
    <div class="horizontalBar" id="h13"></div>
    <div class="card25-4" id="row14">
      <CssEditor id="cssEditor" bind:cssEditor on:process="{process}" />
    </div>
  </div>
  <div class="verticalBar" id="v1"></div>
  <div class="column2" id="col2">
    <div class="card75-2 previewColor" id="row21">
      <HtmlPreview id="htmlPreview" bind:htmlPreview />
    </div>
    <div class="horizontalBar" id="h21"></div>
    <div class="card25-2" id="row22">
      <HtmlErrorMessages id="htmlErrorMessages" bind:htmlErrorMessages />
    </div>
  </div>
</main>

<!-- CSS ------------------------------------------------------------------------- -->

<!-- For the HTML preview, we want black on white - no dark theme! -->
<style>
.previewColor {
  background-color: white;
  color: black;
}
</style>
