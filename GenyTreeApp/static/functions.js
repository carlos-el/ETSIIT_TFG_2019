$(document).ready(function(){

  $("#hamburger-icon").click(function(){
    $(".dropdown-menu").toggle(200);
  })

  $(".person-data-readmore-button").click(function(){
    $(this).siblings(".supplementary-data").toggle(200);
    $(this).toggle();
    $(this).siblings(".person-data-readmore-button").toggle();
  });

  $("#print-person-generations").click(function(){
    const doc = new jsPDF({lineHeight: 0.5})

    doc.setProperties({
        title: $('#person-relatives-title').text(),
        subject: 'Genealogy',
    });

      const b = $('#person-generations').text()
    doc.setFontSize(15)
    doc.setFontType("bold");
    doc.text($('#person-relatives-title').text(), 20, 20)

    doc.setFontSize(10)
    doc.setFontType("normal");
    const textLines = $('#person-generations').text().split("\n")

    let margin_top = 25
    for(let i = 0; i < textLines.length; i++){
      if(margin_top >= 270) {
        doc.addPage()
        margin_top = 25
      }

      doc.text(textLines[i], 0, margin_top)
      margin_top += 2
    }

    doc.save($('#person-relatives-title').text() + '.pdf');
  });

  $("#search-bar").focus(function(){
    $("#search-content").show()
  });


  $(document).click(function (e) {
    if ($(e.target).closest("#search").length === 0) {
      $("#search-content").hide();
    }
  })


  $("#search-bar").keyup(function(){
    let keyword = $(this).val()

    $.ajax({
      type: "get",
      url: location.origin + '/person?format=json&keyword=' + keyword,
      success: function(data) {
          $("#search-content").empty()

          data.person_list.forEach(item => {
            let birth = ''
            let death = ''
            if (item.birth)
              birth = 'Nacimiento: ' + item.birth.slice(0,4)
            if (item.death)
              death = 'Defunción: ' + item.death.slice(0,4)

            $("#search-content").append(
                "<a href='"+ location.origin + "/person/" + item.id.toString() +"' class='person-link'> <div> <img class='float-left' src='" +"/static/person_photos/"+item.img_path+ "' width='30' height='40'> <div class='person-link-data'> <span>" +item.name+ "</span> <span>" +item.surname+ "</span><br> <span>" +birth+ "</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>" +death+ "</span></div> </div> </a><br>"
            )
          })
      }
    });
  });

  console.log('Ready')
});