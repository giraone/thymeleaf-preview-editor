<script>
  // The id of the iframe
  export let id = Math.floor(Math.random() * 1000000);

  //-- Exported functions ------------------------------------------------------------

  export const htmlPreview = {
    showHtmlContent(htmlContent) {
      const iframe = document.getElementById(id);
      iframe.srcdoc = htmlContent;
    }
  };

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<iframe
  id="{id}" class="preview"
  title="HTML Preview"
  srcdoc="<pre>No preview yet!</pre>"
/>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
.preview {
  width: 100%;
  min-height: 200px;
  height: 70vh;

  background-color: white;
  color: black;
  border: 1px solid grey;

  line-height: 1.15; 
  -webkit-text-size-adjust: 100%;
  margin-top: 0px;
  margin-bottom: -4px;
  margin-left: 0px;
  margin-right: 0px;
}
</style>
