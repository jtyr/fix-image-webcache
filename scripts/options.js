// Default data structure
var data = [];

// Identifies a record to be saved
var n_save;


// Onload event listener
document.addEventListener('DOMContentLoaded', function () {
  console.log('loading')

  // Load stored data if available
  chrome.storage.local.get('data', function(result) {
    if (result.data) {
      data = result.data;
    }

    // Generate table
    generTable();
  });

  // Set onclick listener to Add and Save buttons
  var f = document.forms[0];
  f.add.onclick = addRecord;
  f.save.onclick = saveRecord;
});


// Store data
function storeData() {
  chrome.storage.local.set({'data': data});
}


// Swap visibility of Add and Save button
function swapButtons(visible) {
  var f = document.forms[0];

  if (visible == 'add') {
    f.add.className = 'btn_visible';
    f.save.className = 'btn_invisible';
  } else {
    f.add.className = 'btn_invisible';
    f.save.className = 'btn_visible';
  }
}


// Add record into the data structure and re-generate the table
function addRecord() {
  var f = document.forms[0];
  var u = f.url.value;
  var t = f.type.value;

  data.push({
    url: u,
    type: t
  });

  // Store data
  storeData();

  // Re-generate table
  generTable();
}


// Delete record from the data structure and re-generate the table
function deleteRecord(n) {
  data.splice(n, 1);

  if (n_save == n) {
    // Make Add button visible
    swapButtons('add');
  }

  // Store data
  storeData();

  // Re-generate table
  generTable();
}


// Load record into the form fields
function loadRecord(n) {
  // Make Save button visible
  swapButtons('save');

  var f = document.forms[0];

  f.url.value = data[n].url;
  f.type.value = data[n].type;

  n_save = n;
}


// Save record and re-generate the table
function saveRecord() {
  var f = document.forms[0];
  var u = f.url.value;
  var t = f.type.value;

  data[n_save] = {
    url: u,
    type: t
  };

  // Make Add button visible
  swapButtons('add');

  // Store data
  storeData();

  // Re-generate table
  generTable();
}


// Generate the table from the data structure
function generTable() {
  var tab = document.getElementById('tab');

  if (data.length == 0) {
    tab.innerHTML = '<tr><td class="center bold">No rules</td></tr>';
    return;
  }

  // Table header
  tab.innerHTML = '<tr><th style="width: 100%" class="lb lr">URL pattern</th><th class="lb lr">Pattern&nbsp;type</th><th class="lb">Action</th></tr>';

  console.log(data.length);
  for (var i=0; i<data.length; i++) {
    var type = 'Regex';

    if (window.data[i].type == 'w') {
      type = 'Wildcard';
    }

    // Add table line
    tab.innerHTML += '<tr><td class="lbl lr">' + window.data[i].url + '</td><td class="lbl lr">' + type + '</td><td class="lbl center">[ <a href="#" title="Edit" id="edit_' + i + '">E</a> <a href="#" title="Delete" id="delete_' + i + '">D</a> ]</td></tr>';
  }

  // Set events for Edit and Delete buttons
  for (var i=0; i<data.length; i++) {
    document.getElementById('edit_' + i).onclick = (function (x) {
        return function (e) {
          loadRecord(x);
        };
    })(i);
    document.getElementById('delete_' + i).onclick = (function (x) {
        return function (e) {
            deleteRecord(x);
        };
    })(i);
  }
}
