// Generated by CoffeeScript 1.10.0
var addProblemReview, addScoreToTitle, constructAchievementCallbackChain, constructAchievementCallbackChainHelper, loadProblems, renderAchievementMessage, renderProblem, renderProblemList, renderProblemSubmit, sanitizeMetricName, submitProblem;

renderProblemList = _.template($("#problem-list-template").remove().text());

renderProblem = _.template($("#problem-template").remove().text());

renderProblemSubmit = _.template($("#problem-submit-template").remove().text());

renderAchievementMessage = _.template($("#achievement-message-template").remove().text());

this.ratingMetrics = ["Difficulty", "Enjoyment", "Educational Value"];

this.ratingQuestion = {
  "Difficulty": "How difficult is this problem?",
  "Enjoyment": "Did you enjoy this problem?",
  "Educational Value": "How much did you learn while solving this problem?"
};

this.ratingChoices = {
  "Difficulty": ["Too easy", "", "A bit challenging", "", "Very hard"],
  "Enjoyment": ["Hated it!", "", "It was okay.", "", "Loved it!"],
  "Educational Value": ["Nothing at all", "", "Something useful", "", "Learned a lot!"]
};

this.timeValues = ["5 minutes or less", "10 minutes", "20 minutes", "40 minutes", "1 hour", "2 hours", "3 hours", "4 hours", "5 hours", "6 hours", "8 hours", "10 hours", "15 hours", "20 hours", "30 hours", "40 hours or more"];

sanitizeMetricName = function(metric) {
  return metric.toLowerCase().replace(" ", "-");
};

constructAchievementCallbackChainHelper = function(achievements, index) {
  $(".modal-backdrop").remove();
  if (index >= 0) {
    return messageDialog(renderAchievementMessage({
      achievement: achievements[index]
    }), "Achievement Unlocked!", "OK", function() {
      return constructAchievementCallbackChainHelper(achievements, index - 1);
    });
  }
};

constructAchievementCallbackChain = function(achievements) {
  return constructAchievementCallbackChainHelper(achievements, achievements.length - 1);
};

submitProblem = function(e) {
  var input;
  e.preventDefault();
  input = $(e.target).find("input");
  return apiCall("POST", "/api/problems/submit", {
    pid: input.data("pid"),
    key: input.val()
  }).done(function(data) {
    if (data['status'] === 1) {
      ga('send', 'event', 'Problem', 'Solve', 'Basic');
      loadProblems();
      setTimeout(function() {
        return $("div[data-target='#" + input.data("pid") + "']").click();
      }, 500);
    } else {
      ga('send', 'event', 'Problem', 'Wrong', 'Basic');
    }
    apiNotify(data);
    return apiCall("GET", "/api/achievements").done(function(data) {
      var new_achievements, x;
      if (data['status'] === 1) {
        new_achievements = (function() {
          var i, len, ref, results;
          ref = data.data;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            if (!x.seen) {
              results.push(x);
            }
          }
          return results;
        })();
        return constructAchievementCallbackChain(new_achievements);
      }
    });
  });
};

addProblemReview = function(e) {
  var feedback, pid, postData, target;
  target = $(e.target);
  pid = target.data("pid");
  feedback = {
    liked: target.data("setting") === "up"
  };
  postData = {
    feedback: JSON.stringify(feedback),
    pid: pid
  };
  return apiCall("POST", "/api/problems/feedback", postData).done(function(data) {
    var selector;
    apiNotify(data);
    if (data['status'] === 1) {
      selector = "#" + pid + "-thumbs" + (feedback.liked ? "down" : "up");
      $(selector).removeClass("active");
      target.addClass("active");
    }
    ga('send', 'event', 'Problem', 'Review', 'Basic');
    return apiCall("GET", "/api/achievements").done(function(data) {
      var new_achievements, x;
      if (data['status'] === 1) {
        new_achievements = (function() {
          var i, len, ref, results;
          ref = data.data;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            if (!x.seen) {
              results.push(x);
            }
          }
          return results;
        })();
        return constructAchievementCallbackChain(new_achievements);
      }
    });
  });
};

loadProblems = function() {
  return apiCall("GET", "/api/problems").done(function(data) {
    switch (data["status"]) {
      case 0:
        return apiNotify(data);
      case 1:
        addScoreToTitle("#title");
        return apiCall("GET", "/api/problems/feedback/reviewed", {}).done(function(reviewData) {
          $("#problem-list-holder").html(renderProblemList({
            problems: data.data,
            reviewData: reviewData.data,
            renderProblem: renderProblem,
            renderProblemSubmit: renderProblemSubmit,
            sanitizeMetricName: sanitizeMetricName
          }));
          $(".time-slider").slider({
            value: 4,
            min: 0,
            max: 15,
            step: 1,
            slide: function(event, ui) {
              return $("#" + $(this).data("label-target")).html(window.timeValues[ui.value]);
            }
          });
          $(".time-slider").each(function(x) {
            return $("#" + $(this).data("label-target")).html(window.timeValues[4]);
          });
          $(".problem-hint").hide();
          $(".problem-submit").on("submit", submitProblem);
          return $(".rating-button").on("click", addProblemReview);
        });
    }
  });
};

addScoreToTitle = function(selector) {
  return apiCall("GET", "/api/team/score", {}).done(function(data) {
    if (data.data) {
      $(selector).children("#team-score").remove();
      return $(selector).append("<span id='team-score' class='pull-right'>Score: " + data.data.score + "</span>");
    }
  });
};

$(function() {
  return loadProblems();
});
