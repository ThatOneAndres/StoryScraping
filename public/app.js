// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page

      var card = $("<div class = 'card'/>");
      console.log(card);
      var cardBlock = $("<div class = 'card-block'/>");
      var cardTitle = $("<div class = 'card-title'/>");
      var cardText = $("<div class = 'card-text'/>");
      var cardLink1 = $("<a class = 'card-link'/>");
      var cardLink2 = $("<a class = 'card-link'/>");
      cardTitle.text(data[i].title);
      cardText.text(data[i].summary);
      cardLink1.text("Read more...");
      cardLink1.attr("href",data[i].link);
      cardLink1.attr("target","_blank");
      cardLink2.text("Save");
      cardLink2.attr("href","#");
      cardBlock.append(cardTitle);
      cardBlock.append(cardText);
      cardBlock.append(cardLink1);
      cardBlock.append(cardLink2);
      card.append(cardBlock);
      $(".articles").append(card);
    }
  });



$(document).ready(function(){
})