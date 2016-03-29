(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD anonymous module
        define(["knockout", "jquery", "jquery-ui"], factory);
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.ko, jQuery);
    }
})(function (ko, $, undefined) {

    ko.bindingHandlers.flash = {
        init: function (element) {
            $(element).hide();
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (value) {
                $(element).stop().hide().text(value).fadeIn(function () {
                    clearTimeout($(element).data("timeout"));
                    $(element).data("timeout", setTimeout(function () {
                        $(element).fadeOut();
                        valueAccessor()(null);
                    }, 3000));
                });
            }
        },
        timeout: null
    };

    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(value));
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    ko.bindingHandlers.slideToggle = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).toggle(ko.utils.unwrapObservable(value)); 
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            ko.utils.unwrapObservable(value) ? $(element).slideDown() : $(element).slideUp();
        }
    };

    var ENTER_KEY = 13;

    ko.bindingHandlers.enterKey = {
        init: function (element, valueAccessor, allBindingsAccessor, data) {
            var wrappedHandler, newValueAccessor;
            wrappedHandler = function (data, event) {
                if (event.keyCode === ENTER_KEY) {
                    valueAccessor().call(this, data, event);
                }
            };
            newValueAccessor = function () {
                return {
                    keyup: wrappedHandler
                };
            };

            ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data);
        }
    };

    ko.bindingHandlers.selectAndFocus = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            ko.bindingHandlers.hasfocus.init(element, valueAccessor, allBindingsAccessor);
            ko.utils.registerEventHandler(element, 'focus', function () {
                element.focus();
            });
        },
        update: function (element, valueAccessor) {
            ko.utils.unwrapObservable(valueAccessor()); 
            setTimeout(function () {
                ko.bindingHandlers.hasfocus.update(element, valueAccessor);
            }, 0);
        }
    };

    ko.bindingHandlers.truncate = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()),
            length = ko.utils.unwrapObservable(allBindingsAccessor().length) || ko.bindingHandlers.truncate.defaultLength,
            truncatedValue = value.length > length ? value.substring(0, Math.min(value.length, length)) + "..." : value;

            ko.bindingHandlers.text.update(element, function () { return truncatedValue; });
        },
        defaultLength: 20
    };

    ko.bindingHandlers.trunc = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            var originalText = ko.utils.unwrapObservable(valueAccessor()),
                length = ko.utils.unwrapObservable(allBindingsAccessor().maxTextLength) || 20,
                truncatedText = originalText.length > length ? originalText.substring(0, length) + "..." : originalText;

            ko.bindingHandlers.text.update(element, function () {
                return truncatedText;
            });
        }
    };

    ko.bindingHandlers.booleanValue = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var observable = valueAccessor(),
                interceptor = ko.computed({
                    read: function () {
                        return observable().toString();
                    },
                    write: function (newValue) {
                        observable(newValue === "true");
                    }
                });

            ko.applyBindingsToNode(element, { value: interceptor });
        }
    };
});