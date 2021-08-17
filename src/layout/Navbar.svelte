<script>
  import FileListing from '../util/FileListing.svelte';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let title = 'Navigation';

  // The state of the dropdown menu
  let menuOpen = false;
  // The FileListing-Component object
  let fileListing;

  function openLoadFolderDialog() {
    fileListing.open(loadFolder);
    menuOpen = false;
    return null;
  }

  async function loadFolder(customEvent) {
    if (customEvent.detail == null) {
      return;
    }
    const fileObjects = customEvent.detail;

    let jsonData = null;
    let jsonSchema = null;
    let html = null;
    let css = null;

    for (var i = 0, file; (file = fileObjects[i]); i++) {
      if (file.name.endsWith('-schema.json')) {
        jsonSchema = file;
      } else if (file.name.endsWith('.json')) {
        jsonData = file;
      } else if (file.name.endsWith('.html')) {
        html = file;
      } else if (file.name.endsWith('.css')) {
        css = file;
      }
    }

    if (!jsonData && !jsonSchema && !html && !css) {
      alert('No suitable file, ending in "-schema.json", ".json", ".html", ".css" selected!');
      return;
    }

    const content = {
      jsonData: await readFileAsync(jsonData),
      jsonSchema: await readFileAsync(jsonSchema),
      html: await readFileAsync(html),
      css: await readFileAsync(css)
    };
    dispatch('loadFolder', content);
  }

  function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      if (file == null) {
        resolve(null);
      } else {
        let reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      }
    });
  }

  function saveAll() {
    dispatch('saveAll');
  }

  function process() {
    dispatch('process');
  }

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(async () => {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser!');
    }
  });
</script>

<!-- HTML ------------------------------------------------------------------------ -->

<nav class="navbar">
  <div class="navbar-menu">
    <div class="navbar-start">
      <a href="#/" class="navbar-item">{title}</a>
      <div class="navbar-item has-dropdown is-hoverable" on:mouseover="{() => (menuOpen = true)}" on:mouseout="{() => (menuOpen = false)}" class:is-active="{menuOpen}">
        <a href="#/" class="navbar-link">File</a>
        <div class="navbar-dropdown">
          <a href="#/" class="navbar-item" on:click="{openLoadFolderDialog}">Load folder ...</a>
          <a href="#/" class="navbar-item" on:click="{saveAll}">Save all</a>
          <hr class="navbar-divider" />
          <a href="#/" class="navbar-item" on:click="{process}">Process</a>
          <hr class="navbar-divider" />
          <a href="#/" class="navbar-item" on:click="{() => (menuOpen = false)}">Close</a>
        </div>
      </div>
    </div>
  </div>
</nav>

<!-- An invisible file listing component -->
<FileListing bind:fileListing on:load="{loadFolder}" />

<!-- CSS ------------------------------------------------------------------------- -->
<style>
</style>
