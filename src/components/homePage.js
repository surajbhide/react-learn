"use strict";

var React = require('react');

var Home = React.createClass({
    render: function(){
        return (
            <div className="jumbotron">
                <h1>PS Admin</h1>
                <p>React, React-router and flux for unltra-responsive web apps </p>
            </div>
        );
    }
});

module.exports = Home;