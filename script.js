/*jslint browser: true*/
/*global alert */
/*global console */
function displayFavorites() {

  /* Replace existing table */
  var favoritesDiv = document.getElementById("favoritesDiv");
  var oldFavoritesTable = document.getElementById("favoritesTable");
  var table = document.createElement("table");
  table.setAttribute('id', "favoritesTable");
  var tableHead = document.createElement("thead");
  var tHeadRow = document.createElement("tr");
  var tHeadCell1 = document.createElement("th");
  var tHeadCell2 = document.createElement("th");
  var tHeadCellText = document.createTextNode("Remove from Favs");
  tHeadCell1.appendChild(tHeadCellText);
  tHeadRow.appendChild(tHeadCell1);
  tHeadCellText = document.createTextNode("Gist Description");
  tHeadCell2.appendChild(tHeadCellText);
  tHeadRow.appendChild(tHeadCell2);
  tableHead.appendChild(tHeadRow);
  table.appendChild(tableHead);
  var tableBody = document.createElement("tbody");
  var j, i;
  var row;
  var html_url;
  var description;
  var cell;
  var button;
  var cellA;
  var cellText;
  for (j = 0; j < localStorage.length; j++) {
    row = document.createElement("tr");
    html_url = localStorage.key(j);
    description = localStorage.getItem(localStorage.key(j));
    for (i = 0; i < 2; i++) {
      cell = document.createElement("td");
      if (i === 0) {
        button = document.createElement("input");
        button.setAttribute('type', "button");
        button.setAttribute('value', "remove");
        button.setAttribute('onclick', "removeFromFavs('" + html_url + "')");
        cell.appendChild(button);
      } else {
        cellA = document.createElement("a");
        if (description === "") {
          description = "No Description";
          cell.style.fontStyle = "italic";
        }
        cellText = document.createTextNode(description);
        cellA.setAttribute('href', html_url);
        cellA.appendChild(cellText);
        cell.appendChild(cellA);
      }
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  }
  table.appendChild(tableBody);
  favoritesDiv.replaceChild(table, oldFavoritesTable);

}

window.onload = function () {
  displayFavorites();
};

function load_tables(response, page) {

  /* Check filters */
  var noFilter = true;
  var includePython = document.getElementById("chkbxPython").checked;
  var includeJSON = document.getElementById("chkbxJSON").checked;
  var includeJS = document.getElementById("chkbxJavaScript").checked;
  var includeSQL = document.getElementById("chkbxSQL").checked;
  var table;
  var tableBody;
  var oldResultsTable;
  if (includePython || includeJSON || includeJS || includeSQL) {
    noFilter = false;
  }
  var resultsDiv = document.getElementById("searchResultsDiv");
  var rowid = 0;
  if (page === 1) {
    oldResultsTable = document.getElementById("resultsTable");
    table = document.createElement("table");
    table.setAttribute('id', "resultsTable");
    var tableHead = document.createElement("thead");
    var tHeadRow = document.createElement("tr");
    var tHeadCell1 = document.createElement("th");
    var tHeadCell2 = document.createElement("th");
    var tHeadCellText = document.createTextNode("Add to Favs");
    tHeadCell1.appendChild(tHeadCellText);
    tHeadRow.appendChild(tHeadCell1);
    tHeadCellText = document.createTextNode("Gist Description");
    tHeadCell2.appendChild(tHeadCellText);
    tHeadRow.appendChild(tHeadCell2);
    tableHead.appendChild(tHeadRow);
    table.appendChild(tableHead);
    tableBody = document.createElement("tbody");
    tableBody.setAttribute('id', "resultsTableBody");
  } else {
    rowid += 30;
    table = document.getElementById("resultsTable");
    tableBody = document.getElementById("resultsTableBody");
  }
  var key;
  var include;
  var fileName;
  var fileObj;
  var row;
  var i;
  var cell;
  var button;
  var cellA;
  var description;
  var cellText;
  /* credit for looping over JSON:
  stackoverflow.com/questions/18238173/javascript-loop-through-json-array */
  for (key in response) {
    if (response.hasOwnProperty(key)) {
      /* Do not add if already in favorites */
      if (!localStorage.getItem(response[key].html_url)) {
        /* Filter Results */
        if (noFilter) {
          include = true;
        } else {
          for (fileName in response[key].files) {
            if (response[key].files.hasOwnProperty(fileName)) {
              fileObj = response[key].files[fileName];
              console.log(fileObj.language);
              if (fileObj.language === "JSON" && includeJSON) {
                include = true;
              } else if (fileObj.language === "JavaScript" && includeJS) {
                include = true;
              } else if (fileObj.language === "Python" && includePython) {
                include = true;
              } else if (fileObj.language === "SQL" && includeSQL) {
                include = true;
              } else {
                include = false;
              }
            }
          }
        }
        console.log(include);
        if (include) {
          row = document.createElement("tr");
          row.setAttribute('id', "rowid" + rowid);
          for (i = 0; i < 2; i++) {
            cell = document.createElement("td");
            if (i === 0) {
              button = document.createElement("input");
              button.setAttribute('type', "button");
              button.setAttribute('value', "add");
              button.setAttribute('onclick', "addToFavorites('" +
                response[key].description + "','" + response[key].html_url +
                "','" + rowid + "')");
              cell.appendChild(button);
            } else {
              cellA = document.createElement("a");
              description = response[key].description;
              if (description === "") {
                description = "No Description";
                cell.style.fontStyle = "italic";
              }
              cellText = document.createTextNode(description);
              cellA.setAttribute('href', response[key].html_url);
              cellA.appendChild(cellText);
              cell.appendChild(cellA);
            }
            row.appendChild(cell);
          }
          tableBody.appendChild(row);
        }
      }
    }
    rowid++;
  }
  if (page === 1) {
    table.appendChild(tableBody);
    resultsDiv.replaceChild(table, oldResultsTable);
  }
}

function searchGit() {
  var pages = document.getElementById("pagesRequested");
  var i;
  var httpRequest;
  var response;
  if (pages.value < 1 || pages.value > 5) {
    alert("Pages must be between 1 and 5. Please try again.");
    return;
  }
  var funcOnReadyStateChange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        response = JSON.parse(httpRequest.responseText);
        load_tables(response, i);
      } else {
        alert('There was a problem with the request.');
      }
    }
  };
  for (i = 1; i <= pages.value; i++) {
    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      httpRequest = new window.ActiveXObject("Microsoft.XMLHTTP");
    }
    if (!httpRequest) {
      alert('Could not create httpRequest');
    }
    httpRequest.onreadystatechange = funcOnReadyStateChange;
    httpRequest.open('GET', 'https://api.github.com/gists', false);
    httpRequest.send("page=" + i);
  }
}

function addToFavorites(description, html_url, rowid) {
  localStorage.setItem(html_url, description);
  displayFavorites();
  var row = document.getElementById("rowid" + rowid);
  var tbody = row.parentNode;
  tbody.removeChild(row);
}

function removeFromFavs(html_url) {
  localStorage.removeItem(html_url);
  displayFavorites();
}

