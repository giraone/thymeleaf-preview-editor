<script>
  // The id of the object tag
  export let id = Math.floor(Math.random() * 1000000);

  //-- Exported functions ------------------------------------------------------------

  export const pdfPreview = {
    showPdfFromUrl(pdfUrl) {
      const objectElement = document.getElementById(id);
      objectElement.data = pdfUrl;
    }
  };

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<object id="{id}" data="static/images/no-preview-yet.pdf" type="application/pdf"
  title="Pdf Preview" standby="Loading..." class="pdf">
  <pre>PDF display using &lt;object&gt; not possible!</pre>
</object>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
  object.pdf {
    width: 100%;
    height: 100%;
  }
</style>
