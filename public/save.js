// Grab the articles as a json
$.getJSON("/api/save", function(data) {
    // For each one
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page

      var card = $("<div class = 'card'/>");
      console.log(card);
      var cardBlock = $("<div class = 'card-block'/>");
      var cardTitle = $("<div class = 'card-title'/>");
      var cardText = $("<div class = 'card-text'/>");
      var cardLink1 = $("<a class = 'card-link'/>");
      var cardLink2 = $("<a class = 'card-link remove'/>");
      cardTitle.text(data[i].title);
      cardText.text(data[i].summary);
      cardLink1.text("Read more...");
      cardLink1.attr("href",data[i].link);
      cardLink1.attr("target","_blank");
      cardLink2.text("Remove");
      cardLink2.attr("href","#");
      cardLink2.data("info", data[i]);
      cardBlock.append(cardTitle);
      cardBlock.append(cardText);
      cardBlock.append(cardLink1);
      cardBlock.append(cardLink2);
      card.append(cardBlock);
      $(".saved").append(card);
    }
  });


$(document).ready(function(){
    $(".remove").on("click",function(e){
        $.ajax({
            url: "/api/save",
            type:"DELETE",
            data: $(this).data("info")
        }).done(function(msg){
            if (msg === "Saved"){
                console.log("Success");
                window.location.reload(true);
            }else{
                console.log(msg);
            }
        });
    })
})