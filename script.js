var list;

const appendArticle = async (filepath) => {
	const content = await fetch(filepath);
	const text = await content.text();

	document.body.insertAdjacentHTML('beforeend', text);
}

const filterArticle = async (filter) => {
	const content = await fetch('articles/articles.json');
	const json = await content.json();

	return json.articles.filter(article => filter(article));
}

appendArticle('articles/head.md');

(async function(){
	if (tag) {
		list = await filterArticle(article => article.tags.includes("all") || article.tags.includes(tag));
	}
	else if (title) {
		list = await filterArticle(article => article.title == title);
	}
	else {
		list = await filterArticle(article => !article.tags.includes('none'));
	}

	while (list.length > 0 && (window.innerHeight + document.body.scrollTop + 1 >= document.documentElement.offsetHeight || list[0].multipart)) {
		await appendArticle('articles/' + list.shift().filepath);
	}

	window.onscroll = async function() {
		if (window.innerHeight + document.body.scrollTop + 1 >= document.documentElement.offsetHeight && list.length > 0) {
			appendArticle('articles/' + list.shift().filepath);
		}
	}
})();
