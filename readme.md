jQuery.offline
--------------
jQuery.offline is a lightweight jquery plugin to handle connection interruptions within your web or hybrid application.

Once initialize, jQuery.offline will intercept all jQuery.ajax requests and look for network related errors. If a network related error is detected, the request will automatically be retried a set number of times. If all of these requests fail, the request will be queued and the script will go into offline mode. Any request made while offline will be queued up and retried on a set interval.

Your body element will be provided with an .offline or .online class depending on the current state of your application. You can utilize this selected to show or hide UI based on the state of the application.

## Getting Started
Getting started is designed to be as simple as possible.
```
$.offline.init();
```