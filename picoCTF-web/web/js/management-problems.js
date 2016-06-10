// Generated by CoffeeScript 1.10.0
var Button, ButtonGroup, ClassifierItem, Col, CollapsibleInformation, CollapsibleMixin, Glyphicon, Input, Label, ListGroup, ListGroupItem, Panel, PanelGroup, Problem, ProblemClassifier, ProblemClassifierList, ProblemDependencyView, ProblemFilter, ProblemFlagTable, ProblemHintTable, ProblemList, ProblemListModifiers, ProblemReview, ProblemTab, Row, SortableButton, SortableButtonGroup, Table, update,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Panel = ReactBootstrap.Panel;

Button = ReactBootstrap.Button;

ButtonGroup = ReactBootstrap.ButtonGroup;

Glyphicon = ReactBootstrap.Glyphicon;

Col = ReactBootstrap.Col;

Input = ReactBootstrap.Input;

Label = ReactBootstrap.Label;

PanelGroup = ReactBootstrap.PanelGroup;

Row = ReactBootstrap.Row;

ListGroup = ReactBootstrap.ListGroup;

ListGroupItem = ReactBootstrap.ListGroupItem;

CollapsibleMixin = ReactBootstrap.CollapsibleMixin;

Table = ReactBootstrap.Table;

update = React.addons.update;

SortableButton = React.createClass({displayName: "SortableButton",
  propTypes: {
    name: React.PropTypes.string.isRequired
  },
  handleClick: function(e) {
    this.props.onFocus(this.props.name);
    if (this.props.active) {
      return this.props.onSortChange(this.props.name, !this.props.ascending);
    } else {
      return this.props.onSortChange(this.props.name, this.props.ascending);
    }
  },
  render: function() {
    var glyph;
    glyph = this.props.ascending ? React.createElement(Glyphicon, {
      "glyph": "chevron-down"
    }) : React.createElement(Glyphicon, {
      "glyph": "chevron-up"
    });
    return React.createElement(Button, {
      "bsSize": "small",
      "active": this.props.active,
      "onClick": this.handleClick
    }, this.props.name, " ", glyph);
  }
});

SortableButtonGroup = React.createClass({displayName: "SortableButtonGroup",
  getInitialState: function() {
    var name, state;
    state = _.object((function() {
      var j, len, ref, results;
      ref = this.props.data;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        name = ref[j];
        results.push([
          name, {
            active: false,
            ascending: true
          }
        ]);
      }
      return results;
    }).call(this));
    state[this.props.activeSort.name] = {
      active: true,
      ascending: this.props.activeSort.ascending
    };
    return state;
  },
  handleClick: function(name) {
    var activeStates;
    activeStates = _.reduce(this.getInitialState(), (function(memo, sortState, name) {
      memo[name] = {
        active: false,
        ascending: true
      };
      return memo;
    }), {});
    activeStates[name].active = true;
    return this.setState(activeStates);
  },
  render: function() {
    var activeState;
    activeState = this.state;
    activeState[this.props.activeSort.name] = {
      active: true,
      ascending: this.props.activeSort.ascending
    };
    return React.createElement(ButtonGroup, null, this.props.data.map((function(name, i) {
      return React.createElement(SortableButton, {
        "key": i,
        "active": activeState[name].active,
        "ascending": activeState[name].ascending,
        "name": name,
        "onSortChange": this.props.onSortChange,
        "onFocus": this.handleClick
      });
    }).bind(this)));
  }
});

ProblemFilter = React.createClass({displayName: "ProblemFilter",
  propTypes: {
    onFilterChange: React.PropTypes.func.isRequired,
    filter: React.PropTypes.string
  },
  getInitialState: function() {
    return {
      filter: this.props.filter
    };
  },
  onChange: function() {
    var filterValue;
    filterValue = this.refs.filter.getInputDOMNode().value;
    this.setState({
      filter: filterValue
    });
    return this.props.onFilterChange(filterValue);
  },
  render: function() {
    var glyph;
    glyph = React.createElement(Glyphicon, {
      "glyph": "search"
    });
    return React.createElement(Panel, null, React.createElement(Col, {
      "xs": 12.
    }, "Search", React.createElement(Input, {
      "type": 'text',
      "className": "form-control",
      "ref": "filter",
      "addonBefore": glyph,
      "onChange": this.onChange,
      "value": this.state.filter
    })), React.createElement(Col, {
      "xs": 12.
    }, React.createElement(SortableButtonGroup, {
      "key": this.props.activeSort,
      "activeSort": this.props.activeSort,
      "onSortChange": this.props.onSortChange,
      "data": ["name", "category", "score"]
    })));
  }
});

ProblemClassifierList = React.createClass({displayName: "ProblemClassifierList",
  render: function() {
    var bundleData, categories, categoryData, organizationData, organizations, problemNames, problemStateData, problemStates;
    categories = _.groupBy(this.props.problems, "category");
    categoryData = _.map(categories, function(problems, category) {
      return {
        name: "Only " + category,
        size: problems.length,
        classifier: function(problem) {
          return problem.category === category;
        }
      };
    });
    categoryData = _.sortBy(categoryData, "name");
    organizations = _.groupBy(this.props.problems, "organization");
    organizationData = _.map(organizations, function(problems, organization) {
      return {
        name: "Created by " + organization,
        size: problems.length,
        classifier: function(problem) {
          return problem.organization === organization;
        }
      };
    });
    organizationData = _.sortBy(organizationData, "name");
    problemStates = _.countBy(this.props.problems, "disabled");
    problemStateData = [];
    if (problemStates[false] > 0) {
      problemStateData.push({
        name: "Enabled problems",
        size: problemStates[false],
        classifier: function(problem) {
          return !problem.disabled;
        }
      });
    }
    if (problemStates[true] > 0) {
      problemStateData.push({
        name: "Disabled problems",
        size: problemStates[true],
        classifier: function(problem) {
          return problem.disabled;
        }
      });
    }
    problemNames = _.map(this.props.problems, function(problem) {
      return problem.sanitized_name;
    });
    bundleData = _.map(this.props.bundles, function(bundle) {
      return {
        name: bundle.name,
        size: _.intersection(bundle.problems, problemNames).length,
        classifier: function(problem) {
          var ref;
          return ref = problem.sanitized_name, indexOf.call(bundle.problems, ref) >= 0;
        }
      };
    });
    return React.createElement(PanelGroup, {
      "className": "problem-classifier",
      "collapsible": true
    }, React.createElement(ProblemClassifier, Object.assign({
      "name": "State",
      "data": problemStateData
    }, this.props)), React.createElement(ProblemClassifier, Object.assign({
      "name": "Categories",
      "data": categoryData
    }, this.props)), React.createElement(ProblemClassifier, Object.assign({
      "name": "Organizations",
      "data": organizationData
    }, this.props)), React.createElement(ProblemClassifier, Object.assign({
      "name": "Bundles",
      "data": bundleData
    }, this.props)));
  }
});

ClassifierItem = React.createClass({displayName: "ClassifierItem",
  handleClick: function(e) {
    this.props.setClassifier(!this.props.active, this.props.classifier, this.props.name);
    return this.props.onExclusiveClick(this.props.name);
  },
  render: function() {
    var glyph;
    glyph = React.createElement(Glyphicon, {
      "glyph": "ok"
    });
    return React.createElement(ListGroupItem, {
      "onClick": this.handleClick,
      "className": "classifier-item"
    }, this.props.name, " ", (this.props.active ? glyph : void 0), " ", React.createElement("div", {
      "className": "pull-right"
    }, React.createElement(Badge, null, this.props.size)));
  }
});

ProblemClassifier = React.createClass({displayName: "ProblemClassifier",
  getInitialState: function() {
    var classifier;
    return _.object((function() {
      var j, len, ref, results;
      ref = this.props.data;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        classifier = ref[j];
        results.push([classifier.name, false]);
      }
      return results;
    }).call(this));
  },
  handleClick: function(name) {
    var activeStates;
    activeStates = this.getInitialState();
    activeStates[name] = !this.state[name];
    return this.setState(activeStates);
  },
  render: function() {
    return React.createElement(Panel, {
      "header": this.props.name,
      "defaultExpanded": true,
      "collapsible": true
    }, React.createElement(ListGroup, {
      "fill": true
    }, this.props.data.map((function(data, i) {
      return React.createElement(ClassifierItem, Object.assign({
        "onExclusiveClick": this.handleClick,
        "active": this.state[data.name],
        "key": i,
        "setClassifier": this.props.setClassifier
      }, data));
    }).bind(this))));
  }
});

CollapsibleInformation = React.createClass({displayName: "CollapsibleInformation",
  mixins: [CollapsibleMixin],
  classNames: function(styles) {
    return _.reduce(styles, (function(memo, val, key) {
      if (val) {
        memo += " " + key;
      }
      return memo;
    }), "");
  },
  getCollapsibleDOMNode: function() {
    return React.findDOMNode(this.refs.panel);
  },
  getCollapsibleDimensionValue: function() {
    return (React.findDOMNode(this.refs.panel)).scrollHeight;
  },
  onHandleToggle: function(e) {
    e.preventDefault();
    return this.setState({
      expanded: !this.state.expanded
    });
  },
  render: function() {
    var glyph, styles;
    styles = this.getCollapsibleClassSet();
    glyph = this.state.expanded ? "chevron-down" : "chevron-right";
    return React.createElement("div", {
      "className": "collapsible-information"
    }, React.createElement("a", {
      "onClick": this.onHandleToggle
    }, this.props.title, " ", React.createElement(Glyphicon, {
      "glyph": glyph,
      "className": "collapsible-information-chevron"
    })), React.createElement("div", {
      "ref": "panel",
      "className": this.classNames(styles)
    }, this.props.children));
  }
});

ProblemFlagTable = React.createClass({displayName: "ProblemFlagTable",
  render: function() {
    return React.createElement(Table, {
      "responsive": true
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Instance"), React.createElement("th", null, "Flag"))), React.createElement("tbody", null, this.props.instances.map(function(instance, i) {
      return React.createElement("tr", {
        "key": i
      }, React.createElement("td", null, i + 1), React.createElement("td", null, instance.iid), React.createElement("td", null, instance.flag));
    })));
  }
});

ProblemHintTable = React.createClass({displayName: "ProblemHintTable",
  render: function() {
    return React.createElement(Table, {
      "responsive": true
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "#"), React.createElement("th", null, "Hint"))), React.createElement("tbody", null, this.props.hints.map(function(hint, i) {
      return React.createElement("tr", {
        "key": i
      }, React.createElement("td", null, i + 1), React.createElement("td", null, hint));
    })));
  }
});

ProblemReview = React.createClass({displayName: "ProblemReview",
  render: function() {
    var downvotes, j, len, ref, review, style, upvotes;
    upvotes = 0;
    downvotes = 0;
    ref = this.props.reviews;
    for (j = 0, len = ref.length; j < len; j++) {
      review = ref[j];
      if (review.feedback.liked) {
        upvotes++;
      } else {
        downvotes++;
      }
    }
    style = {
      fontSize: "2.0em"
    };
    return React.createElement(Row, null, React.createElement(Col, {
      "sm": 6.,
      "md": 6.,
      "lg": 6.
    }, React.createElement("div", {
      "className": "pull-right"
    }, React.createElement(Glyphicon, {
      "glyph": "thumbs-up",
      "className": "active pad",
      "style": style
    }), React.createElement(Badge, null, upvotes))), React.createElement(Col, {
      "sm": 6.,
      "md": 6.,
      "lg": 6.
    }, React.createElement("div", {
      "className": "pull-left"
    }, React.createElement(Glyphicon, {
      "glyph": "thumbs-down",
      "className": "active pad",
      "style": style
    }), React.createElement(Badge, null, downvotes))));
  }
});

Problem = React.createClass({displayName: "Problem",
  getInitialState: function() {
    return {
      expanded: false
    };
  },
  onStateToggle: function(e) {
    e.preventDefault();
    return apiCall("POST", "/api/admin/problems/availability", {
      pid: this.props.pid,
      state: !this.props.disabled
    }).done(this.props.onProblemChange);
  },
  handleExpand: function(e) {
    e.preventDefault();
    if ($(e.target).parent().hasClass("do-expand")) {
      return this.setState({
        expanded: !this.state.expanded
      });
    }
  },
  render: function() {
    var panelStyle, problemFooter, problemHeader, reviewDisplay, statusButton, submissionDisplay;
    statusButton = React.createElement(Button, {
      "bsSize": "xsmall",
      "bsStyle": (this.props.disabled ? "default" : "default"),
      "onClick": this.onStateToggle
    }, (this.props.disabled ? "Enable" : "Disable"), " ", React.createElement(Glyphicon, {
      "glyph": (this.props.disabled ? "ok" : "minus")
    }));
    problemHeader = React.createElement("div", null, React.createElement("span", {
      "className": "do-expand"
    }, this.props.category, " - ", this.props.name), React.createElement("div", {
      "className": "pull-right"
    }, "(", this.props.score, ") ", statusButton));
    if (this.props.tags === void 0 || this.props.tags.length === 0) {
      problemFooter = "No tags";
    } else {
      problemFooter = this.props.tags.map(function(tag, i) {
        return React.createElement(Label, {
          "key": i
        }, tag);
      });
    }
    panelStyle = this.props.disabled ? "default" : "default";
    submissionDisplay = this.props.submissions && this.props.submissions.valid + this.props.submissions.invalid >= 1 ? React.createElement("div", null, React.createElement("h4", {
      "className": "text-center"
    }, " Submissions "), React.createElement(ProblemSubmissionDoughnut, {
      "valid": this.props.submissions.valid,
      "invalid": this.props.submissions.invalid,
      "visible": this.state.expanded,
      "className": "text-center"
    })) : React.createElement("p", null, "No solve attempts.");
    reviewDisplay = React.createElement(ProblemReview, {
      "reviews": this.props.reviews
    });
    if (this.state.expanded) {
      return React.createElement(Panel, {
        "bsStyle": panelStyle,
        "header": problemHeader,
        "footer": problemFooter,
        "collapsible": true,
        "expanded": this.state.expanded,
        "onSelect": this.handleExpand
      }, React.createElement(Row, null, React.createElement(Col, {
        "md": 4.
      }, submissionDisplay, reviewDisplay), React.createElement(Col, {
        "md": 8.
      }, React.createElement("h4", null, this.props.author, (this.props.organization ? " @ " + this.props.organization : void 0)), React.createElement("hr", null), React.createElement(CollapsibleInformation, {
        "title": "Description"
      }, React.createElement("p", {
        "className": "problem-description"
      }, this.props.description)), React.createElement(CollapsibleInformation, {
        "title": "Hints"
      }, React.createElement(ProblemHintTable, {
        "hints": this.props.hints
      })), React.createElement(CollapsibleInformation, {
        "title": "Instance Flags"
      }, React.createElement(ProblemFlagTable, {
        "instances": this.props.instances
      })))));
    } else {
      return React.createElement(Panel, {
        "bsStyle": panelStyle,
        "header": problemHeader,
        "footer": problemFooter,
        "collapsible": true,
        "expanded": this.state.expanded,
        "onSelect": this.handleExpand
      });
    }
  }
});

ProblemList = React.createClass({displayName: "ProblemList",
  propTypes: {
    problems: React.PropTypes.array.isRequired
  },
  render: function() {
    var problemComponents;
    if (this.props.problems.length === 0) {
      return React.createElement("h4", null, "No problems have been loaded. Click ", React.createElement("a", {
        "href": '#'
      }, "here"), " to get started.");
    }
    problemComponents = this.props.problems.map((function(problem, i) {
      return React.createElement(Col, {
        "xs": 12.
      }, React.createElement(Problem, Object.assign({
        "key": problem.name,
        "onProblemChange": this.props.onProblemChange,
        "submissions": this.props.submissions[problem.name]
      }, problem)));
    }).bind(this));
    return React.createElement(Row, null, problemComponents);
  }
});

ProblemDependencyView = React.createClass({displayName: "ProblemDependencyView",
  handleClick: function(bundle) {
    return apiCall("POST", "/api/admin/bundle/dependencies_active", {
      bid: bundle.bid,
      state: !bundle.dependencies_enabled
    }).done(this.props.onProblemChange);
  },
  render: function() {
    var bundleDisplay;
    bundleDisplay = this.props.bundles.map((function(bundle, i) {
      var switchText;
      switchText = bundle.dependencies_enabled ? "Unlock Problems" : "Lock Problems";
      return React.createElement(ListGroupItem, {
        "key": i,
        "className": "clearfix"
      }, React.createElement("div", null, bundle.name, React.createElement("div", {
        "className": "pull-right"
      }, React.createElement(Button, {
        "bsSize": "xsmall",
        "onClick": this.handleClick.bind(null, bundle)
      }, switchText))));
    }).bind(this));
    return React.createElement(Panel, {
      "header": "Problem Dependencies"
    }, React.createElement("p", null, "By default, all problems are unlocked. You can enable or disable the problem unlock dependencies for your problem bundles below."), React.createElement(ListGroup, {
      "fill": true
    }, bundleDisplay));
  }
});

ProblemListModifiers = React.createClass({displayName: "ProblemListModifiers",
  onMassChange: function(enabled) {
    var change, changeNumber;
    change = enabled ? "enable" : "disable";
    changeNumber = this.props.problems.length;
    return window.confirmDialog("Are you sure you want to " + change + " these " + changeNumber + " problems?", "Mass Problem State Change", "Yes", "No", (function() {
      var calls;
      calls = _.map(this.props.problems, function(problem) {
        return apiCall("POST", "/api/admin/problems/availability", {
          pid: problem.pid,
          state: !enabled
        });
      });
      return ($.when.apply(this, calls)).done((function() {
        if (_.all(_.map(arguments, function(call) {
          return (_.first(call)).status === 1;
        }))) {
          apiNotify({
            status: 1,
            message: "All problems have been successfully changed."
          });
        } else {
          apiNotify({
            status: 0,
            message: "There was an error changing some of the problems."
          });
        }
        return this.props.onProblemChange();
      }).bind(this));
    }).bind(this, function() {
      return false;
    }));
  },
  render: function() {
    return React.createElement(Panel, null, React.createElement(ButtonGroup, {
      "className": "pull-right"
    }, React.createElement(Button, {
      "onClick": this.onMassChange.bind(null, true)
    }, "Enable All Problems"), React.createElement(Button, {
      "onClick": this.onMassChange.bind(null, false)
    }, "Disable All Problems")));
  }
});

ProblemTab = React.createClass({displayName: "ProblemTab",
  propTypes: {
    problems: React.PropTypes.array.isRequired
  },
  getInitialState: function() {
    return {
      filterRegex: /.*/,
      activeSort: {
        name: "name",
        ascending: true
      },
      problemClassifier: [
        {
          name: "all",
          func: function(problem) {
            return true;
          }
        }
      ]
    };
  },
  onFilterChange: function(filter) {
    var error, newFilter;
    try {
      newFilter = new RegExp(filter, "i");
      return this.setState(update(this.state, {
        filterRegex: {
          $set: newFilter
        }
      }));
    } catch (error) {

    }
  },
  onSortChange: function(name, ascending) {
    return this.setState(update(this.state, {
      activeSort: {
        $set: {
          name: name,
          ascending: ascending
        }
      }
    }));
  },
  setClassifier: function(classifierState, classifier, name) {
    var otherClassifiers;
    if (classifierState) {
      return this.setState(update(this.state, {
        problemClassifier: {
          $push: [
            {
              name: name,
              func: classifier
            }
          ]
        }
      }));
    } else {
      otherClassifiers = _.filter(this.state.problemClassifier, function(classifierObject) {
        return classifierObject.name !== name;
      });
      return this.setState(update(this.state, {
        problemClassifier: {
          $set: otherClassifiers
        }
      }));
    }
  },
  filterProblems: function(problems) {
    var sortedProblems, visibleProblems;
    visibleProblems = _.filter(problems, (function(problem) {
      var classifier;
      return (this.state.filterRegex.exec(problem.name)) !== null && _.all((function() {
        var j, len, ref, results;
        ref = this.state.problemClassifier;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          classifier = ref[j];
          results.push(classifier.func(problem));
        }
        return results;
      }).call(this));
    }).bind(this));
    sortedProblems = _.sortBy(visibleProblems, this.state.activeSort.name);
    if (this.state.activeSort.ascending) {
      return sortedProblems;
    } else {
      return sortedProblems.reverse();
    }
  },
  render: function() {
    var filteredProblems;
    filteredProblems = this.filterProblems(this.props.problems);
    return React.createElement(Row, {
      "className": "pad"
    }, React.createElement(Col, {
      "xs": 3.,
      "md": 3.
    }, React.createElement(Row, null, React.createElement(ProblemFilter, {
      "onSortChange": this.onSortChange,
      "filter": "",
      "activeSort": this.state.activeSort,
      "onFilterChange": this.onFilterChange
    })), React.createElement(Row, null, React.createElement(ProblemClassifierList, {
      "setClassifier": this.setClassifier,
      "problems": filteredProblems,
      "bundles": this.props.bundles
    })), React.createElement(Row, null, React.createElement(ProblemDependencyView, {
      "bundles": this.props.bundles,
      "onProblemChange": this.props.onProblemChange
    }))), React.createElement(Col, {
      "xs": 9.,
      "md": 9.
    }, React.createElement(Row, null, React.createElement(Col, {
      "xs": 12.
    }, React.createElement(ProblemListModifiers, {
      "problems": filteredProblems,
      "onProblemChange": this.props.onProblemChange
    }))), React.createElement(Row, null, React.createElement(Col, {
      "xs": 12.
    }, React.createElement(ProblemList, {
      "problems": filteredProblems,
      "submissions": this.props.submissions,
      "onProblemChange": this.props.onProblemChange
    })))));
  }
});
