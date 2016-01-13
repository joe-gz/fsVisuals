"use strict";

(function(){
  angular
  .module("leagues")

  //camel cased directive name
  //in your HTML, this will be named as bars-chart
  .directive('barsChart', function ($parse) {
    //explicitly creating a directive definition variable
    //this may look verbose but is good for clarification purposes
    //in real life you'd want to simply return the object {...}
    var directiveDefinitionObject = {
      //We restrict its use to an element
      //as usually  <bars-chart> is semantically
      //more understandable
      restrict: 'E',
      //this is important,
      //we don't want to overwrite our directive declaration
      //in the HTML mark-up
      replace: false,
      //our data source would be an array
      //passed thru chart-data attribute
      scope: {data: '=chartData', filter: '=filterRound'},
      link: function (scope, element, attrs) {
        console.log(scope.data);

        scope.masterData = scope.data;

        scope.$watch('filter', function(newValue, oldValue) {

          $('.chart').remove();
          $('.bubble').remove();
          scope.data = [];

          if (newValue.round === 'Show All') {
            console.log('Make everything show!');
            scope.data = scope.masterData
          } else {
            for (var i = 0; i < scope.masterData.length; i++){
              if (Number(scope.masterData[i].round) === newValue.round) {
                console.log('SHOW JUST '+ scope.masterData[i].round);
                scope.data.push(scope.masterData[i])
              }
            }
          }

          scope.loadChart();
          console.log('NEW VALUE: ' + newValue.round);
        }, true);

        //in D3, any selection[0] contains the group
        //selection[0][0] is the DOM node
        //but we won't need that this time
        var chart = d3.select(element[0]);
        //to our original directive markup bars-chart
        //we add a div with out chart stling and bind each
        //data entry to the chart


        scope.loadChart = function(){

          chart.append("div").attr("class", "chart")
          .selectAll('div')
          .data(scope.data).enter().append("div")
          .attr("class", "bar")
          .transition().ease("elastic")
          .style("width", function(d) { return d.cost + "%"; })
          .text(function(d) { return d.playerName +" $"+ d.cost; });
          //a little of magic: setting it's width based
          //on the data value (d)
          //and text all with a smooth transition

          // *******************************************************

          var diameter = 500, //max size of the bubbles
          color    = d3.scale.category20b(); //color category

          var bubble = d3.layout.pack()
          .sort(null)
          .size([diameter, diameter])
          .padding(1.5);

          var svg = chart.append("svg")
          .attr("width", diameter)
          .attr("height", diameter)
          .attr("class", "bubble");

          function render(data){

            //convert numerical values from strings to numbers
            data = data.map(function(d){ d.value = +Number(d.cost); return d; });
            console.log(data);

            //bubbles needs very specific format, convert data to this.
            var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

            //setup the chart
            var bubbles = svg.append("g")
            .attr("transform", "translate(0,0)")
            .selectAll(".bubble")
            .data(nodes)
            .enter();

            //create the bubbles
            bubbles.append("circle")
            .attr("r", function(d){ return d.r; })
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
            .style("fill", function(d) { return color(d.value); });

            //format the text for each bubble
            bubbles.append("text")
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y + 5; })
            .attr("text-anchor", "middle")
            .text(function(d){ return d.playerName; })
            .style({
              "fill":"white",
              "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
              "font-size": "12px"
            });
          };

          render(scope.data)
          // *******************************************************

        };

        scope.loadChart();
      }
    };
    return directiveDefinitionObject;
  });

}());
