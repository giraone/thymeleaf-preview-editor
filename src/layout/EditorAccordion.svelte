<script>

  // The id of the container (div or h)
  export let id = Math.floor(Math.random() * 1000000);

  //-- Lifecycle functions -----------------------------------------------------------

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<div class="no-margin" id="accordion-{id}">
 <slot>
   <em>no accordion items were provided for "accordion-{id}"</em>
 </slot>
</div>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
