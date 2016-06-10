// Generated by CoffeeScript 1.10.0
var Button, ButtonGroup, ButtonInput, Col, Glyphicon, Input, Panel, Row, TeamManagementForm, disableAccount, resetPassword, update, updatePassword;

updatePassword = function(e) {
  e.preventDefault();
  return apiCall("POST", "/api/user/update_password", $("#password-update-form").serializeObject()).done(function(data) {
    switch (data['status']) {
      case 1:
        ga('send', 'event', 'Authentication', 'UpdatePassword', 'Success');
        break;
      case 0:
        ga('send', 'event', 'Authentication', 'UpdatePassword', 'Failure::' + data.message);
    }
    return apiNotify(data, "/account");
  });
};

resetPassword = function(e) {
  var form;
  e.preventDefault();
  form = $("#password-reset-form").serializeObject();
  form["reset-token"] = window.location.hash.substring(1);
  return apiCall("POST", "/api/user/confirm_password_reset", form).done(function(data) {
    ga('send', 'event', 'Authentication', 'ResetPassword', 'Success');
    return apiNotify(data, "/");
  });
};

disableAccount = function(e) {
  e.preventDefault();
  return confirmDialog("This will disable your account, drop you from your team, and prevent you from playing!", "Disable Account Confirmation", "Disable Account", "Cancel", function() {
    var form;
    form = $("#disable-account-form").serializeObject();
    return apiCall("POST", "/api/user/disable_account", form).done(function(data) {
      ga('send', 'event', 'Authentication', 'DisableAccount', 'Success');
      return apiNotify(data, "/");
    });
  });
};

Input = ReactBootstrap.Input;

Row = ReactBootstrap.Row;

Col = ReactBootstrap.Col;

Button = ReactBootstrap.Button;

Panel = ReactBootstrap.Panel;

Glyphicon = ReactBootstrap.Glyphicon;

ButtonInput = ReactBootstrap.ButtonInput;

ButtonGroup = ReactBootstrap.ButtonGroup;

update = React.addons.update;

TeamManagementForm = React.createClass({displayName: "TeamManagementForm",
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      user: {},
      team: {}
    };
  },
  componentWillMount: function() {
    apiCall("GET", "/api/user/status").done((function(api) {
      return this.setState(update(this.state, {
        user: {
          $set: api.data
        }
      }));
    }).bind(this));
    return apiCall("GET", "/api/team/settings").done((function(api) {
      return this.setState(update(this.state, {
        team: {
          $set: api.data
        }
      }));
    }).bind(this));
  },
  onTeamRegistration: function(e) {
    e.preventDefault();
    return apiCall("POST", "/api/team/create", {
      team_name: this.state.team_name,
      team_password: this.state.team_password
    }).done(function(resp) {
      switch (resp.status) {
        case 0:
          return apiNotify(resp);
        case 1:
          return document.location.href = "/profile";
      }
    });
  },
  onTeamJoin: function(e) {
    e.preventDefault();
    return apiCall("POST", "/api/team/join", {
      team_name: this.state.team_name,
      team_password: this.state.team_password
    }).done(function(resp) {
      switch (resp.status) {
        case 0:
          return apiNotify(resp);
        case 1:
          return document.location.href = "/profile";
      }
    });
  },
  render: function() {
    var lockGlyph, shouldDisable, towerGlyph;
    if (this.state.team.max_team_size > 1) {
      towerGlyph = React.createElement(Glyphicon, {
        "glyph": "tower"
      });
      lockGlyph = React.createElement(Glyphicon, {
        "glyph": "lock"
      });
      shouldDisable = this.state.user && this.state.user.username !== this.state.user.team_name ? "disabled" : "";
      return React.createElement(Panel, {
        "header": "Team Management"
      }, React.createElement("form", {
        "onSubmit": this.onTeamJoin
      }, (shouldDisable ? React.createElement("p", null, "You can not switch or register your account to another team.") : React.createElement("span", null)), React.createElement(Input, {
        "type": "text",
        "valueLink": this.linkState("team_name"),
        "addonBefore": towerGlyph,
        "label": "Team Name",
        "required": true,
        "disabled": shouldDisable
      }), React.createElement(Input, {
        "type": "password",
        "valueLink": this.linkState("team_password"),
        "addonBefore": lockGlyph,
        "label": "Team Password",
        "required": true,
        "disabled": shouldDisable
      }), React.createElement(Col, {
        "md": 6.
      }, React.createElement("span", null, React.createElement(Button, {
        "type": "submit",
        "disabled": shouldDisable
      }, "Join Team"), React.createElement(Button, {
        "onClick": this.onTeamRegistration,
        "disabled": shouldDisable
      }, "Register Team")))));
    } else {
      return React.createElement("div", null);
    }
  }
});

$(function() {
  $("#password-update-form").on("submit", updatePassword);
  $("#password-reset-form").on("submit", resetPassword);
  $("#disable-account-form").on("submit", disableAccount);
  return React.render(React.createElement(TeamManagementForm, null), document.getElementById("team-management"));
});
