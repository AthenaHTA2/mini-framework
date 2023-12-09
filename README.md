# mini-framework
01F Javascript project #5
mini-framework is bundled with parcel.js to enable jsx file format

# Commands to run mini-framework:
1. If missing, install the Parcel bundler and node_modules locally:
   npm install --save-dev parcel
2. Start the development server: 
   npm start
3. In the browser type:
   http://localhost:1234/


# To install Parcel.js:
1. to generate the package.json file: 
   npm init

2. to install the Parcel bundler locally: 
   npm install --save-dev parcel

In the root directory:
1. to start the development server: 
   npx parcel static/index.html

2. add npm scripts to start and build mini-framework:
   Open the package.json file, and
   Change the 'main' field from "main": "index.js" to "source": "static"/index.html"
   Underneath "source", add 
   "scripts": {
       "start": "parcel",
       "build": "parcel build --dist-dir public"
     },

Source: https://www.digitalocean.com/community/tutorials/how-to-bundle-a-web-app-with-parcel-js