var ListingsPreview = createClass({
  getInitialState: function() {
    return { filter: 'all' };
  },
  
  handleFilterChange: function(newFilter) {
    this.setState({ filter: newFilter });
  },
  
  render: function() {
    // Get the listings array from the entry data.
    var listingsData = this.props.entry.getIn(['data', 'listings']);
    var listings = listingsData ? listingsData.toJS() : [];
    
    // Calculate counts for the filter buttons.
    var countAll = listings.length;
    var countSale = listings.filter(function(item) {
      // Treat missing type as "sale", and include "both".
      return item.listing_type === 'sale' || item.listing_type === 'both' || !item.listing_type;
    }).length;
    var countLease = listings.filter(function(item) {
      return item.listing_type === 'lease' || item.listing_type === 'both';
    }).length;
    var countSold = listings.filter(function(item) {
      return item.listing_type === 'sold';
    }).length;
    
    // For non-"all" filters, use the following flat list filtering.
    var filteredListings = listings.filter(function(item) {
      if (this.state.filter === 'all') {
        return true;
      }
      if (this.state.filter === 'sale') {
        return item.listing_type === 'sale' || item.listing_type === 'both' || !item.listing_type;
      }
      if (this.state.filter === 'lease') {
        return item.listing_type === 'lease' || item.listing_type === 'both';
      }
      if (this.state.filter === 'sold') {
        return item.listing_type === 'sold';
      }
      return true;
    }, this);
    
    // Define a shared font-family style.
    var textStyle = { 
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' 
    };
    
    // Top bar with filter buttons.
    var filterBar = h("div", { style: Object.assign({ marginBottom: "20px" }, textStyle) },
      h("button", {
        onClick: this.handleFilterChange.bind(this, 'all'),
        style: Object.assign({ marginRight: "10px", fontWeight: this.state.filter === 'all' ? "bold" : "normal" }, textStyle)
      }, "View All (" + countAll + ")"),
      h("button", {
        onClick: this.handleFilterChange.bind(this, 'sale'),
        style: Object.assign({ marginRight: "10px", fontWeight: this.state.filter === 'sale' ? "bold" : "normal" }, textStyle)
      }, "For Sale (" + countSale + ")"),
      h("button", {
        onClick: this.handleFilterChange.bind(this, 'lease'),
        style: Object.assign({ marginRight: "10px", fontWeight: this.state.filter === 'lease' ? "bold" : "normal" }, textStyle)
      }, "For Lease (" + countLease + ")"),
      h("button", {
        onClick: this.handleFilterChange.bind(this, 'sold'),
        style: Object.assign({ marginRight: "10px", fontWeight: this.state.filter === 'sold' ? "bold" : "normal" }, textStyle)
      }, "Sold (" + countSold + ")")
    );
    
    // In "View All" mode, group the listings with section headers.
    if (this.state.filter === 'all') {
      var groups = { sale: [], lease: [], sold: [] };
      // Group items: for sale gets sale, missing, and both; lease gets only "lease"; sold gets "sold".
      listings.forEach(function(item, index) {
        if (item.listing_type === 'lease') {
          groups.lease.push({ item: item, index: index });
        } else if (item.listing_type === 'sold') {
          groups.sold.push({ item: item, index: index });
        } else {
          groups.sale.push({ item: item, index: index });
        }
      });
      
      return h("div", { style: Object.assign({ padding: "10px", marginTop: "10rem" }, textStyle) },
        filterBar,
        Object.keys(groups).map(function(groupKey) {
          var groupItems = groups[groupKey];
          if (groupItems.length === 0) return null;
          var headerText;
          if (groupKey === 'sale') headerText = "For Sale (" + groupItems.length + ")";
          if (groupKey === 'lease') headerText = "For Lease (" + groupItems.length + ")";
          if (groupKey === 'sold') headerText = "Sold (" + groupItems.length + ")";
          return h("div", { key: groupKey, style: { marginBottom: "20px" } },
            h("h3", { style: textStyle }, headerText),
            groupItems.map(function(obj) {
              var item = obj.item;
              return h("div", { 
                key: obj.index, 
                style: { 
                  border: "1px solid #ccc", 
                  padding: "5px", 
                  marginBottom: "5px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                } 
              },
                // Left container: image and address.
                h("div", { style: { display: "flex", alignItems: "center" } },
                  item.image && h("img", { 
                    src: item.image, 
                    style: { width: "150px", height: "150px", objectFit: "cover", marginRight: "10px" } 
                  }),
                  h("span", { style: textStyle }, item.address || "No address")
                ),
                // "Edit" link.
                h("a", {
                  href: "#",
                  onClick: function(e) {
                    e.preventDefault();
                    window.parent.postMessage({
                      action: "focusListingByAddress",
                      address: item.address
                    }, "*");
                  },
                  style: Object.assign({ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "10px" }, textStyle)
                }, "Edit")
              );
            })
          );
        })
      );
    } else {
      // For a specific filter (sale, lease, or sold), show a flat list.
      return h("div", { style: Object.assign({ padding: "10px", marginTop: "10rem" }, textStyle) },
        filterBar,
        filteredListings.map(function(item, index) {
          return h("div", { 
            key: index, 
            style: { 
              border: "1px solid #ccc", 
              padding: "5px", 
              marginBottom: "5px", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center" 
            } 
          },
            h("div", { style: { display: "flex", alignItems: "center" } },
              item.image && h("img", { 
                src: item.image, 
                style: { width: "150px", height: "150px", objectFit: "cover", marginRight: "10px" } 
              }),
              h("span", { style: textStyle }, item.address || "No address")
            ),
            h("a", {
              href: "#",
              onClick: function(e) {
                e.preventDefault();
                window.parent.postMessage({
                  action: "focusListingByAddress",
                  address: item.address
                }, "*");
              },
              style: Object.assign({ color: "blue", textDecoration: "underline", cursor: "pointer", marginLeft: "10px" }, textStyle)
            }, "Edit")
          );
        })
      );
    }
  }
});

CMS.registerPreviewTemplate("listings", ListingsPreview);
