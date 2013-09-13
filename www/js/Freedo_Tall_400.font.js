/*!
 * The following copyright notice may not be removed under any circumstances.
 * 
 * Copyright:
 * Freedo Tall © (SosagE). 2013. All Rights Reserved
 * 
 * Trademark:
 * Freedo Tall is a Trademark of George Valmas
 * 
 * Full name:
 * FreedoTall-Regular
 * 
 * Designer:
 * George Valmas
 */

/*!
 * Copyright (c) 2011 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 * @version ${Version}
 */

var Cufon = (function() {

	var api = function() {
		return api.replace.apply(null, arguments);
	};

	var DOM = api.DOM = {

		ready: (function() {

			var complete = false, readyStatus = { loaded: 1, complete: 1 };

			var queue = [], perform = function() {
				if (complete) return;
				complete = true;
				for (var fn; fn = queue.shift(); fn());
			};

			// Gecko, Opera, WebKit r26101+

			if (document.addEventListener) {
				document.addEventListener('DOMContentLoaded', perform, false);
				window.addEventListener('pageshow', perform, false); // For cached Gecko pages
			}

			// Old WebKit, Internet Explorer

			if (!window.opera && document.readyState) (function() {
				readyStatus[document.readyState] ? perform() : setTimeout(arguments.callee, 10);
			})();

			// Internet Explorer

			if (document.readyState && document.createStyleSheet) (function() {
				try {
					document.body.doScroll('left');
					perform();
				}
				catch (e) {
					setTimeout(arguments.callee, 1);
				}
			})();

			addEvent(window, 'load', perform); // Fallback

			return function(listener) {
				if (!arguments.length) perform();
				else complete ? listener() : queue.push(listener);
			};

		})(),

		root: function() {
			return document.documentElement || document.body;
		},

		strict: (function() {
			var doctype;
			// no doctype (doesn't always catch it though.. IE I'm looking at you)
			if (document.compatMode == 'BackCompat') return false;
			// WebKit, Gecko, Opera, IE9+
			doctype = document.doctype;
			if (doctype) {
				return !/frameset|transitional/i.test(doctype.publicId);
			}
			// IE<9, firstChild is the doctype even if there's an XML declaration
			doctype = document.firstChild;
			if (doctype.nodeType != 8 || /^DOCTYPE.+(transitional|frameset)/i.test(doctype.data)) {
				return false;
			}
			return true;
		})()

	};

	var CSS = api.CSS = {

		Size: function(value, base) {

			this.value = parseFloat(value);
			this.unit = String(value).match(/[a-z%]*$/)[0] || 'px';

			this.convert = function(value) {
				return value / base * this.value;
			};

			this.convertFrom = function(value) {
				return value / this.value * base;
			};

			this.toString = function() {
				return this.value + this.unit;
			};

		},

		addClass: function(el, className) {
			var current = el.className;
			el.className = current + (current && ' ') + className;
			return el;
		},

		color: cached(function(value) {
			var parsed = {};
			parsed.color = value.replace(/^rgba\((.*?),\s*([\d.]+)\)/, function($0, $1, $2) {
				parsed.opacity = parseFloat($2);
				return 'rgb(' + $1 + ')';
			});
			return parsed;
		}),

		// has no direct CSS equivalent.
		// @see http://msdn.microsoft.com/en-us/library/system.windows.fontstretches.aspx
		fontStretch: cached(function(value) {
			if (typeof value == 'number') return value;
			if (/%$/.test(value)) return parseFloat(value) / 100;
			return {
				'ultra-condensed': 0.5,
				'extra-condensed': 0.625,
				condensed: 0.75,
				'semi-condensed': 0.875,
				'semi-expanded': 1.125,
				expanded: 1.25,
				'extra-expanded': 1.5,
				'ultra-expanded': 2
			}[value] || 1;
		}),

		getStyle: function(el) {
			var view = document.defaultView;
			if (view && view.getComputedStyle) return new Style(view.getComputedStyle(el, null));
			if (el.currentStyle) return new Style(el.currentStyle);
			return new Style(el.style);
		},

		gradient: cached(function(value) {
			var gradient = {
				id: value,
				type: value.match(/^-([a-z]+)-gradient\(/)[1],
				stops: []
			}, colors = value.substr(value.indexOf('(')).match(/([\d.]+=)?(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)/ig);
			for (var i = 0, l = colors.length, stop; i < l; ++i) {
				stop = colors[i].split('=', 2).reverse();
				gradient.stops.push([ stop[1] || i / (l - 1), stop[0] ]);
			}
			return gradient;
		}),

		quotedList: cached(function(value) {
			// doesn't work properly with empty quoted strings (""), but
			// it's not worth the extra code.
			var list = [], re = /\s*((["'])([\s\S]*?[^\\])\2|[^,]+)\s*/g, match;
			while (match = re.exec(value)) list.push(match[3] || match[1]);
			return list;
		}),

		recognizesMedia: cached(function(media) {
			var el = document.createElement('style'), sheet, container, supported;
			el.type = 'text/css';
			el.media = media;
			try { // this is cached anyway
				el.appendChild(document.createTextNode('/**/'));
			} catch (e) {}
			container = elementsByTagName('head')[0];
			container.insertBefore(el, container.firstChild);
			sheet = (el.sheet || el.styleSheet);
			supported = sheet && !sheet.disabled;
			container.removeChild(el);
			return supported;
		}),

		removeClass: function(el, className) {
			var re = RegExp('(?:^|\\s+)' + className +  '(?=\\s|$)', 'g');
			el.className = el.className.replace(re, '');
			return el;
		},

		supports: function(property, value) {
			var checker = document.createElement('span').style;
			if (checker[property] === undefined) return false;
			checker[property] = value;
			return checker[property] === value;
		},

		textAlign: function(word, style, position, wordCount) {
			if (style.get('textAlign') == 'right') {
				if (position > 0) word = ' ' + word;
			}
			else if (position < wordCount - 1) word += ' ';
			return word;
		},

		textShadow: cached(function(value) {
			if (value == 'none') return null;
			var shadows = [], currentShadow = {}, result, offCount = 0;
			var re = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;
			while (result = re.exec(value)) {
				if (result[0] == ',') {
					shadows.push(currentShadow);
					currentShadow = {};
					offCount = 0;
				}
				else if (result[1]) {
					currentShadow.color = result[1];
				}
				else {
					currentShadow[[ 'offX', 'offY', 'blur' ][offCount++]] = result[2];
				}
			}
			shadows.push(currentShadow);
			return shadows;
		}),

		textTransform: (function() {
			var map = {
				uppercase: function(s) {
					return s.toUpperCase();
				},
				lowercase: function(s) {
					return s.toLowerCase();
				},
				capitalize: function(s) {
					return s.replace(/(?:^|\s)./g, function($0) {
						return $0.toUpperCase();
					});
				}
			};
			return function(text, style) {
				var transform = map[style.get('textTransform')];
				return transform ? transform(text) : text;
			};
		})(),

		whiteSpace: (function() {
			var ignore = {
				inline: 1,
				'inline-block': 1,
				'run-in': 1
			};
			var wsStart = /^\s+/, wsEnd = /\s+$/;
			return function(text, style, node, previousElement, simple) {
				if (simple) return text.replace(wsStart, '').replace(wsEnd, ''); // @fixme too simple
				if (previousElement) {
					if (previousElement.nodeName.toLowerCase() == 'br') {
						text = text.replace(wsStart, '');
					}
				}
				if (ignore[style.get('display')]) return text;
				if (!node.previousSibling) text = text.replace(wsStart, '');
				if (!node.nextSibling) text = text.replace(wsEnd, '');
				return text;
			};
		})()

	};

	CSS.ready = (function() {

		// don't do anything in Safari 2 (it doesn't recognize any media type)
		var complete = !CSS.recognizesMedia('all'), hasLayout = false;

		var queue = [], perform = function() {
			complete = true;
			for (var fn; fn = queue.shift(); fn());
		};

		var links = elementsByTagName('link'), styles = elementsByTagName('style');

		var checkTypes = {
			'': 1,
			'text/css': 1
		};

		function isContainerReady(el) {
			if (!checkTypes[el.type.toLowerCase()]) return true;
			return el.disabled || isSheetReady(el.sheet, el.media || 'screen');
		}

		function isSheetReady(sheet, media) {
			// in Opera sheet.disabled is true when it's still loading,
			// even though link.disabled is false. they stay in sync if
			// set manually.
			if (!CSS.recognizesMedia(media || 'all')) return true;
			if (!sheet || sheet.disabled) return false;
			try {
				var rules = sheet.cssRules, rule;
				if (rules) {
					// needed for Safari 3 and Chrome 1.0.
					// in standards-conforming browsers cssRules contains @-rules.
					// Chrome 1.0 weirdness: rules[<number larger than .length - 1>]
					// returns the last rule, so a for loop is the only option.
					search: for (var i = 0, l = rules.length; rule = rules[i], i < l; ++i) {
						switch (rule.type) {
							case 2: // @charset
								break;
							case 3: // @import
								if (!isSheetReady(rule.styleSheet, rule.media.mediaText)) return false;
								break;
							default:
								// only @charset can precede @import
								break search;
						}
					}
				}
			}
			catch (e) {} // probably a style sheet from another domain
			return true;
		}

		function allStylesLoaded() {
			// Internet Explorer's style sheet model, there's no need to do anything
			if (document.createStyleSheet) return true;
			// standards-compliant browsers
			var el, i;
			for (i = 0; el = links[i]; ++i) {
				if (el.rel.toLowerCase() == 'stylesheet' && !isContainerReady(el)) return false;
			}
			for (i = 0; el = styles[i]; ++i) {
				if (!isContainerReady(el)) return false;
			}
			return true;
		}

		DOM.ready(function() {
			// getComputedStyle returns null in Gecko if used in an iframe with display: none
			if (!hasLayout) hasLayout = CSS.getStyle(document.body).isUsable();
			if (complete || (hasLayout && allStylesLoaded())) perform();
			else setTimeout(arguments.callee, 10);
		});

		return function(listener) {
			if (complete) listener();
			else queue.push(listener);
		};

	})();

	function Font(data) {

		var face = this.face = data.face, ligatureCache = [], wordSeparators = {
			'\u0020': 1,
			'\u00a0': 1,
			'\u3000': 1
		};

		this.glyphs = (function(glyphs) {
			var key, fallbacks = {
				'\u2011': '\u002d',
				'\u00ad': '\u2011'
			};
			for (key in fallbacks) {
				if (!hasOwnProperty(fallbacks, key)) continue;
				if (!glyphs[key]) glyphs[key] = glyphs[fallbacks[key]];
			}
			return glyphs;
		})(data.glyphs);

		this.w = data.w;
		this.baseSize = parseInt(face['units-per-em'], 10);

		this.family = face['font-family'].toLowerCase();
		this.weight = face['font-weight'];
		this.style = face['font-style'] || 'normal';

		this.viewBox = (function () {
			var parts = face.bbox.split(/\s+/);
			var box = {
				minX: parseInt(parts[0], 10),
				minY: parseInt(parts[1], 10),
				maxX: parseInt(parts[2], 10),
				maxY: parseInt(parts[3], 10)
			};
			box.width = box.maxX - box.minX;
			box.height = box.maxY - box.minY;
			box.toString = function() {
				return [ this.minX, this.minY, this.width, this.height ].join(' ');
			};
			return box;
		})();

		this.ascent = -parseInt(face.ascent, 10);
		this.descent = -parseInt(face.descent, 10);

		this.height = -this.ascent + this.descent;

		this.spacing = function(chars, letterSpacing, wordSpacing) {
			var glyphs = this.glyphs, glyph,
				kerning, k,
				jumps = [],
				width = 0, w,
				i = -1, j = -1, chr;
			while (chr = chars[++i]) {
				glyph = glyphs[chr] || this.missingGlyph;
				if (!glyph) continue;
				if (kerning) {
					width -= k = kerning[chr] || 0;
					jumps[j] -= k;
				}
				w = glyph.w;
				if (isNaN(w)) w = +this.w; // may have been a String in old fonts
				if (w > 0) {
					w += letterSpacing;
					if (wordSeparators[chr]) w += wordSpacing;
				}
				width += jumps[++j] = ~~w; // get rid of decimals
				kerning = glyph.k;
			}
			jumps.total = width;
			return jumps;
		};

		this.applyLigatures = function(text, ligatures) {
			// find cached ligature configuration for this font
			for (var i=0, ligatureConfig; i<ligatureCache.length && !ligatureConfig; i++)
				if (ligatureCache[i].ligatures === ligatures)
					ligatureConfig = ligatureCache[i];

			// if there is none, it needs to be created and cached
			if (!ligatureConfig) {
				// identify letter groups to prepare regular expression that matches these
				var letterGroups = [];
				for (var letterGroup in ligatures) {
					if (this.glyphs[ligatures[letterGroup]]) {
						letterGroups.push(letterGroup);
					}
				}

				// sort by longer groups first, then alphabetically (to aid caching by this key)
				var regexpText = letterGroups.sort(function(a, b) {
					return b.length - a.length || a > b;
				}).join('|');

				ligatureCache.push(ligatureConfig = {
					ligatures: ligatures,
					// create regular expression for matching desired ligatures that are present in the font
					regexp: regexpText.length > 0 
						? regexpCache[regexpText] || (regexpCache[regexpText] = new RegExp(regexpText, 'g'))
						: null
				});
			}

			// return applied ligatures or original text if none exist for given configuration
			return ligatureConfig.regexp
				? text.replace(ligatureConfig.regexp, function(match) {
					return ligatures[match] || match;
				})
				: text;
		};
	}

	function FontFamily() {

		var styles = {}, mapping = {
			oblique: 'italic',
			italic: 'oblique'
		};

		this.add = function(font) {
			(styles[font.style] || (styles[font.style] = {}))[font.weight] = font;
		};

		this.get = function(style, weight) {
			var weights = styles[style] || styles[mapping[style]]
				|| styles.normal || styles.italic || styles.oblique;
			if (!weights) return null;
			// we don't have to worry about "bolder" and "lighter"
			// because IE's currentStyle returns a numeric value for it,
			// and other browsers use the computed value anyway
			weight = {
				normal: 400,
				bold: 700
			}[weight] || parseInt(weight, 10);
			if (weights[weight]) return weights[weight];
			// http://www.w3.org/TR/CSS21/fonts.html#propdef-font-weight
			// Gecko uses x99/x01 for lighter/bolder
			var up = {
				1: 1,
				99: 0
			}[weight % 100], alts = [], min, max;
			if (up === undefined) up = weight > 400;
			if (weight == 500) weight = 400;
			for (var alt in weights) {
				if (!hasOwnProperty(weights, alt)) continue;
				alt = parseInt(alt, 10);
				if (!min || alt < min) min = alt;
				if (!max || alt > max) max = alt;
				alts.push(alt);
			}
			if (weight < min) weight = min;
			if (weight > max) weight = max;
			alts.sort(function(a, b) {
				return (up
					? (a >= weight && b >= weight) ? a < b : a > b
					: (a <= weight && b <= weight) ? a > b : a < b) ? -1 : 1;
			});
			return weights[alts[0]];
		};

	}

	function HoverHandler() {

		function contains(node, anotherNode) {
			try {
				if (node.contains) return node.contains(anotherNode);
				return node.compareDocumentPosition(anotherNode) & 16;
			}
			catch(e) {} // probably a XUL element such as a scrollbar
			return false;
		}

		// mouseover/mouseout (standards) mode
		function onOverOut(e) {
			var related = e.relatedTarget;
			// there might be no relatedTarget if the element is right next
			// to the window frame
			if (related && contains(this, related)) return;
			trigger(this, e.type == 'mouseover');
		}

		// mouseenter/mouseleave (probably ie) mode
		function onEnterLeave(e) {
			if (!e) e = window.event;
			// ie model, we don't have access to "this", but
			// mouseenter/leave doesn't bubble so it's fine.
			trigger(e.target || e.srcElement, e.type == 'mouseenter');
		}

		function trigger(el, hoverState) {
			// A timeout is needed so that the event can actually "happen"
			// before replace is triggered. This ensures that styles are up
			// to date.
			setTimeout(function() {
				var options = sharedStorage.get(el).options;
				if (hoverState) {
					options = merge(options, options.hover);
					options._mediatorMode = 1;
				}
				api.replace(el, options, true);
			}, 10);
		}

		this.attach = function(el) {
			if (el.onmouseenter === undefined) {
				addEvent(el, 'mouseover', onOverOut);
				addEvent(el, 'mouseout', onOverOut);
			}
			else {
				addEvent(el, 'mouseenter', onEnterLeave);
				addEvent(el, 'mouseleave', onEnterLeave);
			}
		};

		this.detach = function(el) {
			if (el.onmouseenter === undefined) {
				removeEvent(el, 'mouseover', onOverOut);
				removeEvent(el, 'mouseout', onOverOut);
			}
			else {
				removeEvent(el, 'mouseenter', onEnterLeave);
				removeEvent(el, 'mouseleave', onEnterLeave);
			}
		};

	}

	function ReplaceHistory() {

		var list = [], map = {};

		function filter(keys) {
			var values = [], key;
			for (var i = 0; key = keys[i]; ++i) values[i] = list[map[key]];
			return values;
		}

		this.add = function(key, args) {
			map[key] = list.push(args) - 1;
		};

		this.repeat = function() {
			var snapshot = arguments.length ? filter(arguments) : list, args;
			for (var i = 0; args = snapshot[i++];) api.replace(args[0], args[1], true);
		};

	}

	function Storage() {

		var map = {}, at = 0;

		function identify(el) {
			return el.cufid || (el.cufid = ++at);
		}

		this.get = function(el) {
			var id = identify(el);
			return map[id] || (map[id] = {});
		};

	}

	function Style(style) {

		var custom = {}, sizes = {};

		this.extend = function(styles) {
			for (var property in styles) {
				if (hasOwnProperty(styles, property)) custom[property] = styles[property];
			}
			return this;
		};

		this.get = function(property) {
			return custom[property] != undefined ? custom[property] : style[property];
		};

		this.getSize = function(property, base) {
			return sizes[property] || (sizes[property] = new CSS.Size(this.get(property), base));
		};

		this.isUsable = function() {
			return !!style;
		};

	}

	function addEvent(el, type, listener) {
		if (el.addEventListener) {
			el.addEventListener(type, listener, false);
		}
		else if (el.attachEvent) {
			// we don't really need "this" right now, saves code
			el.attachEvent('on' + type, listener);
		}
	}

	function attach(el, options) {
		if (options._mediatorMode) return el;
		var storage = sharedStorage.get(el);
		var oldOptions = storage.options;
		if (oldOptions) {
			if (oldOptions === options) return el;
			if (oldOptions.hover) hoverHandler.detach(el);
		}
		if (options.hover && options.hoverables[el.nodeName.toLowerCase()]) {
			hoverHandler.attach(el);
		}
		storage.options = options;
		return el;
	}

	function cached(fun) {
		var cache = {};
		return function(key) {
			if (!hasOwnProperty(cache, key)) cache[key] = fun.apply(null, arguments);
			return cache[key];
		};
	}

	function getFont(el, style) {
		var families = CSS.quotedList(style.get('fontFamily').toLowerCase()), family;
		for (var i = 0; family = families[i]; ++i) {
			if (fonts[family]) return fonts[family].get(style.get('fontStyle'), style.get('fontWeight'));
		}
		return null;
	}

	function elementsByTagName(query) {
		return document.getElementsByTagName(query);
	}

	function hasOwnProperty(obj, property) {
		return obj.hasOwnProperty(property);
	}

	function merge() {
		var merged = {}, arg, key;
		for (var i = 0, l = arguments.length; arg = arguments[i], i < l; ++i) {
			for (key in arg) {
				if (hasOwnProperty(arg, key)) merged[key] = arg[key];
			}
		}
		return merged;
	}

	function process(font, text, style, options, node, el) {
		var fragment = document.createDocumentFragment(), processed;
		if (text === '') return fragment;
		var separate = options.separate;
		var parts = text.split(separators[separate]), needsAligning = (separate == 'words');
		if (needsAligning && HAS_BROKEN_REGEXP) {
			// @todo figure out a better way to do this
			if (/^\s/.test(text)) parts.unshift('');
			if (/\s$/.test(text)) parts.push('');
		}
		for (var i = 0, l = parts.length; i < l; ++i) {
			processed = engines[options.engine](font,
				needsAligning ? CSS.textAlign(parts[i], style, i, l) : parts[i],
				style, options, node, el, i < l - 1);
			if (processed) fragment.appendChild(processed);
		}
		return fragment;
	}

	function removeEvent(el, type, listener) {
		if (el.removeEventListener) {
			el.removeEventListener(type, listener, false);
		}
		else if (el.detachEvent) {
			el.detachEvent('on' + type, listener);
		}
	}

	function replaceElement(el, options) {
		var name = el.nodeName.toLowerCase();
		if (options.ignore[name]) return;
		if (options.ignoreClass && options.ignoreClass.test(el.className)) return;
		if (options.onBeforeReplace) options.onBeforeReplace(el, options);
		var replace = !options.textless[name], simple = (options.trim === 'simple');
		var style = CSS.getStyle(attach(el, options)).extend(options);
		// may cause issues if the element contains other elements
		// with larger fontSize, however such cases are rare and can
		// be fixed by using a more specific selector
		if (parseFloat(style.get('fontSize')) === 0) return;
		var font = getFont(el, style), node, type, next, anchor, text, lastElement;
		var isShy = options.softHyphens, anyShy = false, pos, shy, reShy = /\u00ad/g;
		var modifyText = options.modifyText;
		if (!font) return;
		for (node = el.firstChild; node; node = next) {
			type = node.nodeType;
			next = node.nextSibling;
			if (replace && type == 3) {
				if (isShy && el.nodeName.toLowerCase() != TAG_SHY) {
					pos = node.data.indexOf('\u00ad');
					if (pos >= 0) {
						node.splitText(pos);
						next = node.nextSibling;
						next.deleteData(0, 1);
						shy = document.createElement(TAG_SHY);
						shy.appendChild(document.createTextNode('\u00ad'));
						el.insertBefore(shy, next);
						next = shy;
						anyShy = true;
					}
				}
				// Node.normalize() is broken in IE 6, 7, 8
				if (anchor) {
					anchor.appendData(node.data);
					el.removeChild(node);
				}
				else anchor = node;
				if (next) continue;
			}
			if (anchor) {
				text = anchor.data;
				if (!isShy) text = text.replace(reShy, '');
				text = CSS.whiteSpace(text, style, anchor, lastElement, simple);
				// modify text only on the first replace
				if (modifyText) text = modifyText(text, anchor, el, options);
				el.replaceChild(process(font, text, style, options, node, el), anchor);
				anchor = null;
			}
			if (type == 1) {
				if (node.firstChild) {
					if (node.nodeName.toLowerCase() == 'cufon') {
						engines[options.engine](font, null, style, options, node, el);
					}
					else arguments.callee(node, options);
				}
				lastElement = node;
			}
		}
		if (isShy && anyShy) {
			updateShy(el);
			if (!trackingShy) addEvent(window, 'resize', updateShyOnResize);
			trackingShy = true;
		}
		if (options.onAfterReplace) options.onAfterReplace(el, options);
	}

	function updateShy(context) {
		var shys, shy, parent, glue, newGlue, next, prev, i;
		shys = context.getElementsByTagName(TAG_SHY);
		// unfortunately there doesn't seem to be any easy
		// way to avoid having to loop through the shys twice.
		for (i = 0; shy = shys[i]; ++i) {
			shy.className = C_SHY_DISABLED;
			glue = parent = shy.parentNode;
			if (glue.nodeName.toLowerCase() != TAG_GLUE) {
				newGlue = document.createElement(TAG_GLUE);
				newGlue.appendChild(shy.previousSibling);
				parent.insertBefore(newGlue, shy);
				newGlue.appendChild(shy);
			}
			else {
				// get rid of double glue (edge case fix)
				glue = glue.parentNode;
				if (glue.nodeName.toLowerCase() == TAG_GLUE) {
					parent = glue.parentNode;
					while (glue.firstChild) {
						parent.insertBefore(glue.firstChild, glue);
					}
					parent.removeChild(glue);
				}
			}
		}
		for (i = 0; shy = shys[i]; ++i) {
			shy.className = '';
			glue = shy.parentNode;
			parent = glue.parentNode;
			next = glue.nextSibling || parent.nextSibling;
			// make sure we're comparing same types
			prev = (next.nodeName.toLowerCase() == TAG_GLUE) ? glue : shy.previousSibling;
			if (prev.offsetTop >= next.offsetTop) {
				shy.className = C_SHY_DISABLED;
				if (prev.offsetTop < next.offsetTop) {
					// we have an annoying edge case, double the glue
					newGlue = document.createElement(TAG_GLUE);
					parent.insertBefore(newGlue, glue);
					newGlue.appendChild(glue);
					newGlue.appendChild(next);
				}
			}
		}
	}

	function updateShyOnResize() {
		if (ignoreResize) return; // needed for IE
		CSS.addClass(DOM.root(), C_VIEWPORT_RESIZING);
		clearTimeout(shyTimer);
		shyTimer = setTimeout(function() {
			ignoreResize = true;
			CSS.removeClass(DOM.root(), C_VIEWPORT_RESIZING);
			updateShy(document);
			ignoreResize = false;
		}, 100);
	}

	var HAS_BROKEN_REGEXP = ' '.split(/\s+/).length == 0;
	var TAG_GLUE = 'cufonglue';
	var TAG_SHY = 'cufonshy';
	var C_SHY_DISABLED = 'cufon-shy-disabled';
	var C_VIEWPORT_RESIZING = 'cufon-viewport-resizing';

	var regexpCache = {};
	var sharedStorage = new Storage();
	var hoverHandler = new HoverHandler();
	var replaceHistory = new ReplaceHistory();
	var initialized = false;
	var trackingShy = false;
	var shyTimer;
	var ignoreResize = false;

	var engines = {}, fonts = {}, defaultOptions = {
		autoDetect: false,
		engine: null,
		forceHitArea: false,
		hover: false,
		hoverables: {
			a: true
		},
		ignore: {
			applet: 1,
			canvas: 1,
			col: 1,
			colgroup: 1,
			head: 1,
			iframe: 1,
			map: 1,
			noscript: 1,
			optgroup: 1,
			option: 1,
			script: 1,
			select: 1,
			style: 1,
			textarea: 1,
			title: 1,
			pre: 1
		},
		ignoreClass: null,
		modifyText: null,
		onAfterReplace: null,
		onBeforeReplace: null,
		printable: true,
		selector: (
				window.Sizzle
			||	(window.jQuery && function(query) { return jQuery(query); }) // avoid noConflict issues
			||	(window.dojo && dojo.query)
			||	(window.glow && glow.dom && glow.dom.get)
			||	(window.Ext && Ext.query)
			||	(window.YAHOO && YAHOO.util && YAHOO.util.Selector && YAHOO.util.Selector.query)
			||	(window.$$ && function(query) { return $$(query); })
			||	(window.$ && function(query) { return $(query); })
			||	(document.querySelectorAll && function(query) { return document.querySelectorAll(query); })
			||	elementsByTagName
		),
		separate: 'words', // 'none' and 'characters' are also accepted
		softHyphens: true,
		textless: {
			dl: 1,
			html: 1,
			ol: 1,
			table: 1,
			tbody: 1,
			thead: 1,
			tfoot: 1,
			tr: 1,
			ul: 1
		},
		textShadow: 'none',
		trim: 'advanced',
		ligatures: {
			'ff': '\ufb00',
			'fi': '\ufb01',
			'fl': '\ufb02',
			'ffi': '\ufb03',
			'ffl': '\ufb04',
			'\u017ft': '\ufb05',
			'st': '\ufb06'
		}
	};

	var separators = {
		// The first pattern may cause unicode characters above
		// code point 255 to be removed in Safari 3.0. Luckily enough
		// Safari 3.0 does not include non-breaking spaces in \s, so
		// we can just use a simple alternative pattern.
		words: /\s/.test('\u00a0') ? /[^\S\u00a0]+/ : /\s+/,
		characters: '',
		none: /^/
	};

	api.now = function() {
		DOM.ready();
		return api;
	};

	api.refresh = function() {
		replaceHistory.repeat.apply(replaceHistory, arguments);
		return api;
	};

	api.registerEngine = function(id, engine) {
		if (!engine) return api;
		engines[id] = engine;
		return api.set('engine', id);
	};

	api.registerFont = function(data) {
		if (!data) return api;
		var font = new Font(data), family = font.family;
		if (!fonts[family]) fonts[family] = new FontFamily();
		fonts[family].add(font);
		return api.set('fontFamily', '"' + family + '"');
	};

	api.replace = function(elements, options, ignoreHistory) {
		options = merge(defaultOptions, options);
		if (!options.engine) return api; // there's no browser support so we'll just stop here
		if (!initialized) {
			CSS.addClass(DOM.root(), 'cufon-active cufon-loading');
			CSS.ready(function() {
				// fires before any replace() calls, but it doesn't really matter
				CSS.addClass(CSS.removeClass(DOM.root(), 'cufon-loading'), 'cufon-ready');
			});
			initialized = true;
		}
		if (options.hover) options.forceHitArea = true;
		if (options.autoDetect) delete options.fontFamily;
		if (typeof options.ignoreClass == 'string') {
			options.ignoreClass = new RegExp('(?:^|\\s)(?:' + options.ignoreClass.replace(/\s+/g, '|') + ')(?:\\s|$)');
		}
		if (typeof options.textShadow == 'string') {
			options.textShadow = CSS.textShadow(options.textShadow);
		}
		if (typeof options.color == 'string' && /^-/.test(options.color)) {
			options.textGradient = CSS.gradient(options.color);
		}
		else delete options.textGradient;
		if (typeof elements == 'string') {
			if (!ignoreHistory) replaceHistory.add(elements, arguments);
			elements = [ elements ];
		}
		else if (elements.nodeType) elements = [ elements ];
		CSS.ready(function() {
			for (var i = 0, l = elements.length; i < l; ++i) {
				var el = elements[i];
				if (typeof el == 'string') api.replace(options.selector(el), options, true);
				else replaceElement(el, options);
			}
		});
		return api;
	};

	api.set = function(option, value) {
		defaultOptions[option] = value;
		return api;
	};

	return api;

})();

Cufon.registerEngine('vml', (function() {

	var ns = document.namespaces;
	if (!ns) return;
	ns.add('cvml', 'urn:schemas-microsoft-com:vml');
	ns = null;

	var check = document.createElement('cvml:shape');
	check.style.behavior = 'url(#default#VML)';
	if (!check.coordsize) return; // VML isn't supported
	check = null;

	var HAS_BROKEN_LINEHEIGHT = (document.documentMode || 0) < 8;
	
	var styleSheet = document.createElement('style');
	styleSheet.type = 'text/css';
	styleSheet.styleSheet.cssText = (
		'cufoncanvas{text-indent:0;}' +
		'@media screen{' +
			'cvml\\:shape,cvml\\:rect,cvml\\:fill,cvml\\:shadow{behavior:url(#default#VML);display:block;antialias:true;position:absolute;}' +
			'cufoncanvas{position:absolute;text-align:left;}' +
			'cufon{display:inline-block;position:relative;vertical-align:' +
			(HAS_BROKEN_LINEHEIGHT
				? 'middle'
				: 'text-bottom') +
			';}' +
			'cufon cufontext{position:absolute;left:-10000in;font-size:1px;text-align:left;}' +
			'cufonshy.cufon-shy-disabled,.cufon-viewport-resizing cufonshy{display:none;}' +
			'cufonglue{white-space:nowrap;display:inline-block;}' +
			'.cufon-viewport-resizing cufonglue{white-space:normal;}' +
			'a cufon{cursor:pointer}' + // ignore !important here
		'}' +
		'@media print{' +
			'cufon cufoncanvas{display:none;}' +
		'}'
	).replace(/;/g, '!important;');
	document.getElementsByTagName('head')[0].appendChild(styleSheet);

	function getFontSizeInPixels(el, value) {
		return getSizeInPixels(el, /(?:em|ex|%)$|^[a-z-]+$/i.test(value) ? '1em' : value);
	}

	// Original by Dead Edwards.
	// Combined with getFontSizeInPixels it also works with relative units.
	function getSizeInPixels(el, value) {
		if (!isNaN(value) || /px$/i.test(value)) return parseFloat(value);
		var style = el.style.left, runtimeStyle = el.runtimeStyle.left;
		el.runtimeStyle.left = el.currentStyle.left;
		el.style.left = value.replace('%', 'em');
		var result = el.style.pixelLeft;
		el.style.left = style;
		el.runtimeStyle.left = runtimeStyle;
		return result;
	}

	function getSpacingValue(el, style, size, property) {
		var key = 'computed' + property, value = style[key];
		if (isNaN(value)) {
			value = style.get(property);
			style[key] = value = (value == 'normal') ? 0 : ~~size.convertFrom(getSizeInPixels(el, value));
		}
		return value;
	}

	var fills = {};

	function gradientFill(gradient) {
		var id = gradient.id;
		if (!fills[id]) {
			var stops = gradient.stops, fill = document.createElement('cvml:fill'), colors = [];
			fill.type = 'gradient';
			fill.angle = 180;
			fill.focus = '0';
			fill.method = 'none';
			fill.color = stops[0][1];
			for (var j = 1, k = stops.length - 1; j < k; ++j) {
				colors.push(stops[j][0] * 100 + '% ' + stops[j][1]);
			}
			fill.colors = colors.join(',');
			fill.color2 = stops[k][1];
			fills[id] = fill;
		}
		return fills[id];
	}

	return function(font, text, style, options, node, el, hasNext) {

		var redraw = (text === null);

		if (redraw) text = node.alt;

		var viewBox = font.viewBox;

		var size = style.computedFontSize || (style.computedFontSize = new Cufon.CSS.Size(getFontSizeInPixels(el, style.get('fontSize')) + 'px', font.baseSize));

		var wrapper, canvas;

		if (redraw) {
			wrapper = node;
			canvas = node.firstChild;
		}
		else {
			wrapper = document.createElement('cufon');
			wrapper.className = 'cufon cufon-vml';
			wrapper.alt = text;

			canvas = document.createElement('cufoncanvas');
			wrapper.appendChild(canvas);

			if (options.printable) {
				var print = document.createElement('cufontext');
				print.appendChild(document.createTextNode(text));
				wrapper.appendChild(print);
			}

			// ie6, for some reason, has trouble rendering the last VML element in the document.
			// we can work around this by injecting a dummy element where needed.
			// @todo find a better solution
			if (!hasNext) wrapper.appendChild(document.createElement('cvml:shape'));
		}

		var wStyle = wrapper.style;
		var cStyle = canvas.style;

		var height = size.convert(viewBox.height), roundedHeight = Math.ceil(height);
		var roundingFactor = roundedHeight / height;
		var stretchFactor = roundingFactor * Cufon.CSS.fontStretch(style.get('fontStretch'));
		var minX = viewBox.minX, minY = viewBox.minY;

		cStyle.height = roundedHeight;
		cStyle.top = Math.round(size.convert(minY - font.ascent));
		cStyle.left = Math.round(size.convert(minX));

		wStyle.height = size.convert(font.height) + 'px';

		var color = style.get('color');
		var chars = Cufon.CSS.textTransform(options.ligatures ? font.applyLigatures(text, options.ligatures) : text, style).split('');

		var jumps = font.spacing(chars,
			getSpacingValue(el, style, size, 'letterSpacing'),
			getSpacingValue(el, style, size, 'wordSpacing')
		);

		if (!jumps.length) return null;

		var width = jumps.total;
		var fullWidth = -minX + width + (viewBox.width - jumps[jumps.length - 1]);

		var shapeWidth = size.convert(fullWidth * stretchFactor), roundedShapeWidth = Math.round(shapeWidth);

		var coordSize = fullWidth + ',' + viewBox.height, coordOrigin;
		var stretch = 'r' + coordSize + 'ns';

		var fill = options.textGradient && gradientFill(options.textGradient);

		var glyphs = font.glyphs, offsetX = 0;
		var shadows = options.textShadow;
		var i = -1, j = 0, chr;

		while (chr = chars[++i]) {

			var glyph = glyphs[chars[i]] || font.missingGlyph, shape;
			if (!glyph) continue;

			if (redraw) {
				// some glyphs may be missing so we can't use i
				shape = canvas.childNodes[j];
				while (shape.firstChild) shape.removeChild(shape.firstChild); // shadow, fill
			}
			else {
				shape = document.createElement('cvml:shape');
				canvas.appendChild(shape);
			}

			shape.stroked = 'f';
			shape.coordsize = coordSize;
			shape.coordorigin = coordOrigin = (minX - offsetX) + ',' + minY;
			shape.path = (glyph.d ? 'm' + glyph.d + 'xe' : '') + 'm' + coordOrigin + stretch;
			shape.fillcolor = color;

			if (fill) shape.appendChild(fill.cloneNode(false));

			// it's important to not set top/left or IE8 will grind to a halt
			var sStyle = shape.style;
			sStyle.width = roundedShapeWidth;
			sStyle.height = roundedHeight;

			if (shadows) {
				// due to the limitations of the VML shadow element there
				// can only be two visible shadows. opacity is shared
				// for all shadows.
				var shadow1 = shadows[0], shadow2 = shadows[1];
				var color1 = Cufon.CSS.color(shadow1.color), color2;
				var shadow = document.createElement('cvml:shadow');
				shadow.on = 't';
				shadow.color = color1.color;
				shadow.offset = shadow1.offX + ',' + shadow1.offY;
				if (shadow2) {
					color2 = Cufon.CSS.color(shadow2.color);
					shadow.type = 'double';
					shadow.color2 = color2.color;
					shadow.offset2 = shadow2.offX + ',' + shadow2.offY;
				}
				shadow.opacity = color1.opacity || (color2 && color2.opacity) || 1;
				shape.appendChild(shadow);
			}

			offsetX += jumps[j++];
		}

		// addresses flickering issues on :hover

		var cover = shape.nextSibling, coverFill, vStyle;

		if (options.forceHitArea) {

			if (!cover) {
				cover = document.createElement('cvml:rect');
				cover.stroked = 'f';
				cover.className = 'cufon-vml-cover';
				coverFill = document.createElement('cvml:fill');
				coverFill.opacity = 0;
				cover.appendChild(coverFill);
				canvas.appendChild(cover);
			}

			vStyle = cover.style;

			vStyle.width = roundedShapeWidth;
			vStyle.height = roundedHeight;

		}
		else if (cover) canvas.removeChild(cover);

		wStyle.width = Math.max(Math.ceil(size.convert(width * stretchFactor)), 0);

		if (HAS_BROKEN_LINEHEIGHT) {

			var yAdjust = style.computedYAdjust;

			if (yAdjust === undefined) {
				var lineHeight = style.get('lineHeight');
				if (lineHeight == 'normal') lineHeight = '1em';
				else if (!isNaN(lineHeight)) lineHeight += 'em'; // no unit
				style.computedYAdjust = yAdjust = 0.5 * (getSizeInPixels(el, lineHeight) - parseFloat(wStyle.height));
			}

			if (yAdjust) {
				wStyle.marginTop = Math.ceil(yAdjust) + 'px';
				wStyle.marginBottom = yAdjust + 'px';
			}

		}

		return wrapper;

	};

})());

Cufon.registerEngine('canvas', (function() {

	// Safari 2 doesn't support .apply() on native methods

	var check = document.createElement('canvas');
	if (!check || !check.getContext || !check.getContext.apply) return;
	check = null;

	var HAS_INLINE_BLOCK = Cufon.CSS.supports('display', 'inline-block');

	// Firefox 2 w/ non-strict doctype (almost standards mode)
	var HAS_BROKEN_LINEHEIGHT = !HAS_INLINE_BLOCK && (document.compatMode == 'BackCompat' || /frameset|transitional/i.test(document.doctype.publicId));

	var styleSheet = document.createElement('style');
	styleSheet.type = 'text/css';
	styleSheet.appendChild(document.createTextNode((
		'cufon{text-indent:0;}' +
		'@media screen,projection{' +
			'cufon{display:inline;display:inline-block;position:relative;vertical-align:middle;' +
			(HAS_BROKEN_LINEHEIGHT
				? ''
				: 'font-size:1px;line-height:1px;') +
			'}cufon cufontext{display:-moz-inline-box;display:inline-block;width:0;height:0;text-align:left;text-indent:-10000in;}' +
			(HAS_INLINE_BLOCK
				? 'cufon canvas{position:relative;}'
				: 'cufon canvas{position:absolute;}') +
			'cufonshy.cufon-shy-disabled,.cufon-viewport-resizing cufonshy{display:none;}' +
			'cufonglue{white-space:nowrap;display:inline-block;}' +
			'.cufon-viewport-resizing cufonglue{white-space:normal;}' +
		'}' +
		'@media print{' +
			'cufon{padding:0;}' + // Firefox 2
			'cufon canvas{display:none;}' +
		'}'
	).replace(/;/g, '!important;')));
	document.getElementsByTagName('head')[0].appendChild(styleSheet);

	function generateFromVML(path, context) {
		var atX = 0, atY = 0;
		var code = [], re = /([mrvxe])([^a-z]*)/g, match;
		generate: for (var i = 0; match = re.exec(path); ++i) {
			var c = match[2].split(',');
			switch (match[1]) {
				case 'v':
					code[i] = { m: 'bezierCurveTo', a: [ atX + ~~c[0], atY + ~~c[1], atX + ~~c[2], atY + ~~c[3], atX += ~~c[4], atY += ~~c[5] ] };
					break;
				case 'r':
					code[i] = { m: 'lineTo', a: [ atX += ~~c[0], atY += ~~c[1] ] };
					break;
				case 'm':
					code[i] = { m: 'moveTo', a: [ atX = ~~c[0], atY = ~~c[1] ] };
					break;
				case 'x':
					code[i] = { m: 'closePath' };
					break;
				case 'e':
					break generate;
			}
			context[code[i].m].apply(context, code[i].a);
		}
		return code;
	}

	function interpret(code, context) {
		for (var i = 0, l = code.length; i < l; ++i) {
			var line = code[i];
			context[line.m].apply(context, line.a);
		}
	}

	return function(font, text, style, options, node, el) {

		var redraw = (text === null);

		if (redraw) text = node.getAttribute('alt');

		var viewBox = font.viewBox;

		var size = style.getSize('fontSize', font.baseSize);

		var expandTop = 0, expandRight = 0, expandBottom = 0, expandLeft = 0;
		var shadows = options.textShadow, shadowOffsets = [];
		if (shadows) {
			for (var i = shadows.length; i--;) {
				var shadow = shadows[i];
				var x = size.convertFrom(parseFloat(shadow.offX));
				var y = size.convertFrom(parseFloat(shadow.offY));
				shadowOffsets[i] = [ x, y ];
				if (y < expandTop) expandTop = y;
				if (x > expandRight) expandRight = x;
				if (y > expandBottom) expandBottom = y;
				if (x < expandLeft) expandLeft = x;
			}
		}

		var chars = Cufon.CSS.textTransform(options.ligatures ? font.applyLigatures(text, options.ligatures) : text, style).split('');

		var jumps = font.spacing(chars,
			~~size.convertFrom(parseFloat(style.get('letterSpacing')) || 0),
			~~size.convertFrom(parseFloat(style.get('wordSpacing')) || 0)
		);

		if (!jumps.length) return null; // there's nothing to render

		var width = jumps.total;

		expandRight += viewBox.width - jumps[jumps.length - 1];
		expandLeft += viewBox.minX;

		var wrapper, canvas;

		if (redraw) {
			wrapper = node;
			canvas = node.firstChild;
		}
		else {
			wrapper = document.createElement('cufon');
			wrapper.className = 'cufon cufon-canvas';
			wrapper.setAttribute('alt', text);

			canvas = document.createElement('canvas');
			wrapper.appendChild(canvas);

			if (options.printable) {
				var print = document.createElement('cufontext');
				print.appendChild(document.createTextNode(text));
				wrapper.appendChild(print);
			}
		}

		var wStyle = wrapper.style;
		var cStyle = canvas.style;

		var height = size.convert(viewBox.height);
		var roundedHeight = Math.ceil(height);
		var roundingFactor = roundedHeight / height;
		var stretchFactor = roundingFactor * Cufon.CSS.fontStretch(style.get('fontStretch'));
		var stretchedWidth = width * stretchFactor;

		var canvasWidth = Math.ceil(size.convert(stretchedWidth + expandRight - expandLeft));
		var canvasHeight = Math.ceil(size.convert(viewBox.height - expandTop + expandBottom));

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// needed for WebKit and full page zoom
		cStyle.width = canvasWidth + 'px';
		cStyle.height = canvasHeight + 'px';

		// minY has no part in canvas.height
		expandTop += viewBox.minY;

		cStyle.top = Math.round(size.convert(expandTop - font.ascent)) + 'px';
		cStyle.left = Math.round(size.convert(expandLeft)) + 'px';

		var wrapperWidth = Math.max(Math.ceil(size.convert(stretchedWidth)), 0) + 'px';

		if (HAS_INLINE_BLOCK) {
			wStyle.width = wrapperWidth;
			wStyle.height = size.convert(font.height) + 'px';
		}
		else {
			wStyle.paddingLeft = wrapperWidth;
			wStyle.paddingBottom = (size.convert(font.height) - 1) + 'px';
		}

		var g = canvas.getContext('2d'), scale = height / viewBox.height;
		var pixelRatio = window.devicePixelRatio || 1;
		if (pixelRatio != 1) {
			canvas.width = canvasWidth * pixelRatio;
			canvas.height = canvasHeight * pixelRatio;
			g.scale(pixelRatio, pixelRatio);
		}

		// proper horizontal scaling is performed later
		g.scale(scale, scale * roundingFactor);
		g.translate(-expandLeft, -expandTop);
		g.save();

		function renderText() {
			var glyphs = font.glyphs, glyph, i = -1, j = -1, chr;
			g.scale(stretchFactor, 1);
			while (chr = chars[++i]) {
				var glyph = glyphs[chars[i]] || font.missingGlyph;
				if (!glyph) continue;
				if (glyph.d) {
					g.beginPath();
					// the following moveTo is for Opera 9.2. if we don't
					// do this, it won't forget the previous path which
					// results in garbled text.
					g.moveTo(0, 0);
					if (glyph.code) interpret(glyph.code, g);
					else glyph.code = generateFromVML('m' + glyph.d, g);
					g.fill();
				}
				g.translate(jumps[++j], 0);
			}
			g.restore();
		}

		if (shadows) {
			for (var i = shadows.length; i--;) {
				var shadow = shadows[i];
				g.save();
				g.fillStyle = shadow.color;
				g.translate.apply(g, shadowOffsets[i]);
				renderText();
			}
		}

		var gradient = options.textGradient;
		if (gradient) {
			var stops = gradient.stops, fill = g.createLinearGradient(0, viewBox.minY, 0, viewBox.maxY);
			for (var i = 0, l = stops.length; i < l; ++i) {
				fill.addColorStop.apply(fill, stops[i]);
			}
			g.fillStyle = fill;
		}
		else g.fillStyle = style.get('color');

		renderText();

		return wrapper;

	};

})());

Cufon.registerFont({"w":114,"face":{"font-family":"Freedo Tall","font-weight":400,"font-stretch":"normal","units-per-em":"360","panose-1":"0 0 0 0 0 0 0 0 0 0","ascent":"288","descent":"-72","bbox":"-29 -277.013 179.602 72.1672","underline-thickness":"26.3672","underline-position":"-24.9609","stemh":"11","stemv":"11","unicode-range":"U+0020-U+007E"},"glyphs":{" ":{"w":89},"!":{"d":"20,-246r2,192v0,7,-12,8,-12,0r-1,-192v0,-4,2,-6,6,-6v3,0,5,2,5,6xm16,-34v9,1,10,30,1,34v-10,-1,-5,-17,-6,-28v0,-4,2,-6,5,-6","w":43},"\"":{"d":"11,-270v13,6,4,38,6,60v0,6,-10,6,-11,1v4,-17,-2,-35,0,-55v0,-3,2,-6,5,-6xm39,-205v-8,-8,-14,-55,-1,-64v10,5,3,42,7,59v0,2,-4,5,-6,5","w":62},"#":{"d":"87,-170v20,5,-10,46,-3,63v8,-1,24,2,14,11v-5,-1,-13,-2,-17,1v-1,7,-2,12,-3,18v10,-2,27,6,12,11r-14,0r-14,62v-3,7,-12,3,-11,-3v2,-16,10,-40,14,-59r-24,1r-12,61v-3,7,-13,3,-11,-4r12,-58v-11,1,-36,1,-21,-10v7,-1,14,-1,22,0r4,-21v-10,-2,-25,6,-24,-7v4,-9,27,4,27,-9v6,-18,1,-47,15,-58v12,13,-3,42,-5,64v11,-1,28,4,26,-9v5,-17,3,-43,13,-54xm42,-76r25,0v1,-6,2,-13,3,-20v-9,1,-26,-5,-26,5v-1,4,-1,10,-2,15","w":125},"$":{"d":"41,-142v41,9,56,24,56,73v0,30,-14,38,-38,44v8,16,-13,40,-10,11v0,-4,0,-8,-1,-11v-33,-2,-49,-17,-46,-53v0,-3,2,-5,5,-5v9,-1,5,12,6,21v3,20,15,27,41,26v25,-1,35,-13,32,-44v8,-64,-79,-32,-79,-97v0,-33,11,-47,38,-51v-3,-12,4,-34,11,-18r0,18v27,4,43,19,41,57v0,3,-3,6,-6,6v-5,0,-5,-5,-5,-10v1,-35,-12,-40,-37,-43v-39,-5,-42,69,-8,76","w":119},"%":{"d":"8,-189v-11,-51,43,-78,69,-45v18,22,22,101,-27,96v-29,-3,-44,-17,-42,-51xm19,-206v0,32,-1,60,31,57v37,6,29,-58,19,-78v-16,-18,-50,-11,-50,21xm131,-247v1,-6,12,-5,11,2v-12,48,-34,93,-48,140r-29,100v-1,4,-5,5,-6,3v-7,-36,24,-86,31,-128v6,-37,33,-77,41,-117xm127,-108v39,-10,52,21,52,57v0,29,-10,51,-38,52v-42,1,-48,-39,-39,-81v3,-16,10,-24,25,-28xm141,-10v24,0,28,-20,28,-43v0,-25,-7,-51,-39,-45v-20,4,-20,35,-21,54v-1,24,11,33,32,34","w":204},"&":{"d":"98,-168r1,180v0,4,-2,6,-5,6v-11,-3,-3,-17,-6,-34v-34,25,-97,12,-80,-50v-2,-32,-7,-71,17,-80v-35,-16,-32,-119,26,-106v31,0,46,13,46,37v0,7,-10,6,-11,0v-3,-19,-15,-26,-40,-26v-31,0,-31,24,-31,55v0,40,36,31,71,33v-2,-13,4,-24,12,-15xm17,-106v5,40,-13,92,30,92v17,0,36,-8,40,-19r-1,-108v-34,1,-74,-4,-69,35","w":125},"(":{"d":"32,7v5,3,52,17,20,17v-84,0,-30,-132,-45,-216v-8,-47,11,-79,51,-80v4,0,6,1,6,5v0,4,-3,5,-6,6v-56,4,-37,62,-38,125v0,42,-6,89,-1,128v2,4,6,9,13,15","w":87},")":{"d":"64,-150v-10,74,30,174,-48,174v-3,0,-5,-2,-5,-6v0,-4,1,-6,6,-6v66,-2,26,-91,35,-163v6,-46,13,-114,-43,-110v-7,-1,-7,-12,2,-12v34,2,57,28,55,73","w":87},"*":{"d":"65,-232v11,5,37,15,22,25v-9,-6,-17,-12,-31,-16v-2,13,6,37,-6,40v-11,-3,-2,-28,-5,-40v-11,5,-31,23,-37,10v4,-9,18,-9,28,-18v-9,-5,-40,-10,-25,-21v12,4,21,10,34,13v0,-13,-4,-48,11,-32r0,32v12,-2,29,-22,35,-6v-5,6,-18,8,-26,13","w":112},"+":{"d":"81,-108v24,1,55,-8,63,6v-6,12,-41,-1,-63,5r0,73v-9,8,-12,-3,-12,-14r1,-59r-57,2v-7,0,-7,-11,0,-11r56,-2r0,-68v0,-3,2,-6,6,-5v12,8,2,53,6,73","w":165},",":{"d":"24,-17v5,23,-7,44,-20,52v-15,-12,20,-26,9,-52v0,-4,3,-5,6,-6v3,0,5,2,5,6","w":46},"-":{"d":"77,-97r-66,4v-4,0,-7,-3,-6,-7v4,-11,57,-4,72,-9v4,0,7,2,6,7v0,4,-2,5,-6,5","w":108},".":{"d":"18,-2v-6,7,-13,0,-12,-9v-1,-10,4,-30,11,-16","w":37},"\/":{"d":"10,0v3,-80,53,-182,82,-251v5,0,8,1,7,7v-31,73,-61,157,-83,238v0,4,-3,5,-6,6","w":115},"0":{"d":"48,0v-76,0,-35,-118,-45,-205v-4,-36,16,-47,51,-47v76,0,31,113,41,197v4,38,-12,55,-47,55xm54,-241v-63,-4,-32,57,-39,115v4,44,-16,116,32,115v71,-2,27,-111,39,-190v4,-27,-5,-38,-32,-40","w":118},"1":{"d":"43,0v-15,-48,-2,-156,-5,-230v-11,13,-17,24,-30,31v-3,0,-5,-3,-5,-6r40,-49v3,1,7,2,6,6r0,242v0,4,-3,5,-6,6","w":74},"2":{"d":"92,-1r-78,1v-4,0,-5,-1,-5,-5r-5,-94v-3,-61,87,-13,87,-91v0,-29,-12,-51,-39,-51v-26,0,-43,21,-35,47v1,3,-2,6,-6,6v-23,-27,7,-69,43,-64v52,-5,70,101,19,118v-26,9,-73,8,-56,57r3,65r72,0v3,0,5,2,5,6v0,4,-1,5,-5,5","w":125},"3":{"d":"94,-100v3,54,4,108,-50,99v-20,-3,-39,-15,-39,-35v0,-4,2,-6,5,-6v4,0,5,3,6,6v7,35,72,34,67,-13v-4,-45,6,-92,-50,-84v-4,0,-5,-3,-6,-6v1,-8,13,-5,22,-5v31,0,35,-14,34,-44v10,-57,-54,-70,-70,-25v-3,6,-13,2,-10,-5v8,-21,23,-33,49,-34v48,-3,58,97,22,115v13,7,20,19,20,37","w":117},"4":{"d":"63,-78v-25,-4,-71,9,-59,-8r54,-151v1,-7,9,-22,15,-11v4,43,-1,108,1,159v10,-4,31,3,16,10r-16,0r2,74v0,6,-11,7,-11,0xm16,-90r47,1r1,-128v-18,39,-32,88,-48,127"},"5":{"d":"49,0v-27,0,-45,-10,-45,-37v0,-3,2,-5,5,-5v7,0,6,6,6,13v3,11,17,18,34,18v45,0,37,-54,34,-95v8,-42,-49,-63,-67,-27v-1,9,-11,16,-14,6v-4,-34,3,-70,0,-102v-4,-40,54,-17,83,-19v4,0,5,1,5,5v0,4,-1,5,-5,5r-53,-3v-22,-5,-17,11,-18,30r-2,63v29,-32,88,-7,82,42v5,49,6,106,-45,106","w":118},"6":{"d":"88,-21v-17,37,-85,20,-85,-23r-1,-162v-1,-33,18,-45,47,-46v39,-2,48,19,48,56v1,9,-10,6,-11,1v0,-32,-4,-47,-39,-47v-47,0,-31,57,-34,106v28,-30,96,-10,81,44v2,23,0,57,-6,71xm84,-104v5,-42,-70,-46,-70,-10v0,47,-11,106,41,103v39,-2,25,-55,29,-93","w":119},"7":{"d":"92,-245r-63,240v0,5,-7,7,-10,3v14,-77,45,-161,62,-238v-19,-4,-54,0,-74,0v-4,0,-5,-3,-6,-6v4,-11,31,-6,52,-6v18,0,34,-3,39,7"},"8":{"d":"47,0v-43,0,-45,-40,-45,-86v0,-29,5,-42,23,-53v-22,-5,-22,-36,-21,-66v1,-35,14,-46,44,-47v42,-2,49,27,49,72v0,23,-8,34,-25,40v22,8,24,36,24,70v0,46,-9,69,-49,70xm78,-122v-25,-26,-80,-6,-65,44v0,36,1,66,34,67v43,1,40,-37,38,-82v0,-14,-3,-24,-7,-29xm48,-242v-36,-3,-35,35,-33,69v2,24,13,28,37,27v32,-2,34,-18,34,-52v0,-32,-12,-42,-38,-44","w":118},"9":{"d":"101,-134v-2,65,18,155,-63,131v-24,-7,-31,-20,-31,-51v0,-3,2,-5,6,-5v4,0,5,1,5,5v-1,30,11,43,38,43v19,0,36,-8,35,-32r-2,-73v-33,28,-96,6,-85,-50v-4,-45,1,-86,47,-86v59,0,52,60,50,118xm49,-241v-48,0,-34,65,-31,107v10,24,72,28,72,-4r0,-62v2,-31,-16,-40,-41,-41","w":124},":":{"d":"10,-124v-15,-5,-3,-50,6,-29v-2,10,3,26,-6,29xm11,0v-21,-5,2,-55,5,-22v-4,10,6,20,-5,22","w":31},";":{"d":"14,-158v21,23,-12,54,-6,6v0,-3,3,-6,6,-6xm11,-11v-4,-12,1,-30,10,-17v4,24,-7,46,-21,53v-13,-9,12,-23,11,-36","w":35},"<":{"d":"22,-86v16,17,41,30,48,52v-22,4,-37,-38,-60,-48v0,-22,40,-35,50,-56v14,0,8,7,0,17v-12,14,-25,21,-38,35","w":90},"=":{"d":"103,-110v-32,-1,-60,4,-89,0v-4,0,-4,-2,-5,-5v13,-14,60,-2,94,-6v4,0,6,2,6,6v0,3,-2,5,-6,5xm13,-85v26,3,80,-11,97,2v-2,18,-29,-1,-50,8v-24,-1,-45,8,-53,-5v0,-3,2,-5,6,-5","w":129},">":{"d":"35,-48v-14,8,-20,24,-29,11v12,-18,46,-34,60,-51v-15,-18,-46,-30,-52,-47v0,-4,5,-5,7,-4v13,17,50,28,57,55v-15,13,-24,25,-43,36","w":98},"?":{"d":"47,-251v36,-3,50,28,46,66v8,64,-72,55,-50,124v-2,1,-2,3,-5,3v-10,-2,-7,-17,-8,-30v-5,-48,60,-43,52,-97v2,-32,-5,-58,-35,-56v-28,2,-39,16,-34,48v0,3,-2,6,-5,6v-9,-1,-5,-14,-6,-24v0,-28,18,-37,45,-40xm39,0v-9,-2,-8,-32,0,-36v8,1,8,33,0,36","w":113},"@":{"d":"90,-77v3,27,-20,46,-24,16v-26,19,-54,-5,-48,-43v-5,-34,22,-57,48,-40v1,-5,4,-9,8,-6v8,20,-5,67,4,93r1,-98v1,-23,-9,-31,-31,-31v-24,1,-35,11,-33,39v3,42,0,78,0,106v-1,26,11,31,34,31v16,0,29,-9,28,-27v-1,-3,3,-5,5,-5v2,0,6,2,5,5v1,24,-15,37,-38,37v-71,3,-38,-94,-44,-159v-2,-25,17,-37,43,-37v58,0,35,63,42,119xm28,-104v-9,35,30,56,37,23v-3,-24,12,-62,-18,-59v-16,2,-18,15,-19,36","w":112},"A":{"d":"12,-7v0,5,-7,7,-10,3v6,-85,27,-152,39,-240v1,-11,12,-9,14,-1r39,240v0,3,-2,5,-5,5v-3,0,-6,-2,-6,-5r-17,-95r-40,0xm28,-111r36,0r-16,-110"},"B":{"d":"18,0v-17,0,-16,-5,-16,-22r0,-215v1,-14,14,-14,29,-14v54,0,66,36,56,87v-3,16,-7,27,-17,32v25,10,20,48,22,81v2,40,-33,51,-74,51xm80,-41v0,-41,8,-96,-44,-85r-23,-1r-1,116v30,1,68,-3,68,-30xm31,-240v-38,-5,-10,56,-18,102v35,1,65,4,65,-40v0,-40,-4,-67,-47,-62"},"C":{"d":"47,0v-78,0,-45,-115,-45,-197v0,-38,11,-54,45,-55v36,-1,52,13,47,54v0,4,-3,5,-6,6v-8,-1,-4,-13,-5,-22v3,-24,-15,-26,-36,-27v-47,-5,-33,53,-33,96v0,50,-25,136,33,134v28,-1,38,-12,35,-44v0,-4,1,-5,5,-5v8,-1,6,9,6,16v2,34,-15,44,-46,44","w":115},"D":{"d":"88,-212v-12,108,41,232,-81,211v-8,-1,-6,-12,-6,-23r3,-224v2,-11,44,0,44,-2v25,4,38,14,40,38xm76,-62v-10,-87,42,-187,-61,-179r-2,230v44,-2,69,4,63,-51"},"E":{"d":"85,-252v7,0,6,11,0,11r-73,1r3,105v19,3,51,-6,60,5v-7,13,-37,3,-60,6r1,111r65,1v4,0,5,1,5,5v-10,14,-49,4,-75,5v-17,-48,0,-150,-10,-222v1,-12,-3,-25,6,-27","w":112},"F":{"d":"87,-252v4,-1,5,2,5,5v0,4,-1,5,-5,5v-18,2,-47,4,-74,3r-1,102r57,0v7,1,7,11,0,11v-19,-1,-41,3,-57,-1v-3,42,3,80,2,122v-1,3,-3,4,-6,5v-14,-55,-4,-167,-6,-244v2,-10,19,-4,31,-5","w":116},"G":{"d":"82,-125v-15,3,-53,7,-36,-8v22,0,59,-18,47,36v5,47,6,99,-45,97v-72,-2,-41,-99,-46,-175v-2,-40,5,-78,45,-77v35,1,51,15,49,55v0,7,-11,7,-11,0v2,-34,-11,-42,-38,-45v-61,9,-26,111,-35,185v-3,26,7,46,34,46v55,0,33,-61,36,-114","w":117},"H":{"d":"83,-252v3,0,5,3,5,6r1,240v0,3,-3,7,-7,6v-11,-26,0,-81,-4,-124r-64,-2r-1,120v0,7,-10,7,-11,0r0,-240v-1,-3,3,-6,5,-6v3,0,5,3,5,6r2,110v18,-3,46,1,64,2r0,-112v0,-3,2,-6,5,-6"},"I":{"d":"13,-1v-4,0,-5,-1,-5,-5r-1,-240v0,-7,11,-7,11,0r0,240v0,4,-1,5,-5,5","w":39},"J":{"d":"94,-247v-9,99,44,257,-62,246v-23,-2,-32,-24,-31,-55v0,-4,3,-5,6,-6v3,0,5,2,5,6v0,28,7,46,35,45v57,-1,41,-82,39,-140r-3,-96v0,-4,1,-5,5,-5v4,0,6,2,6,5","w":115},"K":{"d":"64,-217v9,-16,15,-45,28,-29v-22,43,-46,83,-75,122v16,17,49,27,64,45v2,4,8,32,13,74v0,3,-3,5,-6,5v-3,0,-5,-2,-5,-5v-13,-56,3,-66,-26,-79v-16,-7,-29,-17,-42,-27r1,104v1,4,-3,6,-5,6v-10,-1,-4,-18,-5,-28r-5,-218v-1,-3,2,-6,5,-5v4,-1,5,2,5,5v0,32,1,67,3,108v25,-34,40,-61,50,-78"},"L":{"d":"4,-5v5,-83,-13,-191,7,-247v9,59,-1,164,3,241v24,-3,49,0,72,-2v7,9,-3,13,-14,12v-21,-2,-42,0,-63,1v-3,0,-5,-2,-5,-5","w":109},"M":{"d":"119,-5v-1,6,-10,6,-11,0r1,-202r-45,202v-1,1,-2,2,-4,2v-7,0,-14,-25,-22,-73v-3,-18,-10,-57,-24,-120r-2,194v-2,3,-10,2,-9,-3r1,-162r-3,-79v0,-6,10,-9,12,-2r46,221r48,-221v1,-7,14,-4,13,2","w":140},"N":{"d":"96,-5v0,7,-12,7,-13,1v-18,-68,-65,-189,-69,-206r2,205v0,3,-3,5,-6,5v-17,-60,1,-161,-8,-247v0,-3,2,-6,7,-5v10,1,8,17,11,25r65,192r-1,-212v0,-3,1,-6,5,-5v10,-1,6,14,6,22","w":117},"O":{"d":"50,0v-81,0,-39,-131,-47,-211v-3,-29,22,-41,47,-41v74,0,35,121,44,202v4,33,-15,50,-44,50xm75,-230v-15,-19,-61,-15,-61,19r-2,151v-1,34,10,48,38,49v35,2,35,-36,32,-73v-4,-46,9,-113,-7,-146","w":115},"P":{"d":"9,0v-13,-62,-5,-165,-8,-246v2,-10,23,-5,36,-6v50,-5,47,42,47,91v0,44,-29,41,-71,41r1,115v0,4,-2,4,-5,5xm73,-160v0,-53,2,-94,-61,-80r0,110v33,-1,61,6,61,-30","w":107},"Q":{"d":"89,-24v8,5,21,16,8,21v-6,-2,-6,-8,-14,-11v-27,29,-91,12,-82,-40v13,-69,-32,-198,46,-198v78,0,46,120,46,201v0,12,-1,21,-4,27xm14,-106v-8,56,6,120,60,86v-6,-6,-16,-13,-9,-20v9,0,6,6,14,10v8,-49,-2,-116,2,-172v2,-27,-9,-38,-34,-39v-56,-1,-26,86,-33,135","w":119},"R":{"d":"83,0v-11,-4,-4,-28,-5,-41v-3,-51,5,-94,-65,-83r-2,117v1,4,-2,5,-5,5v-4,0,-5,-1,-5,-5r1,-240v0,-7,12,-5,20,-5v58,-3,67,23,67,78v0,24,-8,36,-21,44v30,19,17,76,20,125v1,4,-3,4,-5,5xm78,-175v0,-50,-10,-70,-65,-66r1,106v37,0,64,3,64,-40","w":112},"S":{"d":"97,-209v3,10,-10,27,-13,11v8,-27,-13,-43,-40,-43v-38,0,-33,59,-26,89v9,19,61,13,68,37v12,40,16,120,-40,115v-31,-2,-45,-17,-43,-52v0,-7,11,-7,11,0v0,30,7,39,33,41v46,3,40,-67,29,-100v-17,-25,-81,-9,-72,-61v-4,-42,1,-80,41,-80v30,0,50,16,52,43","w":117},"T":{"d":"1,-247v21,-11,62,-1,90,-3v9,0,7,10,1,11r-39,-2r3,236v1,4,-3,4,-5,5v-16,-49,-2,-165,-9,-241v-16,-4,-41,11,-41,-6","w":119},"U":{"d":"50,0v-51,1,-48,-53,-48,-109v0,-52,1,-97,2,-137v0,-4,2,-6,6,-6v3,0,5,2,5,6r-2,179v-1,35,7,55,37,56v60,-13,23,-124,32,-197r-1,-37v0,-4,2,-5,6,-5v14,28,8,97,8,149v0,48,1,100,-45,101","w":116},"V":{"d":"78,-214v1,-16,1,-49,14,-32r-38,233v-1,10,-7,18,-13,9v-16,-68,-33,-170,-40,-238v0,-4,3,-5,6,-6v9,4,6,17,8,37v5,46,22,129,31,182v18,-98,29,-160,32,-185","w":115},"W":{"d":"158,-252v12,2,2,23,2,38v0,12,-28,195,-36,212v-14,5,-12,-14,-15,-32r-27,-160v-8,40,-19,175,-36,194v-17,-12,-14,-40,-19,-76r-24,-167v0,-8,11,-5,11,0r3,32v3,45,21,127,28,180v17,-98,28,-160,30,-184v1,-12,0,-48,14,-32v1,63,21,149,31,216r32,-216v0,-2,3,-6,6,-5","w":187},"X":{"d":"89,-247v3,-5,12,-3,10,4r-44,120r42,118v0,5,-10,8,-11,1v-8,-32,-24,-70,-36,-103r-35,102v-3,6,-14,1,-10,-4r39,-114r-41,-125v12,-9,13,8,16,19r30,89","w":122},"Y":{"d":"84,-250v10,0,2,14,2,23v1,3,-34,108,-36,112r-1,110v-1,6,-11,6,-11,0r2,-110v-15,-35,-33,-89,-39,-128v0,-3,2,-5,5,-5v11,1,3,9,9,21v5,23,21,69,29,97r35,-116v-1,-2,3,-5,5,-4","w":115},"Z":{"d":"92,-12v8,0,5,11,0,11r-84,1v-3,0,-5,-4,-5,-8r82,-232v-21,-1,-48,-2,-79,-2v-4,1,-5,-2,-5,-5v0,-4,1,-5,5,-5v34,0,63,1,86,2v15,11,-13,55,-22,80r-54,159","w":119},"[":{"d":"52,6v-23,-3,-53,11,-50,-13v10,-78,1,-161,4,-242v7,-12,33,-3,48,-7v7,0,6,9,0,10r-38,2r-4,240v10,-1,55,-5,40,10","w":82},"\\":{"d":"98,-8v2,9,-10,10,-12,4v-21,-77,-60,-167,-81,-242v0,-3,3,-5,6,-5v31,73,58,168,87,243","w":117},"]":{"d":"6,-256v31,1,52,-13,52,29r-1,228v-4,11,-27,4,-46,6v-3,0,-5,-2,-5,-5v2,-11,31,-3,41,-6r0,-242v-15,-4,-42,7,-46,-6v0,-2,3,-4,5,-4","w":81},"^":{"d":"33,-247v2,20,6,46,12,65v1,2,-2,4,-4,4v-14,-8,-8,-28,-14,-44v-7,13,-3,44,-19,43v0,-20,11,-48,15,-69v1,-4,10,-4,10,1","w":66},"_":{"d":"167,26v-52,-1,-133,8,-164,-4v12,-18,51,-5,83,-6r81,-2v4,0,7,2,7,6v0,4,-3,6,-7,6","w":193},"a":{"d":"55,-158v60,3,33,89,37,150v0,3,-2,5,-5,5v-4,-1,-7,-4,-6,-10v-32,28,-92,9,-80,-49v-7,-45,57,-55,82,-29v1,-31,-1,-57,-29,-57v-25,1,-45,12,-42,39v1,3,-3,5,-5,5v-6,1,-7,-5,-6,-11v1,-30,23,-44,54,-43xm44,-11v29,3,38,-17,38,-48v0,-28,-16,-35,-41,-35v-25,0,-29,16,-29,44v0,31,11,37,32,39","w":117},"b":{"d":"15,-147v34,-25,92,-6,82,49v4,54,5,102,-55,95v-13,-1,-22,-6,-28,-12v4,11,-8,22,-11,9r2,-222v0,-7,11,-7,11,0xm44,-14v50,0,43,-37,41,-84v-1,-32,-5,-49,-35,-49v-34,0,-39,21,-36,56v3,34,-9,77,30,77","w":119},"c":{"d":"98,-118v0,6,-1,15,-8,14v-7,-1,-3,-13,-3,-14v-1,-17,-14,-29,-36,-29v-44,0,-39,41,-39,85v0,35,14,51,41,51v24,0,34,-10,33,-38v0,-3,2,-6,5,-6v4,0,5,3,6,6v1,36,-13,47,-44,49v-48,3,-52,-44,-52,-100v0,-39,14,-57,50,-58v27,-2,46,18,47,40","w":120},"d":{"d":"86,-140v1,-37,-12,-81,7,-97v6,58,4,159,3,231v0,7,-12,8,-11,0r0,-6v-41,29,-96,-4,-84,-63v-3,-46,6,-82,46,-83v16,0,29,6,39,18xm12,-97v-3,47,-1,85,42,85v36,0,30,-47,32,-73v1,-35,-8,-62,-40,-62v-26,0,-33,21,-34,50","w":121},"e":{"d":"54,0v-51,4,-55,-50,-53,-106v1,-33,17,-52,50,-53v39,-1,52,29,46,72v-12,15,-53,5,-84,7v-4,40,7,71,41,69v25,-2,33,-11,32,-39v0,-3,2,-5,6,-5v3,0,6,2,6,5v1,36,-14,47,-44,50xm51,-148v-29,0,-46,27,-36,57r71,-1v4,-34,-4,-56,-35,-56","w":123},"f":{"d":"1,-71v7,-77,-29,-179,62,-166v4,-1,5,2,5,5v0,10,-15,5,-23,5v-35,0,-33,33,-32,68v13,-1,53,-4,34,10r-34,1r-1,143v0,6,-12,9,-11,0r0,-66","w":89},"g":{"d":"2,-56v-14,-75,27,-129,81,-90v-4,-11,11,-20,11,-8r0,165v13,64,-85,83,-93,26v-1,-10,10,-14,12,-4v-5,16,11,27,29,27v40,0,43,-33,40,-74v-29,22,-92,14,-80,-42xm44,-13v59,0,29,-61,37,-113v-18,-40,-75,-24,-68,28v5,37,-11,85,31,85","w":118},"h":{"d":"4,-175v1,-20,-9,-53,5,-59v10,13,3,57,6,90v26,-25,77,-16,79,34r4,104v0,7,-12,7,-12,0v-9,-50,21,-145,-41,-140v-50,5,-22,88,-29,141v-1,6,-11,7,-11,0","w":119},"i":{"d":"7,-154v0,-7,11,-7,11,0r-1,148v0,7,-11,6,-11,0xm12,-176v-10,-2,-10,-40,0,-47v11,5,3,26,5,41v0,4,-2,6,-5,6","w":37},"j":{"d":"18,-216v14,7,8,61,-4,41v2,-13,-6,-35,4,-41xm-24,61v69,3,26,-101,37,-172v2,-14,-7,-52,11,-46r0,184v-2,31,-14,47,-47,45v-3,0,-6,-2,-6,-5v0,-3,2,-6,5,-6","w":44},"k":{"d":"6,-237v19,19,2,85,7,130v9,-6,64,-51,74,-57v15,13,-6,17,-29,36r-39,32v29,14,77,11,75,55v-1,22,10,32,2,41v-24,-2,1,-55,-28,-66r-54,-20r-2,79v0,4,-2,6,-5,6v-17,-49,4,-156,-6,-230v0,-3,3,-6,5,-6","w":120},"l":{"d":"16,0v-4,0,-5,-3,-6,-6r1,-226v0,-4,3,-5,6,-6v13,52,4,203,4,232v0,4,-2,6,-5,6","w":44},"m":{"d":"134,-158v66,0,40,88,43,152v0,4,-2,6,-5,6v-16,-26,1,-75,-4,-122v-3,-27,-45,-34,-61,-12v-27,12,-2,74,-10,128v0,7,-11,7,-11,0v-6,-57,19,-137,-30,-141v-65,-5,-37,80,-42,141v0,4,-3,5,-6,6v-13,-33,-3,-107,-4,-157v1,-4,12,-5,11,2v-2,3,-2,7,-2,12v19,-17,68,-26,78,8v13,-10,23,-23,43,-23","w":204},"n":{"d":"13,-144v32,-33,98,-6,82,52r1,85v0,3,-3,5,-6,5v-21,-31,23,-144,-38,-146v-19,0,-34,10,-39,24r1,119v-1,3,-3,4,-6,5v-13,-27,-3,-103,-6,-152v0,-4,2,-6,5,-6v6,0,6,7,6,14","w":120},"o":{"d":"94,-105v0,58,6,111,-56,104v-46,-5,-35,-56,-36,-101v-2,-42,14,-57,47,-57v31,0,45,20,45,54xm49,-148v-48,-2,-34,57,-35,105v0,25,12,31,34,32v46,2,34,-48,35,-95v0,-27,-9,-41,-34,-42","w":121},"p":{"d":"13,-145v37,-31,93,-5,79,61v4,49,-1,86,-45,84v-14,0,-26,-5,-32,-13r0,77v0,4,-3,5,-6,6v-13,-13,-3,-71,-4,-95r-3,-131v0,-7,10,-5,11,0r0,11xm35,-12v50,14,49,-34,46,-85v12,-53,-51,-63,-66,-30v5,39,-13,106,20,115","w":122},"q":{"d":"90,-160v17,37,0,170,7,226v1,3,-3,5,-5,5v-16,-7,-3,-41,-7,-86v-26,26,-83,16,-83,-34v0,-55,-5,-111,48,-110v13,0,27,6,35,13v0,-6,-1,-14,5,-14xm49,-12v51,0,33,-64,36,-113v-15,-36,-78,-28,-72,25v5,42,-9,88,36,88","w":124},"r":{"d":"7,-158v7,-3,7,8,7,16v20,-24,82,-17,78,25v-1,7,-11,5,-11,-1v1,-19,-12,-27,-32,-27v-56,0,-31,84,-34,140v0,4,-2,4,-5,5v-3,0,-5,-2,-5,-5v-6,-47,2,-102,-3,-148v-1,-3,3,-5,5,-5"},"s":{"d":"45,0v-29,0,-44,-15,-44,-44v0,-4,2,-6,5,-6v4,0,5,3,6,6v-1,23,14,33,34,33v21,0,39,-10,38,-35v-1,-21,-15,-28,-38,-28v-30,-1,-47,-13,-46,-45v0,-25,18,-40,44,-39v33,1,45,16,49,49v0,3,-2,6,-6,6v-12,-17,-9,-44,-43,-44v-18,0,-34,10,-33,29v0,23,10,33,35,32v32,0,52,16,49,46v-3,27,-23,40,-50,40","w":118},"t":{"d":"32,-148v5,60,-18,133,36,136v3,0,5,2,5,6v0,4,-2,6,-5,6v-64,-1,-43,-82,-47,-148v-11,4,-28,-6,-13,-11r13,0v3,-19,-9,-52,5,-61v13,7,3,38,6,60v10,3,31,-5,31,7v0,12,-19,4,-31,5","w":87},"u":{"d":"94,-152r2,146v0,3,-2,6,-6,6v-6,0,-5,-5,-6,-12v-28,24,-82,13,-82,-37r-1,-103v0,-4,3,-5,6,-6v13,22,3,70,7,110v-3,28,10,36,35,37v61,1,26,-81,34,-141v0,-4,2,-6,5,-6v4,0,5,3,6,6","w":122},"v":{"d":"89,-158v10,2,2,14,2,24v-8,6,-24,143,-48,132v-19,-46,-34,-108,-41,-148v0,-4,2,-6,5,-6v9,1,6,14,9,21v5,25,19,74,31,115r36,-133v0,-2,3,-6,6,-5","w":122},"w":{"d":"161,-152v2,-6,12,-5,11,2r-40,146v-4,6,-10,5,-12,-3r-35,-120r-34,122v-4,7,-9,4,-11,-2v-8,-22,-32,-109,-37,-125v-9,-28,4,-30,11,-4r32,113r35,-130v0,-7,10,-5,11,0v5,42,26,96,35,131","w":200},"x":{"d":"55,-78v21,46,48,61,34,78v-15,-10,-15,-28,-40,-67v-20,20,-29,75,-47,63v10,-28,27,-49,40,-74r-41,-76v18,-13,20,28,41,53v4,4,5,9,7,12v24,-34,22,-59,40,-66v8,19,-15,36,-34,77","w":119},"y":{"d":"86,-156v14,34,1,118,5,178v2,29,-17,49,-45,49v-23,0,-59,-27,-40,-45v10,4,5,23,17,27v29,19,66,-2,57,-44r0,-24v-36,34,-97,2,-79,-62r-1,-76v1,-2,3,-5,6,-5v23,30,-25,150,41,147v54,-3,26,-81,33,-140v0,-2,3,-6,6,-5","w":117},"z":{"d":"107,-7v-19,15,-57,4,-89,6v-9,1,-14,-2,-14,-9v0,-23,85,-132,81,-137r-78,0v-7,0,-8,-12,0,-11r74,0v12,0,18,6,15,16r-80,130r85,0v3,0,6,2,6,5","w":126},"{":{"d":"97,43v-56,2,-41,-64,-45,-115v-2,-31,-10,-32,-40,-37v-4,-1,-5,-2,-5,-6v0,-4,1,-6,5,-6v86,4,-10,-147,87,-154v11,-3,18,14,4,12v-41,-6,-43,55,-39,103v2,21,-7,38,-23,45v29,11,23,70,23,109v0,26,15,42,43,36v3,0,7,2,6,7v0,6,-10,6,-16,6","w":135},"|":{"d":"22,61v-16,-65,-1,-196,-5,-287v0,-3,2,-5,5,-5v9,-1,5,11,6,18r0,269v0,3,-2,5,-6,5","w":53},"}":{"d":"89,-100v-36,40,14,154,-67,142v-3,0,-5,-2,-5,-6v0,-6,5,-7,12,-6v30,1,32,-27,32,-60v0,-38,4,-75,30,-86v-34,-8,-25,-63,-25,-105v0,-23,-22,-45,-45,-44v-4,0,-5,-3,-6,-6v0,-4,2,-6,6,-6v58,-1,58,58,58,120v0,29,13,31,39,34v11,8,0,13,-10,15v-9,2,-16,5,-19,8","w":147},"~":{"d":"132,-125v-20,39,-90,-15,-118,10v-4,0,-6,-5,-4,-6v31,-33,82,16,119,-7","w":155},"'":{"d":"8,-270v14,-1,4,43,9,61v0,2,-3,5,-6,4v-9,-4,-11,-52,-3,-65","w":34},"`":{"d":"45,-216v-4,14,-9,3,-15,-4v-4,-10,-36,-9,-24,-22v21,0,31,14,39,26","w":62},"\u00a0":{"w":89}}});
