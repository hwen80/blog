var list;
fetch('articles/head.md')
	.then(content => content.text())
	.then(text => document.body.insertAdjacentHTML('beforeend', text));
if (tag) {
    fetch('articles/articles.json')
        .then(content => content.json())
        .then(json => list = json)
        .then(() =>
            list.articles = list.articles.filter(article => article.tags.includes("all") || article.tags.includes(tag)))
        .then(() =>
            fetch('articles/' + list.articles.shift().filepath)
            .then(content => content.text())
            .then(text => document.body.insertAdjacentHTML('beforeend', text)))
        .then(() =>
            fetch('articles/' + list.articles.shift().filepath)
            .then(content => content.text())
            .then(text => document.body.insertAdjacentHTML('beforeend', text)));
}
else if (title) {
    fetch('articles/articles.json')
        .then(content => content.json())
        .then(json => list = json)
        .then(() =>
            list.articles = list.articles.filter(article => article.title == title))
        .then(() =>
            fetch('articles/' + list.articles.shift().filepath)
            .then(content => content.text())
            .then(text => document.body.insertAdjacentHTML('beforeend', text)))
}
else {
    fetch('articles/articles.json')
        .then(content => content.json())
        .then(json => list = json)
        .then(() =>
            list.articles = list.articles.filter(article => !article.tags.includes('none')))
        .then(() => 
            fetch('articles/' + list.articles.shift().filepath)
            .then(content => content.text())
            .then(text => document.body.insertAdjacentHTML('beforeend', text)))
        .then(() =>
            fetch('articles/' + list.articles.shift().filepath)
            .then(content => content.text())
            .then(text => document.body.insertAdjacentHTML('beforeend', text)));
}

window.onscroll = function() {
    if (window.innerHeight + document.body.scrollTop + 1 >= document.documentElement.offsetHeight && list.articles.length > 0) {
        fetch('articles/' + list.articles.shift().filepath)
            .then(content => content.text())
            .then(text => document.body.insertAdjacentHTML('beforeend', text));
    }
}
