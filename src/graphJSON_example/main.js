$(window).ready(function(){
  $.getJSON('main.json', function(js){
    var data = js.variables;


  d3.select(".chart")
  .selectAll("div")
  .data(data)
    .enter()
    .append("div")
    .style("width", function(d) { return d + "px"; })
    .text(function(d) { return d; });


  });

  $(function(){
    $('.chart').sortable();
    $('.chart').disableSelection();
  });
});
