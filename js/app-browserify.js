"use strict";

var Promise = require('es6-promise').Promise
    // just Node?
    // var fetch = require('node-fetch')
    // Browserify?
require('whatwg-fetch') //--> not a typo, don't store as a var

// es6 polyfills, powered by babel
require("babel/register")
var Backbone = require('backbone')

// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
// start app
// new Router()
// }

// VERSION 1 --------------------------------------------------------------------------------------
// var pullProf = (name) => fetch(`https://api.github.com/users/${name}`).then((data) => data.json())
// var pullRepos = (name) => fetch(`https://api.github.com/users/${name}/repos`).then((data) => data.json())
//     // var profElements = ['name', 'location', 'login', 'html_url', 'email', 'blog']
//     // var profile = (obj) => profElements.reduce((a, v, i) => a[v] = obj[v], {})
// var repoArr = (arr) => arr.map((repo) => repo.name)
// var formatLi = (name) => `<li>${name}</li>`
// var formatUl = (arr) => arr.map((v) => formatLi(v)).reduce((a, v, i) => i < arr.length ? (a + v) : (a + v) + '</ul></div>', '<ul class="repos">')
// var formatProf = (prof) =>
//     `<div class="profile"><pre>name: ${prof.name}   <img src="${prof.avatar_url}" height="42" width="42">
// location: ${prof.location}
// login: ${prof.login}
// html_url: ${prof.html_url}
// email: ${prof.email}
// blog: ${prof.blog}<pre>`

// var addItems = (item) => {document.querySelector('.container').insertAdjacentHTML('beforeend', item)}
//     // var makeProf = (name) => pullProf(name).then((data) => addItems(formatProf(data)))
//     // var makeRepos = (name) => pullRepos(name).then((data) => addItems(formatUl(repoArr(data))))
//     // var makeRepos = (name) => pullRepos(name).then((data) => document.query
// var repoPipe = [repoArr, formatUl]

// function githubClient(name) {
//     var promises = [pullProf(name), pullRepos(name)]
//     Promise.all(promises).then((data) => {
//         addItems(data[0].formatProf())
//         addItems(data[1].repoArr().formatUl())
//     })
// }

// githubClient('APartingGlass') 
// githubClient('matthiasak')


// VERSION 2 ------------------------------------------------------------------------------------------
var fetchGit = (name) => {
    var arr = [`https://api.github.com/users/${name}`, `https://api.github.com/users/${name}/repos`]
    var desirables = ['name', 'location', 'login', 'html_url', 'email', 'blog']
    var requests = arr.map((url) => fetch(url).then((data) => data.json()))
    Promise.all(requests).then((data) => {
        var avatar = `<img src="${data[0].avatar_url}">`
        var profile = desirables.map((prop) => `<li>${prop}:${data[0][prop]}</li>`).reduce((a, v, i, arr) => i + 1 < arr.length ? `${a}${v}` : `${a}${v}</ul>`, `<ul class="info">`)
        var repos = data[1].map((repo) => `<li><a href="${repo.html_url}">${repo.name}</a></li>`).reduce((a, v, i, arr) => i + 1 < arr.length ? `${a}${v}` : `${a}${v}</ul>`, '<ul class ="repos">')
        document.querySelector('.container').innerHTML = `<div class='profile'>${avatar}${profile}${repos}</div>`
    })
}

var GithubRouter = Backbone.Router.extend({
    routes: {
        ':username': 'drawProfile',
        '*default': 'defaultProfile'
    },
    drawProfile: function(user) {
        fetchGit(user)
    },
    defaultProfile: function() {
        fetchGit('MichaelZC')
    },
    initialize: function() {
        Backbone.history.start()
    }
})
var router = new GithubRouter()
