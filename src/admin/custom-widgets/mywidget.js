var MyWidgetControl = createClass({
  getInitialState: function() {
    return { currentTab: "all", // which filter tab is active
             expanded: {}      // tracks which listings are expanded
           };
  },
  handleTabChange: function(tab) {
    this.setState({ currentTab: tab });
  },
  toggleExpand: function(index) {
    var expanded = Object.assign({}, this.state.expanded);
    expanded[index] = !expanded[index];
    this.setState({ expanded: expanded });
  },
  handleFieldChange: function(index, field, newValue) {
    // Convert to plain array if necessary.
    var listings = this.props.value && this.props.value.toJS 
                     ? this.props.value.toJS() 
                     : (this.props.value || []);
    listings[index][field] = newValue;
    this.props.onChange(listings);
  },
  render: function() {
    var currentTab = this.state.currentTab;
    // Convert the incoming value to a plain array.
    var listings = this.props.value && this.props.value.toJS 
                     ? this.props.value.toJS() 
                     : (this.props.value || []);
    // Filter listings based on the current tab selection.
    var filteredListings = listings.filter(function(listing) {
      return currentTab === "all" ? true : listing.listing_type === currentTab;
    });
    
    return h("div", { className: "mywidget-control", style: { padding: "10px" } },
      // Render tab buttons.
      h("div", { className: "tabs", style: { marginBottom: "10px" } },
        ["all", "lease", "sale", "sold"].map(function(tab) {
          return h("button", {
            onClick: function() { this.handleTabChange(tab); }.bind(this),
            style: { marginRight: "5px", fontWeight: currentTab === tab ? "bold" : "normal" }
          }, tab);
        }, this)
      ),
      // Render listings.
      h("div", { className: "listings" },
        filteredListings.length === 0 ?
          h("div", {}, "No listings found for this category") :
          filteredListings.map(function(listing, index) {
            // Use the expanded state keyed by index.
            var isExpanded = this.state.expanded[index];
            return h("div", { key: index, style: { border: "1px solid #ccc", marginBottom: "10px", padding: "10px" } },
              // Always show the summary.
              h("div", {}, "Addressz: " + (listing.address || "No address")),
              h("div", {}, "Listing Type: " + listing.listing_type),
              // Button to toggle edit mode.
              h("button", { onClick: function() { this.toggleExpand(index); }.bind(this) },
                isExpanded ? "Collapse" : "Edit"
              ),
              // If expanded, show additional input fields for editing.
              isExpanded ? h("div", { className: "expanded-edit", style: { marginTop: "10px" } },
                // Editable Address field.
                h("div", {},
                  "Address: ",
                  h("input", {
                    type: "text",
                    value: listing.address,
                    onChange: function(e) {
                      this.handleFieldChange(index, "address", e.target.value);
                    }.bind(this)
                  })
                ),
                // Editable Listing Type field.
                h("div", {},
                  "Listing Type: ",
                  h("select", {
                    value: listing.listing_type,
                    onChange: function(e) {
                      this.handleFieldChange(index, "listing_type", e.target.value);
                    }.bind(this)
                  },
                    ["sale", "lease", "both", "sold"].map(function(option) {
                      return h("option", { value: option }, option);
                    })
                  )
                ),
                // You can add more fields here similarly:
                // For example: a field for "Featured Image", "Price", etc.
                h("div", {},
                  "Agent Name: ",
                  h("input", {
                    type: "text",
                    value: listing.agent_name || "",
                    onChange: function(e) {
                      this.handleFieldChange(index, "agent_name", e.target.value);
                    }.bind(this)
                  })
                )
                // And so on for additional fields...
              ) : null
            );
          }, this)
      )
    );
  }
});

var MyWidgetPreview = createClass({
  render: function() {
    var listings = this.props.value && this.props.value.toJS 
                     ? this.props.value.toJS() 
                     : (this.props.value || []);
    return h("div", {}, "Total listings: " + listings.length);
  }
});

CMS.registerWidget("mywidget", MyWidgetControl, MyWidgetPreview);
