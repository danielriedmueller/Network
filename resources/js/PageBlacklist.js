/**
 * Visjs agnostic
 */
module.PageBlacklist = ( function ( mw ) {
	"use strict"

	/**
	 * @param {string[]} blacklistedPageNames
	 * @param {int[]} excludedNamespaces
	 * @param {boolean} excludeTalkPages
	 * @param {string[]} excludedCategories
	 */
	let PageBlacklist = function(blacklistedPageNames, excludedNamespaces, excludeTalkPages, excludedCategories) {
		this.pages = blacklistedPageNames;
		this.namespaces = excludedNamespaces;
		this.excludeTalk = excludeTalkPages;
		this.categories = excludedCategories;
	};

	/**
	 * @param {string} pageName
	 */
	PageBlacklist.prototype.isBlacklisted = function(pageName) {
		if (this.pages.includes(pageName)) {
			return true;
		}

		let title = mw.Title.newFromText(pageName);

		return title === null
			|| (this.excludeTalk && this._isTalkPage(title))
			|| this.namespaces.includes(title.getNamespaceId());
	};

	/**
	 * @param {array} pageCategories
	 * @returns {boolean}
	 */
	PageBlacklist.prototype.hasBlacklistedCategory = function(pageCategories) {
		if (!pageCategories) {
			return false;
		}

		let intersection = this.categories.filter(x => pageCategories.includes(x));
		return intersection.length > 0;
	};

	PageBlacklist.prototype._isTalkPage = function(title) {
		// Can replace this function with title.isTalkPage() on MW 1.35+
		let namespaceId = title.getNamespaceId();
		return !!(namespaceId > 0 && namespaceId % 2);
	};

	return PageBlacklist;

}( window.mediaWiki ) );