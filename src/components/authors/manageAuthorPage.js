"use strict";

var React = require('react');
var AuthorForm = require('./authorForm');
var AuthorActions = require('../../actions/authorActions');
var AuthorStore = require('../../stores/authorStore');
var Route = require('react-router');
var toastr = require('toastr');


var ManageAuthorPage = React.createClass({
    mixins: [
        Route.Navigation
    ],

    statics: {
        willTransitionFrom: function(transaction, component){
            if (component.state.dirty && !confirm("Leave page without saving?")) {
                transaction.abort();
            }
        }
    },

    componentWillMount: function() {
        var authorId = this.props.params.id;
        if (authorId) {
            this.setState({author: AuthorStore.getAuthorById(authorId)});
        }
    },

    getInitialState: function() {
        return {
            author: {id: "", lastName: "", firstName: ""},
            errors: {},
            dirty: false
        };
    },

    setAuthorState: function(event) {
        this.setState({dirty: true});
        var field = event.target.name;
        var value = event.target.value;
        this.state.author[field] = value;
        this.setState({author: this.state.author});
    },

    isFormValid: function(){
        var isValid = true;
        this.state.errors = {};
        if (this.state.author.firstName.length < 1){
            this.state.errors.firstName = "First Name should be at least 1 char.";
            isValid = false;
        }
        if (this.state.author.lastName.length < 1){
            this.state.errors.lastName = "Last Name should be at least 1 char.";
            isValid = false;
        }
        this.setState({errors: this.state.errors});
        return isValid;
    },

    saveAuthor: function(event){
        event.preventDefault();
        if (!this.isFormValid()) {
            return;
        }
        if (this.state.author.id) {
            AuthorActions.updateAuthor(this.state.author);
        } else {
            AuthorActions.createAuthor(this.state.author);
        }
        this.setState({dirty: false});
        toastr.success("Saved author successfully");
        this.transitionTo('authors');
    },

    render: function(){
        return (
            <AuthorForm
            author={this.state.author}
            onChange={this.setAuthorState}
            onSave={this.saveAuthor}
            error={this.state.errors}
            />
        );
    }
});

module.exports = ManageAuthorPage;