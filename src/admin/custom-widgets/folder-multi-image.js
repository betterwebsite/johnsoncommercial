// Make sure to run this code after CMS.init() completes.
var MultiFolderImageUploadWidgetControl = createClass({
  getInitialState: function() {
    return { uploading: false, images: [], backend: null };
  },
  componentDidMount: function() {
    // Retrieve the backend instance; this should now be the Bitbucket backend.
    const backend = window.CMS && window.CMS.backend ? window.CMS.backend : CMS.getBackend();
    this.setState({ backend });
  },
  handleFileChange: function(e) {
    const files = Array.from(e.target.files);
    // Filter to only image files.
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (!imageFiles.length) return;
    
    const { backend } = this.state;
    if (!backend || typeof backend.uploadFile !== "function") {
      console.error("uploadFile not available on backend instance. Ensure CMS is fully initialized.");
      return;
    }
    
    this.setState({ uploading: true });
    
    // Retrieve configuration (works with Immutable Maps or plain objects).
    const config = this.props.config || CMS.getConfig();
    const mediaFolder = (config.get ? config.get("media_folder") : config.media_folder) || "src/assets/images/cms";
    const publicFolder = (config.get ? config.get("public_folder") : config.public_folder) || "/assets/images/cms";
    
    // You can upload directly into the mediaFolder (or specify a subfolder if needed).
    const destFolder = mediaFolder;
    
    // Loop over each image file and call uploadFile.
    const uploadPromises = imageFiles.map(file => {
      // Sanitize the filename (replace spaces with dashes)
      const sanitizedFilename = file.name.replace(/\s+/g, '-');
      const destPath = `${destFolder}/${sanitizedFilename}`;
      return backend.uploadFile(file, { path: destPath, public_folder: publicFolder });
    });
    
    Promise.all(uploadPromises)
      .then(results => {
        // Each result should include a URL (either under 'url' or 'downloadURL').
        const urls = results.map(res => res.url || res.downloadURL);
        // Update the widget value to be the array of URLs.
        this.props.onChange(urls);
        this.setState({ uploading: false, images: urls });
      })
      .catch(err => {
        console.error("Upload failed:", err);
        this.setState({ uploading: false });
      });
  },
  render: function() {
    return h("div", { style: { padding: "10px" } },
      h("input", {
        type: "file",
        webkitdirectory: "true", // allows folder selection (Chrome and some browsers)
        directory: "true",
        multiple: true,
        onChange: this.handleFileChange
      }),
      this.state.uploading && h("div", { style: { marginTop: "10px" } }, "Uploading images..."),
      this.state.images.length > 0 && h("div", { style: { marginTop: "10px" } },
        this.state.images.map((url, i) =>
          h("img", {
            key: i,
            src: url,
            alt: "Uploaded image " + (i + 1),
            style: { maxWidth: "100px", marginRight: "5px" }
          })
        )
      )
    );
  }
});

var MultiFolderImageUploadWidgetPreview = createClass({
  render: function() {
    const urls = this.props.value || [];
    return h("div", {},
      urls.length === 0
        ? "No images uploaded."
        : urls.map((url, i) =>
            h("img", {
              key: i,
              src: url,
              alt: "Uploaded image " + (i + 1),
              style: { maxWidth: "100px", marginRight: "5px" }
            })
          )
    );
  }
});

// Register the widget after CMS.init() completes.
window.CMS.registerWidget("folder-multi-image", MultiFolderImageUploadWidgetControl, MultiFolderImageUploadWidgetPreview);
