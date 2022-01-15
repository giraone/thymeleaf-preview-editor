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
  srcdoc="<pre>No HTML preview yet!</pre>"
/>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
