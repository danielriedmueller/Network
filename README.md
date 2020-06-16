# Network

[![Build Status](https://travis-ci.org/ProfessionalWiki/Network.svg?branch=master)](https://travis-ci.org/ProfessionalWiki/Network)
[![Latest Stable Version](https://poser.pugx.org/professional-wiki/network/version.png)](https://packagist.org/packages/professional-wiki/network)
[![Download count](https://poser.pugx.org/professional-wiki/network/d/total.png)](https://packagist.org/packages/professional-wiki/network)

The **Network** extension allows visualizing connections between wiki pages via an interactive network graph.

It was created by [Professional.Wiki](https://professional.wiki/) and funded by
[KDZ - Centre for Public Administration Research](https://www.kdz.eu/).

Example network

TODO

## Platform requirements

* PHP 7.1 or later
* MediaWiki 1.31.x up to 1.35.x

See the [release notes](#release-notes) for more information on the different versions of Network.

## Installation

The recommended way to install Network is using [Composer](https://getcomposer.org) with
[MediaWiki's built-in support for Composer](https://professional.wiki/en/articles/installing-mediawiki-extensions-with-composer).

## Usage

```
{{#network:}}
```

### Parameters

<table>
	<tr>
		<th></th>
		<th>Default</th>
		<th>Example value</th>
		<th>Description</th>
	</tr>
	<tr>
	    <th>page</th>
	    <td><i>The current page</i></td>
	    <td>MyPage</td>
	    <td>The name of the page to show connections for</td>
	</tr>
	<tr>
        <th>class</th>
        <td></td>
        <td>col-lg-3 mt-0</td>
        <td>Extra css class(es) to add to the network graph</td>
    </tr>
</table>

### Configuration

The default value of all parameters can be changed by placing configuration in "LocalSettings.php".
These configuration settings are available:

* `$wgTODO` – 

Default values of these configuration settings can be found in "extension.json". Do not change "extension.json".

Example of changing one of the configuration settings:

```php
$wgTODO = '500px';
```

## Limitations

* 

[Professional MediaWiki development](https://professional.wiki/en/services#development) is available via
[Professional.Wiki](https://professional.wiki/).

## Contribution and support

If you want to contribute work to the project please subscribe to the developers mailing list and
have a look at the contribution guideline.

* [File an issue](https://github.com/ProfessionalWiki/Network/issues)
* [Submit a pull request](https://github.com/ProfessionalWiki/Network/pulls)
* Ask a question on [the mailing list](https://www.semantic-mediawiki.org/wiki/Mailing_list)

[Professional MediaWiki support](https://professional.wiki/en/support) is available via
[Professional.Wiki](https://professional.wiki/).

## License

[GNU General Public License v2.0 or later (GPL-2.0-or-later)](/COPYING).

## Release notes

### Version 1.0.0

TODO

Initial release

## Examples

TODO