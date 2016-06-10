// Generated by CoffeeScript 1.10.0
var ProblemSubmissionDoughnut;

ProblemSubmissionDoughnut = React.createClass({displayName: "ProblemSubmissionDoughnut",
  componentDidMount: function() {
    var ctx, data;
    if (this.props.visible) {
      ctx = this.getDOMNode().getContext("2d");
      data = [
        {
          value: this.props.invalid,
          color: "#F7464A",
          highlight: "#FF5A5E",
          label: "Invalid submissions"
        }, {
          value: this.props.valid,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: "Valid submissions"
        }
      ];
      return (new Chart(ctx)).Doughnut(data, {
        animateRotate: false
      });
    }
  },
  render: function() {
    var style;
    style = {
      padding: 0,
      margin: "auto",
      display: "block"
    };
    return React.createElement("canvas", {
      "height": "200",
      "width": "200",
      "style": style
    });
  }
});
