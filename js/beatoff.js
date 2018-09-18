var player1 = {};
var player2 = {};
var union = [];
var url1 = 'https://scoresaber.com/u/76561198006244519&page=1&sort=1';
var url2 = 'https://scoresaber.com/u/76561198011570317&page=1&sort=1';
var count = 0;
var newHtml = "";

$(document).ready(function() {
  console.log("ready!");
  player1 = {};
  player2 = {};
  union = [];

  $.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
      var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
      options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
    }
  });
});

function getData() {
  getSongs(organize);
}

function getSongs(callback) {
  for (let i = 1; i < 11; i++) {
    var url1 = $('form input.p1form').val() + '&page=' + i.toString() + '&sort=1';
    var url2 = $('form input.p2form').val() + '&page=' + i.toString() + '&sort=1';
    console.log(url1);
    console.log(url2);

    $.get(url1, function(data1) {
      console.log(url1);
      var html1 = $(data1);
      var table1 = html1.find("table");
      var tbody1 = table1.find("tbody");
      tbody1.children().each(function() {
        var songHtml1 = $(this).find("th.song");
        var ppHtml1 = $(this).find("th.score");
        var song1 = $(this).find("th.song div div a span.songTop.pp").text();
        var pp1 = parseFloat($(this).find("th.score span.scoreTop.ppValue").text());
        player1[song1] = [pp1, songHtml1, ppHtml1];
        var songObj1 = {
          "song": song1,
          "pp": pp1
        };
        union.push(songObj1);
      });
      callback();
    });

    $.get(url2, function(data2) {
      console.log(url2);
      var html2 = $(data2);
      var table2 = html2.find("table");
      var tbody2 = table2.find("tbody");
      tbody2.children().each(function() {
        var songHtml2 = $(this).find("th.song");
        var ppHtml2 = $(this).find("th.score");
        var song2 = $(this).find("th.song div div a span.songTop.pp").text();
        var pp2 = parseFloat($(this).find("th.score span.scoreTop.ppValue").text());
        player2[song2] = [pp2, songHtml2, ppHtml2];
        var songObj2 = {
          "song": song2,
          "pp": pp2
        };
        union.push(songObj2);
      });
      callback();
    });
  }
}

function organize() {
  count++;
  if (count === 20) {
    union.sort(function(a, b) {
      return b.pp - a.pp
    });
    console.log(union);
    console.log(player1);
    console.log(player2);
    calculate();
  }
}

function calculate() {
  var finalUnion = [];
  for (let i = 0; i < union.length; i++) {
    var song = union[i];
    if (finalUnion.indexOf(song.song) < 0) {
      finalUnion.push(song.song);

      var player1Data = player1[song.song];
      var player2Data = player2[song.song];

      var p1score = null;
      var p2score = null;

      if (player1Data) {
        p1score = player1[song.song][2];
        var p1pp = player1[song.song][0];
        var songInfo1 = player1[song.song][1];
      }

      if (player2Data) {
        var songInfo2 = player2[song.song][1];
        p2score = player2[song.song][2];
        var p2pp = player2[song.song][0];
      }

      var ppdiff = 0;
      var p1big = true;
      if (p1pp >= p2pp) {
        ppdiff = p1pp - p2pp;
      } else {
        ppdiff = p2pp - p1pp;
        var p1big = false;
      }

      var tableHtml = $("table.playerdata tbody");

      newHtml = "<tr><th>";

      if (p1big) {
        newHtml += "<span>+</span>";
      } else {
        newHtml += "<span> </span>";
      }

      newHtml += "</th><th>";

      if (p1score) {
        newHtml += p1score.html();
        newHtml += "</th>";
      } else {
        newHtml += "<span>---</span>";
        newHtml += "</th>";
      }

      newHtml += "<th>";
      if (songInfo1) {
        newHtml += songInfo1.html();
        newHtml += "</th>";
      } else {
        newHtml += songInfo2.html();
        newHtml += "</th>";
      }

      newHtml += "<th>";
      if (p2score) {
        newHtml += p2score.html();
        newHtml += "</th>";
      } else {
        newHtml += "<span>---</span>";
        newHtml += "</th>";
      }

      newHtml += "<th>";

      if (!p1big) {
        newHtml += "<span>+</span>";
      } else {
        newHtml += "<span> </span>";
      }

      newHtml += "</th></tr>";
      console.log(newHtml);
      tableHtml.append(newHtml);
    }
  }
  console.log(finalUnion);
}
