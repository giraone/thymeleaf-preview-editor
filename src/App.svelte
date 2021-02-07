<script>
  import CssEditor from "./editor/CssEditor.svelte";
  import HtmlEditor from "./editor/HtmlEditor.svelte";
  import HtmlErrorMessages from "./editor/HtmlErrorMessages.svelte";
  import HtmlPreview from "./editor/HtmlPreview.svelte";
  import JsonEditor from "./editor/JsonEditor.svelte";
  import EditorAccordion from "./layout/EditorAccordion.svelte";
  import EditorAccordionItem from "./layout/EditorAccordionItem.svelte";

  export let processUrl = 'http://localhost:8080/api/json-to-html';

  let jsonEditor;
  let htmlEditor;
  let cssEditor;
  let htmlPreview;
  let htmlErrorMessages;

  const process = function(e) {

    const jsonContent = jsonEditor.getValue();
    const templateContent = htmlEditor.getValue();
    const cssContent = cssEditor.getValue();
    console.log('process ' + processUrl + ' ' + e.detail.name + ' ' + jsonContent.length + ' ' + templateContent.length + ' ' + cssContent.length);
    
    const formData = new FormData();
    console.log('1');
    formData.append('data', new Blob([jsonContent], { type: 'application/json;charset=UTF-8' }), 'data.json');
    console.log('1');
    formData.append('template', new Blob([templateContent], { type: 'text/html;charset=UTF-8'}), 'template.html');
    console.log('1');
    if (cssContent.length > 0) {
      formData.append('css', new Blob([cssContent], { type: 'text/css;charset=UTF-8'}), 'template.css');
    }

    console.log('upload ' + jsonContent.length + ' ' + templateContent.length + ' ' + cssContent.length);

    let req = new XMLHttpRequest();
    req.open('POST', processUrl);
    req.setRequestHeader('Accept', 'text/html');

    req.onload = function() {
        if (req.status == 200) {
          showResponse({htmlContent: req.responseText});
        } else {
            alert('Error: ' + req.statusText);
            showResponse({
              errorMessages: 'Status Code: ' + req.statusCode
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

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<main>
  <div class="container full-width-and-height">
    <div class="row full-width-and-height">
      <div class="col-6 no-margin">
        <EditorAccordion id="editorsAccordion">
          <EditorAccordionItem title="JSON Editor" isOpen="false">
            <JsonEditor id="jsonEditor" bind:jsonEditor={jsonEditor} on:process={process} />
          </EditorAccordionItem>
          <EditorAccordionItem title="HTML Template Editor">
            <HtmlEditor id="htmlEditor" bind:htmlEditor={htmlEditor} on:process={process} />
          </EditorAccordionItem>
          <EditorAccordionItem title="CSS Editor" isOpen="false">
            <CssEditor id="cssEditor" bind:cssEditor={cssEditor} on:process={process} />
          </EditorAccordionItem>
        </EditorAccordion>
      </div>
      <div class="col-6 no-margin">
          <EditorAccordion id="previewAccordion">
            <EditorAccordionItem title="HTML Preview">
              <HtmlPreview id="htmlPreview" bind:htmlPreview={htmlPreview} />
            </EditorAccordionItem>
            <EditorAccordionItem title="Error Messages" isOpen="false">
              <HtmlErrorMessages id="htmlErrorMessages" bind:htmlErrorMessages={htmlErrorMessages} />
            </EditorAccordionItem>
          </EditorAccordion>
        </div>
    </div>
  </div>
</main>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
