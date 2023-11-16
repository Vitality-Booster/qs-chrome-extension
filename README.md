# Quantified Student Web Extension Front-end 
This repository is for a front-end part of the web extension built for the Quantified Student project. Basically, it is the web extension itself which is responsible for tracking user activity on the browser, monitoring which websites they visit, and displaying useful statistics explaining how much of browsing time the user spent on "work" and on "procrastination".

## Basics (pre-requisites)
To begin with, the development of an extension is quite different from a basic web development. Mostly, the difference is in the initial structure of the application. Here we will list main aspects of the Web Extension structure:

1. Manifest.json. This is the most important file of a web extension. It sets default web extension information (e.g., name, version, etc.) in addition to more advanced extension settings (e.g., permissions, commands). From more information refer to the [documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json).
2. Popup folder. This folder is a visual and interactive part of the extension. 
3. Content folder. This part of the application is responsible for the interaction with the DOM of the currently displayed webpage.
4. Background folder. This is the code that runs on the "background" all the time as far as the extension is working.

In a nutshell, these parts are the most important ones in the web extension. However, if you want to learn more, here is an amazing article that even showcases how to build an extension from scratch: [website link](https://hackernoon.com/how-to-create-a-chrome-extension-with-react).

### Addition (usage)
One of the things to bear in mind, is that it is impossible to run the web extension in a development environment, like we used to do with websites.

Instead, you need to build the project and upload the "build" folder to the extensions. And only then you will be able to test how your extension works.

To understand how it works even better, visit the same website mentioned earlier: [source](https://hackernoon.com/how-to-create-a-chrome-extension-with-react). 

## How it works
When the extension starts we are logging in a hard-coded user we have (it will be fixed later). If the user is successfully logged in, the extension starts tracking the websites the user visits.

When the user visit a website a "Statement" is created and stored in the browser. These statements are getting collected until there is a new statement which timestamp is more than the timestamp of a first Statement in the storage in a certain number of minutes. As soon as the latest_timestamp - `first_timestamp > 'x' minutes` then all the collected Statements are sent to the back-end which stores them in a database. Also, after that the Statement storage in browser is cleared and the Statement recording & storage restarts.

## What's coming?
The web extension has still a long way to go. Here are some of the features that you can expect coming as soon as possible:

1. **Statistics display**. Pretty graphs that will provide the user with an insight on their performance.
2. **Login/logout**. Proper log in/out and sign up functionality implementation.
3. **Dashboard**. User-friendly and intuitive dashboard, which will provide additional functionality for the user.