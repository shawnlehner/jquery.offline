# jQuery.offline
jQuery.offline is a lightweight jquery plugin to handle connection interruptions within your web or hybrid application.

Once initialize, jQuery.offline will intercept all jQuery.ajax requests and look for network related errors. If a network related error is detected, the request will automatically be retried a set number of times. If all of these requests fail, the request will be queued and the script will go into offline mode. Any request made while offline will be queued up and retried on a set interval.

Your body element will be provided with an .offline or .online class depending on the current state of your application. You can utilize this selected to show or hide UI based on the state of the application.

## Getting Started
Getting started is designed to be as simple as possible.
```
$.offline.init();
```
Running this one line of code will replace the default jQuery.ajax method with a custom handler to monitor all of the requests being made by your application. It will provide logic to automatically queue and retry these requests in the event that your application loses its connection to the server.

## Configuration
You can initialize the script with a configuration object instead like this:
```
$.offline.init({
    notificationAttempts: 5
});
```
#### Available Options
<table>
  <tbody>
    <tr>
      <th>Parameter</th>
      <th align="center">Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>notificationAttempts</td>
      <td align="center">int</td>
      <td>3</td>
      <td>How many times should we retry before going offline.</td>
    </tr>
    <tr>
      <td>retryInterval</td>
      <td align="center">int</td>
      <td>10</td>
      <td>Time in seconds after deciding we are offline between retry attempts for the queue.</td>
    </tr>
    <tr>
      <td>isNetworkError</td>
      <td align="center">function</td>
      <td>
        <code>
            function (xhr) { 
                return xhr.status == 0 || 
                    (xhr.status >= 400 && 
                        xhr.status < 500); 
            }
        </code>
      </td>
      <td>Logic to decide if the request was a network error or not.</td>
    </tr>
  </tbody>
</table>

## Methods
There are a handfull of methods exposed by the $.offline object that you can use to interact with the script.
 <table>
  <tbody>
    <tr>
      <th>Method</th>
      <th align="center">Return Type</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>init</td>
      <td align="center">void</td>
      <td>
        Initializes the offline script and replaces jQuery functions. This method can be called multiple times if you want to updated settings after it has been initialized.
      </td>
    </tr>
    <tr>
      <td>isOnline</td>
      <td align="center">bool</td>
      <td>Returns the current state of your application.</td>
    </tr>
    <tr>
      <td>requestQueueCount</td>
      <td align="center">int</td>
      <td>The number of requests that are currently queued for retry.</td>
    </tr>
  </tbody>
</table>
## Credit and Background
I was inspired to create this script by the [Hubspot/Offline](https://github.com/HubSpot/offline) script. I found it and I really loved the concept. Unfortunately, I couldn't get it to work quite the way I wanted and it seemed to have a lot of extra bloat that I was never going to be using in my application. I decided to create an extremely light weight script that did the following:
1. Automatically monitor my ajax requests and queue them in the event of a network outage.
2. Provide some basic mechanisms for knowing if the app has a real-world connection to my services without additional overhead of ping requests.

## Known Issues
There aren't any reported bugs yet, but there are a few issues that I already know could effect this script.
1. This only handles the requests that go throug the jQuery.ajax method. Standard XHR requests are NOT going to be queued.
2. If you are making a synchronous ajax request, you are going to have problems. But why would you want to do that anyway :)?

## Roadmap
Here are some things I plan on doing in the near future.
1. Provide a basic grunt script to minify the script and minified versions in a /dist directory
2. Add some off-the-shelf interface options for offline indicators. These will be inspired by the ones in the [Hubspot/Offline](https://github.com/HubSpot/offline) script  