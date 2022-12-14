<script>
  // The id of the iframe
  export let id = Math.floor(Math.random() * 1000000);

  function changeScale() {
      const scaler = document.getElementById('os');
      if (!scaler) {
        return;
      }    
      var s = parseFloat(scaler.value);
      const frame = document.getElementById(id);
      if (!frame) {
        return;
      }    
      frame.style.transform='scale(' + s + ')';
      document.getElementById('scale').innerHTML = s.toFixed(2);
  }

  //-- Exported functions ------------------------------------------------------------

  export const htmlPreview = {
    showHtmlContent(htmlContent) {
      const iframe = document.getElementById(id);
      iframe.srcdoc = htmlContent;
    }
  };
</script>

<!-- HTML ------------------------------------------------------------------------ -->

<div class="scale">
<input id="os" class="scale" type="range" min="0.25" max="8.0" value="1.0" step="0.25" on:change="{changeScale}" />
<span class="scale" id="scale">1.00</span>
</div>
<div class="preview">
  <iframe id="{id}" class="preview" title="HTML Preview" srcdoc="&lt;pre&gt;No HTML preview yet! Lookup in the window below for errors.&lt;/pre&gt;"></iframe>
</div>

<!-- CSS ------------------------------------------------------------------------- -->
<style>
</style>
