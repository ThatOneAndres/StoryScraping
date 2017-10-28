// Grab the articles as a json
$.getJSON("/api/save", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page

      var card = $("<div class = 'card'/>");
      var cardBlock = $("<div class = 'card-block'/>");
      var cardTitle = $("<div class = 'card-title'/>");
      var cardText = $("<div class = 'card-text'/>");
      var cardLink1 = $("<a class = 'card-link'/>");
      var cardLink2 = $("<a class = 'card-link remove'/>");
      var viewComments = $("<button class='btn btn-primary btn-sm' type='button' data-toggle='collapse' aria-expanded='false' aria-controls='collapseExample'/>");
      var comments = $("<div class = 'collapse'/>");
      var addComments = $("<button class='btn btn-primary btn-sm addToggle'/>")
      var addForm = $("<form style = 'display: none'/>")
      var formContent = $("<form-group/>");
      var formButton = $('<button class ="btn btn-primary comment-submit"/>').text("Add");
      cardTitle.text(data[i].title);
      cardText.text(data[i].summary);
      cardLink1.text("Read more...");
      cardLink1.attr("href",data[i].link);
      cardLink1.attr("target","_blank");
      cardLink2.text("Remove");
      cardLink2.attr("href","#");
      cardLink2.data("info", data[i]);
      // View Comments
      viewComments.text("View Comments");
      viewComments.attr("data-target","#collapseExample"+i);
      comments.attr("id","collapseExample"+i)
      for (var j = 0; j < data[i].note.length; j++){
          var comment = $("<div class = 'card card-body'/>");
          var header = $("<h4/>").text(data[i].note[j].title);
          header.data("comment-id",data[i].note[j]);
          header.html(data[i].note[j].title + "<button type='button' class='btn btn-danger pull-right btn-sm delete'> <i class='fa fa-trash' aria-hidden='true'></i></button>")
          var body = $("<p/>").text(data[i].note[j].body);
          comment.append(header);
          comment.append(body);
          comments.append(comment);
      }
      // Add Comment
      addComments.text("Add Comment");
      formContent.append($("<div/>").text("Heading"));
      formContent.append($('<input type="text" class="form-control" id="commentTitle"/>'));
      formContent.append($('<div for="comment"/>').text("Comment"));
      formContent.append($('<textarea class="form-control" id="comment" rows="3"></textarea>'));
      formButton.data("id", data[i]._id);
      formContent.append(formButton);
      addForm.append(formContent);

      cardBlock.append(cardTitle);
      cardBlock.append(cardText);
      cardBlock.append(cardLink1);
      cardBlock.append(cardLink2);
      cardBlock.append(viewComments);
      cardBlock.append(addComments);
      cardBlock.append(comments);
      card.append(cardBlock);
      $(".saved").append(card);
      $(".saved").append(addForm);
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
    $(".delete").on("click", function(e){
        $.ajax({
            url:"/api/comment",
            type:"DELETE",
            data:$($(this)[0].parentNode).data("comment-id")
        }).done(function(msg){
            console.log(msg)
        });
    })

    $(".addToggle").on("click", function(e){
        e.preventDefault();
        console.log($($(this)[0].parentElement.parentElement.nextSibling).css("display"));
        if ($($(this)[0].parentElement.parentElement.nextSibling).css("display") === "none"){
            $($(this)[0].parentElement.parentElement.nextSibling).css("display", "block");
        }else{
            $($(this)[0].parentElement.parentElement.nextSibling).css("display", "none");
        }
    })

    $(".comment-submit").on("click", function(e){
        console.log($(this)[0].parentElement.childNodes[1]);
        console.log($(this)[0].parentElement.childNodes[4]);
        var heading = $($(this)[0].parentElement.childNodes[1]).val().trim();
        var comment = $($(this)[0].parentElement.childNodes[4]).val().trim();
        var commObj = {title: heading, body: comment};
        var articleID = $(this).data("id");
        console.log(heading,comment,articleID);
        var url = "/save/"+articleID;
        $.post(url,commObj,function(data){
            console.log(data);
        });
    })
})