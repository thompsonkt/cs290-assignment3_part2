window.onload = function() {
  var favoritesStr = localStorage.getItem('favorites');
  if (favoritesStr === null) {
    settings = {'favorites':[]};
    localStorage.setItem('favorites',JSON.stringify(settings));
  }
  else {
    settings = JSON.parse(favoritesStr);
    displayFavorites();
  }
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
        load_tables(response);
      } else {
        alert('There was a problem with the request.');
      }
    }
  };

  httpRequest.open('GET', 'https://api.github.com/gists', true);
  /* TO DO: Add paging...loop using page=x or rel="next"*/
  httpRequest.send();
}

function load_tables(response) {

  /* Replace existing table */
  var resultsDiv = document.getElementById("searchResultsDiv");
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
  
  for (var key in response)
  {
    /* credit for looping over JSON: http://stackoverflow.com/questions/18238173/javascript-loop-through-json-array */
    if (response.hasOwnProperty(key)) {
      
      var row = document.createElement("tr");
      
      for (var i=0; i < 2; i++) {
        
        var cell = document.createElement("td");
        
        if (i == 0) {
          var button = document.createElement("input");
          button.setAttribute('type',"button");
          button.setAttribute('value',"add");
          button.setAttribute('onclick',"addToFavorites('" + response[key].description + "','" + response[key].url + "')");
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
  
  table.appendChild(tableBody);
  resultsDiv.replaceChild(table, oldResultsTable);
}

function addToFavorites(description, url) {
  var f = new Favorite(description, url);
  addFavorite(settings, f);
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
  
  for (var key in settings)
  {
    if (settings.hasOwnProperty(key)) {
      if (key == "favorites") {
      var favs = 
        for (var subkey in key) {
          var row = document.createElement("tr");
          
          for (var i=0; i < 2; i++) {
            
            var cell = document.createElement("td");
            
            if (i == 0) {
              var button = document.createElement("input");
              button.setAttribute('type',"button");
              button.setAttribute('value',"remove");
              button.setAttribute('onclick',"removeFromFavorites('" + key[subkey].description + "','" + key[subkey].url + "')");
              cell.appendChild(button);
            }
            else {
              var cellA = document.createElement("a");
              var description = key[subkey].description;
              if (description == "") {
                description = "No Description";
                cell.style.fontStyle="italic"
              }
              var cellText = document.createTextNode(description);
              cellA.setAttribute('href', key[subkey].url);
              cellA.appendChild(cellText);
              cell.appendChild(cellA);
            }
            row.appendChild(cell);
          }
          tableBody.appendChild(row);
         }
      }
    }
  }
      
  table.appendChild(tableBody);
  favoritesDiv.replaceChild(table, oldFavoritesTable);

}