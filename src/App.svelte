<script>
  import JsonSchemaEditor from './editor/JsonSchemaEditor.svelte';
  import JsonEditor from './editor/JsonEditor.svelte';
  import HtmlEditor from './editor/HtmlEditor.svelte';
  import CssEditor from './editor/CssEditor.svelte';

  import HtmlErrorMessages from './preview/HtmlErrorMessages.svelte';
  import HtmlPreview from './preview/HtmlPreview.svelte';
  import PdfPreview from './preview/PdfPreview.svelte';

  import Navbar from './layout/Navbar.svelte';

  import { onMount } from 'svelte';

  import { processJsonToHtmlUrl, processJsonToPdfUrl } from './environment.js';

  let jsonSchemaEditor;
  let jsonDataEditor;
  let htmlEditor;
  let cssEditor;

  let jsonSchemaFile = 'file-schema.json';
  let jsonDataFile = 'file.json';
  let htmlFile = 'file.html';
  let cssFile = 'file.css';

  let htmlErrorMessages;
  let htmlPreview;
  let pdfPreview;
 
  let showPdf = false;

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

    // console.log('load ' + jsonContent.length + ' ' + templateContent.length + ' ' + cssContent.length);

    if (showPdf) {
      previewPdf(formData);
    } else {
      previewHtml(formData);
    }
  };

  const processToHtml = function () {
    showPdf = false;
    process();
  };

  const processToPdf = function () {
    showPdf = true;
    process();
  };

  const previewHtml = function (formData) {
   
    const req = new XMLHttpRequest();
    req.open('POST', processJsonToHtmlUrl);
    req.setRequestHeader('Accept', 'text/html');

    req.onload = function () {
      console.log('-- ' + req.readyState + ' ' + req.status);
      if (req.status === 200) {
        htmlPreview.showHtmlContent(req.responseText);
        htmlErrorMessages.showErrorMessages(req.responseText);
      } else {
        let text = 'Status Code: ' + req.status + '\r\nStatus Text: ' + req.statusText;
        if (req.responseText) {
          text += '\r\n- - -\r\n' + req.responseText;
        }
        htmlErrorMessages.showErrorMessages(text);
      }
    };
    req.onerror = function () {
      htmlErrorMessages.showErrorMessages('ERROR calling ' + processJsonToHtmlUrl);
    };

    req.send(formData);
  };

  const previewPdf = function (formData) {
  
    const req = new XMLHttpRequest();
    req.open('POST', processJsonToPdfUrl);
    req.setRequestHeader('Accept', 'application/pdf');
    req.responseType = "arraybuffer";

    req.onload = function () {
      console.log('-- ' + req.readyState + ' ' + req.status);
      if (req.status === 200) {
        htmlErrorMessages.showErrorMessages('');
        var arrayBuffer = req.response; // Note: not req.responseText!
        if (arrayBuffer) {
          let dataUrl = URL.createObjectURL(new Blob([arrayBuffer], {
            type: "application/pdf"
          }));     
          pdfPreview.showPdfFromUrl(dataUrl);
        }
      } else {
        htmlErrorMessages.showErrorMessages('Status Code: ' + req.status + '\r\nStatus Text: ' + req.statusText);
      }
    };
    req.onerror = function () {
      htmlErrorMessages.showErrorMessages('ERROR calling ' + processJsonToPdflUrl);
    };

    req.send(formData);
  };

  const loadFolder = function (customEvent) {
    if (customEvent == null || customEvent.detail == null) {
      return;
    }
    const fileContents = customEvent.detail;
    if (fileContents.jsonSchema) {
      jsonSchemaEditor.setValue(fileContents.jsonSchema);
      jsonDataEditor.setSchema(fileContents.jsonSchema);
      jsonSchemaFile = fileContents.jsonSchemaFile;
    }
    if (fileContents.jsonData) {
      jsonDataEditor.setValue(fileContents.jsonData);
      jsonDataFile = fileContents.jsonDataFile;
    }
    if (fileContents.html) {
      htmlEditor.setValue(fileContents.html);
      htmlFile = fileContents.htmlFile;
    }
    if (fileContents.css) {
      cssEditor.setValue(fileContents.css);
      cssFile = fileContents.cssFile;
    }
  };

  const saveAll = function() {

    saveFile(htmlEditor.getValue(), 'text/html', htmlFile);
    saveFile(jsonDataEditor.getValue(), 'application/json', jsonDataFile);
    saveFile(cssEditor.getValue(), 'text/css', cssFile);
    saveFile(jsonSchemaEditor.getValue(), 'application/json', jsonSchemaFile);
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
  <Navbar title="Thymeleaf Editor/Preview" on:loadFolder="{loadFolder}"
    on:saveAll="{saveAll}" on:processToHtml="{processToHtml}" on:processToPdf="{processToPdf}" />
    <span class="fileName">   Loaded files:</span>
    <span class="fileName">JSON schema = {jsonSchemaFile},</span>
    <span class="fileName">JSON data = {jsonDataFile},</span>
    <span class="fileName">HTML = {htmlFile},</span>
    <span class="fileName">CSS = {cssFile}</span>
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
      {#if showPdf}
      <PdfPreview id="pdfPreview" bind:pdfPreview />
      {:else}
      <HtmlPreview id="htmlPreview" bind:htmlPreview />  
      {/if}
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
span.fileName {
  vertical-align: top;
}
</style>
