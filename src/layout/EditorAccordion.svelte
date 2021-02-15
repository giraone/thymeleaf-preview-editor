<script>

  // The id of the container (div or h)
  export let id = Math.floor(Math.random() * 1000000);

  //-- Lifecycle functions -----------------------------------------------------------

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<div class="accordion no-margin" id="accordion-{id}">
 <slot>
   <em>no accordion items were provided for "accordion-{id}"</em>
 </slot>
</div>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
  div.accordion {
    width: 100%;
    height: 94vh;
    overflow: hidden;
  }
</style>
