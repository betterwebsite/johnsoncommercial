// Imports
const pluginEleventyNavigation = require("@11ty/eleventy-navigation");
const pluginMinifier = require("@sherby/eleventy-plugin-files-minifier");
const pluginSitemap = require("@quasibit/eleventy-plugin-sitemap");

// Configs
const configCss = require("./src/config/css");
const configJs = require("./src/config/javascript");
const configSitemap = require("./src/config/sitemap");
const configServer = require("./src/config/server");

// Other
const filterPostDate = require("./src/config/postDate");
const isProduction = configServer.isProduction;
const eleventyPluginSharpImages = require("@codestitchofficial/eleventy-plugin-sharp-images");
const blocksToHtml = require('@sanity/block-content-to-html');
const markdownIt = require("markdown-it");

const fetchListings = require("./src/_data/sanityListings.cjs");

module.exports = function (eleventyConfig) {
    /**=====================================================================
          EXTENSIONS - Recognising non-default languages as templates 
    =======================================================================*/
    /** https://www.11ty.dev/docs/languages/custom/ */

    /**
     *  CSS EXTENSION
     *  Setting up CSS files to be recognised as aN eleventy template language. This allows our minifier to read CSS files and minify them
     */
    eleventyConfig.addTemplateFormats("css");
    eleventyConfig.addExtension("css", configCss);

    /**
     *  JS EXTENSION
     *  Sets up JS files as an eleventy template language, which are compiled by esbuild. Allows bundling and minification of JS
     */
    eleventyConfig.addTemplateFormats("js");
    eleventyConfig.addExtension("js", configJs);
    /**=====================================================================
                                END EXTENSIONS
    =======================================================================*/
    eleventyConfig.addPlugin(eleventyPluginSharpImages, {
        urlPath: "/assets/images",
        outputDir: "public/assets/images",
    });


    eleventyConfig.addFilter('sanityBlockContent', function(blocks) {
        if (!blocks) return '';
        return blocksToHtml({
          blocks: blocks
        });
      });

      eleventyConfig.addFilter("shortId", (id) => {
        // take the last 6 characters of the string
        return id.toString().slice(-6);
      });


    


    /**=====================================================================
                  PLUGINS - Adds additional eleventy functionality 
    =======================================================================*/
    /** https://www.11ty.dev/docs/plugins/ */

    /**
     *  ELEVENTY NAVIGATION
     *  Sets up the eleventy navigation plugin for a scalable navigation as used in _includes/components/header.html
     *  https://github.com/11ty/eleventy-navigation
     */
    eleventyConfig.addPlugin(pluginEleventyNavigation);

    /**
     *  AUTOMATIC SITEMAP GENERATION 
     *  Automatically generate a sitemap, using the domain in _data/client.json
     *  https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap
     */
    eleventyConfig.addPlugin(pluginSitemap, configSitemap);

    /**
     *  MINIFIER 
     *  When in production ("npm run build" is ran), minify all HTML, CSS, JSON, XML, XSL and webmanifest files.
     *  https://github.com/benjaminrancourt/eleventy-plugin-files-minifier
     */
    if (isProduction) {
        eleventyConfig.addPlugin(pluginMinifier);
    }
    /**=====================================================================
                                END PLUGINS
    =======================================================================*/


    /**======================================================================
       PASSTHROUGHS - Copy source files to /public with no 11ty processing
    ========================================================================*/
    /** https://www.11ty.dev/docs/copy/ */

    eleventyConfig.addPassthroughCopy("./src/assets", {
        filter: [
            "**/*",
            "!**/*.js"
        ]
    });
    eleventyConfig.addPassthroughCopy("./src/admin");
    eleventyConfig.addPassthroughCopy("./src/_redirects");
    /**=====================================================================
                              END PASSTHROUGHS
    =======================================================================*/

    /**======================================================================
               FILTERS - Modify data in template files at build time
    ========================================================================*/
    /** https://www.11ty.dev/docs/filters/ */

    /**
     *  Converts dates from JSDate format (Fri Dec 02 18:00:00 GMT-0600) to a locale format.
     *  Use - {{ "DATE GOES HERE" | postDate }}
     *  https://moment.github.io/luxon/api-docs/index.html#datetime
     */
    eleventyConfig.addFilter("postDate", filterPostDate);

    eleventyConfig.addFilter("slug", function(value) {
        return String(value)
          .toLowerCase()
          .replace(/[^\w\\s-]/g, '')  // remove punctuation
          .replace(/\\s+/g, '-')      // spaces to dashes
          .replace(/-+/g, '-')        // collapse multiple dashes
          .replace(/^-+|-+$/g, '');   // trim leading/trailing
      });

    eleventyConfig.addFilter("money", function(value) {
    // Handle undefined, null, or empty string
    if (value === undefined || value === null || value === '') {
        return '';
    }
    
    // Convert string to number if needed
    let numValue;
    if (typeof value === 'string') {
        // Remove any existing currency symbols or commas
        const cleanValue = value.replace(/[$,]/g, '');
        numValue = parseFloat(cleanValue);
        
        // If we couldn't parse it as a number, return the original
        if (isNaN(numValue)) {
            return value;
        }
    } else if (typeof value === 'number') {
        numValue = value;
    } else {
        // For other types, try to convert or return as is
        try {
            numValue = Number(value);
            if (isNaN(numValue)) {
                return String(value);
            }
        } catch (e) {
            return String(value);
        }
    }
    
    // Format the number as currency
    return numValue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
});
    
    const md = new markdownIt({ html: true });
    eleventyConfig.addFilter("markdownify", str => {
        return md.render(str || "");
    });

    eleventyConfig.addFilter("float", function(value) {
        return value.toLocaleString('en-US');
    });

    /**=====================================================================
                                    END FILTERS
    =======================================================================*/

    /**======================================================================
                  SHORTCODES - Output data using JS at build time
    ========================================================================*/
    /** https://www.11ty.dev/docs/shortcodes/ */

    /**
     *  Gets the current year, which can be outputted with {% year %}. Used for the footer copyright. Updates with every build.
     *  Use - {% year %}
     */
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
    /**=====================================================================
                                END SHORTCODES
    =======================================================================*/

    /**=====================================================================
                                SERVER SETTINGS
    =======================================================================*/
    eleventyConfig.setServerOptions(configServer);
    /**=====================================================================
                              END SERVER SETTINGS
    =======================================================================*/
    const slugify = eleventyConfig.getFilter("slugify");
    eleventyConfig.addGlobalData("groupedListings", async () => {
        const listings = await fetchListings();
        const counts = {};
    
        return listings.map(item => {
          // 1) Normalize the address into a slug right here
          const baseSlug = slugify(item.address, { lower: true, strict: true });
          counts[baseSlug] = (counts[baseSlug] || 0) + 1;
    
          // 2) Append a counter if it’s not the first one
          const uniqueSlug = counts[baseSlug] === 1
            ? baseSlug
            : `${baseSlug}-${counts[baseSlug]}`;
    
          return {
            ...item,
            slug: uniqueSlug
          };
        });
      });
    return {
        dir: {
            input: "src",
            output: "public",
            includes: "_includes",
            data: "_data",
        },
        htmlTemplateEngine: "njk",
    };
};
