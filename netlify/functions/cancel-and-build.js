const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Only process POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    // Get environment variables
    const netlifyToken = process.env.NETLIFY_API_TOKEN;
    const siteId = process.env.NETLIFY_SITE_ID;
    const buildHookUrl = process.env.NETLIFY_BUILD_HOOK;
    
    // Verify required environment variables
    if (!netlifyToken || !siteId || !buildHookUrl) {
      console.error('Missing required environment variables');
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Server configuration error' }) 
      };
    }

    // Get current builds
    console.log('Fetching current builds...');
    const buildsResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/builds`, {
      headers: {
        'Authorization': `Bearer ${netlifyToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!buildsResponse.ok) {
      throw new Error(`Failed to fetch builds: ${buildsResponse.status} ${buildsResponse.statusText}`);
    }
    
    const builds = await buildsResponse.json();
    
    // Find in-progress builds (building or enqueued)
    const inProgressBuilds = builds.filter(build => 
      (build.status === 'building' || build.status === 'enqueued') && 
      build.deploy_id // Make sure there's a deploy ID to cancel
    );
    
    console.log(`Found ${inProgressBuilds.length} in-progress builds to cancel`);
    
    // Cancel each in-progress build
    for (const build of inProgressBuilds) {
      console.log(`Cancelling build ${build.id} with deploy ID ${build.deploy_id}...`);
      
      const cancelResponse = await fetch(`https://api.netlify.com/api/v1/deploys/${build.deploy_id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${netlifyToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!cancelResponse.ok) {
        console.warn(`Warning: Failed to cancel build ${build.id}: ${cancelResponse.status} ${cancelResponse.statusText}`);
      } else {
        console.log(`Successfully cancelled build ${build.id}`);
      }
    }
    
    // Trigger new build
    console.log('Triggering new build...');
    const buildTriggerResponse = await fetch(buildHookUrl, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!buildTriggerResponse.ok) {
      throw new Error(`Failed to trigger new build: ${buildTriggerResponse.status} ${buildTriggerResponse.statusText}`);
    }
    
    console.log('New build triggered successfully');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `Cancelled ${inProgressBuilds.length} builds and triggered a new build` 
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};