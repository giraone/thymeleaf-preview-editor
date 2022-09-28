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

  function clearContent() {
    dispatch('clearContent');
    menuOpen = false;
    return null;
  }

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

    let jsonSchema = null;
    let jsonData = null;
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
      jsonSchemaFile: jsonSchema?.name,
      jsonDataFile: jsonData?.name,
      htmlFile: html?.name,
      cssFile: css?.name,

      jsonSchema: await readFileAsync(jsonSchema),
      jsonData: await readFileAsync(jsonData),
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

  function processToHtml() {
    dispatch('processToHtml');
  }

  function processToPdf() {
    dispatch('processToPdf');
  }

  //-- Lifecycle functions -----------------------------------------------------------

  onMount(async () => {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser!');
    }
  });
</script>

<!-- HTML ------------------------------------------------------------------------ -->

<span class="header">{title}</span>
<nav id="buttons">
  <ul>
    <li><a class="navButton" href="#/" on:click="{clearContent}">Clear</a></li>
    <li><a class="navButton" href="#/" on:click="{openLoadFolderDialog}">Load files...</a></li>
    <li><a class="navButton" href="#/" on:click="{saveAll}">Save all...</a></li>
    <li><a class="navButton" href="#/" on:click="{processToHtml}">&gt; HTML</a></li>
    <li><a class="navButton" href="#/" on:click="{processToPdf}">&gt; to PDF</a></li>
  </ul>
</nav>

<!-- An invisible file listing component -->
<FileListing bind:fileListing on:load="{loadFolder}" />

<!-- CSS ------------------------------------------------------------------------- -->

<style>
 header nav#buttons ul li a {
    min-width: 5rem;
    padding-left: 2px;
    padding-right: 2px;
  }
</style>
