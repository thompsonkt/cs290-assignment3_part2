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
  var tHeadCellText = document.createTextNode("Favorites");
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
  alert("Adding " + description + " to favorites");
  alert("URL " + url);
}