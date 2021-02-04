/**
 * Visjs specific
 */
module.NetworkData = ( function ( vis, mw ) {
	"use strict"

	let NetworkData = function(pageBlacklist, categoriesOption) {
		this.nodes = new vis.DataSet();
		this.edges = new vis.DataSet();
		this._pageBlacklist = pageBlacklist;
		this._categoriesOption = categoriesOption;
	};

	NetworkData.prototype.addPages = function(pages) {
		const me = this;

		this.nodes.update(
			pages
				.filter(page => me._pageTitleIsAllowed(page.title) && me._pageCategoryIsAllowed(page.categories))
				.map(function(page) {
					let node = {
						id: page.title,
						label: page.displaytitle,
						getUrl: function() {
							let title = mw.Title.newFromText(page.title, page.ns);
							return  title === null ? '' : title.getUrl();
						}
					}

					node = Object.assign(node, me._getOptionsByPageCategories(page.categories));

					if (page.isMissing) {
						node.color = {
							background: 'lightgrey',
							border: 'grey',
							highlight: {
								background: 'lightgrey',
								border: 'grey',
							}
						};
						node.font = {
							color: '#ba0000'
						};
					}

					return node;
				})
		);
	}

	NetworkData.prototype._pageTitleIsAllowed = function(pageTitle) {
		return !this._pageBlacklist.isBlacklisted(pageTitle);
	}

	NetworkData.prototype._pageCategoryIsAllowed = function(pageCategories) {
		return !this._pageBlacklist.hasBlacklistedCategory(pageCategories);
	}

	NetworkData.prototype.addLinks = function(links) {
		this.edges.update(
			links
				.filter(link => this._pageTitleIsAllowed(link.from) && this._pageTitleIsAllowed(link.to))
				.map(function(link) {
					return {
						id: link.from + '|' + link.to,
						from: link.from,
						to: link.to,

						arrows: 'to',
						color: {
							inherit: 'to'
						}
					}
				})
		);
	}

	/**
	 * Supported shapes:
	 * 		"ellipse",
	 * 		"box",
	 * 		"circle",
	 * 		"database",
	 * 		"diamond",
	 * 		"dot",
	 * 		"square",
	 * 		"star",
	 * 		"text",
	 * 		"triangle",
	 * 		"triangleDown",
	 * 		"hexagon"
	 *
	 * Define as associative array like ['CATEGORY_NAME' => 'SHAPE'].
	 *
	 * If multiple shapes are defined for one page,
	 * the first shape is picked.
	 *
	 * @param pageCategories
	 * @returns {string}
	 * @private
	 */
	NetworkData.prototype._getOptionsByPageCategories = function(pageCategories) {
		let options = '';

		if (!pageCategories) {
			return options;
		}

		const categoriesOption = this._categoriesOption;

		pageCategories.some(category => {
			if (category in categoriesOption) {
				options = categoriesOption[category];

				// Take first found category options and break loop.
				return true;
			}
		});

		return options;
	}

	return NetworkData;

}( window.vis, window.mediaWiki ) );
