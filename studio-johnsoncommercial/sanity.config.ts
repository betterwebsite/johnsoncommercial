import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

import {
  dashboardTool,
  projectUsersWidget,
} from '@sanity/dashboard'

import { netlifyWidget } from "sanity-plugin-dashboard-widget-netlify";


export default defineConfig({
  name: 'default',
  title: 'johnsoncommercial',

  projectId: 'lgrua1a8',
  dataset: 'production',

  plugins: [structureTool(), visionTool(),dashboardTool({widgets: [netlifyWidget({
    title: 'Deploy Changes to Site',
    sites: [
      {
        title: 'Website',
        apiId: '0ae5f3d5-fc59-4eca-9f7e-18bfbffcb369',
        buildHookId: '6801c2832964186fd73c5c24',
        url: 'https://johnsoncommercialgroup.netlify.app',
      }
    ]
}), projectUsersWidget()]})],

  schema: {
    types: schemaTypes,
  },
})
