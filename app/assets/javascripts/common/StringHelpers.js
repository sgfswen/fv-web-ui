/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
export default {
  clean: function (str, mode = 'NXQL') {
    if (mode == 'NXQL') {
      // Escape single quotes and URL decode
      str = decodeURIComponent(str.replace(/'/g, "\\'"));

      // Escape '&' operator
      str = str.replace(/&/g, "%26")
    }

    return str;
  },
  extractErrorMessage: function (jsonError) {
    let errorMessage = jsonError.message;

    if (jsonError.message != null && jsonError.message.indexOf(": ") !== -1) {
      errorMessage = jsonError.message.split(": ")[1];
      errorMessage = "Error: " + errorMessage;
    }

    return errorMessage;
  },
  getReadableFileSize: function(size) {
    var e = (Math.log(size) / Math.log(1e3)) | 0;
    return +(size / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
  },
  toTitleCase: function (string) {
    return string[0].toUpperCase() + string.substring(1);
  }
}