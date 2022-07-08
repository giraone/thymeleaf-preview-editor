<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let fileinput;

  const onFileSelected = function(e) {
    const fileObjects = e.target.files;
    dispatch('load', fileObjects);
  };

  //-- Exported functions ------------------------------------------------------------

  // We need an object, that contains a function - this can be called from the parent component
  export const fileListing = {
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
  multiple="true"
  on:change={(e) => onFileSelected(e)}
  bind:this={fileinput}
/>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
