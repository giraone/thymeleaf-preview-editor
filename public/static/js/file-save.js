function saveFile(content, contentType, targetFileName) {
  const a = document.createElement("a");
  const file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = targetFileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
