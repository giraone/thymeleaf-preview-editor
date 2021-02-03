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
    const jsonData = jsonEditor.getValue();
    const htmlData = htmlEditor.getValue();
    const cssData = cssEditor.getValue();
    alert('process ' + processUrl + ' ' + e.detail.name + ' ' + jsonData.length + ' ' + htmlData.length + ' ' + cssData.length);
  };
  
  const showPreview = function(e) {
    const iframe = document.getElementById(htmlPreview.id);
    if (!iframe) {
      alert('iframe ' + previewFrame + ' not found!');
    }
    iframe.srcdoc = dataSet.htmlData; // HTML5!
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
