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
      var cardLink2 = $("<a class = 'card-link save'/>");
      cardTitle.text(data[i].title);
      cardText.text(data[i].summary);
      cardLink1.text("Read more...");
      cardLink1.attr("href",data[i].link);
      cardLink1.attr("target","_blank");
      cardLink2.text("Save");
      cardLink2.attr("href","#");
      cardLink2.data("info", data[i]);
      cardBlock.append(cardTitle);
      cardBlock.append(cardText);
      cardBlock.append(cardLink1);
      cardBlock.append(cardLink2);
      card.append(cardBlock);
      $(".articles").append(card);
    }
  });



$(document).ready(function(){
    $(".save").on("click",function(e){
        $.post("/api/save",$(this).data("info"),function(msg){
            if (msg === "Saved"){
                console.log("Success");
            }else{
                console.log(msg);
            }
        })
    })

    $(".scrape").on("click",function(e){
        $.get("/scrape",function(msg){
            if (msg === "Scrape Complete"){
                window.location.reload(true);
                console.log("Success");
            }else{
                console.log(msg);
            }
        })
    })
})