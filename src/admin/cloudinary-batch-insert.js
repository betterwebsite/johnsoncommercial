/**
 * Cloudinary Folder Widget for Decap CMS
 * This widget allows you to fetch all images from a Cloudinary folder
 * and insert them into your content.
 */

var CloudinaryFolderWidgetControl = createClass({
  getInitialState: function() {
    return {
      folderName: '',
      loading: false,
      error: null,
      images: [],
      selectedImages: this.props.value ? [].concat(this.props.value) : []
    };
  },

  componentDidMount: function() {
    // If we already have a value, populate the selected images
    if (this.props.value) {
      var values = Array.isArray(this.props.value) ? this.props.value : [this.props.value];
      this.setState({ selectedImages: values });
    }
  },

  handleFolderNameChange: function(e) {
    this.setState({ folderName: e.target.value });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    
    var folderName = this.state.folderName;
    if (!folderName.trim()) {
      this.setState({ error: 'Please enter a folder name' });
      return;
    }

    this.fetchImagesFromFolder(folderName);
  },

  fetchImagesFromFolder: function(folderName) {
    var self = this;
    self.setState({ loading: true, error: null });

    // Call PHP proxy to fetch images from Cloudinary
    fetch('/admin/api/cloudinary-folder.php?folder=' + encodeURIComponent(folderName))
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        return response.json();
      })
      .then(function(data) {
        if (data.resources && Array.isArray(data.resources)) {
          self.setState({ 
            images: data.resources,
            loading: false
          });
        } else {
          self.setState({ 
            error: 'No images found in folder',
            loading: false
          });
        }
      })
      .catch(function(error) {
        console.error('Error fetching images:', error);
        self.setState({ 
          error: error.message || 'Failed to fetch images',
          loading: false
        });
      });
  },

  handleImageToggle: function(imageUrl) {
    var selectedImages = this.state.selectedImages;
    var multiple = this.props.field.multiple;
    
    // If multiple is false, replace the selection
    if (!multiple) {
      this.setState({ selectedImages: [imageUrl] });
      this.props.onChange(imageUrl);
      return;
    }
    
    // If multiple is true, toggle the selection
    var newSelectedImages;
    if (selectedImages.includes(imageUrl)) {
      newSelectedImages = selectedImages.filter(function(url) {
        return url !== imageUrl;
      });
    } else {
      newSelectedImages = selectedImages.concat([imageUrl]);
    }
    
    this.setState({ selectedImages: newSelectedImages });
    this.props.onChange(newSelectedImages);
  },

  handleInsertAll: function() {
    var images = this.state.images;
    var multiple = this.props.field.multiple;
    
    if (!images.length) return;
    
    var imageUrls = images.map(function(image) {
      return image.secure_url;
    });
    
    if (!multiple) {
      // If multiple is false, just use the first image
      this.setState({ selectedImages: [imageUrls[0]] });
      this.props.onChange(imageUrls[0]);
    } else {
      this.setState({ selectedImages: imageUrls });
      this.props.onChange(imageUrls);
    }
  },

  render: function() {
    var self = this;
    var folderName = this.state.folderName;
    var loading = this.state.loading;
    var error = this.state.error;
    var images = this.state.images;
    var selectedImages = this.state.selectedImages;
    var multiple = this.props.field.multiple || false;

    // Define inline styles
    var widgetStyle = {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '10px'
    };
    
    var inputContainerStyle = {
      display: 'flex',
      marginBottom: '15px'
    };
    
    var inputStyle = {
      flex: '1',
      padding: '8px 12px',
      fontSize: '14px',
      border: '1px solid #ddd',
      borderRadius: '4px 0 0 4px'
    };
    
    var buttonStyle = {
      padding: '8px 15px',
      fontSize: '14px',
      backgroundColor: '#3490dc',
      color: 'white',
      border: 'none',
      borderRadius: '0 4px 4px 0',
      cursor: 'pointer'
    };
    
    var disabledButtonStyle = Object.assign({}, buttonStyle, {
      backgroundColor: '#95b8dc',
      cursor: 'not-allowed'
    });
    
    var errorStyle = {
      color: '#e3342f',
      marginBottom: '15px',
      padding: '8px',
      backgroundColor: '#fde8e8',
      borderRadius: '4px'
    };
    
    var insertAllButtonStyle = {
      marginBottom: '15px',
      padding: '8px 15px',
      fontSize: '14px',
      backgroundColor: '#38c172',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    };
    
    var imagesGridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '10px'
    };
    
    return h('div', { className: 'cloudinary-folder-widget', style: widgetStyle },
      // Folder input form
      h('form', { onSubmit: this.handleSubmit },
        h('div', { style: inputContainerStyle },
          h('input', {
            type: 'text',
            value: folderName,
            onChange: this.handleFolderNameChange,
            placeholder: 'Enter Cloudinary folder name',
            style: inputStyle
          }),
          h('button', { 
            type: 'submit',
            style: loading ? disabledButtonStyle : buttonStyle,
            disabled: loading
          }, loading ? 'Loading...' : 'Fetch Images')
        )
      ),
      
      // Error message
      error && h('div', { style: errorStyle }, error),
      
      // Images container
      images.length > 0 && h('div', {},
        // Insert All button
        h('button', {
          type: 'button',
          style: insertAllButtonStyle,
          onClick: this.handleInsertAll
        }, 'Insert All Images'),
        
        // Images grid
        h('div', { style: imagesGridStyle },
          images.map(function(image) {
            var isSelected = selectedImages.includes(image.secure_url);
            
            var imageItemStyle = {
              position: 'relative',
              borderRadius: '4px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: isSelected ? '2px solid #3490dc' : '2px solid transparent'
            };
            
            var imageStyle = {
              width: '100%',
              height: '120px',
              objectFit: 'cover',
              display: 'block'
            };
            
            var overlayStyle = {
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '5px',
              fontSize: '12px',
              wordBreak: 'break-all'
            };
            
            var filenameStyle = {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            };
            
            var indicatorStyle = {
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: '#3490dc',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              textAlign: 'center',
              lineHeight: '20px'
            };
            
            return h('div', {
              key: image.public_id,
              style: imageItemStyle,
              onClick: function() { self.handleImageToggle(image.secure_url); }
            },
              h('img', {
                src: image.secure_url,
                alt: image.public_id,
                style: imageStyle
              }),
              h('div', { style: overlayStyle },
                h('div', { style: filenameStyle }, image.public_id.split('/').pop())
              ),
              isSelected && h('div', { style: indicatorStyle }, '✓')
            );
          })
        )
      )
    );
  }
});

var CloudinaryFolderWidgetPreview = createClass({
  render: function() {
    // Convert the value to a simple array if it's an Immutable.js object
    var value = this.props.value && this.props.value.toJS 
              ? this.props.value.toJS() 
              : (this.props.value || []);
    
    // If it's not an array (single value), wrap it
    var imageUrls = Array.isArray(value) ? value : [value];
    
    // If there are no images, show a simple message
    if (imageUrls.length === 0) {
      return h('div', {}, 'No images selected');
    }
    
    // Show a preview of the first few images
    var maxPreview = 3;
    var remaining = imageUrls.length > maxPreview ? imageUrls.length - maxPreview : 0;
    
    return h('div', {},
      h('div', {}, 'Selected images: ' + imageUrls.length),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' } },
        imageUrls.slice(0, maxPreview).map(function(url, index) {
          return h('img', {
            key: index,
            src: url,
            alt: 'Preview ' + index,
            style: { width: '100px', height: '75px', objectFit: 'cover' }
          });
        })
      ),
      remaining > 0 && h('div', { style: { marginTop: '5px' } }, '+ ' + remaining + ' more')
    );
  }
});

// Register the widget with Decap CMS
CMS.registerWidget('cloudinaryFolder', CloudinaryFolderWidgetControl, CloudinaryFolderWidgetPreview);