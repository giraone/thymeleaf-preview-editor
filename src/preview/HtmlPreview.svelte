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

<div class="preview">
  <iframe id="{id}" class="preview" title="HTML Preview"
    srcdoc="&lt;pre&gt;No HTML preview yet! Lookup in the window below for errors.&lt;/pre&gt;"
  ></iframe>
</div>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
