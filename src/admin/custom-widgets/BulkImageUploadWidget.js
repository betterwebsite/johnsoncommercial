console.log("📁 BulkFolderUploadWidget loaded");

var BulkFolderUploadControl = createClass({
  getInitialState: function () {
    return {
      imagePaths: this.props.value && this.props.value.toJS ? this.props.value.toJS() : []
    };
  },

  handleUpload: function (event) {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(f => f.type.startsWith("image/"));

    if (!this.props.mediaLibrary || !this.props.mediaLibrary.persistMedia) {
      alert("Media Library is not available. Make sure it's enabled.");
      return;
    }
    
    const uploads = imageFiles.map(file =>
      this.props.mediaLibrary.persistMedia({ file }).then(({ path }) => path)
    );
    

    Promise.all(uploads).then((paths) => {
      const updatedPaths = [...this.state.imagePaths, ...paths];
      this.setState({ imagePaths: updatedPaths });
      this.props.onChange(updatedPaths);
    });
  },

  render: function () {
    const h = window.h;
    const { imagePaths } = this.state;

    return h("div", { style: { padding: "10px" } },
      h("input", {
        type: "file",
        webkitdirectory: true,
        multiple: true,
        accept: "image/*",
        onChange: this.handleUpload
      }),
      h("div", { style: { marginTop: "10px" } },
        imagePaths.length === 0 ?
          h("div", {}, "No images uploaded yet.") :
          h("ul", {},
            imagePaths.map((img, i) =>
              h("li", { key: i },
                h("img", {
                  src: img,
                  style: { width: "80px", marginRight: "10px", verticalAlign: "middle" }
                }),
                " ", img
              )
            )
          )
      )
    );
  }
});

var BulkFolderUploadPreview = createClass({
  render: function () {
    const h = window.h;
    const imagePaths = this.props.value && this.props.value.toJS ? this.props.value.toJS() : [];

    return h("div", {},
      imagePaths.map((src, i) =>
        h("img", {
          key: i,
          src,
          style: { width: '100px', marginRight: '10px' }
        })
      )
    );
  }
});

CMS.registerWidget(
  "bulkFolderImages",
  BulkFolderUploadControl,
  BulkFolderUploadPreview,
  { allowMediaLibrary: true }
);

