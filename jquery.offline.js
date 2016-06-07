(function ($) {
    $.extend(function () {
        return {
            offline: function () {

                var retryAttempts = 0;
                var jqajax = null;
                var failedRequestLog = [];

                var settings = {
                    notificationAttempts: 3,
                    retryInterval: 10,
                    isNetworkError: function (xhr) {
                        return xhr.status == 0 || (xhr.status >= 400 && xhr.status < 500);
                    }
                };

                var states = {
                    inactive: 0,
                    online: 1,
                    pendingOffline: 2,
                    offline: 3
                };

                var currentState = -1;
                var stateLogic = {};

                stateLogic[states.online] = {
                    start: function () {
                        $('body').addClass('online');

                        // Requeue any pending requests now that we are back online
                        if (failedRequestLog.length > 0) {
                            var itemsToQueue = failedRequestLog.splice(0, failedRequestLog.length);
                            for (var i = 0; i < itemsToQueue; i++) {
                                performRequest(itemsToQueue[i]);
                            }
                        }
                    }
                }
                stateLogic[states.pendingOffline] = {
                    start: function () {
                        // Update our state to pending offline.
                        currentState = states.pendingOffline;
                        // Reset our retry attempts
                        retryAttempts = 0;

                        var retryLoop = function () {
                            if (retryAttempts++ >= settings.notificationAttempts) {
                                // Ok, we need to go into a standard retry cycle now.
                                goToState(states.offline);
                            } else {
                                performRetry(retryLoop);
                            }
                        };

                        retryLoop();
                    }
                }
                stateLogic[states.offline] = {
                    start: function () {
                        var retryLoop = function () {
                            setTimeout(function () {
                                performRetry(retryLoop);
                            }, settings.retryInterval * 1000);
                        };

                        $('body').addClass('offline');
                        retryLoop();
                    }
                }


                function goToState(newState) {
                    if (currentState != newState) {
                        var prevState = currentState;
                        currentState = newState;

                        executeStateEvent(currentState, 'end', newState);
                        executeStateEvent(newState, 'start', prevState);
                        
                        $('body').trigger('offline-state-change', [newState, prevState]);
                    }
                }

                function executeStateEvent(state, method, transitionState) {
                    var logic = stateLogic[state];
                    if (typeof logic === 'object') {
                        var m = logic[method];
                        if (typeof m === 'function') m(transitionState);
                    }
                }

                goToState(states.inactive);

                return {
                    init: function (options) {
                        $.extend(settings, options);

                        // Replace the default jQuery ajax function
                        if (currentState == states.inactive) {
                            jqajax = $.ajax;
                            $.ajax = handleAjaxRequest;

                            goToState(states.online);
                        }
                    },
                    isOnline: function() {
                        return currentState === states.online;
                    },
                    requestQueueCount: function() {
                        return failedRequestLog.length;
                    }
                };

                function handleAjaxRequest(url, options) {
                    // Make sure we allow option only overload to mimic jQuery
                    if (typeof url === "object") {
                        options = url;
                        url = undefined;
                    }

                    var reqData = { url: url, options: options };
                    performRequest(reqData);
                }

                function performRequest(reqData, callback) {
                    var url = reqData.url;
                    var options = reqData.options;

                    // Cache the users callbacks
                    var callbacks = {
                        complete: options.complete,
                        success: options.success,
                        error: options.error
                    };

                    if (typeof callback !== 'function') {
                        callback = function (success) {
                            if (success == false) {
                                // Log this failed request
                                failedRequestLog.push(reqData);

                                // Report this failure so our system knows there is something up
                                reportRequestFailure();
                            }
                        }
                    }

                    // Extend the user options with our custom callbacks
                    var reqSettings = $.extend({}, options, {
                        complete: function () {
                            applyCallback(callbacks.complete, this, arguments);
                        },
                        success: function () {
                            callback(true);
                            applyCallback(callbacks.success, this, arguments);
                        },
                        error: function (jqXHR) {
                            if (settings.isNetworkError(jqXHR)) {
                                callback(false);
                            } else {
                                callback(true);
                                applyCallback(callbacks.error, this, arguments);
                            }
                        }
                    });

                    // Pass this request through to jQuery using our custom options
                    jqajax(url, reqSettings);
                }

                function reportRequestFailure() {
                    if (currentState == states.online) {
                        goToState(states.pendingOffline);
                    }
                }

                function performRetry(failCallback) {
                    // Perform a retry, if it is good we go back to online otherwise we let the state handler know
                    performRequest(failedRequestLog[0], function (success) {
                        if (success) {
                            failedRequestLog.splice(0, 1); // Remove the one that finished with success
                            goToState(states.online);
                        } else {
                            failCallback();
                        }
                    });
                }

                function applyCallback(func, context, args) {
                    if (typeof func === 'function') {
                        func.apply(context, args);
                    }
                }
            }()
        };
    }())
})(jQuery);