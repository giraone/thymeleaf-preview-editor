<script>
  // The id of the iframe
  export let id = Math.floor(Math.random() * 1000000);

  //-- Exported functions ------------------------------------------------------------

  export const htmlErrorMessages = {
    showErrorMessages(textContent) {
      const pre = document.getElementById(id);
      pre.textContent = textContent;
    },
  };
</script>

<!-- HTML ------------------------------------------------------------------------ -->

<pre {id} class="error-messages" />

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
