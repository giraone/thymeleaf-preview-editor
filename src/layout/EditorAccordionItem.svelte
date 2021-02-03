<script>
  // The id of the container (div or h)
  export let id = Math.floor(Math.random() * 1000000);
  export let title = "Accordion Title";
  export let isOpen = true;
</script>

<!-- HTML ------------------------------------------------------------------------ -->

<div class="accordion-item">
  <h2 class="accordion-header no-margin" id="accordion-item-{id}">
    <button class="accordion-button" type="button" on:click={() => (isOpen = !isOpen)}>{title}</button>
  </h2>
  <div class="no-margin" id="accordion-item-content-{id}">
    <div class="no-margin" class:collapse={!isOpen}>
      <slot>
        <em>no accordion item content was provided</em>
      </slot>
    </div>
  </div>
</div>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
