var player1 = {};
var player2 = {};
var union = [];
var finalUnion = [];
var url1 = 'https://scoresaber.com/u/76561198006244519&page=1&sort=1';
var url2 = 'https://scoresaber.com/u/76561198011570317&page=1&sort=1';
var count = 0;
var newHtml = "";
var player1Name = "Player 1";
var player2Name = "Player 2";
var needPlayer1 = true;
var needPlayer2 = true;
var count1 = 0;
var count2 = 0;

$(document).ready(function() {
  $("#loading").hide();
  $("#playerscores").hide();
  $("#playerheader").hide();
  $.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
      var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
      options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
    }
  });
});

function getData() {
  player1 = {};
  player2 = {};
  union = [];
  finalUnion = [];
  count = 0;
  needPlayer1 = true;
  needPlayer2 = true;
  count1 = 0;
  count2 = 0;
  $("#loading").show();
  $("table.playerdata tbody").html("");
  $("#playerscores").hide();
  $("#playerheader").hide();
  getSongs(organize);
}

function getSongs(callback) {
  for (let i = 1; i < 16; i++) {
    var url1 = $('form input.p1form').val() + '&page=' + i.toString() + '&sort=1';
    var url2 = $('form input.p2form').val() + '&page=' + i.toString() + '&sort=1';

    $.get(url1, function(data1) {
      var html1 = $(data1);
      if (needPlayer1) {
        var player1NameWithSpace = html1.find("h5.title.is-5 a").html();
        player1Name = $.trim(player1NameWithSpace);
        needPlayer1 = false;
      }
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
      count1++;
      if (count1 > 14) {
        callback();
      }
    });

    $.get(url2, function(data2) {
      var html2 = $(data2);
      if (needPlayer2) {
        var player2NameWithSpace = html2.find("h5.title.is-5 a").html();
        player2Name = $.trim(player2NameWithSpace);
        needPlayer2 = false;
      }
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
      });
      count2++;
      if (count2 > 14) {
        callback();
      }
    });
  }
}

function organize() {
  count++;
  if (count > 1) {
    $("#player1Name").html(player1Name);
    $("#player2Name").html(player2Name);
    union.sort(function(a, b) {
      return b.pp - a.pp
    });
    calculate();
  }
}

function calculate() {
  finalUnion = [];
  for (let i = 0; i < union.length; i++) {
    var song = union[i];
    if (finalUnion.indexOf(song.song) < 0) {
      finalUnion.push(song.song);

      var player1Data = player1[song.song];
      var player2Data = player2[song.song];

      var p1score = null;
      var p2score = null;
      var songInfo1 = null;
      var songInfo2 = null;
      var p1pp = null;
      var p2pp = null;

      if (player1Data) {
        p1score = player1[song.song][2];
        p1pp = player1[song.song][0];
        songInfo1 = player1[song.song][1];
      }

      if (player2Data) {
        songInfo2 = player2[song.song][1];
        p2score = player2[song.song][2];
        p2pp = player2[song.song][0];
      }

      var ppdiff = 0;
      var p1big = true;
      if (p1pp >= p2pp) {
        ppdiff = p1pp - p2pp;
      } else {
        ppdiff = p2pp - p1pp;
        var p1big = false;
      }

      if (!p1pp) {
        p1big = false;
      }

      var tableHtml = $("table.playerdata tbody");

      newHtml = "<tr>";

      if (p1big) {
        newHtml += "<th style='background-color:red'>";
      } else {
        newHtml += "<th>";
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
      newHtml += song.song;
      newHtml += "</th>";

      newHtml += "<th>";
      if (p2score) {
        newHtml += p2score.html();
        newHtml += "</th>";
      } else {
        newHtml += "<span>---</span>";
        newHtml += "</th>";
      }

      if (!p1big) {
        newHtml += "<th style='background-color:blue'>";
      } else {
        newHtml += "<th>";
      }

      newHtml += "</th></tr>";
      tableHtml.append(newHtml);
      $("#playerheader").show();
      $("#playerscores").show();
      $("#loading").hide();
    }
  }
}
