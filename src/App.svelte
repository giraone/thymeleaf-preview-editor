<script>
  import CssEditor from "./editor/CssEditor.svelte";
  import HtmlEditor from "./editor/HtmlEditor.svelte";
  import HtmlErrorMessages from "./editor/HtmlErrorMessages.svelte";
  import HtmlPreview from "./editor/HtmlPreview.svelte";
  import JsonSchemaEditor from "./editor/JsonSchemaEditor.svelte";
  import JsonEditor from "./editor/JsonEditor.svelte";
  import Navbar from "./layout/Navbar.svelte";
  import EditorAccordion from "./layout/EditorAccordion.svelte";
  import EditorAccordionItem from "./layout/EditorAccordionItem.svelte";

  import { onMount } from 'svelte';

  export let processUrl = 'http://localhost:8080/api/json-to-html';

  let jsonSchemaEditor;
  let jsonDataEditor;
  let htmlEditor;
  let cssEditor;
  let htmlPreview;
  let htmlErrorMessages;

  const defaultJsonDataContent = [
    "{",
    '\t"name": "User of Thymeleaf Editor"',
    "}",
  ].join("\n");

  const defaultJsonSchemaContent = "{}";

  const process = function(customEvent) {

    const jsonContent = jsonDataEditor.getValue();
    const templateContent = htmlEditor.getValue();
    const cssContent = cssEditor.getValue();

    const formData = new FormData();
    formData.append('data', new Blob([jsonContent], { type: 'application/json;charset=UTF-8' }), 'data.json');
    formData.append('template', new Blob([templateContent], { type: 'text/html;charset=UTF-8'}), 'template.html');
    if (cssContent.length > 0) {
      formData.append('css', new Blob([cssContent], { type: 'text/css;charset=UTF-8'}), 'template.css');
    }

    // console.log('upload ' + jsonContent.length + ' ' + templateContent.length + ' ' + cssContent.length);

    let req = new XMLHttpRequest();
    req.open('POST', processUrl);
    req.setRequestHeader('Accept', 'text/html');

    req.onload = function() {
        if (req.status == 200) {
          showResponse({htmlContent: req.responseText});
        } else {
          showResponse({
            errorMessages: 'Status Code: ' + req.status
              + '\r\nStatus Text: ' + req.statusText,
            htmlContent: req.responseText
          });
        }
    }

    req.send(formData);
  };

  function showResponse(dataSet) {
    if (dataSet.errorMessages) {
      htmlErrorMessages.showErrorMessages(dataSet.errorMessage);
    }
    if (dataSet.htmlContent) {
      htmlPreview.showHtmlContent(dataSet.htmlContent);
    }
  };

  const loadFolder = function(customEvent) {

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

  const saveAll = function saveAll() {

  };

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(async () => {
		process();
	});

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<main>
  <div class="columns">
    <div class="column">
      <Navbar title="Thymeleaf Editor/Preview"
        on:loadFolder={loadFolder}
        on:saveAll={saveAll}
        on:process={process}
      ></Navbar>
      <EditorAccordion id="editorsAccordion">
        <EditorAccordionItem title="JSON Schema Editor" isActive={true}>
          <JsonSchemaEditor id="jsonSchemaEditor" bind:jsonEditor={jsonSchemaEditor} on:process={process}
           defaultContent={defaultJsonSchemaContent} />
        </EditorAccordionItem>
        <EditorAccordionItem title="JSON Editor" isActive={true}>
          <JsonEditor id="jsonDataEditor" bind:jsonEditor={jsonDataEditor} on:process={process}
          defaultContent={defaultJsonDataContent} />
        </EditorAccordionItem>
        <EditorAccordionItem title="HTML Template Editor" isActive={true}>
          <HtmlEditor id="htmlEditor" bind:htmlEditor={htmlEditor} on:process={process} />
        </EditorAccordionItem>
        <EditorAccordionItem title="CSS Editor" isActive={true}>
          <CssEditor id="cssEditor" bind:cssEditor={cssEditor} on:process={process} />
        </EditorAccordionItem>
      </EditorAccordion>
    </div>
    <div class="column">
        <EditorAccordion id="previewAccordion">
          <EditorAccordionItem title="HTML Preview" isActive={true}>
            <HtmlPreview id="htmlPreview" bind:htmlPreview={htmlPreview} />
          </EditorAccordionItem>
          <EditorAccordionItem title="Error Messages" isActive={true}>
            <HtmlErrorMessages id="htmlErrorMessages" bind:htmlErrorMessages={htmlErrorMessages} />
          </EditorAccordionItem>
        </EditorAccordion>
      </div>
  </div>
</main>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
