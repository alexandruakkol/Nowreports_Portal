# Nowreports Portal Module

## What is Nowreports?
Nowreports leverages company financial reports in order to allow users to inquire about the way a certain business works and is performing. State-of-the-art AI techniques are used to process data and create models that will allow the user to chat with the AI just like they would with the executive board of their chosen company. This enables users to obtain valuable insights into the internal business processes that may not be as easily accessible through other sources.
## Tech
Nowreports is a web application composed of three modules: Portal, API and AI, each having its own Github repository.

The Portal is built with React and Google Firebase.

Firebase is used for authentication and analytics only.

## Project Structure

The frontend objects are divided into Pages and Components.
 
Most pages are placed behind a Login wall through the `Auth.js` logical wrapper component.

`account_operations.js` contains the user creation procedure, which gets handled though the API. This includes:
- Stripe customer creation
- Database user insert

Users can sign in either with username and password, or with a Google account.

Reusable and accessible React components will be provided by my own library, ReadyUI.

## CSS

The CSS rules are divided into reusable classes (`.text-center`, `.flex`, etc.), and individual ones.

## Logging

Caught errors will be sent via API to the SQL database for debugging. 

For security purposes, client-facing error messages on sensitive mechanisms display a generic message and a code for debugging purposes, ex. `Unexpected error. Code 27`

Errors are centralized throughout the application through a React Context.

## Environments

<i>Production</i> and <i>development</i> environments can be toggled using the `REACT_APP_ENV` environment variable.

The React application is deployed using Nginx. The availability and performance are monitored with Uptime Robot.

## Features

The Portal contains the following notable features:
- Feedback collection section on the landing page and in the AI app
- Resizable section that displays an external webpage (financial report) through an iframe, in the AI app.
- HTTP streaming capability in the conversation: characters arrive in the chat in chunks, not all at once, as they are being generated by the AI server.
- Stripe hosted webpage for payment with coupon code system

# Screenshots

## Landing Page

<img width="1914" alt="Screenshot 2024-03-26 at 8 54 33 PM" src="https://github.com/alexandruakkol/nowreports_portal/assets/96371551/a362d442-37e8-44e1-932a-8bd2d7a7e3cc">

## Company search

<img width="1915" alt="Screenshot 2024-03-26 at 8 51 49 PM" src="https://github.com/alexandruakkol/nowreports_portal/assets/96371551/adf6ba7e-15dd-4e22-bd16-871d5f9cc08b">
## AI App

<img width="1920" alt="Screenshot 2024-03-26 at 8 52 36 PM" src="https://github.com/alexandruakkol/nowreports_portal/assets/96371551/221ebcf0-35cb-4513-b7b6-afe2a3513a1e">
