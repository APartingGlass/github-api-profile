"use strict";

var Promise = require('es6-promise').Promise
    // just Node?
    // var fetch = require('node-fetch')
    // Browserify?
require('whatwg-fetch') //--> not a typo, don't store as a var

// es6 polyfills, powered by babel
require("babel/register")

// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
// start app
// new Router()
// }
var pullProf = (name) => fetch('https://api.github.com/users/' + name).then((data) => data.json())
var pullRepos = (name) => fetch(`https://api.github.com/users/${name}/repos`).then((data) => data.json())
var profElements = ['name', 'location', 'login', 'html_url', 'email', 'blog']
var profile = (obj) => profElements.reduce((a, v, i) => a[v] = obj[v], {})
var repoArr = (arr) => arr.map((repo) => repo.name)
var formatLi = (name) => `<li>${name}</li>`
var formatUl = (arr) => arr.map(formatLi(v)).reduce((a, v, i) => i < arr.length ? (a + v) : (a + v) + '</ul>', '<ul class="repos">')
var formatProf = (prof) => 
`<div class ="info"><pre>name: ${prof.name}
location: ${prof.location}
login: ${prof.login}
html_url: ${prof.html_url}
email: ${prof.email}
blog: ${prof.blog}<pre><div>`

var profPipe = [pullProf, profile, formatProf]
var repoPipe = [pullRepos, repoArr, formatUl]

var GithubClient = (name) => "<div class='profile'>"+ profPipe.reduce((a,v,i) => v(a), name) + repoPipe.reduce((a,v,i) => v(a), name) + "</div>"
var michael = GithubClient('APartingGlass')
michael.appendTo('.container')