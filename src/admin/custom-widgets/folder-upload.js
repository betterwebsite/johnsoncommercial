var FolderUploadWidgetControl = createClass({
  getInitialState: function() {
    return { uploadedUrls: [] };
  },
  handleChange: function(e) {
    const files = Array.from(e.target.files);
    // Filter to image files only.
    const images = files.filter(file => file.type.startsWith("image/"));
    if (!images.length) return;
    
    const backend = CMS.getBackend();
    // Define the destination folder (adjust as needed).
    const destFolder = "src/assets/images/cms/folder-upload";
    
    // Loop over each image file and upload it.
    const uploadPromises = images.map(file => {
      // Sanitize file name if needed (optional).
      const destPath = destFolder + "/" + file.name;
      // Use backend.uploadFile if available, otherwise simulate.
      if (backend && typeof backend.uploadFile === "function") {
        return backend.uploadFile(file, { path: destPath });
      } else {
        return new Promise(resolve => {
          setTimeout(() => resolve({ url: destPath }), 300);
        });
      }
    });
    
    // When all uploads complete, update the widget value.
    Promise.all(uploadPromises)
      .then(results => {
        const urls = results.map(res => res.url);
        this.props.onChange(urls);
        this.setState({ uploadedUrls: urls });
      })
      .catch(err => {
        console.error("Upload error:", err);
      });
  },
  render: function() {
    return h("div", { style: { padding: "10px" } },
      h("input", {
        type: "file",
        webkitdirectory: "true", // enables folder selection in Chrome
        multiple: true,
        onChange: this.handleChange
      }),
      h("div", { style: { marginTop: "10px" } },
        this.state.uploadedUrls.length === 0
          ? "No images uploaded."
          : this.state.uploadedUrls.map((url, index) =>
              h("img", { key: index, src: url, alt: "Uploaded image " + (index + 1), style: { maxWidth: "100px", marginRight: "5px" } })
            )
      )
    );
  }
});

var FolderUploadWidgetPreview = createClass({
  render: function() {
    const urls = this.props.value || [];
    return h("div", {},
      urls.length === 0
        ? "No images uploaded."
        : urls.map((url, index) =>
            h("img", { key: index, src: url, alt: "Uploaded image " + (index + 1), style: { maxWidth: "100px", marginRight: "5px" } })
          )
    );
  }
});

// Register the widget with a unique name.
CMS.registerWidget("folder-upload", FolderUploadWidgetControl, FolderUploadWidgetPreview);
