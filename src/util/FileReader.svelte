<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let accept = '*';
  let fileinput;

  const onFileSelected = function(e) {
    const fileObject = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      dispatch("load", e.target.result);
    };
    reader.onerror = (e) => {
      alert('File cannot be read!' + JSON.stringify(e))
    };
    reader.readAsText(fileObject);
  };

  //-- Exported functions ------------------------------------------------------------

  // We need an object, that contains a function - this can be called from the parent component
  export const fileReader = {
    open() {
      fileinput.click();
    }
  };

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<!-- this input(type=file) is bound directly to the svelte object (this )-->
<input
  style="display:none"
  type="file"
  accept="{accept}"
  on:change={(e) => onFileSelected(e)}
  bind:this={fileinput}
/>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
