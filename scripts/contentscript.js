// Stored data variable
var data;

// Prepare matching regexp
var re = new RegExp('^https://.[^\.]*.googleusercontent.com.[^#]*#(.*)');


// Functions which removes proxy URL from all broken images
function removeProxy() {
  // Apply only in the e-mail content container
  $("div[class='nH if'] img").error(function() {
    // Check image source URL
    var url_match = re.exec($(this).attr('src'));

    if (url_match != null) {
      for (var i=0; i<data.length; i++) {
        var r = data[i].url;

        // Translate wildcard string to regexp
        if (data[i].type == 'w') {
          r = globStringToRegex(data[i].url);
        }

        // Check if the URL matches any URL pattern
        if (url_match[1].match(r)) {
          // Set new SRC attribute
          $(this).attr({
            src: url_match[1]
          });

          break;
        }
      }
    }
  });
}


// Converts wildcard string to regexp
function globStringToRegex(str) {
  return new RegExp(preg_quote(str).replace(/\\\*/g, '.*').replace(/\\\?/g, '.'), 'g');
}
function preg_quote (str, delimiter) {
  // http://kevin.vanzonneveld.net
  // +   original by: booeyOH
  // +   improved by: Ates Goral (http://magnetiq.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: preg_quote("$40");
  // *     returns 1: '\$40'
  // *     example 2: preg_quote("*RRRING* Hello?");
  // *     returns 2: '\*RRRING\* Hello\?'
  // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
  // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
  return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}


// Bind our function to the DOM tree change
$('html').bind('DOMSubtreeModified', function(e) {
  removeProxy();
});


// Load stored data
(function() {
  chrome.storage.local.get('data', function(result) {
    if (result.data) {
      data = result.data;
    }
  });
})();
