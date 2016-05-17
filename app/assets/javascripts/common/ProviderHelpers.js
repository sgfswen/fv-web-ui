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
  getEntry: function (wordResults, path) {
    if (!wordResults || wordResults.isEmpty() || !path)
      return null;

    let result = wordResults.find(function(entry) {
        return entry.get('id') === path;
    });

	if (result)
    	return result.toJS();

    return null;
  },
  /*hasExtendedGroup: function (extendedGroups, group) {

    if (extendedGroups && extendedGroups.size > 0) {
      if (extendedGroups.findIndex(function(entry) { return (entry.get('name') === group) }) === -1) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  },*/
  getDialectPathFromURLArray: function (url) {
  	return decodeURI(url.slice(1, 7).join('/'));
  }
}