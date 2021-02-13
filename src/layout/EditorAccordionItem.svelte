<script>
  import { onMount } from 'svelte';

  // The id of the container (div or h)
  export let id = Math.floor(Math.random() * 1000000);
  export let title = "Accordion Title";
  export let isActive = true;

  let accordionItem = null;

  function toggle() {

    console.log('toggle ' + isActive);
    if (!accordionItem) {
      console.warn('accordionItem not set!');
      return;
    }
    if (isActive) {
      accordionItem.bulmaCollapsible('collapse');
      isActive=false;
    } else {
      accordionItem.bulmaCollapsible('expand');
      isActive=true;
    }
  }

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(() => {
    accordionItem = document.getElementById('accordion-item-' + id);
    
    if (accordionItem) {
      new bulmaCollapsible(accordionItem, { allowMultiple: true });
      if (!isActive) {
        accordionItem.bulmaCollapsible('collapse');
      }
    }
	});

</script>

<!-- HTML ------------------------------------------------------------------------ -->

<div class="card no-margin">

  <div class="no-margin">
		<a href="#/" on:click={toggle}>
      <span>{title}</span>
      <span class="icon">
				<i class="fas fa-angle-down" aria-hidden="true"></i>
			</span>
    </a>
  </div>

  <div id="accordion-item-{id}" class="is-collapsible no-margin" class:is-active={isActive}>
    <slot>
      <em>no accordion item content was provided</em>
    </slot>
  </div>
</div>

<!-- CSS ------------------------------------------------------------------------- -->

<style>
</style>
