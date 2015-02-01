window.onload = function() {
    displayFavorites();
}

function Favorite(description, url) {
  this.description = description;
  this.url = url;
}

function addFavorite(settings, favorite) {
  if (favorite instanceof Favorite) {
    settings.favorites.push(favorite);
    localStorage.setItem('favorites', JSON.stringify(settings));
    displayFavorites();
    return true;
  }
  console.error('Attempted to add non-favorite');
  return false;
}

function searchGit() {
  var pages = document.getElementById("pagesRequested");
  if (pages.value < 1 || pages.value > 5)
  {
    alert("Pages must be between 1 and 5. Please try again.");
    return;
  }
  
  for (var i = 1; i <= pages.value; i++) {
    var httpRequest;
    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    if (!httpRequest) {
      alert('Could not create httpRequest');
    }

    httpRequest.onreadystatechange = function(){
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          var response = JSON.parse(httpRequest.responseText);
          load_tables(response, i);
        } else {
          alert('There was a problem with the request.');
        }
      }
    };

    httpRequest.open('GET', 'https://api.github.com/gists', false);
    httpRequest.send("page=" + i);
  }
}

function load_tables(response, page) {

  var resultsDiv = document.getElementById("searchResultsDiv");  
  var rowid = 0;
  
  if (page == 1)
  {
    var oldResultsTable = document.getElementById("resultsTable");
    var table = document.createElement("table");
    table.setAttribute('id',"resultsTable");
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
    
    var tableBody = document.createElement("tbody");
    tableBody.setAttribute('id',"resultsTableBody");
    
  }
  else
  {
    rowid += 30;
    var table = document.getElementById("resultsTable");
    var tableBody = document.getElementById("resultsTableBody");
  }
  
  
  for (var key in response)
  {
    /* credit for looping over JSON: http://stackoverflow.com/questions/18238173/javascript-loop-through-json-array */
    if (response.hasOwnProperty(key)) {
      
      /* Do not add if already in favorites */
      if (!localStorage.getItem(response[key].url)) {
      
        var row = document.createElement("tr");
        row.setAttribute('id',"rowid" + rowid);
        
        for (var i=0; i < 2; i++) {
          
          var cell = document.createElement("td");
          
          if (i == 0) {
            var button = document.createElement("input");
            button.setAttribute('type',"button");
            button.setAttribute('value',"add");
            button.setAttribute('onclick',"addToFavorites('" + response[key].description + "','" + response[key].url + "','" + rowid + "')");
            cell.appendChild(button);
          }
          else {
            var cellA = document.createElement("a");
            var description = response[key].description;
            if (description == "") {
              description = "No Description";
              cell.style.fontStyle="italic"
            }
            var cellText = document.createTextNode(description);
            cellA.setAttribute('href', response[key].url);
            cellA.appendChild(cellText);
            cell.appendChild(cellA);
          }
          row.appendChild(cell);
        }
        tableBody.appendChild(row);
      }
    }
    rowid++;
  }
  
  if (page == 1) {
    table.appendChild(tableBody);
    resultsDiv.replaceChild(table, oldResultsTable);
  }
  
}

function addToFavorites(description, url, rowid) {
  localStorage.setItem(url,description);
  displayFavorites();
  var row = document.getElementById("rowid" + rowid)
  var tbody = row.parentNode;
  tbody.removeChild(row);
}

function removeFromFavorites(url) {
  localStorage.removeItem(url);
  displayFavorites();
}

function displayFavorites() {

  /* Replace existing table */
  var favoritesDiv = document.getElementById("favoritesDiv");
  var oldFavoritesTable = document.getElementById("favoritesTable");
  
  var table = document.createElement("table");
  table.setAttribute('id',"favoritesTable");
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
  
  for (var j = 0; j < localStorage.length; j++)
  {
    var row = document.createElement("tr");
    var url = localStorage.key(j);
    var description = localStorage.getItem(localStorage.key(j));
    
    for (var i=0; i < 2; i++) {
      
      var cell = document.createElement("td");
      
      if (i == 0) {
        var button = document.createElement("input");
        button.setAttribute('type',"button");
        button.setAttribute('value',"remove");
        button.setAttribute('onclick',"removeFromFavorites('" + url + "')");
        cell.appendChild(button);
      }
      else {
        var cellA = document.createElement("a");
        if (description == "") {
          description = "No Description";
          cell.style.fontStyle="italic"
        }
        var cellText = document.createTextNode(description);
        cellA.setAttribute('href', url);
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