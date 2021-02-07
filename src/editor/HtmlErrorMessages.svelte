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
  .error-messages {
    width: 100%;
    min-height: 100px;
    height: 30vh;

    background-color: white;
    color: black;
    border: 1px solid grey;

    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    overflow: auto;
    margin: 0;
  }
</style>
