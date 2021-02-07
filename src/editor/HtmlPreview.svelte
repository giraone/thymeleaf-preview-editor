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
  height: 100vh;

  background-color: white;
  color: black;
  border: 1px solid grey;

  line-height: 1.15; 
  -webkit-text-size-adjust: 100%;
  margin: 0;
}
</style>
