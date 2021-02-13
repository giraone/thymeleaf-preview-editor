// Re-usable AMD loader stuff for monaco (hs)

function monacoAmdLoader(callback) {
  if (!window.require) {
    // console.log("Loading monaco editor's AMD loader");
    const loaderScript = document.createElement("script");
    loaderScript.type = "text/javascript";
    loaderScript.src = "vendor/monaco-editor/vs/loader.js";
    loaderScript.addEventListener("load", function() { onGotMonacoAmdLoader(callback); });
    document.body.appendChild(loaderScript);
  } else {
    callback();
  }
}

function onGotMonacoAmdLoader(callback) {
  // Load monaco JavaScript code
  // console.log("Loading monaco editor JS code");
  window.require.config({ paths: { vs: 'vendor/monaco-editor/vs' } });
  window.require(["vs/editor/editor.main"], () => {
    callback();
  });
};
