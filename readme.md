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
Running this one line of code will replace the default jQuery.ajax method with a custom handler to monitor all of the requests being made by your application. It will provide logic to automatically queue and retry these requests in the event that your application loses its connection to the server.

## Configuration
You can initialize the script with a configuration object instead like this:
```
$.offline.init({
    notificationAttempts: 5
});
```
### Available Options
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
```
function (xhr) { 
    return xhr.status == 0 || (xhr.status >= 400 && xhr.status < 500); 
}
```
      </td>
      <td>Logic to decide if the request was a network error or not.</td>
    </tr>
  </tbody>
</table>