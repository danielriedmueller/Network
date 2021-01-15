/**
 * MediaWiki API specific, visjs agnostic
 */
module.ApiPageConnectionRepo = ( function ( mw, ApiConnectionsBuilder ) {
	"use strict"

	let ApiPageConnectionRepo = function() {
		this._addedPages = [];
	};

	/**
	 * @param {string[]} pageNames
	 * @return {Promise}
	 */
	ApiPageConnectionRepo.prototype.addConnections = function(pageNames) {
		return new Promise(
			function(resolve) {
				let pagesToAdd =  pageNames.filter(p => !this._addedPages.includes(p));

				if (pagesToAdd.length === 0) {
					resolve({pages: [], links: []});
				} else {
					this._addedPages.concat(pagesToAdd);

					this._queryLinks(pagesToAdd).done(
						function(apiResponse) {
							this._apiResponseToPagesAndLinks(apiResponse).then(connections => resolve(connections))
						}.bind(this)
					);
				}
			}.bind(this)
		);
	};

	ApiPageConnectionRepo.prototype._apiResponseToPagesAndLinks = function(linkQueryResponse) {
		return new Promise(
			function(resolve) {
				let connections = (new ApiConnectionsBuilder()).connectionsFromApiResponses(linkQueryResponse)

				this._queryPageNodeInfo(connections.pages).done(function(pageInfoResponse) {
					let missingPages = Object.values(pageInfoResponse.query.pages)
						.filter(p => p.missing === '')
						.map(p => p.title);

					let hasCategories = Object.values(pageInfoResponse.query.pages)
						.filter(p => p.categories !== undefined)
						.map(p => ({title: p.title, categories: p.categories}));
					const categories = Object.assign(...hasCategories.map(({title, categories}) => ({[title]: categories})));

					connections.pages.forEach(function(page) {
						if(missingPages.includes(page.title)) {
							page.isMissing = true;
						}

						if(page.title in categories) {
							page.categories = categories[page.title].map(category => category.title.split(':')[1]);
						}
					});

					resolve(connections);
				});
			}.bind(this)
		);
	};

	ApiPageConnectionRepo.prototype._queryLinks = function(pageNames) {
		return new mw.Api().get({
			action: 'query',
			titles: pageNames,

			prop: ['links', 'linkshere', 'extlinks'],
			pllimit: 'max',
			lhlimit: 'max',
			ellimit: 'max',

			format: 'json',
			redirects: 'true'
		});
	};

	ApiPageConnectionRepo.prototype._queryPageNodeInfo = function(pageNodes) {
		return new mw.Api().get({
			action: 'query',
			titles: pageNodes.map(page => page.title),
			prop: ['categories'],
			format: 'json',
			redirects: 'true'
		});
	};

	return ApiPageConnectionRepo;

}( window.mediaWiki, module.ApiConnectionsBuilder ) );
