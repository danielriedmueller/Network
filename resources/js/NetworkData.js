/**
 * Visjs specific
 */
module.NetworkData = ( function ( vis, mw ) {
	"use strict"

	let NetworkData = function(pageBlacklist, categoriesShape) {
		this.nodes = new vis.DataSet();
		this.edges = new vis.DataSet();
		this._pageBlacklist = pageBlacklist;
		this._categoriesShape = categoriesShape;
	};

	NetworkData.prototype.addPages = function(pages) {
		const me = this;

		this.nodes.update(
			pages
				.filter(page => me._pageTitleIsAllowed(page.title))
				.map(function(page) {
					let node = {
						id: page.title,
						label: page.title,
						shape: me._getShapeByPageCategories(page.categories),
						getUrl: function() {
							let title = mw.Title.newFromText(page.title, page.ns);
							return  title === null ? '' : title.getUrl();
						}
					}

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
	NetworkData.prototype._getShapeByPageCategories = function(pageCategories) {
		let shape = '';

		if (!pageCategories) {
			return shape;
		}

		const categoriesShape = this._categoriesShape;
		pageCategories.some(category => {
			if (category in categoriesShape) {
				shape = categoriesShape[category];
				return true;
			}
		});

		return shape;
	}

	return NetworkData;

}( window.vis, window.mediaWiki ) );
