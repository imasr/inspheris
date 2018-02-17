

! function(e, r) {
    r(jQuery, e)
}(this, function(e, r) {
    "use strict";
    var i, o;
    if (e.uaMatch = function(e) {
            e = e.toLowerCase();
            var r = /(edge)\/([\w.]+)/.exec(e) || /(opr)[\/]([\w.]+)/.exec(e) || /(chrome)[ \/]([\w.]+)/.exec(e) || /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [],
                i = /(ipad)/.exec(e) || /(ipod)/.exec(e) || /(iphone)/.exec(e) || /(kindle)/.exec(e) || /(silk)/.exec(e) || /(android)/.exec(e) || /(windows phone)/.exec(e) || /(win)/.exec(e) || /(mac)/.exec(e) || /(linux)/.exec(e) || /(cros)/.exec(e) || /(playbook)/.exec(e) || /(bb)/.exec(e) || /(blackberry)/.exec(e) || [];
            return {
                browser: r[5] || r[3] || r[1] || "",
                version: r[2] || r[4] || "0",
                versionNumber: r[4] || r[2] || "0",
                platform: i[0] || ""
            }
        }, i = e.uaMatch(r.navigator.userAgent), o = {}, i.browser && (o[i.browser] = !0, o.version = i.version, o.versionNumber = parseInt(i.versionNumber, 10)), i.platform && (o[i.platform] = !0), (o.android || o.bb || o.blackberry || o.ipad || o.iphone || o.ipod || o.kindle || o.playbook || o.silk || o["windows phone"]) && (o.mobile = !0), (o.cros || o.mac || o.linux || o.win) && (o.desktop = !0), (o.chrome || o.opr || o.safari) && (o.webkit = !0), o.rv || o.edge) {
        var a = "msie";
        i.browser = a, o[a] = !0
    }
    if (o.safari && o.blackberry) {
        var s = "blackberry";
        i.browser = s, o[s] = !0
    }
    if (o.safari && o.playbook) {
        var b = "playbook";
        i.browser = b, o[b] = !0
    }
    if (o.bb) {
        var c = "blackberry";
        i.browser = c, o[c] = !0
    }
    if (o.opr) {
        var n = "opera";
        i.browser = n, o[n] = !0
    }
    if (o.safari && o.android) {
        var w = "android";
        i.browser = w, o[w] = !0
    }
    if (o.safari && o.kindle) {
        var l = "kindle";
        i.browser = l, o[l] = !0
    }
    if (o.safari && o.silk) {
        var x = "silk";
        i.browser = x, o[x] = !0
    }
    return o.name = i.browser, o.platform = i.platform, e.browser = o, o
});; /* Lazy Load XT 1.0.5 | MIT License */



! function(a, b, c, d) {
    function e(a, b) {
        return a[b] === d ? t[b] : a[b]
    }

    function f() {
        var a = b.pageYOffset;
        return a === d ? r.scrollTop : a
    }

    function g(a, b) {
        var c = t["on" + a];
        c && (w(c) ? c.call(b[0]) : (c.addClass && b.addClass(c.addClass), c.removeClass && b.removeClass(c.removeClass))), b.trigger("lazy" + a, [b]), k()
    }

    function h(b) {
        g(b.type, a(this).off(p, h))
    }

    function i(c) {
        if (A.length) {
            c = c || t.forceLoad, B = 1 / 0;
            var d, e, i = f(),
                j = b.innerHeight || r.clientHeight,
                k = b.innerWidth || r.clientWidth;
            for (d = 0, e = A.length; e > d; d++) {
                var l, m = A[d],
                    o = m[0],
                    q = m[n],
                    s = !1,
                    u = c;
                if (z(r, o)) {
                    if (c || !q.visibleOnly || o.offsetWidth || o.offsetHeight) {
                        if (!u) {
                            var v = o.getBoundingClientRect(),
                                x = q.edgeX,
                                y = q.edgeY;
                            l = v.top + i - y - j, u = i >= l && v.bottom > -y && v.left <= k + x && v.right > -x
                        }
                        if (u) {
                            g("show", m);
                            var C = q.srcAttr,
                                D = w(C) ? C(m) : o.getAttribute(C);
                            D && (m.on(p, h), o.src = D), s = !0
                        } else B > l && (B = l)
                    }
                } else s = !0;
                s && (A.splice(d--, 1), e--)
            }
            e || g("complete", a(r))
        }
    }

    function j() {
        C > 1 ? (C = 1, i(), setTimeout(j, t.throttle)) : C = 0
    }

    function k(a) {
        A.length && (a && "scroll" === a.type && a.currentTarget === b && B >= f() || (C || setTimeout(j, 0), C = 2))
    }

    function l() {
        v.lazyLoadXT()
    }

    function m() {
        i(!0)
    }
    var n = "lazyLoadXT",
        o = "lazied",
        p = "load error",
        q = "lazy-hidden",
        r = c.documentElement || c.body,
        s = b.onscroll === d || !!b.operamini || !r.getBoundingClientRect,
        t = {
            autoInit: !0,
            selector: "img[data-src]",
            blankImage: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            throttle: 99,
            forceLoad: s,
            loadEvent: "pageshow",
            updateEvent: "load orientationchange resize scroll touchmove focus",
            forceEvent: "",
            oninit: {
                removeClass: "lazy"
            },
            onshow: {
                addClass: q
            },
            onload: {
                removeClass: q,
                addClass: "lazy-loaded"
            },
            onerror: {
                removeClass: q
            },
            checkDuplicates: !0
        },
        u = {
            srcAttr: "data-src",
            edgeX: 0,
            edgeY: 0,
            visibleOnly: !0
        },
        v = a(b),
        w = a.isFunction,
        x = a.extend,
        y = a.data || function(b, c) {
            return a(b).data(c)
        },
        z = a.contains || function(a, b) {
            for (; b = b.parentNode;)
                if (b === a) return !0;
            return !1
        },
        A = [],
        B = 0,
        C = 0;
    a[n] = x(t, u, a[n]), a.fn[n] = function(c) {
        c = c || {};
        var d, f = e(c, "blankImage"),
            h = e(c, "checkDuplicates"),
            i = e(c, "scrollContainer"),
            j = {};
        a(i).on("scroll", k);
        for (d in u) j[d] = e(c, d);
        return this.each(function(d, e) {
            if (e === b) a(t.selector).lazyLoadXT(c);
            else {
                if (h && y(e, o)) return;
                var i = a(e).data(o, 1);
                f && "IMG" === e.tagName && !e.src && (e.src = f), i[n] = x({}, j), g("init", i), A.push(i)
            }
        })
    }, a(c).ready(function() {
        g("start", v), v.on(t.loadEvent, l).on(t.updateEvent, k).on(t.forceEvent, m), a(c).on(t.updateEvent, k), t.autoInit && l()
    })
}
(window.jQuery || window.Zepto || window.$, window, document),
function(a) {
    var b = a.lazyLoadXT;
    b.selector += ",video,iframe[data-src]", b.videoPoster = "data-poster", a(document).on("lazyshow", "video", function(c, d) {
        var e = d.lazyLoadXT.srcAttr,
            f = a.isFunction(e);
        d.attr("poster", d.attr(b.videoPoster)).children("source,track").each(function(b, c) {
            var d = a(c);
            d.attr("src", f ? e(d) : d.attr(e))
        }), this.load()
    })
}(window.jQuery || window.Zepto || window.$); /* Lazy Load XT 1.0.6 | MIT License */
! function(a, b, c, d) {
    function e(b, c) {
        return Math[c].apply(null, a.map(b, function(a) {
            return a[i]
        }))
    }

    function f(a) {
        return a[i] >= t[i] || a[i] === j
    }

    function g(a) {
        return a[i] === j
    }

    function h(d) {
        var h = d.attr(k.srcsetAttr);
        if (!h) return !1;
        var l = a.map(h.split(","), function(a) {
            return {
                url: m.exec(a)[1],
                w: parseFloat((n.exec(a) || q)[1]),
                h: parseFloat((o.exec(a) || q)[1]),
                x: parseFloat((p.exec(a) || r)[1])
            }
        });
        if (!l.length) return !1;
        var s, u, v = c.documentElement;
        t = {
            w: b.innerWidth || v.clientWidth,
            h: b.innerHeight || v.clientHeight,
            x: b.devicePixelRatio || 1
        };
        for (s in t) i = s, j = e(l, "max"), l = a.grep(l, f);
        for (s in t) i = s, j = e(l, "min"), l = a.grep(l, g);
        return u = l[0].url, k.srcsetExtended && (u = (d.attr(k.srcsetBaseAttr) || "") + u + (d.attr(k.srcsetExtAttr) || "")), u
    }
    var i, j, k = a.lazyLoadXT,
        l = function() {
            return "srcset" in new Image
        }(),
        m = /^\s*(\S*)/,
        n = /\S\s+(\d+)w/,
        o = /\S\s+(\d+)h/,
        p = /\S\s+([\d\.]+)x/,
        q = [0, 1 / 0],
        r = [0, 1],
        s = {
            srcsetAttr: "data-srcset",
            srcsetExtended: !0,
            srcsetBaseAttr: "data-srcset-base",
            srcsetExtAttr: "data-srcset-ext"
        },
        t = {
            w: 0,
            h: 0,
            x: 0
        };
    for (i in s) k[i] === d && (k[i] = s[i]);
    k.selector += ",img[" + k.srcsetAttr + "]", a(c).on("lazyshow", "img", function(a, b) {
        var c = b.attr(k.srcsetAttr);
        c && (!k.srcsetExtended && l ? b.attr("srcset", c) : b.lazyLoadXT.srcAttr = h)
    })
}(window.jQuery || window.Zepto || window.$, window, document);
(function() {
    function e() {}

    function t(e, t) {
        for (var n = e.length; n--;)
            if (e[n].listener === t) return n;
        return -1
    }

    function n(e) {
        return function() {
            return this[e].apply(this, arguments)
        }
    }
    var i = e.prototype,
        r = this,
        o = r.EventEmitter;
    i.getListeners = function(e) {
        var t, n, i = this._getEvents();
        if ("object" == typeof e) {
            t = {};
            for (n in i) i.hasOwnProperty(n) && e.test(n) && (t[n] = i[n])
        } else t = i[e] || (i[e] = []);
        return t
    }, i.flattenListeners = function(e) {
        var t, n = [];
        for (t = 0; t < e.length; t += 1) n.push(e[t].listener);
        return n
    }, i.getListenersAsObject = function(e) {
        var t, n = this.getListeners(e);
        return n instanceof Array && (t = {}, t[e] = n), t || n
    }, i.addListener = function(e, n) {
        var i, r = this.getListenersAsObject(e),
            o = "object" == typeof n;
        for (i in r) r.hasOwnProperty(i) && -1 === t(r[i], n) && r[i].push(o ? n : {
            listener: n,
            once: !1
        });
        return this
    }, i.on = n("addListener"), i.addOnceListener = function(e, t) {
        return this.addListener(e, {
            listener: t,
            once: !0
        })
    }, i.once = n("addOnceListener"), i.defineEvent = function(e) {
        return this.getListeners(e), this
    }, i.defineEvents = function(e) {
        for (var t = 0; t < e.length; t += 1) this.defineEvent(e[t]);
        return this
    }, i.removeListener = function(e, n) {
        var i, r, o = this.getListenersAsObject(e);
        for (r in o) o.hasOwnProperty(r) && (i = t(o[r], n), -1 !== i && o[r].splice(i, 1));
        return this
    }, i.off = n("removeListener"), i.addListeners = function(e, t) {
        return this.manipulateListeners(!1, e, t)
    }, i.removeListeners = function(e, t) {
        return this.manipulateListeners(!0, e, t)
    }, i.manipulateListeners = function(e, t, n) {
        var i, r, o = e ? this.removeListener : this.addListener,
            s = e ? this.removeListeners : this.addListeners;
        if ("object" != typeof t || t instanceof RegExp)
            for (i = n.length; i--;) o.call(this, t, n[i]);
        else
            for (i in t) t.hasOwnProperty(i) && (r = t[i]) && ("function" == typeof r ? o.call(this, i, r) : s.call(this, i, r));
        return this
    }, i.removeEvent = function(e) {
        var t, n = typeof e,
            i = this._getEvents();
        if ("string" === n) delete i[e];
        else if ("object" === n)
            for (t in i) i.hasOwnProperty(t) && e.test(t) && delete i[t];
        else delete this._events;
        return this
    }, i.removeAllListeners = n("removeEvent"), i.emitEvent = function(e, t) {
        var n, i, r, o, s = this.getListenersAsObject(e);
        for (r in s)
            if (s.hasOwnProperty(r))
                for (i = s[r].length; i--;) n = s[r][i], n.once === !0 && this.removeListener(e, n.listener), o = n.listener.apply(this, t || []), o === this._getOnceReturnValue() && this.removeListener(e, n.listener);
        return this
    }, i.trigger = n("emitEvent"), i.emit = function(e) {
        var t = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(e, t)
    }, i.setOnceReturnValue = function(e) {
        return this._onceReturnValue = e, this
    }, i._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, i._getEvents = function() {
        return this._events || (this._events = {})
    }, e.noConflict = function() {
        return r.EventEmitter = o, e
    }, "object" == typeof module && module.exports ? module.exports = e : this.EventEmitter = e
}).call(this),
    function(e) {
        function t(t) {
            var n = e.event;
            return n.target = n.target || n.srcElement || t, n
        }
        var n = document.documentElement,
            i = function() {};
        n.addEventListener ? i = function(e, t, n) {
            e.addEventListener(t, n, !1)
        } : n.attachEvent && (i = function(e, n, i) {
            e[n + i] = i.handleEvent ? function() {
                var n = t(e);
                i.handleEvent.call(i, n)
            } : function() {
                var n = t(e);
                i.call(e, n)
            }, e.attachEvent("on" + n, e[n + i])
        });
        var r = function() {};
        n.removeEventListener ? r = function(e, t, n) {
            e.removeEventListener(t, n, !1)
        } : n.detachEvent && (r = function(e, t, n) {
            e.detachEvent("on" + t, e[t + n]);
            try {
                delete e[t + n]
            } catch (i) {
                e[t + n] = void 0
            }
        });
        var o = {
            bind: i,
            unbind: r
        };
        e.eventie = o
    }(this),
    function(e, t) {
        "object" == typeof exports ? module.exports = t(e, require("wolfy87-eventemitter"), require("eventie")) : e.imagesLoaded = t(e, e.EventEmitter, e.eventie)
    }(window, function(e, t, n) {
        function i(e, t) {
            for (var n in t) e[n] = t[n];
            return e
        }

        function r(e) {
            return "[object Array]" === d.call(e)
        }

        function o(e) {
            var t = [];
            if (r(e)) t = e;
            else if ("number" == typeof e.length)
                for (var n = 0, i = e.length; i > n; n++) t.push(e[n]);
            else t.push(e);
            return t
        }

        function s(e, t, n) {
            if (!(this instanceof s)) return new s(e, t);
            "string" == typeof e && (e = document.querySelectorAll(e)), this.elements = o(e), this.options = i({}, this.options), "function" == typeof t ? n = t : i(this.options, t), n && this.on("always", n), this.getImages(), h && (this.jqDeferred = new h.Deferred);
            var r = this;
            setTimeout(function() {
                r.check()
            })
        }

        function c(e) {
            this.img = e
        }

        function a(e) {
            this.src = e, l[e] = this
        }
        var h = e.jQuery,
            u = e.console,
            f = "undefined" != typeof u,
            d = Object.prototype.toString;
        s.prototype = new t, s.prototype.options = {}, s.prototype.getImages = function() {
            this.images = [];
            for (var e = 0, t = this.elements.length; t > e; e++) {
                var n = this.elements[e];
                "IMG" === n.nodeName && this.addImage(n);
                var i = n.nodeType;
                if (i && (1 === i || 9 === i || 11 === i))
                    for (var r = n.querySelectorAll("img"), o = 0, s = r.length; s > o; o++) {
                        var c = r[o];
                        this.addImage(c)
                    }
            }
        }, s.prototype.addImage = function(e) {
            var t = new c(e);
            this.images.push(t)
        }, s.prototype.check = function() {
            function e(e, r) {
                return t.options.debug && f && u.log("confirm", e, r), t.progress(e), n++, n === i && t.complete(), !0
            }
            var t = this,
                n = 0,
                i = this.images.length;
            if (this.hasAnyBroken = !1, !i) return void this.complete();
            for (var r = 0; i > r; r++) {
                var o = this.images[r];
                o.on("confirm", e), o.check()
            }
        }, s.prototype.progress = function(e) {
            this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded;
            var t = this;
            setTimeout(function() {
                t.emit("progress", t, e), t.jqDeferred && t.jqDeferred.notify && t.jqDeferred.notify(t, e)
            })
        }, s.prototype.complete = function() {
            var e = this.hasAnyBroken ? "fail" : "done";
            this.isComplete = !0;
            var t = this;
            setTimeout(function() {
                if (t.emit(e, t), t.emit("always", t), t.jqDeferred) {
                    var n = t.hasAnyBroken ? "reject" : "resolve";
                    t.jqDeferred[n](t)
                }
            })
        }, h && (h.fn.imagesLoaded = function(e, t) {
            var n = new s(this, e, t);
            return n.jqDeferred.promise(h(this))
        }), c.prototype = new t, c.prototype.check = function() {
            var e = l[this.img.src] || new a(this.img.src);
            if (e.isConfirmed) return void this.confirm(e.isLoaded, "cached was confirmed");
            if (this.img.complete && void 0 !== this.img.naturalWidth) return void this.confirm(0 !== this.img.naturalWidth, "naturalWidth");
            var t = this;
            e.on("confirm", function(e, n) {
                return t.confirm(e.isLoaded, n), !0
            }), e.check()
        }, c.prototype.confirm = function(e, t) {
            this.isLoaded = e, this.emit("confirm", this, t)
        };
        var l = {};
        return a.prototype = new t, a.prototype.check = function() {
            if (!this.isChecked) {
                var e = new Image;
                n.bind(e, "load", this), n.bind(e, "error", this), e.src = this.src, this.isChecked = !0
            }
        }, a.prototype.handleEvent = function(e) {
            var t = "on" + e.type;
            this[t] && this[t](e)
        }, a.prototype.onload = function(e) {
            this.confirm(!0, "onload"), this.unbindProxyEvents(e)
        }, a.prototype.onerror = function(e) {
            this.confirm(!1, "onerror"), this.unbindProxyEvents(e)
        }, a.prototype.confirm = function(e, t) {
            this.isConfirmed = !0, this.isLoaded = e, this.emit("confirm", this, t)
        }, a.prototype.unbindProxyEvents = function(e) {
            n.unbind(e.target, "load", this), n.unbind(e.target, "error", this)
        }, s
    });;
/* Modernizr 2.8.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-video-shiv-cssclasses-load
 */
;
window.Modernizr = function(a, b, c) {
        function u(a) {
            j.cssText = a
        }

        function v(a, b) {
            return u(prefixes.join(a + ";") + (b || ""))
        }

        function w(a, b) {
            return typeof a === b
        }

        function x(a, b) {
            return !!~("" + a).indexOf(b)
        }

        function y(a, b, d) {
            for (var e in a) {
                var f = b[a[e]];
                if (f !== c) return d === !1 ? a[e] : w(f, "function") ? f.bind(d || b) : f
            }
            return !1
        }
        var d = "2.8.2",
            e = {},
            f = !0,
            g = b.documentElement,
            h = "modernizr",
            i = b.createElement(h),
            j = i.style,
            k, l = {}.toString,
            m = {},
            n = {},
            o = {},
            p = [],
            q = p.slice,
            r, s = {}.hasOwnProperty,
            t;
        !w(s, "undefined") && !w(s.call, "undefined") ? t = function(a, b) {
            return s.call(a, b)
        } : t = function(a, b) {
            return b in a && w(a.constructor.prototype[b], "undefined")
        }, Function.prototype.bind || (Function.prototype.bind = function(b) {
            var c = this;
            if (typeof c != "function") throw new TypeError;
            var d = q.call(arguments, 1),
                e = function() {
                    if (this instanceof e) {
                        var a = function() {};
                        a.prototype = c.prototype;
                        var f = new a,
                            g = c.apply(f, d.concat(q.call(arguments)));
                        return Object(g) === g ? g : f
                    }
                    return c.apply(b, d.concat(q.call(arguments)))
                };
            return e
        }), m.video = function() {
            var a = b.createElement("video"),
                c = !1;
            try {
                if (c = !!a.canPlayType) c = new Boolean(c), c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "")
            } catch (d) {}
            return c
        };
        for (var z in m) t(m, z) && (r = z.toLowerCase(), e[r] = m[z](), p.push((e[r] ? "" : "no-") + r));
        return e.addTest = function(a, b) {
                if (typeof a == "object")
                    for (var d in a) t(a, d) && e.addTest(d, a[d]);
                else {
                    a = a.toLowerCase();
                    if (e[a] !== c) return e;
                    b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b
                }
                return e
            }, u(""), i = k = null,
            function(a, b) {
                function l(a, b) {
                    var c = a.createElement("p"),
                        d = a.getElementsByTagName("head")[0] || a.documentElement;
                    return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild)
                }

                function m() {
                    var a = s.elements;
                    return typeof a == "string" ? a.split(" ") : a
                }

                function n(a) {
                    var b = j[a[h]];
                    return b || (b = {}, i++, a[h] = i, j[i] = b), b
                }

                function o(a, c, d) {
                    c || (c = b);
                    if (k) return c.createElement(a);
                    d || (d = n(c));
                    var g;
                    return d.cache[a] ? g = d.cache[a].cloneNode() : f.test(a) ? g = (d.cache[a] = d.createElem(a)).cloneNode() : g = d.createElem(a), g.canHaveChildren && !e.test(a) && !g.tagUrn ? d.frag.appendChild(g) : g
                }

                function p(a, c) {
                    a || (a = b);
                    if (k) return a.createDocumentFragment();
                    c = c || n(a);
                    var d = c.frag.cloneNode(),
                        e = 0,
                        f = m(),
                        g = f.length;
                    for (; e < g; e++) d.createElement(f[e]);
                    return d
                }

                function q(a, b) {
                    b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function(c) {
                        return s.shivMethods ? o(c, a, b) : b.createElem(c)
                    }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/[\w\-]+/g, function(a) {
                        return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")'
                    }) + ");return n}")(s, b.frag)
                }

                function r(a) {
                    a || (a = b);
                    var c = n(a);
                    return s.shivCSS && !g && !c.hasCSS && (c.hasCSS = !!l(a, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), k || q(a, c), a
                }
                var c = "3.7.0",
                    d = a.html5 || {},
                    e = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
                    f = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
                    g, h = "_html5shiv",
                    i = 0,
                    j = {},
                    k;
                (function() {
                    try {
                        var a = b.createElement("a");
                        a.innerHTML = "<xyz></xyz>", g = "hidden" in a, k = a.childNodes.length == 1 || function() {
                            b.createElement("a");
                            var a = b.createDocumentFragment();
                            return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined"
                        }()
                    } catch (c) {
                        g = !0, k = !0
                    }
                })();
                var s = {
                    elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
                    version: c,
                    shivCSS: d.shivCSS !== !1,
                    supportsUnknownElements: k,
                    shivMethods: d.shivMethods !== !1,
                    type: "default",
                    shivDocument: r,
                    createElement: o,
                    createDocumentFragment: p
                };
                a.html5 = s, r(b)
            }(this, b), e._version = d, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + p.join(" ") : ""), e
    }(this, this.document),
    function(a, b, c) {
        function d(a) {
            return "[object Function]" == o.call(a)
        }

        function e(a) {
            return "string" == typeof a
        }

        function f() {}

        function g(a) {
            return !a || "loaded" == a || "complete" == a || "uninitialized" == a
        }

        function h() {
            var a = p.shift();
            q = 1, a ? a.t ? m(function() {
                ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1)
            }, 0) : (a(), h()) : q = 0
        }

        function i(a, c, d, e, f, i, j) {
            function k(b) {
                if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) {
                    "img" != a && m(function() {
                        t.removeChild(l)
                    }, 50);
                    for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload()
                }
            }
            var j = j || B.errorTimeout,
                l = b.createElement(a),
                o = 0,
                r = 0,
                u = {
                    t: d,
                    s: c,
                    e: f,
                    a: i,
                    x: j
                };
            1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
                k.call(this, r)
            }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l))
        }

        function j(a, b, c, d, f) {
            return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this
        }

        function k() {
            var a = B;
            return a.loader = {
                load: j,
                i: 0
            }, a
        }
        var l = b.documentElement,
            m = a.setTimeout,
            n = b.getElementsByTagName("script")[0],
            o = {}.toString,
            p = [],
            q = 0,
            r = "MozAppearance" in l.style,
            s = r && !!b.createRange().compareNode,
            t = s ? l : n.parentNode,
            l = a.opera && "[object Opera]" == o.call(a.opera),
            l = !!b.attachEvent && !l,
            u = r ? "object" : l ? "script" : "img",
            v = l ? "script" : u,
            w = Array.isArray || function(a) {
                return "[object Array]" == o.call(a)
            },
            x = [],
            y = {},
            z = {
                timeout: function(a, b) {
                    return b.length && (a.timeout = b[0]), a
                }
            },
            A, B;
        B = function(a) {
            function b(a) {
                var a = a.split("!"),
                    b = x.length,
                    c = a.pop(),
                    d = a.length,
                    c = {
                        url: c,
                        origUrl: c,
                        prefixes: a
                    },
                    e, f, g;
                for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
                for (f = 0; f < b; f++) c = x[f](c);
                return c
            }

            function g(a, e, f, g, h) {
                var i = b(a),
                    j = i.autoCallback;
                i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function() {
                    k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2
                })))
            }

            function h(a, b) {
                function c(a, c) {
                    if (a) {
                        if (e(a)) c || (j = function() {
                            var a = [].slice.call(arguments);
                            k.apply(this, a), l()
                        }), g(a, j, b, 0, h);
                        else if (Object(a) === a)
                            for (n in m = function() {
                                    var b = 0,
                                        c;
                                    for (c in a) a.hasOwnProperty(c) && b++;
                                    return b
                                }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
                                var a = [].slice.call(arguments);
                                k.apply(this, a), l()
                            } : j[n] = function(a) {
                                return function() {
                                    var b = [].slice.call(arguments);
                                    a && a.apply(this, b), l()
                                }
                            }(k[n])), g(a[n], j, b, n, h))
                    } else !c && l()
                }
                var h = !!a.test,
                    i = a.load || a.both,
                    j = a.callback || f,
                    k = j,
                    l = a.complete || f,
                    m, n;
                c(h ? a.yep : a.nope, !!i), i && c(i)
            }
            var i, j, l = this.yepnope.loader;
            if (e(a)) g(a, 0, l, 0);
            else if (w(a))
                for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l);
            else Object(a) === a && h(a, l)
        }, B.addPrefix = function(a, b) {
            z[a] = b
        }, B.addFilter = function(a) {
            x.push(a)
        }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function() {
            b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete"
        }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
            var k = b.createElement("script"),
                l, o, e = e || B.errorTimeout;
            k.src = a;
            for (o in d) k.setAttribute(o, d[o]);
            c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
                !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null)
            }, m(function() {
                l || (l = 1, c(1))
            }, e), i ? k.onload() : n.parentNode.insertBefore(k, n)
        }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
            var e = b.createElement("link"),
                j, c = i ? h : c || f;
            e.href = a, e.rel = "stylesheet", e.type = "text/css";
            for (j in d) e.setAttribute(j, d[j]);
            g || (n.parentNode.insertBefore(e, n), m(c, 0))
        }
    }(this, document), Modernizr.load = function() {
        yepnope.apply(window, [].slice.call(arguments, 0))
    };
! function(e) {
    function t(e) {
        var t = e.length,
            a = r.type(e);
        return "function" === a || r.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === a || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }
    if (!e.jQuery) {
        var r = function(e, t) {
            return new r.fn.init(e, t)
        };
        r.isWindow = function(e) {
            return null != e && e == e.window
        }, r.type = function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? n[i.call(e)] || "object" : typeof e
        }, r.isArray = Array.isArray || function(e) {
            return "array" === r.type(e)
        }, r.isPlainObject = function(e) {
            var t;
            if (!e || "object" !== r.type(e) || e.nodeType || r.isWindow(e)) return !1;
            try {
                if (e.constructor && !o.call(e, "constructor") && !o.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (a) {
                return !1
            }
            for (t in e);
            return void 0 === t || o.call(e, t)
        }, r.each = function(e, r, a) {
            var n, o = 0,
                i = e.length,
                s = t(e);
            if (a) {
                if (s)
                    for (; i > o && (n = r.apply(e[o], a), n !== !1); o++);
                else
                    for (o in e)
                        if (n = r.apply(e[o], a), n === !1) break
            } else if (s)
                for (; i > o && (n = r.call(e[o], o, e[o]), n !== !1); o++);
            else
                for (o in e)
                    if (n = r.call(e[o], o, e[o]), n === !1) break; return e
        }, r.data = function(e, t, n) {
            if (void 0 === n) {
                var o = e[r.expando],
                    i = o && a[o];
                if (void 0 === t) return i;
                if (i && t in i) return i[t]
            } else if (void 0 !== t) {
                var o = e[r.expando] || (e[r.expando] = ++r.uuid);
                return a[o] = a[o] || {}, a[o][t] = n, n
            }
        }, r.removeData = function(e, t) {
            var n = e[r.expando],
                o = n && a[n];
            o && r.each(t, function(e, t) {
                delete o[t]
            })
        }, r.extend = function() {
            var e, t, a, n, o, i, s = arguments[0] || {},
                l = 1,
                u = arguments.length,
                c = !1;
            for ("boolean" == typeof s && (c = s, s = arguments[l] || {}, l++), "object" != typeof s && "function" !== r.type(s) && (s = {}), l === u && (s = this, l--); u > l; l++)
                if (null != (o = arguments[l]))
                    for (n in o) e = s[n], a = o[n], s !== a && (c && a && (r.isPlainObject(a) || (t = r.isArray(a))) ? (t ? (t = !1, i = e && r.isArray(e) ? e : []) : i = e && r.isPlainObject(e) ? e : {}, s[n] = r.extend(c, i, a)) : void 0 !== a && (s[n] = a));
            return s
        }, r.queue = function(e, a, n) {
            function o(e, r) {
                var a = r || [];
                return null != e && (t(Object(e)) ? ! function(e, t) {
                    for (var r = +t.length, a = 0, n = e.length; r > a;) e[n++] = t[a++];
                    if (r !== r)
                        for (; void 0 !== t[a];) e[n++] = t[a++];
                    return e.length = n, e
                }(a, "string" == typeof e ? [e] : e) : [].push.call(a, e)), a
            }
            if (e) {
                a = (a || "fx") + "queue";
                var i = r.data(e, a);
                return n ? (!i || r.isArray(n) ? i = r.data(e, a, o(n)) : i.push(n), i) : i || []
            }
        }, r.dequeue = function(e, t) {
            r.each(e.nodeType ? [e] : e, function(e, a) {
                t = t || "fx";
                var n = r.queue(a, t),
                    o = n.shift();
                "inprogress" === o && (o = n.shift()), o && ("fx" === t && n.unshift("inprogress"), o.call(a, function() {
                    r.dequeue(a, t)
                }))
            })
        }, r.fn = r.prototype = {
            init: function(e) {
                if (e.nodeType) return this[0] = e, this;
                throw new Error("Not a DOM node.")
            },
            offset: function() {
                var t = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : {
                    top: 0,
                    left: 0
                };
                return {
                    top: t.top + (e.pageYOffset || document.scrollTop || 0) - (document.clientTop || 0),
                    left: t.left + (e.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || 0)
                }
            },
            position: function() {
                function e() {
                    for (var e = this.offsetParent || document; e && "html" === !e.nodeType.toLowerCase && "static" === e.style.position;) e = e.offsetParent;
                    return e || document
                }
                var t = this[0],
                    e = e.apply(t),
                    a = this.offset(),
                    n = /^(?:body|html)$/i.test(e.nodeName) ? {
                        top: 0,
                        left: 0
                    } : r(e).offset();
                return a.top -= parseFloat(t.style.marginTop) || 0, a.left -= parseFloat(t.style.marginLeft) || 0, e.style && (n.top += parseFloat(e.style.borderTopWidth) || 0, n.left += parseFloat(e.style.borderLeftWidth) || 0), {
                    top: a.top - n.top,
                    left: a.left - n.left
                }
            }
        };
        var a = {};
        r.expando = "velocity" + (new Date).getTime(), r.uuid = 0;
        for (var n = {}, o = n.hasOwnProperty, i = n.toString, s = "Boolean Number String Function Array Date RegExp Object Error".split(" "), l = 0; l < s.length; l++) n["[object " + s[l] + "]"] = s[l].toLowerCase();
        r.fn.init.prototype = r.fn, e.Velocity = {
            Utilities: r
        }
    }
}(window),
function(e) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e() : e()
}(function() {
    return function(e, t, r, a) {
        function n(e) {
            for (var t = -1, r = e ? e.length : 0, a = []; ++t < r;) {
                var n = e[t];
                n && a.push(n)
            }
            return a
        }

        function o(e) {
            return m.isWrapped(e) ? e = [].slice.call(e) : m.isNode(e) && (e = [e]), e
        }

        function i(e) {
            var t = f.data(e, "velocity");
            return null === t ? a : t
        }

        function s(e) {
            return function(t) {
                return Math.round(t * e) * (1 / e)
            }
        }

        function l(e, r, a, n) {
            function o(e, t) {
                return 1 - 3 * t + 3 * e
            }

            function i(e, t) {
                return 3 * t - 6 * e
            }

            function s(e) {
                return 3 * e
            }

            function l(e, t, r) {
                return ((o(t, r) * e + i(t, r)) * e + s(t)) * e
            }

            function u(e, t, r) {
                return 3 * o(t, r) * e * e + 2 * i(t, r) * e + s(t)
            }

            function c(t, r) {
                for (var n = 0; m > n; ++n) {
                    var o = u(r, e, a);
                    if (0 === o) return r;
                    var i = l(r, e, a) - t;
                    r -= i / o
                }
                return r
            }

            function p() {
                for (var t = 0; b > t; ++t) w[t] = l(t * x, e, a)
            }

            function f(t, r, n) {
                var o, i, s = 0;
                do i = r + (n - r) / 2, o = l(i, e, a) - t, o > 0 ? n = i : r = i; while (Math.abs(o) > h && ++s < v);
                return i
            }

            function d(t) {
                for (var r = 0, n = 1, o = b - 1; n != o && w[n] <= t; ++n) r += x;
                --n;
                var i = (t - w[n]) / (w[n + 1] - w[n]),
                    s = r + i * x,
                    l = u(s, e, a);
                return l >= y ? c(t, s) : 0 == l ? s : f(t, r, r + x)
            }

            function g() {
                V = !0, (e != r || a != n) && p()
            }
            var m = 4,
                y = .001,
                h = 1e-7,
                v = 10,
                b = 11,
                x = 1 / (b - 1),
                S = "Float32Array" in t;
            if (4 !== arguments.length) return !1;
            for (var P = 0; 4 > P; ++P)
                if ("number" != typeof arguments[P] || isNaN(arguments[P]) || !isFinite(arguments[P])) return !1;
            e = Math.min(e, 1), a = Math.min(a, 1), e = Math.max(e, 0), a = Math.max(a, 0);
            var w = S ? new Float32Array(b) : new Array(b),
                V = !1,
                C = function(t) {
                    return V || g(), e === r && a === n ? t : 0 === t ? 0 : 1 === t ? 1 : l(d(t), r, n)
                };
            C.getControlPoints = function() {
                return [{
                    x: e,
                    y: r
                }, {
                    x: a,
                    y: n
                }]
            };
            var T = "generateBezier(" + [e, r, a, n] + ")";
            return C.toString = function() {
                return T
            }, C
        }

        function u(e, t) {
            var r = e;
            return m.isString(e) ? b.Easings[e] || (r = !1) : r = m.isArray(e) && 1 === e.length ? s.apply(null, e) : m.isArray(e) && 2 === e.length ? x.apply(null, e.concat([t])) : m.isArray(e) && 4 === e.length ? l.apply(null, e) : !1, r === !1 && (r = b.Easings[b.defaults.easing] ? b.defaults.easing : v), r
        }

        function c(e) {
            if (e)
                for (var t = (new Date).getTime(), r = 0, n = b.State.calls.length; n > r; r++)
                    if (b.State.calls[r]) {
                        var o = b.State.calls[r],
                            s = o[0],
                            l = o[2],
                            u = o[3],
                            d = !!u;
                        u || (u = b.State.calls[r][3] = t - 16);
                        for (var g = Math.min((t - u) / l.duration, 1), y = 0, h = s.length; h > y; y++) {
                            var v = s[y],
                                x = v.element;
                            if (i(x)) {
                                var P = !1;
                                if (l.display !== a && null !== l.display && "none" !== l.display) {
                                    if ("flex" === l.display) {
                                        var V = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];
                                        f.each(V, function(e, t) {
                                            S.setPropertyValue(x, "display", t)
                                        })
                                    }
                                    S.setPropertyValue(x, "display", l.display)
                                }
                                l.visibility !== a && "hidden" !== l.visibility && S.setPropertyValue(x, "visibility", l.visibility);
                                for (var C in v)
                                    if ("element" !== C) {
                                        var T, k = v[C],
                                            A = m.isString(k.easing) ? b.Easings[k.easing] : k.easing;
                                        if (1 === g) T = k.endValue;
                                        else if (T = k.startValue + (k.endValue - k.startValue) * A(g), !d && T === k.currentValue) continue;
                                        if (k.currentValue = T, S.Hooks.registered[C]) {
                                            var F = S.Hooks.getRoot(C),
                                                E = i(x).rootPropertyValueCache[F];
                                            E && (k.rootPropertyValue = E)
                                        }
                                        var j = S.setPropertyValue(x, C, k.currentValue + (0 === parseFloat(T) ? "" : k.unitType), k.rootPropertyValue, k.scrollData);
                                        S.Hooks.registered[C] && (i(x).rootPropertyValueCache[F] = S.Normalizations.registered[F] ? S.Normalizations.registered[F]("extract", null, j[1]) : j[1]), "transform" === j[0] && (P = !0)
                                    }
                                l.mobileHA && i(x).transformCache.translate3d === a && (i(x).transformCache.translate3d = "(0px, 0px, 0px)", P = !0), P && S.flushTransformCache(x)
                            }
                        }
                        l.display !== a && "none" !== l.display && (b.State.calls[r][2].display = !1), l.visibility !== a && "hidden" !== l.visibility && (b.State.calls[r][2].visibility = !1), l.progress && l.progress.call(o[1], o[1], g, Math.max(0, u + l.duration - t), u), 1 === g && p(r)
                    }
            b.State.isTicking && w(c)
        }

        function p(e, t) {
            if (!b.State.calls[e]) return !1;
            for (var r = b.State.calls[e][0], n = b.State.calls[e][1], o = b.State.calls[e][2], s = b.State.calls[e][4], l = !1, u = 0, c = r.length; c > u; u++) {
                var p = r[u].element;
                if (t || o.loop || ("none" === o.display && S.setPropertyValue(p, "display", o.display), "hidden" === o.visibility && S.setPropertyValue(p, "visibility", o.visibility)), o.loop !== !0 && (f.queue(p)[1] === a || !/\.velocityQueueEntryFlag/i.test(f.queue(p)[1])) && i(p)) {
                    i(p).isAnimating = !1, i(p).rootPropertyValueCache = {};
                    var d = !1;
                    f.each(S.Lists.transforms3D, function(e, t) {
                        var r = /^scale/.test(t) ? 1 : 0,
                            n = i(p).transformCache[t];
                        i(p).transformCache[t] !== a && new RegExp("^\\(" + r + "[^.]").test(n) && (d = !0, delete i(p).transformCache[t])
                    }), o.mobileHA && (d = !0, delete i(p).transformCache.translate3d), d && S.flushTransformCache(p), S.Values.removeClass(p, "velocity-animating")
                }
                if (!t && o.complete && !o.loop && u === c - 1) try {
                    o.complete.call(n, n)
                } catch (g) {
                    setTimeout(function() {
                        throw g
                    }, 1)
                }
                s && o.loop !== !0 && s(n), o.loop !== !0 || t || (f.each(i(p).tweensContainer, function(e, t) {
                    /^rotate/.test(e) && 360 === parseFloat(t.endValue) && (t.endValue = 0, t.startValue = 360)
                }), b(p, "reverse", {
                    loop: !0,
                    delay: o.delay
                })), o.queue !== !1 && f.dequeue(p, o.queue)
            }
            b.State.calls[e] = !1;
            for (var m = 0, y = b.State.calls.length; y > m; m++)
                if (b.State.calls[m] !== !1) {
                    l = !0;
                    break
                }
            l === !1 && (b.State.isTicking = !1, delete b.State.calls, b.State.calls = [])
        }
        var f, d = function() {
                if (r.documentMode) return r.documentMode;
                for (var e = 7; e > 4; e--) {
                    var t = r.createElement("div");
                    if (t.innerHTML = "<!--[if IE " + e + "]><span></span><![endif]-->", t.getElementsByTagName("span").length) return t = null, e
                }
                return a
            }(),
            g = function() {
                var e = 0;
                return t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || function(t) {
                    var r, a = (new Date).getTime();
                    return r = Math.max(0, 16 - (a - e)), e = a + r, setTimeout(function() {
                        t(a + r)
                    }, r)
                }
            }(),
            m = {
                isString: function(e) {
                    return "string" == typeof e
                },
                isArray: Array.isArray || function(e) {
                    return "[object Array]" === Object.prototype.toString.call(e)
                },
                isFunction: function(e) {
                    return "[object Function]" === Object.prototype.toString.call(e)
                },
                isNode: function(e) {
                    return e && e.nodeType
                },
                isNodeList: function(e) {
                    return "object" == typeof e && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(e)) && e.length !== a && (0 === e.length || "object" == typeof e[0] && e[0].nodeType > 0)
                },
                isWrapped: function(e) {
                    return e && (e.jquery || t.Zepto && t.Zepto.zepto.isZ(e))
                },
                isSVG: function(e) {
                    return t.SVGElement && e instanceof t.SVGElement
                },
                isEmptyObject: function(e) {
                    for (var t in e) return !1;
                    return !0
                }
            },
            y = !1;
        if (e.fn && e.fn.jquery ? (f = e, y = !0) : f = t.Velocity.Utilities, 8 >= d && !y) throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
        if (7 >= d) return void(jQuery.fn.velocity = jQuery.fn.animate);
        var h = 400,
            v = "swing",
            b = {
                State: {
                    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                    isAndroid: /Android/i.test(navigator.userAgent),
                    isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                    isChrome: t.chrome,
                    isFirefox: /Firefox/i.test(navigator.userAgent),
                    prefixElement: r.createElement("div"),
                    prefixMatches: {},
                    scrollAnchor: null,
                    scrollPropertyLeft: null,
                    scrollPropertyTop: null,
                    isTicking: !1,
                    calls: []
                },
                CSS: {},
                Utilities: f,
                Redirects: {},
                Easings: {},
                Promise: t.Promise,
                defaults: {
                    queue: "",
                    duration: h,
                    easing: v,
                    begin: a,
                    complete: a,
                    progress: a,
                    display: a,
                    visibility: a,
                    loop: !1,
                    delay: !1,
                    mobileHA: !0,
                    _cacheValues: !0
                },
                init: function(e) {
                    f.data(e, "velocity", {
                        isSVG: m.isSVG(e),
                        isAnimating: !1,
                        computedStyle: null,
                        tweensContainer: null,
                        rootPropertyValueCache: {},
                        transformCache: {}
                    })
                },
                hook: null,
                mock: !1,
                version: {
                    major: 1,
                    minor: 1,
                    patch: 0
                },
                debug: !1
            };
        t.pageYOffset !== a ? (b.State.scrollAnchor = t, b.State.scrollPropertyLeft = "pageXOffset", b.State.scrollPropertyTop = "pageYOffset") : (b.State.scrollAnchor = r.documentElement || r.body.parentNode || r.body, b.State.scrollPropertyLeft = "scrollLeft", b.State.scrollPropertyTop = "scrollTop");
        var x = function() {
            function e(e) {
                return -e.tension * e.x - e.friction * e.v
            }

            function t(t, r, a) {
                var n = {
                    x: t.x + a.dx * r,
                    v: t.v + a.dv * r,
                    tension: t.tension,
                    friction: t.friction
                };
                return {
                    dx: n.v,
                    dv: e(n)
                }
            }

            function r(r, a) {
                var n = {
                        dx: r.v,
                        dv: e(r)
                    },
                    o = t(r, .5 * a, n),
                    i = t(r, .5 * a, o),
                    s = t(r, a, i),
                    l = 1 / 6 * (n.dx + 2 * (o.dx + i.dx) + s.dx),
                    u = 1 / 6 * (n.dv + 2 * (o.dv + i.dv) + s.dv);
                return r.x = r.x + l * a, r.v = r.v + u * a, r
            }
            return function a(e, t, n) {
                var o, i, s, l = {
                        x: -1,
                        v: 0,
                        tension: null,
                        friction: null
                    },
                    u = [0],
                    c = 0,
                    p = 1e-4,
                    f = .016;
                for (e = parseFloat(e) || 500, t = parseFloat(t) || 20, n = n || null, l.tension = e, l.friction = t, o = null !== n, o ? (c = a(e, t), i = c / n * f) : i = f;;)
                    if (s = r(s || l, i), u.push(1 + s.x), c += 16, !(Math.abs(s.x) > p && Math.abs(s.v) > p)) break;
                return o ? function(e) {
                    return u[e * (u.length - 1) | 0]
                } : c
            }
        }();
        b.Easings = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            },
            spring: function(e) {
                return 1 - Math.cos(4.5 * e * Math.PI) * Math.exp(6 * -e)
            }
        }, f.each([
            ["ease", [.25, .1, .25, 1]],
            ["ease-in", [.42, 0, 1, 1]],
            ["ease-out", [0, 0, .58, 1]],
            ["ease-in-out", [.42, 0, .58, 1]],
            ["easeInSine", [.47, 0, .745, .715]],
            ["easeOutSine", [.39, .575, .565, 1]],
            ["easeInOutSine", [.445, .05, .55, .95]],
            ["easeInQuad", [.55, .085, .68, .53]],
            ["easeOutQuad", [.25, .46, .45, .94]],
            ["easeInOutQuad", [.455, .03, .515, .955]],
            ["easeInCubic", [.55, .055, .675, .19]],
            ["easeOutCubic", [.215, .61, .355, 1]],
            ["easeInOutCubic", [.645, .045, .355, 1]],
            ["easeInQuart", [.895, .03, .685, .22]],
            ["easeOutQuart", [.165, .84, .44, 1]],
            ["easeInOutQuart", [.77, 0, .175, 1]],
            ["easeInQuint", [.755, .05, .855, .06]],
            ["easeOutQuint", [.23, 1, .32, 1]],
            ["easeInOutQuint", [.86, 0, .07, 1]],
            ["easeInExpo", [.95, .05, .795, .035]],
            ["easeOutExpo", [.19, 1, .22, 1]],
            ["easeInOutExpo", [1, 0, 0, 1]],
            ["easeInCirc", [.6, .04, .98, .335]],
            ["easeOutCirc", [.075, .82, .165, 1]],
            ["easeInOutCirc", [.785, .135, .15, .86]]
        ], function(e, t) {
            b.Easings[t[0]] = l.apply(null, t[1])
        });
        var S = b.CSS = {
            RegEx: {
                isHex: /^#([A-f\d]{3}){1,2}$/i,
                valueUnwrap: /^[A-z]+\((.*)\)$/i,
                wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/gi
            },
            Lists: {
                colors: ["fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor"],
                transformsBase: ["translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ"],
                transforms3D: ["transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY"]
            },
            Hooks: {
                templates: {
                    textShadow: ["Color X Y Blur", "black 0px 0px 0px"],
                    boxShadow: ["Color X Y Blur Spread", "black 0px 0px 0px 0px"],
                    clip: ["Top Right Bottom Left", "0px 0px 0px 0px"],
                    backgroundPosition: ["X Y", "0% 0%"],
                    transformOrigin: ["X Y Z", "50% 50% 0px"],
                    perspectiveOrigin: ["X Y", "50% 50%"]
                },
                registered: {},
                register: function() {
                    for (var e = 0; e < S.Lists.colors.length; e++) {
                        var t = "color" === S.Lists.colors[e] ? "0 0 0 1" : "255 255 255 1";
                        S.Hooks.templates[S.Lists.colors[e]] = ["Red Green Blue Alpha", t]
                    }
                    var r, a, n;
                    if (d)
                        for (r in S.Hooks.templates) {
                            a = S.Hooks.templates[r], n = a[0].split(" ");
                            var o = a[1].match(S.RegEx.valueSplit);
                            "Color" === n[0] && (n.push(n.shift()), o.push(o.shift()), S.Hooks.templates[r] = [n.join(" "), o.join(" ")])
                        }
                    for (r in S.Hooks.templates) {
                        a = S.Hooks.templates[r], n = a[0].split(" ");
                        for (var e in n) {
                            var i = r + n[e],
                                s = e;
                            S.Hooks.registered[i] = [r, s]
                        }
                    }
                },
                getRoot: function(e) {
                    var t = S.Hooks.registered[e];
                    return t ? t[0] : e
                },
                cleanRootPropertyValue: function(e, t) {
                    return S.RegEx.valueUnwrap.test(t) && (t = t.match(S.RegEx.valueUnwrap)[1]), S.Values.isCSSNullValue(t) && (t = S.Hooks.templates[e][1]), t
                },
                extractValue: function(e, t) {
                    var r = S.Hooks.registered[e];
                    if (r) {
                        var a = r[0],
                            n = r[1];
                        return t = S.Hooks.cleanRootPropertyValue(a, t), t.toString().match(S.RegEx.valueSplit)[n]
                    }
                    return t
                },
                injectValue: function(e, t, r) {
                    var a = S.Hooks.registered[e];
                    if (a) {
                        var n, o, i = a[0],
                            s = a[1];
                        return r = S.Hooks.cleanRootPropertyValue(i, r), n = r.toString().match(S.RegEx.valueSplit), n[s] = t, o = n.join(" ")
                    }
                    return r
                }
            },
            Normalizations: {
                registered: {
                    clip: function(e, t, r) {
                        switch (e) {
                            case "name":
                                return "clip";
                            case "extract":
                                var a;
                                return S.RegEx.wrappedValueAlreadyExtracted.test(r) ? a = r : (a = r.toString().match(S.RegEx.valueUnwrap), a = a ? a[1].replace(/,(\s+)?/g, " ") : r), a;
                            case "inject":
                                return "rect(" + r + ")"
                        }
                    },
                    blur: function(e, t, r) {
                        switch (e) {
                            case "name":
                                return "-webkit-filter";
                            case "extract":
                                var a = parseFloat(r);
                                if (!a && 0 !== a) {
                                    var n = r.toString().match(/blur\(([0-9]+[A-z]+)\)/i);
                                    a = n ? n[1] : 0
                                }
                                return a;
                            case "inject":
                                return parseFloat(r) ? "blur(" + r + ")" : "none"
                        }
                    },
                    opacity: function(e, t, r) {
                        if (8 >= d) switch (e) {
                            case "name":
                                return "filter";
                            case "extract":
                                var a = r.toString().match(/alpha\(opacity=(.*)\)/i);
                                return r = a ? a[1] / 100 : 1;
                            case "inject":
                                return t.style.zoom = 1, parseFloat(r) >= 1 ? "" : "alpha(opacity=" + parseInt(100 * parseFloat(r), 10) + ")"
                        } else switch (e) {
                            case "name":
                                return "opacity";
                            case "extract":
                                return r;
                            case "inject":
                                return r
                        }
                    }
                },
                register: function() {
                    9 >= d || b.State.isGingerbread || (S.Lists.transformsBase = S.Lists.transformsBase.concat(S.Lists.transforms3D));
                    for (var e = 0; e < S.Lists.transformsBase.length; e++) ! function() {
                        var t = S.Lists.transformsBase[e];
                        S.Normalizations.registered[t] = function(e, r, n) {
                            switch (e) {
                                case "name":
                                    return "transform";
                                case "extract":
                                    return i(r) === a || i(r).transformCache[t] === a ? /^scale/i.test(t) ? 1 : 0 : i(r).transformCache[t].replace(/[()]/g, "");
                                case "inject":
                                    var o = !1;
                                    switch (t.substr(0, t.length - 1)) {
                                        case "translate":
                                            o = !/(%|px|em|rem|vw|vh|\d)$/i.test(n);
                                            break;
                                        case "scal":
                                        case "scale":
                                            b.State.isAndroid && i(r).transformCache[t] === a && 1 > n && (n = 1), o = !/(\d)$/i.test(n);
                                            break;
                                        case "skew":
                                            o = !/(deg|\d)$/i.test(n);
                                            break;
                                        case "rotate":
                                            o = !/(deg|\d)$/i.test(n)
                                    }
                                    return o || (i(r).transformCache[t] = "(" + n + ")"), i(r).transformCache[t]
                            }
                        }
                    }();
                    for (var e = 0; e < S.Lists.colors.length; e++) ! function() {
                        var t = S.Lists.colors[e];
                        S.Normalizations.registered[t] = function(e, r, n) {
                            switch (e) {
                                case "name":
                                    return t;
                                case "extract":
                                    var o;
                                    if (S.RegEx.wrappedValueAlreadyExtracted.test(n)) o = n;
                                    else {
                                        var i, s = {
                                            black: "rgb(0, 0, 0)",
                                            blue: "rgb(0, 0, 255)",
                                            gray: "rgb(128, 128, 128)",
                                            green: "rgb(0, 128, 0)",
                                            red: "rgb(255, 0, 0)",
                                            white: "rgb(255, 255, 255)"
                                        };
                                        /^[A-z]+$/i.test(n) ? i = s[n] !== a ? s[n] : s.black : S.RegEx.isHex.test(n) ? i = "rgb(" + S.Values.hexToRgb(n).join(" ") + ")" : /^rgba?\(/i.test(n) || (i = s.black), o = (i || n).toString().match(S.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ")
                                    }
                                    return 8 >= d || 3 !== o.split(" ").length || (o += " 1"), o;
                                case "inject":
                                    return 8 >= d ? 4 === n.split(" ").length && (n = n.split(/\s+/).slice(0, 3).join(" ")) : 3 === n.split(" ").length && (n += " 1"), (8 >= d ? "rgb" : "rgba") + "(" + n.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")"
                            }
                        }
                    }()
                }
            },
            Names: {
                camelCase: function(e) {
                    return e.replace(/-(\w)/g, function(e, t) {
                        return t.toUpperCase()
                    })
                },
                SVGAttribute: function(e) {
                    var t = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";
                    return (d || b.State.isAndroid && !b.State.isChrome) && (t += "|transform"), new RegExp("^(" + t + ")$", "i").test(e)
                },
                prefixCheck: function(e) {
                    if (b.State.prefixMatches[e]) return [b.State.prefixMatches[e], !0];
                    for (var t = ["", "Webkit", "Moz", "ms", "O"], r = 0, a = t.length; a > r; r++) {
                        var n;
                        if (n = 0 === r ? e : t[r] + e.replace(/^\w/, function(e) {
                                return e.toUpperCase()
                            }), m.isString(b.State.prefixElement.style[n])) return b.State.prefixMatches[e] = n, [n, !0]
                    }
                    return [e, !1]
                }
            },
            Values: {
                hexToRgb: function(e) {
                    var t, r = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                        a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
                    return e = e.replace(r, function(e, t, r, a) {
                        return t + t + r + r + a + a
                    }), t = a.exec(e), t ? [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)] : [0, 0, 0]
                },
                isCSSNullValue: function(e) {
                    return 0 == e || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(e)
                },
                getUnitType: function(e) {
                    return /^(rotate|skew)/i.test(e) ? "deg" : /(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(e) ? "" : "px"
                },
                getDisplayType: function(e) {
                    var t = e && e.tagName.toString().toLowerCase();
                    return /^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(t) ? "inline" : /^(li)$/i.test(t) ? "list-item" : /^(tr)$/i.test(t) ? "table-row" : "block"
                },
                addClass: function(e, t) {
                    e.classList ? e.classList.add(t) : e.className += (e.className.length ? " " : "") + t
                },
                removeClass: function(e, t) {
                    e.classList ? e.classList.remove(t) : e.className = e.className.toString().replace(new RegExp("(^|\\s)" + t.split(" ").join("|") + "(\\s|$)", "gi"), " ")
                }
            },
            getPropertyValue: function(e, r, n, o) {
                function s(e, r) {
                    function n() {
                        u && S.setPropertyValue(e, "display", "none")
                    }
                    var l = 0;
                    if (8 >= d) l = f.css(e, r);
                    else {
                        var u = !1;
                        if (/^(width|height)$/.test(r) && 0 === S.getPropertyValue(e, "display") && (u = !0, S.setPropertyValue(e, "display", S.Values.getDisplayType(e))), !o) {
                            if ("height" === r && "border-box" !== S.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                var c = e.offsetHeight - (parseFloat(S.getPropertyValue(e, "borderTopWidth")) || 0) - (parseFloat(S.getPropertyValue(e, "borderBottomWidth")) || 0) - (parseFloat(S.getPropertyValue(e, "paddingTop")) || 0) - (parseFloat(S.getPropertyValue(e, "paddingBottom")) || 0);
                                return n(), c
                            }
                            if ("width" === r && "border-box" !== S.getPropertyValue(e, "boxSizing").toString().toLowerCase()) {
                                var p = e.offsetWidth - (parseFloat(S.getPropertyValue(e, "borderLeftWidth")) || 0) - (parseFloat(S.getPropertyValue(e, "borderRightWidth")) || 0) - (parseFloat(S.getPropertyValue(e, "paddingLeft")) || 0) - (parseFloat(S.getPropertyValue(e, "paddingRight")) || 0);
                                return n(), p
                            }
                        }
                        var g;
                        g = i(e) === a ? t.getComputedStyle(e, null) : i(e).computedStyle ? i(e).computedStyle : i(e).computedStyle = t.getComputedStyle(e, null), (d || b.State.isFirefox) && "borderColor" === r && (r = "borderTopColor"), l = 9 === d && "filter" === r ? g.getPropertyValue(r) : g[r], ("" === l || null === l) && (l = e.style[r]), n()
                    }
                    if ("auto" === l && /^(top|right|bottom|left)$/i.test(r)) {
                        var m = s(e, "position");
                        ("fixed" === m || "absolute" === m && /top|left/i.test(r)) && (l = f(e).position()[r] + "px")
                    }
                    return l
                }
                var l;
                if (S.Hooks.registered[r]) {
                    var u = r,
                        c = S.Hooks.getRoot(u);
                    n === a && (n = S.getPropertyValue(e, S.Names.prefixCheck(c)[0])), S.Normalizations.registered[c] && (n = S.Normalizations.registered[c]("extract", e, n)), l = S.Hooks.extractValue(u, n)
                } else if (S.Normalizations.registered[r]) {
                    var p, g;
                    p = S.Normalizations.registered[r]("name", e), "transform" !== p && (g = s(e, S.Names.prefixCheck(p)[0]), S.Values.isCSSNullValue(g) && S.Hooks.templates[r] && (g = S.Hooks.templates[r][1])), l = S.Normalizations.registered[r]("extract", e, g)
                }
                return /^[\d-]/.test(l) || (l = i(e) && i(e).isSVG && S.Names.SVGAttribute(r) ? /^(height|width)$/i.test(r) ? e.getBBox()[r] : e.getAttribute(r) : s(e, S.Names.prefixCheck(r)[0])), S.Values.isCSSNullValue(l) && (l = 0), b.debug >= 2 && console.log("Get " + r + ": " + l), l
            },
            setPropertyValue: function(e, r, a, n, o) {
                var s = r;
                if ("scroll" === r) o.container ? o.container["scroll" + o.direction] = a : "Left" === o.direction ? t.scrollTo(a, o.alternateValue) : t.scrollTo(o.alternateValue, a);
                else if (S.Normalizations.registered[r] && "transform" === S.Normalizations.registered[r]("name", e)) S.Normalizations.registered[r]("inject", e, a), s = "transform", a = i(e).transformCache[r];
                else {
                    if (S.Hooks.registered[r]) {
                        var l = r,
                            u = S.Hooks.getRoot(r);
                        n = n || S.getPropertyValue(e, u), a = S.Hooks.injectValue(l, a, n), r = u
                    }
                    if (S.Normalizations.registered[r] && (a = S.Normalizations.registered[r]("inject", e, a), r = S.Normalizations.registered[r]("name", e)), s = S.Names.prefixCheck(r)[0], 8 >= d) try {
                        e.style[s] = a
                    } catch (c) {
                        b.debug && console.log("Browser does not support [" + a + "] for [" + s + "]")
                    } else i(e) && i(e).isSVG && S.Names.SVGAttribute(r) ? e.setAttribute(r, a) : e.style[s] = a;
                    b.debug >= 2 && console.log("Set " + r + " (" + s + "): " + a)
                }
                return [s, a]
            },
            flushTransformCache: function(e) {
                function t(t) {
                    return parseFloat(S.getPropertyValue(e, t))
                }
                var r = "";
                if ((d || b.State.isAndroid && !b.State.isChrome) && i(e).isSVG) {
                    var a = {
                        translate: [t("translateX"), t("translateY")],
                        skewX: [t("skewX")],
                        skewY: [t("skewY")],
                        scale: 1 !== t("scale") ? [t("scale"), t("scale")] : [t("scaleX"), t("scaleY")],
                        rotate: [t("rotateZ"), 0, 0]
                    };
                    f.each(i(e).transformCache, function(e) {
                        /^translate/i.test(e) ? e = "translate" : /^scale/i.test(e) ? e = "scale" : /^rotate/i.test(e) && (e = "rotate"), a[e] && (r += e + "(" + a[e].join(" ") + ") ", delete a[e])
                    })
                } else {
                    var n, o;
                    f.each(i(e).transformCache, function(t) {
                        return n = i(e).transformCache[t], "transformPerspective" === t ? (o = n, !0) : (9 === d && "rotateZ" === t && (t = "rotate"), void(r += t + n + " "))
                    }), o && (r = "perspective" + o + " " + r)
                }
                S.setPropertyValue(e, "transform", r)
            }
        };
        S.Hooks.register(), S.Normalizations.register(), b.hook = function(e, t, r) {
            var n = a;
            return e = o(e), f.each(e, function(e, o) {
                if (i(o) === a && b.init(o), r === a) n === a && (n = b.CSS.getPropertyValue(o, t));
                else {
                    var s = b.CSS.setPropertyValue(o, t, r);
                    "transform" === s[0] && b.CSS.flushTransformCache(o), n = s
                }
            }), n
        };
        var P = function() {
            function e() {
                return l ? A.promise || null : d
            }

            function s() {
                function e() {
                    function e(e, t) {
                        var r = a,
                            n = a,
                            o = a;
                        return m.isArray(e) ? (r = e[0], !m.isArray(e[1]) && /^[\d-]/.test(e[1]) || m.isFunction(e[1]) || S.RegEx.isHex.test(e[1]) ? o = e[1] : (m.isString(e[1]) && !S.RegEx.isHex.test(e[1]) || m.isArray(e[1])) && (n = t ? e[1] : u(e[1], l.duration), e[2] !== a && (o = e[2]))) : r = e, t || (n = n || l.easing), m.isFunction(r) && (r = r.call(s, C, V)), m.isFunction(o) && (o = o.call(s, C, V)), [r || 0, n, o]
                    }

                    function d(e, t) {
                        var r, a;
                        return a = (t || "0").toString().toLowerCase().replace(/[%A-z]+$/, function(e) {
                            return r = e, ""
                        }), r || (r = S.Values.getUnitType(e)), [a, r]
                    }

                    function g() {
                        var e = {
                                myParent: s.parentNode || r.body,
                                position: S.getPropertyValue(s, "position"),
                                fontSize: S.getPropertyValue(s, "fontSize")
                            },
                            a = e.position === R.lastPosition && e.myParent === R.lastParent,
                            n = e.fontSize === R.lastFontSize;
                        R.lastParent = e.myParent, R.lastPosition = e.position, R.lastFontSize = e.fontSize;
                        var o = 100,
                            l = {};
                        if (n && a) l.emToPx = R.lastEmToPx, l.percentToPxWidth = R.lastPercentToPxWidth, l.percentToPxHeight = R.lastPercentToPxHeight;
                        else {
                            var u = i(s).isSVG ? r.createElementNS("http://www.w3.org/2000/svg", "rect") : r.createElement("div");
                            b.init(u), e.myParent.appendChild(u), f.each(["overflow", "overflowX", "overflowY"], function(e, t) {
                                b.CSS.setPropertyValue(u, t, "hidden")
                            }), b.CSS.setPropertyValue(u, "position", e.position), b.CSS.setPropertyValue(u, "fontSize", e.fontSize), b.CSS.setPropertyValue(u, "boxSizing", "content-box"), f.each(["minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height"], function(e, t) {
                                b.CSS.setPropertyValue(u, t, o + "%")
                            }), b.CSS.setPropertyValue(u, "paddingLeft", o + "em"), l.percentToPxWidth = R.lastPercentToPxWidth = (parseFloat(S.getPropertyValue(u, "width", null, !0)) || 1) / o, l.percentToPxHeight = R.lastPercentToPxHeight = (parseFloat(S.getPropertyValue(u, "height", null, !0)) || 1) / o, l.emToPx = R.lastEmToPx = (parseFloat(S.getPropertyValue(u, "paddingLeft")) || 1) / o, e.myParent.removeChild(u)
                        }
                        return null === R.remToPx && (R.remToPx = parseFloat(S.getPropertyValue(r.body, "fontSize")) || 16), null === R.vwToPx && (R.vwToPx = parseFloat(t.innerWidth) / 100, R.vhToPx = parseFloat(t.innerHeight) / 100), l.remToPx = R.remToPx, l.vwToPx = R.vwToPx, l.vhToPx = R.vhToPx, b.debug >= 1 && console.log("Unit ratios: " + JSON.stringify(l), s), l
                    }
                    if (l.begin && 0 === C) try {
                        l.begin.call(y, y)
                    } catch (h) {
                        setTimeout(function() {
                            throw h
                        }, 1)
                    }
                    if ("scroll" === F) {
                        var P, w, T, k = /^x$/i.test(l.axis) ? "Left" : "Top",
                            E = parseFloat(l.offset) || 0;
                        l.container ? m.isWrapped(l.container) || m.isNode(l.container) ? (l.container = l.container[0] || l.container, P = l.container["scroll" + k], T = P + f(s).position()[k.toLowerCase()] + E) : l.container = null : (P = b.State.scrollAnchor[b.State["scrollProperty" + k]], w = b.State.scrollAnchor[b.State["scrollProperty" + ("Left" === k ? "Top" : "Left")]], T = f(s).offset()[k.toLowerCase()] + E), p = {
                            scroll: {
                                rootPropertyValue: !1,
                                startValue: P,
                                currentValue: P,
                                endValue: T,
                                unitType: "",
                                easing: l.easing,
                                scrollData: {
                                    container: l.container,
                                    direction: k,
                                    alternateValue: w
                                }
                            },
                            element: s
                        }, b.debug && console.log("tweensContainer (scroll): ", p.scroll, s)
                    } else if ("reverse" === F) {
                        if (!i(s).tweensContainer) return void f.dequeue(s, l.queue);
                        "none" === i(s).opts.display && (i(s).opts.display = "auto"), "hidden" === i(s).opts.visibility && (i(s).opts.visibility = "visible"), i(s).opts.loop = !1, i(s).opts.begin = null, i(s).opts.complete = null, x.easing || delete l.easing, x.duration || delete l.duration, l = f.extend({}, i(s).opts, l);
                        var j = f.extend(!0, {}, i(s).tweensContainer);
                        for (var H in j)
                            if ("element" !== H) {
                                var N = j[H].startValue;
                                j[H].startValue = j[H].currentValue = j[H].endValue, j[H].endValue = N, m.isEmptyObject(x) || (j[H].easing = l.easing), b.debug && console.log("reverse tweensContainer (" + H + "): " + JSON.stringify(j[H]), s)
                            }
                        p = j
                    } else if ("start" === F) {
                        var j;
                        i(s).tweensContainer && i(s).isAnimating === !0 && (j = i(s).tweensContainer), f.each(v, function(t, r) {
                            if (RegExp("^" + S.Lists.colors.join("$|^") + "$").test(t)) {
                                var n = e(r, !0),
                                    o = n[0],
                                    i = n[1],
                                    s = n[2];
                                if (S.RegEx.isHex.test(o)) {
                                    for (var l = ["Red", "Green", "Blue"], u = S.Values.hexToRgb(o), c = s ? S.Values.hexToRgb(s) : a, p = 0; p < l.length; p++) {
                                        var f = [u[p]];
                                        i && f.push(i), c !== a && f.push(c[p]), v[t + l[p]] = f
                                    }
                                    delete v[t]
                                }
                            }
                        });
                        for (var L in v) {
                            var z = e(v[L]),
                                q = z[0],
                                M = z[1],
                                $ = z[2];
                            L = S.Names.camelCase(L);
                            var I = S.Hooks.getRoot(L),
                                B = !1;
                            if (i(s).isSVG || S.Names.prefixCheck(I)[1] !== !1 || S.Normalizations.registered[I] !== a) {
                                (l.display !== a && null !== l.display && "none" !== l.display || l.visibility !== a && "hidden" !== l.visibility) && /opacity|filter/.test(L) && !$ && 0 !== q && ($ = 0), l._cacheValues && j && j[L] ? ($ === a && ($ = j[L].endValue + j[L].unitType), B = i(s).rootPropertyValueCache[I]) : S.Hooks.registered[L] ? $ === a ? (B = S.getPropertyValue(s, I), $ = S.getPropertyValue(s, L, B)) : B = S.Hooks.templates[I][1] : $ === a && ($ = S.getPropertyValue(s, L));
                                var W, G, D, X = !1;
                                if (W = d(L, $), $ = W[0], D = W[1], W = d(L, q), q = W[0].replace(/^([+-\/*])=/, function(e, t) {
                                        return X = t, ""
                                    }), G = W[1], $ = parseFloat($) || 0, q = parseFloat(q) || 0, "%" === G && (/^(fontSize|lineHeight)$/.test(L) ? (q /= 100, G = "em") : /^scale/.test(L) ? (q /= 100, G = "") : /(Red|Green|Blue)$/i.test(L) && (q = q / 100 * 255, G = "")), /[\/*]/.test(X)) G = D;
                                else if (D !== G && 0 !== $)
                                    if (0 === q) G = D;
                                    else {
                                        o = o || g();
                                        var Y = /margin|padding|left|right|width|text|word|letter/i.test(L) || /X$/.test(L) || "x" === L ? "x" : "y";
                                        switch (D) {
                                            case "%":
                                                $ *= "x" === Y ? o.percentToPxWidth : o.percentToPxHeight;
                                                break;
                                            case "px":
                                                break;
                                            default:
                                                $ *= o[D + "ToPx"]
                                        }
                                        switch (G) {
                                            case "%":
                                                $ *= 1 / ("x" === Y ? o.percentToPxWidth : o.percentToPxHeight);
                                                break;
                                            case "px":
                                                break;
                                            default:
                                                $ *= 1 / o[G + "ToPx"]
                                        }
                                    }
                                switch (X) {
                                    case "+":
                                        q = $ + q;
                                        break;
                                    case "-":
                                        q = $ - q;
                                        break;
                                    case "*":
                                        q = $ * q;
                                        break;
                                    case "/":
                                        q = $ / q
                                }
                                p[L] = {
                                    rootPropertyValue: B,
                                    startValue: $,
                                    currentValue: $,
                                    endValue: q,
                                    unitType: G,
                                    easing: M
                                }, b.debug && console.log("tweensContainer (" + L + "): " + JSON.stringify(p[L]), s)
                            } else b.debug && console.log("Skipping [" + I + "] due to a lack of browser support.")
                        }
                        p.element = s
                    }
                    p.element && (S.Values.addClass(s, "velocity-animating"), O.push(p), "" === l.queue && (i(s).tweensContainer = p, i(s).opts = l), i(s).isAnimating = !0, C === V - 1 ? (b.State.calls.length > 1e4 && (b.State.calls = n(b.State.calls)), b.State.calls.push([O, y, l, null, A.resolver]), b.State.isTicking === !1 && (b.State.isTicking = !0, c())) : C++)
                }
                var o, s = this,
                    l = f.extend({}, b.defaults, x),
                    p = {};
                switch (i(s) === a && b.init(s), parseFloat(l.delay) && l.queue !== !1 && f.queue(s, l.queue, function(e) {
                    b.velocityQueueEntryFlag = !0, i(s).delayTimer = {
                        setTimeout: setTimeout(e, parseFloat(l.delay)),
                        next: e
                    }
                }), l.duration.toString().toLowerCase()) {
                    case "fast":
                        l.duration = 200;
                        break;
                    case "normal":
                        l.duration = h;
                        break;
                    case "slow":
                        l.duration = 600;
                        break;
                    default:
                        l.duration = parseFloat(l.duration) || 1
                }
                b.mock !== !1 && (b.mock === !0 ? l.duration = l.delay = 1 : (l.duration *= parseFloat(b.mock) || 1, l.delay *= parseFloat(b.mock) || 1)), l.easing = u(l.easing, l.duration), l.begin && !m.isFunction(l.begin) && (l.begin = null), l.progress && !m.isFunction(l.progress) && (l.progress = null), l.complete && !m.isFunction(l.complete) && (l.complete = null), l.display !== a && null !== l.display && (l.display = l.display.toString().toLowerCase(), "auto" === l.display && (l.display = b.CSS.Values.getDisplayType(s))), l.visibility !== a && null !== l.visibility && (l.visibility = l.visibility.toString().toLowerCase()), l.mobileHA = l.mobileHA && b.State.isMobile && !b.State.isGingerbread, l.queue === !1 ? l.delay ? setTimeout(e, l.delay) : e() : f.queue(s, l.queue, function(t, r) {
                    return r === !0 ? (A.promise && A.resolver(y), !0) : (b.velocityQueueEntryFlag = !0, void e(t))
                }), "" !== l.queue && "fx" !== l.queue || "inprogress" === f.queue(s)[0] || f.dequeue(s)
            }
            var l, d, g, y, v, x, w = arguments[0] && (f.isPlainObject(arguments[0].properties) && !arguments[0].properties.names || m.isString(arguments[0].properties));
            if (m.isWrapped(this) ? (l = !1, g = 0, y = this, d = this) : (l = !0, g = 1, y = w ? arguments[0].elements : arguments[0]), y = o(y)) {
                w ? (v = arguments[0].properties, x = arguments[0].options) : (v = arguments[g], x = arguments[g + 1]);
                var V = y.length,
                    C = 0;
                if ("stop" !== v && !f.isPlainObject(x)) {
                    var T = g + 1;
                    x = {};
                    for (var k = T; k < arguments.length; k++) m.isArray(arguments[k]) || !/^(fast|normal|slow)$/i.test(arguments[k]) && !/^\d/.test(arguments[k]) ? m.isString(arguments[k]) || m.isArray(arguments[k]) ? x.easing = arguments[k] : m.isFunction(arguments[k]) && (x.complete = arguments[k]) : x.duration = arguments[k]
                }
                var A = {
                    promise: null,
                    resolver: null,
                    rejecter: null
                };
                l && b.Promise && (A.promise = new b.Promise(function(e, t) {
                    A.resolver = e, A.rejecter = t
                }));
                var F;
                switch (v) {
                    case "scroll":
                        F = "scroll";
                        break;
                    case "reverse":
                        F = "reverse";
                        break;
                    case "stop":
                        f.each(y, function(e, t) {
                            i(t) && i(t).delayTimer && (clearTimeout(i(t).delayTimer.setTimeout), i(t).delayTimer.next && i(t).delayTimer.next(), delete i(t).delayTimer)
                        });
                        var E = [];
                        return f.each(b.State.calls, function(e, t) {
                            t && f.each(t[1], function(r, n) {
                                var o = m.isString(x) ? x : "";
                                return x !== a && t[2].queue !== o ? !0 : void f.each(y, function(t, r) {
                                    r === n && (x !== a && (f.each(f.queue(r, o), function(e, t) {
                                        m.isFunction(t) && t(null, !0)
                                    }), f.queue(r, o, [])), i(r) && "" === o && f.each(i(r).tweensContainer, function(e, t) {
                                        t.endValue = t.currentValue
                                    }), E.push(e))
                                })
                            })
                        }), f.each(E, function(e, t) {
                            p(t, !0)
                        }), A.promise && A.resolver(y), e();
                    default:
                        if (!f.isPlainObject(v) || m.isEmptyObject(v)) {
                            if (m.isString(v) && b.Redirects[v]) {
                                var j = f.extend({}, x),
                                    H = j.duration,
                                    N = j.delay || 0;
                                return j.backwards === !0 && (y = f.extend(!0, [], y).reverse()), f.each(y, function(e, t) {
                                    parseFloat(j.stagger) ? j.delay = N + parseFloat(j.stagger) * e : m.isFunction(j.stagger) && (j.delay = N + j.stagger.call(t, e, V)), j.drag && (j.duration = parseFloat(H) || (/^(callout|transition)/.test(v) ? 1e3 : h), j.duration = Math.max(j.duration * (j.backwards ? 1 - e / V : (e + 1) / V), .75 * j.duration, 200)), b.Redirects[v].call(t, t, j || {}, e, V, y, A.promise ? A : a)
                                }), e()
                            }
                            var L = "Velocity: First argument (" + v + ") was not a property map, a known action, or a registered redirect. Aborting.";
                            return A.promise ? A.rejecter(new Error(L)) : console.log(L), e()
                        }
                        F = "start"
                }
                var R = {
                        lastParent: null,
                        lastPosition: null,
                        lastFontSize: null,
                        lastPercentToPxWidth: null,
                        lastPercentToPxHeight: null,
                        lastEmToPx: null,
                        remToPx: null,
                        vwToPx: null,
                        vhToPx: null
                    },
                    O = [];
                f.each(y, function(e, t) {
                    m.isNode(t) && s.call(t)
                });
                var z, j = f.extend({}, b.defaults, x);
                if (j.loop = parseInt(j.loop), z = 2 * j.loop - 1, j.loop)
                    for (var q = 0; z > q; q++) {
                        var M = {
                            delay: j.delay,
                            progress: j.progress
                        };
                        q === z - 1 && (M.display = j.display, M.visibility = j.visibility, M.complete = j.complete), P(y, "reverse", M)
                    }
                return e()
            }
        };
        b = f.extend(P, b), b.animate = P;
        var w = t.requestAnimationFrame || g;
        return b.State.isMobile || r.hidden === a || r.addEventListener("visibilitychange", function() {
            r.hidden ? (w = function(e) {
                return setTimeout(function() {
                    e(!0)
                }, 16)
            }, c()) : w = t.requestAnimationFrame || g
        }), e.Velocity = b, e !== t && (e.fn.velocity = P, e.fn.velocity.defaults = b.defaults), f.each(["Down", "Up"], function(e, t) {
            b.Redirects["slide" + t] = function(e, r, n, o, i, s) {
                var l = f.extend({}, r),
                    u = l.begin,
                    c = l.complete,
                    p = {
                        height: "",
                        marginTop: "",
                        marginBottom: "",
                        paddingTop: "",
                        paddingBottom: ""
                    },
                    d = {};
                l.display === a && (l.display = "Down" === t ? "inline" === b.CSS.Values.getDisplayType(e) ? "inline-block" : "block" : "none"), l.begin = function() {
                    u && u.call(i, i);
                    for (var r in p) {
                        d[r] = e.style[r];
                        var a = b.CSS.getPropertyValue(e, r);
                        p[r] = "Down" === t ? [a, 0] : [0, a]
                    }
                    d.overflow = e.style.overflow, e.style.overflow = "hidden"
                }, l.complete = function() {
                    for (var t in d) e.style[t] = d[t];
                    c && c.call(i, i), s && s.resolver(i)
                }, b(e, p, l)
            }
        }), f.each(["In", "Out"], function(e, t) {
            b.Redirects["fade" + t] = function(e, r, n, o, i, s) {
                var l = f.extend({}, r),
                    u = {
                        opacity: "In" === t ? 1 : 0
                    },
                    c = l.complete;
                l.complete = n !== o - 1 ? l.begin = null : function() {
                    c && c.call(i, i), s && s.resolver(i)
                }, l.display === a && (l.display = "In" === t ? "auto" : "none"), b(this, u, l)
            }
        }), b
    }(window.jQuery || window.Zepto || window, window, document)
});;
(function() {
    var AjaxMonitor, Bar, DocumentMonitor, ElementMonitor, ElementTracker, EventLagMonitor, Evented, Events, NoTargetError, RequestIntercept, SOURCE_KEYS, Scaler, SocketRequestTracker, XHRRequestTracker, animation, avgAmplitude, bar, cancelAnimation, cancelAnimationFrame, defaultOptions, extend, extendNative, getFromDOM, getIntercept, handlePushState, ignoreStack, init, now, options, requestAnimationFrame, result, runAnimation, scalers, shouldIgnoreURL, shouldTrack, source, sources, uniScaler, _WebSocket, _XDomainRequest, _XMLHttpRequest, _i, _intercept, _len, _pushState, _ref, _ref1, _replaceState,
        __slice = [].slice,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        },
        __indexOf = [].indexOf || function(item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

    defaultOptions = {
        catchupTime: 500,
        initialRate: .03,
        minTime: 500,
        ghostTime: 500,
        maxProgressPerFrame: 10,
        easeFactor: 1.25,
        startOnPageLoad: true,
        restartOnPushState: true,
        restartOnRequestAfter: 500,
        target: 'body',
        elements: {
            checkInterval: 100,
            selectors: ['body']
        },
        eventLag: {
            minSamples: 10,
            sampleCount: 3,
            lagThreshold: 3
        },
        ajax: {
            trackMethods: ['GET'],
            trackWebSockets: true,
            ignoreURLs: []
        }
    };

    now = function() {
        var _ref;
        return (_ref = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) != null ? _ref : +(new Date);
    };

    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    if (requestAnimationFrame == null) {
        requestAnimationFrame = function(fn) {
            return setTimeout(fn, 50);
        };
        cancelAnimationFrame = function(id) {
            return clearTimeout(id);
        };
    }

    runAnimation = function(fn) {
        var last, tick;
        last = now();
        tick = function() {
            var diff;
            diff = now() - last;
            if (diff >= 33) {
                last = now();
                return fn(diff, function() {
                    return requestAnimationFrame(tick);
                });
            } else {
                return setTimeout(tick, 33 - diff);
            }
        };
        return tick();
    };

    result = function() {
        var args, key, obj;
        obj = arguments[0], key = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        if (typeof obj[key] === 'function') {
            return obj[key].apply(obj, args);
        } else {
            return obj[key];
        }
    };

    extend = function() {
        var key, out, source, sources, val, _i, _len;
        out = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        for (_i = 0, _len = sources.length; _i < _len; _i++) {
            source = sources[_i];
            if (source) {
                for (key in source) {
                    if (!__hasProp.call(source, key)) continue;
                    val = source[key];
                    if ((out[key] != null) && typeof out[key] === 'object' && (val != null) && typeof val === 'object') {
                        extend(out[key], val);
                    } else {
                        out[key] = val;
                    }
                }
            }
        }
        return out;
    };

    avgAmplitude = function(arr) {
        var count, sum, v, _i, _len;
        sum = count = 0;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
            v = arr[_i];
            sum += Math.abs(v);
            count++;
        }
        return sum / count;
    };

    getFromDOM = function(key, json) {
        var data, e, el;
        if (key == null) {
            key = 'options';
        }
        if (json == null) {
            json = true;
        }
        el = document.querySelector("[data-pace-" + key + "]");
        if (!el) {
            return;
        }
        data = el.getAttribute("data-pace-" + key);
        if (!json) {
            return data;
        }
        try {
            return JSON.parse(data);
        } catch (_error) {
            e = _error;
            return typeof console !== "undefined" && console !== null ? console.error("Error parsing inline pace options", e) : void 0;
        }
    };

    Evented = (function() {
        function Evented() {}

        Evented.prototype.on = function(event, handler, ctx, once) {
            var _base;
            if (once == null) {
                once = false;
            }
            if (this.bindings == null) {
                this.bindings = {};
            }
            if ((_base = this.bindings)[event] == null) {
                _base[event] = [];
            }
            return this.bindings[event].push({
                handler: handler,
                ctx: ctx,
                once: once
            });
        };

        Evented.prototype.once = function(event, handler, ctx) {
            return this.on(event, handler, ctx, true);
        };

        Evented.prototype.off = function(event, handler) {
            var i, _ref, _results;
            if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
                return;
            }
            if (handler == null) {
                return delete this.bindings[event];
            } else {
                i = 0;
                _results = [];
                while (i < this.bindings[event].length) {
                    if (this.bindings[event][i].handler === handler) {
                        _results.push(this.bindings[event].splice(i, 1));
                    } else {
                        _results.push(i++);
                    }
                }
                return _results;
            }
        };

        Evented.prototype.trigger = function() {
            var args, ctx, event, handler, i, once, _ref, _ref1, _results;
            event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
                i = 0;
                _results = [];
                while (i < this.bindings[event].length) {
                    _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once;
                    handler.apply(ctx != null ? ctx : this, args);
                    if (once) {
                        _results.push(this.bindings[event].splice(i, 1));
                    } else {
                        _results.push(i++);
                    }
                }
                return _results;
            }
        };

        return Evented;

    })();

    if (window.Pace == null) {
        window.Pace = {};
    }

    extend(Pace, Evented.prototype);

    options = Pace.options = extend({}, defaultOptions, window.paceOptions, getFromDOM());

    _ref = ['ajax', 'document', 'eventLag', 'elements'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source = _ref[_i];
        if (options[source] === true) {
            options[source] = defaultOptions[source];
        }
    }

    NoTargetError = (function(_super) {
        __extends(NoTargetError, _super);

        function NoTargetError() {
            _ref1 = NoTargetError.__super__.constructor.apply(this, arguments);
            return _ref1;
        }

        return NoTargetError;

    })(Error);

    Bar = (function() {
        function Bar() {
            this.progress = 0;
        }

        Bar.prototype.getElement = function() {
            var targetElement;
            if (this.el == null) {
                targetElement = document.querySelector(options.target);
                if (!targetElement) {
                    throw new NoTargetError;
                }
                this.el = document.createElement('div');
                this.el.className = "pace pace-active";
                document.body.className = document.body.className.replace(/pace-done/g, '');
                document.body.className += ' pace-running';
                this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>';
                if (targetElement.firstChild != null) {
                    targetElement.insertBefore(this.el, targetElement.firstChild);
                } else {
                    targetElement.appendChild(this.el);
                }
            }
            return this.el;
        };

        Bar.prototype.finish = function() {
            var el;
            el = this.getElement();
            el.className = el.className.replace('pace-active', '');
            el.className += ' pace-inactive';
            document.body.className = document.body.className.replace('pace-running', '');
            return document.body.className += ' pace-done';
        };

        Bar.prototype.update = function(prog) {
            this.progress = prog;
            return this.render();
        };

        Bar.prototype.destroy = function() {
            try {
                this.getElement().parentNode.removeChild(this.getElement());
            } catch (_error) {
                NoTargetError = _error;
            }
            return this.el = void 0;
        };

        Bar.prototype.render = function() {
            var el, progressStr;
            if (document.querySelector(options.target) == null) {
                return false;
            }
            el = this.getElement();
            el.children[0].style.width = "" + this.progress + "%";
            if (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) {
                el.children[0].setAttribute('data-progress-text', "" + (this.progress | 0) + "%");
                if (this.progress >= 100) {
                    progressStr = '99';
                } else {
                    progressStr = this.progress < 10 ? "0" : "";
                    progressStr += this.progress | 0;
                }
                el.children[0].setAttribute('data-progress', "" + progressStr);
            }
            return this.lastRenderedProgress = this.progress;
        };

        Bar.prototype.done = function() {
            return this.progress >= 100;
        };

        return Bar;

    })();

    Events = (function() {
        function Events() {
            this.bindings = {};
        }

        Events.prototype.trigger = function(name, val) {
            var binding, _j, _len1, _ref2, _results;
            if (this.bindings[name] != null) {
                _ref2 = this.bindings[name];
                _results = [];
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                    binding = _ref2[_j];
                    _results.push(binding.call(this, val));
                }
                return _results;
            }
        };

        Events.prototype.on = function(name, fn) {
            var _base;
            if ((_base = this.bindings)[name] == null) {
                _base[name] = [];
            }
            return this.bindings[name].push(fn);
        };

        return Events;

    })();

    _XMLHttpRequest = window.XMLHttpRequest;

    _XDomainRequest = window.XDomainRequest;

    _WebSocket = window.WebSocket;

    extendNative = function(to, from) {
        var e, key, val, _results;
        _results = [];
        for (key in from.prototype) {
            try {
                val = from.prototype[key];
                if ((to[key] == null) && typeof val !== 'function') {
                    _results.push(to[key] = val);
                } else {
                    _results.push(void 0);
                }
            } catch (_error) {
                e = _error;
            }
        }
        return _results;
    };

    ignoreStack = [];

    Pace.ignore = function() {
        var args, fn, ret;
        fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        ignoreStack.unshift('ignore');
        ret = fn.apply(null, args);
        ignoreStack.shift();
        return ret;
    };

    Pace.track = function() {
        var args, fn, ret;
        fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        ignoreStack.unshift('track');
        ret = fn.apply(null, args);
        ignoreStack.shift();
        return ret;
    };

    shouldTrack = function(method) {
        var _ref2;
        if (method == null) {
            method = 'GET';
        }
        if (ignoreStack[0] === 'track') {
            return 'force';
        }
        if (!ignoreStack.length && options.ajax) {
            if (method === 'socket' && options.ajax.trackWebSockets) {
                return true;
            } else if (_ref2 = method.toUpperCase(), __indexOf.call(options.ajax.trackMethods, _ref2) >= 0) {
                return true;
            }
        }
        return false;
    };

    RequestIntercept = (function(_super) {
        __extends(RequestIntercept, _super);

        function RequestIntercept() {
            var monitorXHR,
                _this = this;
            RequestIntercept.__super__.constructor.apply(this, arguments);
            monitorXHR = function(req) {
                var _open;
                _open = req.open;
                return req.open = function(type, url, async) {
                    if (shouldTrack(type)) {
                        _this.trigger('request', {
                            type: type,
                            url: url,
                            request: req
                        });
                    }
                    return _open.apply(req, arguments);
                };
            };
            window.XMLHttpRequest = function(flags) {
                var req;
                req = new _XMLHttpRequest(flags);
                monitorXHR(req);
                return req;
            };
            try {
                extendNative(window.XMLHttpRequest, _XMLHttpRequest);
            } catch (_error) {}
            if (_XDomainRequest != null) {
                window.XDomainRequest = function() {
                    var req;
                    req = new _XDomainRequest;
                    monitorXHR(req);
                    return req;
                };
                try {
                    extendNative(window.XDomainRequest, _XDomainRequest);
                } catch (_error) {}
            }
            if ((_WebSocket != null) && options.ajax.trackWebSockets) {
                window.WebSocket = function(url, protocols) {
                    var req;
                    if (protocols != null) {
                        req = new _WebSocket(url, protocols);
                    } else {
                        req = new _WebSocket(url);
                    }
                    if (shouldTrack('socket')) {
                        _this.trigger('request', {
                            type: 'socket',
                            url: url,
                            protocols: protocols,
                            request: req
                        });
                    }
                    return req;
                };
                try {
                    extendNative(window.WebSocket, _WebSocket);
                } catch (_error) {}
            }
        }

        return RequestIntercept;

    })(Events);

    _intercept = null;

    getIntercept = function() {
        if (_intercept == null) {
            _intercept = new RequestIntercept;
        }
        return _intercept;
    };

    shouldIgnoreURL = function(url) {
        var pattern, _j, _len1, _ref2;
        _ref2 = options.ajax.ignoreURLs;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            pattern = _ref2[_j];
            if (typeof pattern === 'string') {
                if (url.indexOf(pattern) !== -1) {
                    return true;
                }
            } else {
                if (pattern.test(url)) {
                    return true;
                }
            }
        }
        return false;
    };

    getIntercept().on('request', function(_arg) {
        var after, args, request, type, url;
        type = _arg.type, request = _arg.request, url = _arg.url;
        if (shouldIgnoreURL(url)) {
            return;
        }
        if (!Pace.running && (options.restartOnRequestAfter !== false || shouldTrack(type) === 'force')) {
            args = arguments;
            after = options.restartOnRequestAfter || 0;
            if (typeof after === 'boolean') {
                after = 0;
            }
            return setTimeout(function() {
                var stillActive, _j, _len1, _ref2, _ref3, _results;
                if (type === 'socket') {
                    stillActive = request.readyState < 2;
                } else {
                    stillActive = (0 < (_ref2 = request.readyState) && _ref2 < 4);
                }
                if (stillActive) {
                    Pace.restart();
                    _ref3 = Pace.sources;
                    _results = [];
                    for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
                        source = _ref3[_j];
                        if (source instanceof AjaxMonitor) {
                            source.watch.apply(source, args);
                            break;
                        } else {
                            _results.push(void 0);
                        }
                    }
                    return _results;
                }
            }, after);
        }
    });

    AjaxMonitor = (function() {
        function AjaxMonitor() {
            var _this = this;
            this.elements = [];
            getIntercept().on('request', function() {
                return _this.watch.apply(_this, arguments);
            });
        }

        AjaxMonitor.prototype.watch = function(_arg) {
            var request, tracker, type, url;
            type = _arg.type, request = _arg.request, url = _arg.url;
            if (shouldIgnoreURL(url)) {
                return;
            }
            if (type === 'socket') {
                tracker = new SocketRequestTracker(request);
            } else {
                tracker = new XHRRequestTracker(request);
            }
            return this.elements.push(tracker);
        };

        return AjaxMonitor;

    })();

    XHRRequestTracker = (function() {
        function XHRRequestTracker(request) {
            var event, size, _j, _len1, _onreadystatechange, _ref2,
                _this = this;
            this.progress = 0;
            if (window.ProgressEvent != null) {
                size = null;
                request.addEventListener('progress', function(evt) {
                    if (evt.lengthComputable) {
                        return _this.progress = 100 * evt.loaded / evt.total;
                    } else {
                        return _this.progress = _this.progress + (100 - _this.progress) / 2;
                    }
                }, false);
                _ref2 = ['load', 'abort', 'timeout', 'error'];
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                    event = _ref2[_j];
                    request.addEventListener(event, function() {
                        return _this.progress = 100;
                    }, false);
                }
            } else {
                _onreadystatechange = request.onreadystatechange;
                request.onreadystatechange = function() {
                    var _ref3;
                    if ((_ref3 = request.readyState) === 0 || _ref3 === 4) {
                        _this.progress = 100;
                    } else if (request.readyState === 3) {
                        _this.progress = 50;
                    }
                    return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
                };
            }
        }

        return XHRRequestTracker;

    })();

    SocketRequestTracker = (function() {
        function SocketRequestTracker(request) {
            var event, _j, _len1, _ref2,
                _this = this;
            this.progress = 0;
            _ref2 = ['error', 'open'];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                event = _ref2[_j];
                request.addEventListener(event, function() {
                    return _this.progress = 100;
                }, false);
            }
        }

        return SocketRequestTracker;

    })();

    ElementMonitor = (function() {
        function ElementMonitor(options) {
            var selector, _j, _len1, _ref2;
            if (options == null) {
                options = {};
            }
            this.elements = [];
            if (options.selectors == null) {
                options.selectors = [];
            }
            _ref2 = options.selectors;
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                selector = _ref2[_j];
                this.elements.push(new ElementTracker(selector));
            }
        }

        return ElementMonitor;

    })();

    ElementTracker = (function() {
        function ElementTracker(selector) {
            this.selector = selector;
            this.progress = 0;
            this.check();
        }

        ElementTracker.prototype.check = function() {
            var _this = this;
            if (document.querySelector(this.selector)) {
                return this.done();
            } else {
                return setTimeout((function() {
                    return _this.check();
                }), options.elements.checkInterval);
            }
        };

        ElementTracker.prototype.done = function() {
            return this.progress = 100;
        };

        return ElementTracker;

    })();

    DocumentMonitor = (function() {
        DocumentMonitor.prototype.states = {
            loading: 0,
            interactive: 50,
            complete: 100
        };

        function DocumentMonitor() {
            var _onreadystatechange, _ref2,
                _this = this;
            this.progress = (_ref2 = this.states[document.readyState]) != null ? _ref2 : 100;
            _onreadystatechange = document.onreadystatechange;
            document.onreadystatechange = function() {
                if (_this.states[document.readyState] != null) {
                    _this.progress = _this.states[document.readyState];
                }
                return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
            };
        }

        return DocumentMonitor;

    })();

    EventLagMonitor = (function() {
        function EventLagMonitor() {
            var avg, interval, last, points, samples,
                _this = this;
            this.progress = 0;
            avg = 0;
            samples = [];
            points = 0;
            last = now();
            interval = setInterval(function() {
                var diff;
                diff = now() - last - 50;
                last = now();
                samples.push(diff);
                if (samples.length > options.eventLag.sampleCount) {
                    samples.shift();
                }
                avg = avgAmplitude(samples);
                if (++points >= options.eventLag.minSamples && avg < options.eventLag.lagThreshold) {
                    _this.progress = 100;
                    return clearInterval(interval);
                } else {
                    return _this.progress = 100 * (3 / (avg + 3));
                }
            }, 50);
        }

        return EventLagMonitor;

    })();

    Scaler = (function() {
        function Scaler(source) {
            this.source = source;
            this.last = this.sinceLastUpdate = 0;
            this.rate = options.initialRate;
            this.catchup = 0;
            this.progress = this.lastProgress = 0;
            if (this.source != null) {
                this.progress = result(this.source, 'progress');
            }
        }

        Scaler.prototype.tick = function(frameTime, val) {
            var scaling;
            if (val == null) {
                val = result(this.source, 'progress');
            }
            if (val >= 100) {
                this.done = true;
            }
            if (val === this.last) {
                this.sinceLastUpdate += frameTime;
            } else {
                if (this.sinceLastUpdate) {
                    this.rate = (val - this.last) / this.sinceLastUpdate;
                }
                this.catchup = (val - this.progress) / options.catchupTime;
                this.sinceLastUpdate = 0;
                this.last = val;
            }
            if (val > this.progress) {
                this.progress += this.catchup * frameTime;
            }
            scaling = 1 - Math.pow(this.progress / 100, options.easeFactor);
            this.progress += scaling * this.rate * frameTime;
            this.progress = Math.min(this.lastProgress + options.maxProgressPerFrame, this.progress);
            this.progress = Math.max(0, this.progress);
            this.progress = Math.min(100, this.progress);
            this.lastProgress = this.progress;
            return this.progress;
        };

        return Scaler;

    })();

    sources = null;

    scalers = null;

    bar = null;

    uniScaler = null;

    animation = null;

    cancelAnimation = null;

    Pace.running = false;

    handlePushState = function() {
        if (options.restartOnPushState) {
            return Pace.restart();
        }
    };

    if (window.history.pushState != null) {
        _pushState = window.history.pushState;
        window.history.pushState = function() {
            handlePushState();
            return _pushState.apply(window.history, arguments);
        };
    }

    if (window.history.replaceState != null) {
        _replaceState = window.history.replaceState;
        window.history.replaceState = function() {
            handlePushState();
            return _replaceState.apply(window.history, arguments);
        };
    }

    SOURCE_KEYS = {
        ajax: AjaxMonitor,
        elements: ElementMonitor,
        document: DocumentMonitor,
        eventLag: EventLagMonitor
    };

    (init = function() {
        var type, _j, _k, _len1, _len2, _ref2, _ref3, _ref4;
        Pace.sources = sources = [];
        _ref2 = ['ajax', 'elements', 'document', 'eventLag'];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            type = _ref2[_j];
            if (options[type] !== false) {
                sources.push(new SOURCE_KEYS[type](options[type]));
            }
        }
        _ref4 = (_ref3 = options.extraSources) != null ? _ref3 : [];
        for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
            source = _ref4[_k];
            sources.push(new source(options));
        }
        Pace.bar = bar = new Bar;
        scalers = [];
        return uniScaler = new Scaler;
    })();

    Pace.stop = function() {
        Pace.trigger('stop');
        Pace.running = false;
        bar.destroy();
        cancelAnimation = true;
        if (animation != null) {
            if (typeof cancelAnimationFrame === "function") {
                cancelAnimationFrame(animation);
            }
            animation = null;
        }
        return init();
    };

    Pace.restart = function() {
        Pace.trigger('restart');
        Pace.stop();
        return Pace.start();
    };

    Pace.go = function() {
        var start;
        Pace.running = true;
        bar.render();
        start = now();
        cancelAnimation = false;
        return animation = runAnimation(function(frameTime, enqueueNextFrame) {
            var avg, count, done, element, elements, i, j, remaining, scaler, scalerList, sum, _j, _k, _len1, _len2, _ref2;
            remaining = 100 - bar.progress;
            count = sum = 0;
            done = true;
            for (i = _j = 0, _len1 = sources.length; _j < _len1; i = ++_j) {
                source = sources[i];
                scalerList = scalers[i] != null ? scalers[i] : scalers[i] = [];
                elements = (_ref2 = source.elements) != null ? _ref2 : [source];
                for (j = _k = 0, _len2 = elements.length; _k < _len2; j = ++_k) {
                    element = elements[j];
                    scaler = scalerList[j] != null ? scalerList[j] : scalerList[j] = new Scaler(element);
                    done &= scaler.done;
                    if (scaler.done) {
                        continue;
                    }
                    count++;
                    sum += scaler.tick(frameTime);
                }
            }
            avg = sum / count;
            bar.update(uniScaler.tick(frameTime, avg));
            if (bar.done() || done || cancelAnimation) {
                bar.update(100);
                Pace.trigger('done');
                return setTimeout(function() {
                    bar.finish();
                    Pace.running = false;
                    return Pace.trigger('hide');
                }, Math.max(options.ghostTime, Math.max(options.minTime - (now() - start), 0)));
            } else {
                return enqueueNextFrame();
            }
        });
    };

    Pace.start = function(_options) {
        extend(options, _options);
        Pace.running = true;
        try {
            bar.render();
        } catch (_error) {
            NoTargetError = _error;
        }
        if (!document.querySelector('.pace')) {
            return setTimeout(Pace.start, 50);
        } else {
            Pace.trigger('start');
            return Pace.go();
        }
    };

    /*
    if (typeof define === 'function' && define.amd) {
        define(function() {
          return Pace;
      });
    } else */
    if (typeof exports === 'object') {
        module.exports = Pace;
    } else {
        if (options.startOnPageLoad) {
            Pace.start();
        }
    }

}).call(this);
! function(t) {
    function e() {}

    function i(t) {
        function i(e) {
            e.prototype.option || (e.prototype.option = function(e) {
                t.isPlainObject(e) && (this.options = t.extend(!0, this.options, e))
            })
        }

        function o(e, i) {
            t.fn[e] = function(o) {
                if ("string" == typeof o) {
                    for (var s = n.call(arguments, 1), a = 0, h = this.length; h > a; a++) {
                        var u = this[a],
                            p = t.data(u, e);
                        if (p)
                            if (t.isFunction(p[o]) && "_" !== o.charAt(0)) {
                                var l = p[o].apply(p, s);
                                if (void 0 !== l) return l
                            } else r("no such method '" + o + "' for " + e + " instance");
                        else r("cannot call methods on " + e + " prior to initialization; attempted to call '" + o + "'")
                    }
                    return this
                }
                return this.each(function() {
                    var n = t.data(this, e);
                    n ? (n.option(o), n._init()) : (n = new i(this, o), t.data(this, e, n))
                })
            }
        }
        if (t) {
            var r = "undefined" == typeof console ? e : function(t) {
                console.error(t)
            };
            return t.bridget = function(t, e) {
                i(e), o(t, e)
            }, t.bridget
        }
    }
    var n = Array.prototype.slice;
    i("object" == typeof exports ? require("jquery") : t.jQuery)
}(window),
function(t) {
    function e(e) {
        var i = t.event;
        return i.target = i.target || i.srcElement || e, i
    }
    var i = document.documentElement,
        n = function() {};
    i.addEventListener ? n = function(t, e, i) {
        t.addEventListener(e, i, !1)
    } : i.attachEvent && (n = function(t, i, n) {
        t[i + n] = n.handleEvent ? function() {
            var i = e(t);
            n.handleEvent.call(n, i)
        } : function() {
            var i = e(t);
            n.call(t, i)
        }, t.attachEvent("on" + i, t[i + n])
    });
    var o = function() {};
    i.removeEventListener ? o = function(t, e, i) {
        t.removeEventListener(e, i, !1)
    } : i.detachEvent && (o = function(t, e, i) {
        t.detachEvent("on" + e, t[e + i]);
        try {
            delete t[e + i]
        } catch (n) {
            t[e + i] = void 0
        }
    });
    var r = {
        bind: n,
        unbind: o
    };
    "object" == typeof exports ? module.exports = r : t.eventie = r
}(this),
function(t) {
    function e(t) {
        "function" == typeof t && (e.isReady ? t() : s.push(t))
    }

    function i(t) {
        var i = "readystatechange" === t.type && "complete" !== r.readyState;
        e.isReady || i || n()
    }

    function n() {
        e.isReady = !0;
        for (var t = 0, i = s.length; i > t; t++) {
            var n = s[t];
            n()
        }
    }

    function o(o) {
        return "complete" === r.readyState ? n() : (o.bind(r, "DOMContentLoaded", i), o.bind(r, "readystatechange", i), o.bind(t, "load", i)), e
    }
    var r = t.document,
        s = [];
    e.isReady = !1, "object" == typeof exports ? module.exports = o(require("eventie")) : t.docReady = o(t.eventie)
}(window),
function() {
    function t() {}

    function e(t, e) {
        for (var i = t.length; i--;)
            if (t[i].listener === e) return i;
        return -1
    }

    function i(t) {
        return function() {
            return this[t].apply(this, arguments)
        }
    }
    var n = t.prototype,
        o = this,
        r = o.EventEmitter;
    n.getListeners = function(t) {
        var e, i, n = this._getEvents();
        if (t instanceof RegExp) {
            e = {};
            for (i in n) n.hasOwnProperty(i) && t.test(i) && (e[i] = n[i])
        } else e = n[t] || (n[t] = []);
        return e
    }, n.flattenListeners = function(t) {
        var e, i = [];
        for (e = 0; e < t.length; e += 1) i.push(t[e].listener);
        return i
    }, n.getListenersAsObject = function(t) {
        var e, i = this.getListeners(t);
        return i instanceof Array && (e = {}, e[t] = i), e || i
    }, n.addListener = function(t, i) {
        var n, o = this.getListenersAsObject(t),
            r = "object" == typeof i;
        for (n in o) o.hasOwnProperty(n) && -1 === e(o[n], i) && o[n].push(r ? i : {
            listener: i,
            once: !1
        });
        return this
    }, n.on = i("addListener"), n.addOnceListener = function(t, e) {
        return this.addListener(t, {
            listener: e,
            once: !0
        })
    }, n.once = i("addOnceListener"), n.defineEvent = function(t) {
        return this.getListeners(t), this
    }, n.defineEvents = function(t) {
        for (var e = 0; e < t.length; e += 1) this.defineEvent(t[e]);
        return this
    }, n.removeListener = function(t, i) {
        var n, o, r = this.getListenersAsObject(t);
        for (o in r) r.hasOwnProperty(o) && (n = e(r[o], i), -1 !== n && r[o].splice(n, 1));
        return this
    }, n.off = i("removeListener"), n.addListeners = function(t, e) {
        return this.manipulateListeners(!1, t, e)
    }, n.removeListeners = function(t, e) {
        return this.manipulateListeners(!0, t, e)
    }, n.manipulateListeners = function(t, e, i) {
        var n, o, r = t ? this.removeListener : this.addListener,
            s = t ? this.removeListeners : this.addListeners;
        if ("object" != typeof e || e instanceof RegExp)
            for (n = i.length; n--;) r.call(this, e, i[n]);
        else
            for (n in e) e.hasOwnProperty(n) && (o = e[n]) && ("function" == typeof o ? r.call(this, n, o) : s.call(this, n, o));
        return this
    }, n.removeEvent = function(t) {
        var e, i = typeof t,
            n = this._getEvents();
        if ("string" === i) delete n[t];
        else if (t instanceof RegExp)
            for (e in n) n.hasOwnProperty(e) && t.test(e) && delete n[e];
        else delete this._events;
        return this
    }, n.removeAllListeners = i("removeEvent"), n.emitEvent = function(t, e) {
        var i, n, o, r, s = this.getListenersAsObject(t);
        for (o in s)
            if (s.hasOwnProperty(o))
                for (n = s[o].length; n--;) i = s[o][n], i.once === !0 && this.removeListener(t, i.listener), r = i.listener.apply(this, e || []), r === this._getOnceReturnValue() && this.removeListener(t, i.listener);
        return this
    }, n.trigger = i("emitEvent"), n.emit = function(t) {
        var e = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(t, e)
    }, n.setOnceReturnValue = function(t) {
        return this._onceReturnValue = t, this
    }, n._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
    }, n._getEvents = function() {
        return this._events || (this._events = {})
    }, t.noConflict = function() {
        return o.EventEmitter = r, t
    }, "object" == typeof module && module.exports ? module.exports = t : o.EventEmitter = t
}.call(this),
    function(t) {
        function e(t) {
            if (t) {
                if ("string" == typeof n[t]) return t;
                t = t.charAt(0).toUpperCase() + t.slice(1);
                for (var e, o = 0, r = i.length; r > o; o++)
                    if (e = i[o] + t, "string" == typeof n[e]) return e
            }
        }
        var i = "Webkit Moz ms Ms O".split(" "),
            n = document.documentElement.style;
        "object" == typeof exports ? module.exports = e : t.getStyleProperty = e
    }(window),
    function(t) {
        function e(t) {
            var e = parseFloat(t),
                i = -1 === t.indexOf("%") && !isNaN(e);
            return i && e
        }

        function i() {}

        function n() {
            for (var t = {
                    width: 0,
                    height: 0,
                    innerWidth: 0,
                    innerHeight: 0,
                    outerWidth: 0,
                    outerHeight: 0
                }, e = 0, i = s.length; i > e; e++) {
                var n = s[e];
                t[n] = 0
            }
            return t
        }

        function o(i) {
            function o() {
                if (!c) {
                    c = !0;
                    var n = t.getComputedStyle;
                    if (u = function() {
                            var t = n ? function(t) {
                                return n(t, null)
                            } : function(t) {
                                return t.currentStyle
                            };
                            return function(e) {
                                var i = t(e);
                                return i || r("Style returned " + i + ". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"), i
                            }
                        }(), p = i("boxSizing")) {
                        var o = document.createElement("div");
                        o.style.width = "200px", o.style.padding = "1px 2px 3px 4px", o.style.borderStyle = "solid", o.style.borderWidth = "1px 2px 3px 4px", o.style[p] = "border-box";
                        var s = document.body || document.documentElement;
                        s.appendChild(o);
                        var a = u(o);
                        l = 200 === e(a.width), s.removeChild(o)
                    }
                }
            }

            function a(t) {
                if (o(), "string" == typeof t && (t = document.querySelector(t)), t && "object" == typeof t && t.nodeType) {
                    var i = u(t);
                    if ("none" === i.display) return n();
                    var r = {};
                    r.width = t.offsetWidth, r.height = t.offsetHeight;
                    for (var a = r.isBorderBox = !(!p || !i[p] || "border-box" !== i[p]), c = 0, f = s.length; f > c; c++) {
                        var d = s[c],
                            m = i[d];
                        m = h(t, m);
                        var y = parseFloat(m);
                        r[d] = isNaN(y) ? 0 : y
                    }
                    var g = r.paddingLeft + r.paddingRight,
                        v = r.paddingTop + r.paddingBottom,
                        b = r.marginLeft + r.marginRight,
                        _ = r.marginTop + r.marginBottom,
                        L = r.borderLeftWidth + r.borderRightWidth,
                        E = r.borderTopWidth + r.borderBottomWidth,
                        x = a && l,
                        z = e(i.width);
                    z !== !1 && (r.width = z + (x ? 0 : g + L));
                    var S = e(i.height);
                    return S !== !1 && (r.height = S + (x ? 0 : v + E)), r.innerWidth = r.width - (g + L), r.innerHeight = r.height - (v + E), r.outerWidth = r.width + b, r.outerHeight = r.height + _, r
                }
            }

            function h(e, i) {
                if (t.getComputedStyle || -1 === i.indexOf("%")) return i;
                var n = e.style,
                    o = n.left,
                    r = e.runtimeStyle,
                    s = r && r.left;
                return s && (r.left = e.currentStyle.left), n.left = i, i = n.pixelLeft, n.left = o, s && (r.left = s), i
            }
            var u, p, l, c = !1;
            return a
        }
        var r = "undefined" == typeof console ? i : function(t) {
                console.error(t)
            },
            s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
        "object" == typeof exports ? module.exports = o(require("desandro-get-style-property")) : t.getSize = o(t.getStyleProperty)
    }(window),
    function(t) {
        function e(t, e) {
            return t[s](e)
        }

        function i(t) {
            if (!t.parentNode) {
                var e = document.createDocumentFragment();
                e.appendChild(t)
            }
        }

        function n(t, e) {
            i(t);
            for (var n = t.parentNode.querySelectorAll(e), o = 0, r = n.length; r > o; o++)
                if (n[o] === t) return !0;
            return !1
        }

        function o(t, n) {
            return i(t), e(t, n)
        }
        var r, s = function() {
            if (t.matchesSelector) return "matchesSelector";
            for (var e = ["webkit", "moz", "ms", "o"], i = 0, n = e.length; n > i; i++) {
                var o = e[i],
                    r = o + "MatchesSelector";
                if (t[r]) return r
            }
        }();
        if (s) {
            var a = document.createElement("div"),
                h = e(a, "div");
            r = h ? e : o
        } else r = n;
        "object" == typeof exports ? module.exports = r : window.matchesSelector = r
    }(Element.prototype),
    function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function i(t) {
            for (var e in t) return !1;
            return e = null, !0
        }

        function n(t) {
            return t.replace(/([A-Z])/g, function(t) {
                return "-" + t.toLowerCase()
            })
        }

        function o(t, o, r) {
            function a(t, e) {
                t && (this.element = t, this.layout = e, this.position = {
                    x: 0,
                    y: 0
                }, this._create())
            }
            var h = r("transition"),
                u = r("transform"),
                p = h && u,
                l = !!r("perspective"),
                c = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "otransitionend",
                    transition: "transitionend"
                }[h],
                f = ["transform", "transition", "transitionDuration", "transitionProperty"],
                d = function() {
                    for (var t = {}, e = 0, i = f.length; i > e; e++) {
                        var n = f[e],
                            o = r(n);
                        o && o !== n && (t[n] = o)
                    }
                    return t
                }();
            e(a.prototype, t.prototype), a.prototype._create = function() {
                this._transn = {
                    ingProperties: {},
                    clean: {},
                    onEnd: {}
                }, this.css({
                    position: "absolute"
                })
            }, a.prototype.handleEvent = function(t) {
                var e = "on" + t.type;
                this[e] && this[e](t)
            }, a.prototype.getSize = function() {
                this.size = o(this.element)
            }, a.prototype.css = function(t) {
                var e = this.element.style;
                for (var i in t) {
                    var n = d[i] || i;
                    e[n] = t[i]
                }
            }, a.prototype.getPosition = function() {
                var t = s(this.element),
                    e = this.layout.options,
                    i = e.isOriginLeft,
                    n = e.isOriginTop,
                    o = parseInt(t[i ? "left" : "right"], 10),
                    r = parseInt(t[n ? "top" : "bottom"], 10);
                o = isNaN(o) ? 0 : o, r = isNaN(r) ? 0 : r;
                var a = this.layout.size;
                o -= i ? a.paddingLeft : a.paddingRight, r -= n ? a.paddingTop : a.paddingBottom, this.position.x = o, this.position.y = r
            }, a.prototype.layoutPosition = function() {
                var t = this.layout.size,
                    e = this.layout.options,
                    i = {};
                e.isOriginLeft ? (i.left = this.position.x + t.paddingLeft + "px", i.right = "") : (i.right = this.position.x + t.paddingRight + "px", i.left = ""), e.isOriginTop ? (i.top = this.position.y + t.paddingTop + "px", i.bottom = "") : (i.bottom = this.position.y + t.paddingBottom + "px", i.top = ""), this.css(i), this.emitEvent("layout", [this])
            };
            var m = l ? function(t, e) {
                return "translate3d(" + t + "px, " + e + "px, 0)"
            } : function(t, e) {
                return "translate(" + t + "px, " + e + "px)"
            };
            a.prototype._transitionTo = function(t, e) {
                this.getPosition();
                var i = this.position.x,
                    n = this.position.y,
                    o = parseInt(t, 10),
                    r = parseInt(e, 10),
                    s = o === this.position.x && r === this.position.y;
                if (this.setPosition(t, e), s && !this.isTransitioning) return void this.layoutPosition();
                var a = t - i,
                    h = e - n,
                    u = {},
                    p = this.layout.options;
                a = p.isOriginLeft ? a : -a, h = p.isOriginTop ? h : -h, u.transform = m(a, h), this.transition({
                    to: u,
                    onTransitionEnd: {
                        transform: this.layoutPosition
                    },
                    isCleaning: !0
                })
            }, a.prototype.goTo = function(t, e) {
                this.setPosition(t, e), this.layoutPosition()
            }, a.prototype.moveTo = p ? a.prototype._transitionTo : a.prototype.goTo, a.prototype.setPosition = function(t, e) {
                this.position.x = parseInt(t, 10), this.position.y = parseInt(e, 10)
            }, a.prototype._nonTransition = function(t) {
                this.css(t.to), t.isCleaning && this._removeStyles(t.to);
                for (var e in t.onTransitionEnd) t.onTransitionEnd[e].call(this)
            }, a.prototype._transition = function(t) {
                if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(t);
                var e = this._transn;
                for (var i in t.onTransitionEnd) e.onEnd[i] = t.onTransitionEnd[i];
                for (i in t.to) e.ingProperties[i] = !0, t.isCleaning && (e.clean[i] = !0);
                if (t.from) {
                    this.css(t.from);
                    var n = this.element.offsetHeight;
                    n = null
                }
                this.enableTransition(t.to), this.css(t.to), this.isTransitioning = !0
            };
            var y = u && n(u) + ",opacity";
            a.prototype.enableTransition = function() {
                this.isTransitioning || (this.css({
                    transitionProperty: y,
                    transitionDuration: this.layout.options.transitionDuration
                }), this.element.addEventListener(c, this, !1))
            }, a.prototype.transition = a.prototype[h ? "_transition" : "_nonTransition"], a.prototype.onwebkitTransitionEnd = function(t) {
                this.ontransitionend(t)
            }, a.prototype.onotransitionend = function(t) {
                this.ontransitionend(t)
            };
            var g = {
                "-webkit-transform": "transform",
                "-moz-transform": "transform",
                "-o-transform": "transform"
            };
            a.prototype.ontransitionend = function(t) {
                if (t.target === this.element) {
                    var e = this._transn,
                        n = g[t.propertyName] || t.propertyName;
                    if (delete e.ingProperties[n], i(e.ingProperties) && this.disableTransition(), n in e.clean && (this.element.style[t.propertyName] = "", delete e.clean[n]), n in e.onEnd) {
                        var o = e.onEnd[n];
                        o.call(this), delete e.onEnd[n]
                    }
                    this.emitEvent("transitionEnd", [this])
                }
            }, a.prototype.disableTransition = function() {
                this.removeTransitionStyles(), this.element.removeEventListener(c, this, !1), this.isTransitioning = !1
            }, a.prototype._removeStyles = function(t) {
                var e = {};
                for (var i in t) e[i] = "";
                this.css(e)
            };
            var v = {
                transitionProperty: "",
                transitionDuration: ""
            };
            return a.prototype.removeTransitionStyles = function() {
                this.css(v)
            }, a.prototype.removeElem = function() {
                this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [this])
            }, a.prototype.remove = function() {
                if (!h || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
                var t = this;
                this.on("transitionEnd", function() {
                    return t.removeElem(), !0
                }), this.hide()
            }, a.prototype.reveal = function() {
                delete this.isHidden, this.css({
                    display: ""
                });
                var t = this.layout.options;
                this.transition({
                    from: t.hiddenStyle,
                    to: t.visibleStyle,
                    isCleaning: !0
                })
            }, a.prototype.hide = function() {
                this.isHidden = !0, this.css({
                    display: ""
                });
                var t = this.layout.options;
                this.transition({
                    from: t.visibleStyle,
                    to: t.hiddenStyle,
                    isCleaning: !0,
                    onTransitionEnd: {
                        opacity: function() {
                            this.isHidden && this.css({
                                display: "none"
                            })
                        }
                    }
                })
            }, a.prototype.destroy = function() {
                this.css({
                    position: "",
                    left: "",
                    right: "",
                    top: "",
                    bottom: "",
                    transition: "",
                    transform: ""
                })
            }, a
        }
        var r = t.getComputedStyle,
            s = r ? function(t) {
                return r(t, null)
            } : function(t) {
                return t.currentStyle
            };
        "object" == typeof exports ? module.exports = o(require("wolfy87-eventemitter"), require("get-size"), require("desandro-get-style-property")) : (t.Outlayer = {}, t.Outlayer.Item = o(t.EventEmitter, t.getSize, t.getStyleProperty))
    }(window),
    function(t) {
        function e(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function i(t) {
            return "[object Array]" === l.call(t)
        }

        function n(t) {
            var e = [];
            if (i(t)) e = t;
            else if (t && "number" == typeof t.length)
                for (var n = 0, o = t.length; o > n; n++) e.push(t[n]);
            else e.push(t);
            return e
        }

        function o(t, e) {
            var i = f(e, t); - 1 !== i && e.splice(i, 1)
        }

        function r(t) {
            return t.replace(/(.)([A-Z])/g, function(t, e, i) {
                return e + "-" + i
            }).toLowerCase()
        }

        function s(i, s, l, f, d, m) {
            function y(t, i) {
                if ("string" == typeof t && (t = a.querySelector(t)), !t || !c(t)) return void(h && h.error("Bad " + this.constructor.namespace + " element: " + t));
                this.element = t, this.options = e({}, this.constructor.defaults), this.option(i);
                var n = ++g;
                this.element.outlayerGUID = n, v[n] = this, this._create(), this.options.isInitLayout && this.layout()
            }
            var g = 0,
                v = {};
            return y.namespace = "outlayer", y.Item = m, y.defaults = {
                containerStyle: {
                    position: "relative"
                },
                isInitLayout: !0,
                isOriginLeft: !0,
                isOriginTop: !0,
                isResizeBound: !0,
                isResizingContainer: !0,
                transitionDuration: "0.4s",
                hiddenStyle: {
                    opacity: 0,
                    transform: "scale(0.001)"
                },
                visibleStyle: {
                    opacity: 1,
                    transform: "scale(1)"
                }
            }, e(y.prototype, l.prototype), y.prototype.option = function(t) {
                e(this.options, t)
            }, y.prototype._create = function() {
                this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), e(this.element.style, this.options.containerStyle), this.options.isResizeBound && this.bindResize()
            }, y.prototype.reloadItems = function() {
                this.items = this._itemize(this.element.children)
            }, y.prototype._itemize = function(t) {
                for (var e = this._filterFindItemElements(t), i = this.constructor.Item, n = [], o = 0, r = e.length; r > o; o++) {
                    var s = e[o],
                        a = new i(s, this);
                    n.push(a)
                }
                return n
            }, y.prototype._filterFindItemElements = function(t) {
                t = n(t);
                for (var e = this.options.itemSelector, i = [], o = 0, r = t.length; r > o; o++) {
                    var s = t[o];
                    if (c(s))
                        if (e) {
                            d(s, e) && i.push(s);
                            for (var a = s.querySelectorAll(e), h = 0, u = a.length; u > h; h++) i.push(a[h])
                        } else i.push(s)
                }
                return i
            }, y.prototype.getItemElements = function() {
                for (var t = [], e = 0, i = this.items.length; i > e; e++) t.push(this.items[e].element);
                return t
            }, y.prototype.layout = function() {
                this._resetLayout(), this._manageStamps();
                var t = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
                this.layoutItems(this.items, t), this._isLayoutInited = !0
            }, y.prototype._init = y.prototype.layout, y.prototype._resetLayout = function() {
                this.getSize()
            }, y.prototype.getSize = function() {
                this.size = f(this.element)
            }, y.prototype._getMeasurement = function(t, e) {
                var i, n = this.options[t];
                n ? ("string" == typeof n ? i = this.element.querySelector(n) : c(n) && (i = n), this[t] = i ? f(i)[e] : n) : this[t] = 0
            }, y.prototype.layoutItems = function(t, e) {
                t = this._getItemsForLayout(t), this._layoutItems(t, e), this._postLayout()
            }, y.prototype._getItemsForLayout = function(t) {
                for (var e = [], i = 0, n = t.length; n > i; i++) {
                    var o = t[i];
                    o.isIgnored || e.push(o)
                }
                return e
            }, y.prototype._layoutItems = function(t, e) {
                function i() {
                    n.emitEvent("layoutComplete", [n, t])
                }
                var n = this;
                if (!t || !t.length) return void i();
                this._itemsOn(t, "layout", i);
                for (var o = [], r = 0, s = t.length; s > r; r++) {
                    var a = t[r],
                        h = this._getItemLayoutPosition(a);
                    h.item = a, h.isInstant = e || a.isLayoutInstant, o.push(h)
                }
                this._processLayoutQueue(o)
            }, y.prototype._getItemLayoutPosition = function() {
                return {
                    x: 0,
                    y: 0
                }
            }, y.prototype._processLayoutQueue = function(t) {
                for (var e = 0, i = t.length; i > e; e++) {
                    var n = t[e];
                    this._positionItem(n.item, n.x, n.y, n.isInstant)
                }
            }, y.prototype._positionItem = function(t, e, i, n) {
                n ? t.goTo(e, i) : t.moveTo(e, i)
            }, y.prototype._postLayout = function() {
                this.resizeContainer()
            }, y.prototype.resizeContainer = function() {
                if (this.options.isResizingContainer) {
                    var t = this._getContainerSize();
                    t && (this._setContainerMeasure(t.width, !0), this._setContainerMeasure(t.height, !1))
                }
            }, y.prototype._getContainerSize = p, y.prototype._setContainerMeasure = function(t, e) {
                if (void 0 !== t) {
                    var i = this.size;
                    i.isBorderBox && (t += e ? i.paddingLeft + i.paddingRight + i.borderLeftWidth + i.borderRightWidth : i.paddingBottom + i.paddingTop + i.borderTopWidth + i.borderBottomWidth), t = Math.max(t, 0), this.element.style[e ? "width" : "height"] = t + "px"
                }
            }, y.prototype._itemsOn = function(t, e, i) {
                function n() {
                    return o++, o === r && i.call(s), !0
                }
                for (var o = 0, r = t.length, s = this, a = 0, h = t.length; h > a; a++) {
                    var u = t[a];
                    u.on(e, n)
                }
            }, y.prototype.ignore = function(t) {
                var e = this.getItem(t);
                e && (e.isIgnored = !0)
            }, y.prototype.unignore = function(t) {
                var e = this.getItem(t);
                e && delete e.isIgnored
            }, y.prototype.stamp = function(t) {
                if (t = this._find(t)) {
                    this.stamps = this.stamps.concat(t);
                    for (var e = 0, i = t.length; i > e; e++) {
                        var n = t[e];
                        this.ignore(n)
                    }
                }
            }, y.prototype.unstamp = function(t) {
                if (t = this._find(t))
                    for (var e = 0, i = t.length; i > e; e++) {
                        var n = t[e];
                        o(n, this.stamps), this.unignore(n)
                    }
            }, y.prototype._find = function(t) {
                return t ? ("string" == typeof t && (t = this.element.querySelectorAll(t)), t = n(t)) : void 0
            }, y.prototype._manageStamps = function() {
                if (this.stamps && this.stamps.length) {
                    this._getBoundingRect();
                    for (var t = 0, e = this.stamps.length; e > t; t++) {
                        var i = this.stamps[t];
                        this._manageStamp(i)
                    }
                }
            }, y.prototype._getBoundingRect = function() {
                var t = this.element.getBoundingClientRect(),
                    e = this.size;
                this._boundingRect = {
                    left: t.left + e.paddingLeft + e.borderLeftWidth,
                    top: t.top + e.paddingTop + e.borderTopWidth,
                    right: t.right - (e.paddingRight + e.borderRightWidth),
                    bottom: t.bottom - (e.paddingBottom + e.borderBottomWidth)
                }
            }, y.prototype._manageStamp = p, y.prototype._getElementOffset = function(t) {
                var e = t.getBoundingClientRect(),
                    i = this._boundingRect,
                    n = f(t),
                    o = {
                        left: e.left - i.left - n.marginLeft,
                        top: e.top - i.top - n.marginTop,
                        right: i.right - e.right - n.marginRight,
                        bottom: i.bottom - e.bottom - n.marginBottom
                    };
                return o
            }, y.prototype.handleEvent = function(t) {
                var e = "on" + t.type;
                this[e] && this[e](t)
            }, y.prototype.bindResize = function() {
                this.isResizeBound || (i.bind(t, "resize", this), this.isResizeBound = !0)
            }, y.prototype.unbindResize = function() {
                this.isResizeBound && i.unbind(t, "resize", this), this.isResizeBound = !1
            }, y.prototype.onresize = function() {
                function t() {
                    e.resize(), delete e.resizeTimeout
                }
                this.resizeTimeout && clearTimeout(this.resizeTimeout);
                var e = this;
                this.resizeTimeout = setTimeout(t, 100)
            }, y.prototype.resize = function() {
                this.isResizeBound && this.needsResizeLayout() && this.layout()
            }, y.prototype.needsResizeLayout = function() {
                var t = f(this.element),
                    e = this.size && t;
                return e && t.innerWidth !== this.size.innerWidth
            }, y.prototype.addItems = function(t) {
                var e = this._itemize(t);
                return e.length && (this.items = this.items.concat(e)), e
            }, y.prototype.appended = function(t) {
                var e = this.addItems(t);
                e.length && (this.layoutItems(e, !0), this.reveal(e))
            }, y.prototype.prepended = function(t) {
                var e = this._itemize(t);
                if (e.length) {
                    var i = this.items.slice(0);
                    this.items = e.concat(i), this._resetLayout(), this._manageStamps(), this.layoutItems(e, !0), this.reveal(e), this.layoutItems(i)
                }
            }, y.prototype.reveal = function(t) {
                var e = t && t.length;
                if (e)
                    for (var i = 0; e > i; i++) {
                        var n = t[i];
                        n.reveal()
                    }
            }, y.prototype.hide = function(t) {
                var e = t && t.length;
                if (e)
                    for (var i = 0; e > i; i++) {
                        var n = t[i];
                        n.hide()
                    }
            }, y.prototype.getItem = function(t) {
                for (var e = 0, i = this.items.length; i > e; e++) {
                    var n = this.items[e];
                    if (n.element === t) return n
                }
            }, y.prototype.getItems = function(t) {
                if (t && t.length) {
                    for (var e = [], i = 0, n = t.length; n > i; i++) {
                        var o = t[i],
                            r = this.getItem(o);
                        r && e.push(r)
                    }
                    return e
                }
            }, y.prototype.remove = function(t) {
                t = n(t);
                var e = this.getItems(t);
                if (e && e.length) {
                    this._itemsOn(e, "remove", function() {
                        this.emitEvent("removeComplete", [this, e])
                    });
                    for (var i = 0, r = e.length; r > i; i++) {
                        var s = e[i];
                        s.remove(), o(s, this.items)
                    }
                }
            }, y.prototype.destroy = function() {
                var t = this.element.style;
                t.height = "", t.position = "", t.width = "";
                for (var e = 0, i = this.items.length; i > e; e++) {
                    var n = this.items[e];
                    n.destroy()
                }
                this.unbindResize();
                var o = this.element.outlayerGUID;
                delete v[o], delete this.element.outlayerGUID, u && u.removeData(this.element, this.constructor.namespace)
            }, y.data = function(t) {
                var e = t && t.outlayerGUID;
                return e && v[e]
            }, y.create = function(t, i) {
                function n() {
                    y.apply(this, arguments)
                }
                return Object.create ? n.prototype = Object.create(y.prototype) : e(n.prototype, y.prototype), n.prototype.constructor = n, n.defaults = e({}, y.defaults), e(n.defaults, i), n.prototype.settings = {}, n.namespace = t, n.data = y.data, n.Item = function() {
                    m.apply(this, arguments)
                }, n.Item.prototype = new m, s(function() {
                    for (var e = r(t), i = a.querySelectorAll(".js-" + e), o = "data-" + e + "-options", s = 0, p = i.length; p > s; s++) {
                        var l, c = i[s],
                            f = c.getAttribute(o);
                        try {
                            l = f && JSON.parse(f)
                        } catch (d) {
                            h && h.error("Error parsing " + o + " on " + c.nodeName.toLowerCase() + (c.id ? "#" + c.id : "") + ": " + d);
                            continue
                        }
                        var m = new n(c, l);
                        u && u.data(c, t, m)
                    }
                }), u && u.bridget && u.bridget(t, n), n
            }, y.Item = m, y
        }
        var a = t.document,
            h = t.console,
            u = t.jQuery,
            p = function() {},
            l = Object.prototype.toString,
            c = "function" == typeof HTMLElement || "object" == typeof HTMLElement ? function(t) {
                return t instanceof HTMLElement
            } : function(t) {
                return t && "object" == typeof t && 1 === t.nodeType && "string" == typeof t.nodeName
            },
            f = Array.prototype.indexOf ? function(t, e) {
                return t.indexOf(e)
            } : function(t, e) {
                for (var i = 0, n = t.length; n > i; i++)
                    if (t[i] === e) return i;
                return -1
            };
        "object" == typeof exports ? module.exports = s(require("eventie"), require("doc-ready"), require("wolfy87-eventemitter"), require("get-size"), require("desandro-matches-selector"), require("./item")) : t.Outlayer = s(t.eventie, t.docReady, t.EventEmitter, t.getSize, t.matchesSelector, t.Outlayer.Item)
    }(window),
    function(t) {
        function e(t, e) {
            var n = t.create("masonry");
            return n.prototype._resetLayout = function() {
                this.getSize(), this._getMeasurement("columnWidth", "outerWidth"), this._getMeasurement("gutter", "outerWidth"), this.measureColumns();
                var t = this.cols;
                for (this.colYs = []; t--;) this.colYs.push(0);
                this.maxY = 0
            }, n.prototype.measureColumns = function() {
                if (this.getContainerWidth(), !this.columnWidth) {
                    var t = this.items[0],
                        i = t && t.element;
                    this.columnWidth = i && e(i).outerWidth || this.containerWidth
                }
                this.columnWidth += this.gutter, this.cols = Math.floor((this.containerWidth + this.gutter) / this.columnWidth), this.cols = Math.max(this.cols, 1)
            }, n.prototype.getContainerWidth = function() {
                var t = this.options.isFitWidth ? this.element.parentNode : this.element,
                    i = e(t);
                this.containerWidth = i && i.innerWidth
            }, n.prototype._getItemLayoutPosition = function(t) {
                t.getSize();
                var e = t.size.outerWidth % this.columnWidth,
                    n = e && 1 > e ? "round" : "ceil",
                    o = Math[n](t.size.outerWidth / this.columnWidth);
                o = Math.min(o, this.cols);
                for (var r = this._getColGroup(o), s = Math.min.apply(Math, r), a = i(r, s), h = {
                        x: this.columnWidth * a,
                        y: s
                    }, u = s + t.size.outerHeight, p = this.cols + 1 - r.length, l = 0; p > l; l++) this.colYs[a + l] = u;
                return h
            }, n.prototype._getColGroup = function(t) {
                if (2 > t) return this.colYs;
                for (var e = [], i = this.cols + 1 - t, n = 0; i > n; n++) {
                    var o = this.colYs.slice(n, n + t);
                    e[n] = Math.max.apply(Math, o)
                }
                return e
            }, n.prototype._manageStamp = function(t) {
                var i = e(t),
                    n = this._getElementOffset(t),
                    o = this.options.isOriginLeft ? n.left : n.right,
                    r = o + i.outerWidth,
                    s = Math.floor(o / this.columnWidth);
                s = Math.max(0, s);
                var a = Math.floor(r / this.columnWidth);
                a -= r % this.columnWidth ? 0 : 1, a = Math.min(this.cols - 1, a);
                for (var h = (this.options.isOriginTop ? n.top : n.bottom) + i.outerHeight, u = s; a >= u; u++) this.colYs[u] = Math.max(h, this.colYs[u])
            }, n.prototype._getContainerSize = function() {
                this.maxY = Math.max.apply(Math, this.colYs);
                var t = {
                    height: this.maxY
                };
                return this.options.isFitWidth && (t.width = this._getContainerFitWidth()), t
            }, n.prototype._getContainerFitWidth = function() {
                for (var t = 0, e = this.cols; --e && 0 === this.colYs[e];) t++;
                return (this.cols - t) * this.columnWidth - this.gutter
            }, n.prototype.needsResizeLayout = function() {
                var t = this.containerWidth;
                return this.getContainerWidth(), t !== this.containerWidth
            }, n
        }
        var i = Array.prototype.indexOf ? function(t, e) {
            return t.indexOf(e)
        } : function(t, e) {
            for (var i = 0, n = t.length; n > i; i++) {
                var o = t[i];
                if (o === e) return i
            }
            return -1
        };
        "object" == typeof exports ? module.exports = e(require("outlayer"), require("get-size")) : t.Masonry = e(t.Outlayer, t.getSize)
    }(window);;
(function() {
    var t, i = function(t, i) {
        return function() {
            return t.apply(i, arguments)
        }
    };
    t = function() {
        function t() {
            this._confirmImagesPresence = i(this._confirmImagesPresence, this), this._confirmMissingImagesPresence = i(this._confirmMissingImagesPresence, this), this._confirmLatencyReached = i(this._confirmLatencyReached, this), this._trytolaunch = i(this._trytolaunch, this), this.missingimagesloaded = !0, this.imagesloaded = !0, this.latencyreached = !1, viewport.unload($.proxy(this.quiApplication, this))
        }
        return t.prototype.LAUNCHING_LATENCY = 2e3, t.prototype.launchApplication = function() {
            return $application.addClass("loadstatus__unload").trigger(LMDEvents.applicationWillLaunch), this.waitforlaunching = setInterval(this._trytolaunch, 100), setTimeout(this._confirmLatencyReached, this.LAUNCHING_LATENCY), $("body").imagesLoaded(this._confirmMissingImagesPresence), $("html").on("lazycomplete", this._confirmImagesPresence), $application.removeClass("loadstatus__unload").addClass("loadstatus__loading").trigger(LMDEvents.applicationDidLaunch)
        }, t.prototype.quitApplication = function() {
            return $application.trigger(LMDEvents.applicationWillQuit)
        }, t.prototype._trytolaunch = function() {
            return this.missingimagesloaded && this.imagesloaded && this.latencyreached ? ($application.removeClass("loadstatus__loading").addClass("loadstatus__loaded").trigger(LMDEvents.applicationDidAppear), clearInterval(this.waitforlaunching)) : void 0
        }, t.prototype._confirmLatencyReached = function() {
            return this.latencyreached = !0
        }, t.prototype._confirmMissingImagesPresence = function() {
            return this.missingimagesloaded = !0, $application.trigger(LMDEvents.applicationWillAppear)
        }, t.prototype._confirmImagesPresence = function() {
            return this.imagesloaded = !0
        }, t
    }(), window.LMDLoader = t
}).call(this);;
! function(o, t) {
    "use strict";

    function n(o, t) {
        var n = {};
        for (var i in o) n[i] = o[i];
        for (var i in t) n[i] = t[i];
        return n
    }
    t.fn.scrollTo = function(o) {
        var i = {
            position: 0,
            callback: null,
            animated: !1,
            duration: 1e3
        };
        o || (o = {}), o = n(i, o), o.animated || (o.duration = 10), t(this).stop().animate({
            scrollTop: o.position
        }, o.duration, "easeInOutSine", o.callback)
    }, t.fn.scrollToID = function() {
        var o = t(t(this).attr("href")),
            n = o.data("scrolloffset") ? o.data("scrolloffset") : 0;
        t("html,body").scrollTo({
            duration: 1e3,
            animated: !0,
            position: o.offset().top - n
        })
    }, t.fn.onClickScrollToID = function() {
        t(this).on("click", function(o) {
            o.preventDefault(), t(o.currentTarget).scrollToID()
        })
    }
}(window, jQuery);;
(function() {
    var i;
    i = function() {
        function i(i) {
            this.services = i.services
        }
        return i.prototype.notifyAutomatically = function() {
            throw new Error("Automatic notification is not supported")
        }, i.prototype.notify = function(i, n, t, o) {
            return $.each(this.services, function(r, c) {
                return c.notify(i, n, t, o)
            })
        }, i
    }(), window.LMDNavigationTracking || (window.LMDNavigationTracking = {}), window.LMDNavigationTracking.Tracker = i
}).call(this);;
(function() {
    var n, r = {}.hasOwnProperty,
        t = function(n, t) {
            function i() {
                this.constructor = n
            }
            for (var o in t) r.call(t, o) && (n[o] = t[o]);
            return i.prototype = t.prototype, n.prototype = new i, n.__super__ = t.prototype, n
        };
    n = function(n) {
        function r() {
            return r.__super__.constructor.apply(this, arguments)
        }
        return t(r, n), r.prototype.notify = function(n, t, i, o) {
            return n = "click", r.__super__.notify.call(this, n, t, i, o)
        }, r
    }(LMDNavigationTracking.Tracker), window.LMDNavigationTracking || (window.LMDNavigationTracking = {}), window.LMDNavigationTracking.Trackers || (window.LMDNavigationTracking.Trackers = {}), window.LMDNavigationTracking.Trackers.ButtonTracker = n
}).call(this);;
(function() {
    var r, n = {}.hasOwnProperty,
        i = function(r, i) {
            function a() {
                this.constructor = r
            }
            for (var t in i) n.call(i, t) && (r[t] = i[t]);
            return a.prototype = i.prototype, r.prototype = new a, r.__super__ = i.prototype, r
        };
    r = function(r) {
        function n() {
            return n.__super__.constructor.apply(this, arguments)
        }
        return i(n, r), n
    }(LMDNavigationTracking.Tracker), window.LMDNavigationTracking || (window.LMDNavigationTracking = {}), window.LMDNavigationTracking.Trackers || (window.LMDNavigationTracking.Trackers = {}), window.LMDNavigationTracking.Trackers.PageTracker = r
}).call(this);;
(function() {
    var n, o = {}.hasOwnProperty,
        i = function(n, i) {
            function t() {
                this.constructor = n
            }
            for (var r in i) o.call(i, r) && (n[r] = i[r]);
            return t.prototype = i.prototype, n.prototype = new t, n.__super__ = i.prototype, n
        };
    n = function(n) {
        function o(n) {
            o.__super__.constructor.call(this, n)
        }
        return i(o, n), o.prototype.notifyAutomatically = function() {
            return $(".media.audio").on(LMDAudioEvents.audioWillPlay, function(n) {
                return function() {
                    return n.notify("play", "audio", "soundcloud", "soundcloud")
                }
            }(this))
        }, o
    }(LMDNavigationTracking.Tracker), window.LMDNavigationTracking || (window.LMDNavigationTracking = {}), window.LMDNavigationTracking.Trackers || (window.LMDNavigationTracking.Trackers = {}), window.LMDNavigationTracking.Trackers.AudioTracker = n
}).call(this);;
(function() {
    var i, r = {}.hasOwnProperty,
        n = function(i, n) {
            function t() {
                this.constructor = i
            }
            for (var o in n) r.call(n, o) && (i[o] = n[o]);
            return t.prototype = n.prototype, i.prototype = new t, i.__super__ = n.prototype, i
        };
    i = function(i) {
        function r(i) {
            r.__super__.constructor.call(this, i)
        }
        return n(r, i), r.prototype.notifyAutomatically = function() {
            return $(".media.video").on(LMDVideoEvents.videoWillPlay, function(i) {
                return function(r) {
                    return i.notify("play", "video", "YT " + $(r.currentTarget).data("player").identifier, $(r.currentTarget).data("player").identifier)
                }
            }(this))
        }, r
    }(LMDNavigationTracking.Tracker), window.LMDNavigationTracking || (window.LMDNavigationTracking = {}), window.LMDNavigationTracking.Trackers || (window.LMDNavigationTracking.Trackers = {}), window.LMDNavigationTracking.Trackers.VideoTracker = i
}).call(this);;
(function() {
    var t, i = {}.hasOwnProperty,
        o = function(t, o) {
            function r() {
                this.constructor = t
            }
            for (var n in o) i.call(o, n) && (t[n] = o[n]);
            return r.prototype = o.prototype, t.prototype = new r, t.__super__ = o.prototype, t
        };
    t = function(t) {
        function i(t) {
            i.__super__.constructor.call(this, t), this.VIEWPORT = $(window)
        }
        return o(i, t), i.prototype.BREAKPOINTS = [0, 20, 25, 40, 50, 60, 75, 80, 100], i.prototype.notifyAutomatically = function() {
            return this.VIEWPORT.on("scroll", $.proxy(this._track, this))
        }, i.prototype._track = function() {
            var t, i;
            return i = Math.round(this.VIEWPORT.scrollTop() / ($(document).height() - this.VIEWPORT.height()) * 100), t = null, this.previousPosition || (this.previousPosition = i), $.each(this.BREAKPOINTS, function(o, r) {
                return i >= r ? t = r : void 0
            }), this.previousBreakpoint !== t && this.notify("scroll", "window", "" + t + "%", t), this.previousBreakpoint = t
        }, i
    }(LMDNavigationTracking.Tracker), window.LMDNavigationTracking || (window.LMDNavigationTracking = {}), window.LMDNavigationTracking.Trackers || (window.LMDNavigationTracking.Trackers = {}), window.LMDNavigationTracking.Trackers.ScrollTracker = t
}).call(this);;
(function() {
    var t;
    t = function() {
        function t(t) {
            if (this.identifier = t, !this.identifier) throw new TypeError("Tracker has not identifier");
            this.create()
        }
        return t.prototype.LMD_TRACKER_IDENTIFIER = "GFTracker", t.prototype.BREAKPOINTS = [0, 25, 50, 75, 100], t.prototype.create = function() {
            return window.ga || (this._gaq = this._gaq || [], this._gaq.push(["_setAccount", this.identifier]), this._gaq.push(["_trackPageview"]), function(t, i, e, n, a, r, o) {
                t.GoogleAnalyticsObject = a, t[a] = t[a] || function() {
                    (t[a].q = t[a].q || []).push(arguments)
                }, t[a].l = 1 * new Date, r = i.createElement(e), o = i.getElementsByTagName(e)[0], r.async = 1, r.src = n, o.parentNode.insertBefore(r, o)
            }(window, document, "script", "//www.google-analytics.com/analytics.js", "ga")), ga("create", this.identifier, "auto", {
                name: this.LMD_TRACKER_IDENTIFIER
            })
        }, t.prototype.notify = function(t, i, e, n) {
            return t && i ? ga(this.LMD_TRACKER_IDENTIFIER + ".send", "event", i, t, e, n) : ga(this.LMD_TRACKER_IDENTIFIER + ".send", "pageview")
        }, t
    }(), window.LMDNavigationTracking || (window.LMDNavigationTracking = {}), window.LMDNavigationTracking.AnalyticsService = t
}).call(this);;
(function() {
    var i;
    i = function() {
        function i(i) {
            this.identifier = i, this.identifier || (this.identifier = document.title), this.category = document.location.href.split(document.location.origin)[1].split("/")[1]
        }
        return i.prototype.notify = function(i) {
            if ("function" != typeof xt_med) throw new TypeError("XiTi is undefined");
            if (!i) throw new TypeError("target is undefined");
            return xt_med("C", "48", "" + this.category + "::" + this.identifier + "::" + i, "N")
        }, i
    }(), window.LMDNavigationTracking || (window.LMDNavigationTracking = {}), window.LMDNavigationTracking.XiTiService = i
}).call(this);;;
! function(e, t) {
    "use strict";
    var s;
    s = function() {
        function s(e) {
            if (e.selector.length > 1) {
                var r = [];
                return t.each(e.selector, function() {
                    r.push(s.creer({
                        selector: t(this),
                        selector_fixed: e.selector_fixed
                    }))
                }), r
            }
            this.init(e)
        }
        return s.creer = function(e) {
            return new s(e)
        }, s.prototype = {
            init: function(s) {
                return this.selector = s.selector, this.inner = t(this.selector).children("." + s.selector_fixed), this.timer, t(this.inner).removeClass("fixed").removeClass("bottom").addClass("top"), t.browser.mobile || t(e).on("scroll", t.proxy(this.scrooler, this)), this.resizer(), t(e).on("resize", t.proxy(this.resizer, this)), t.browser.mobile && this.touchstart(), this.scrooler(), this
            },
            touchstart: function() {
                this.timer = setInterval(t.proxy(this.scrooler, this), 5)
            },
            touchend: function() {
                clearInterval(this.timer)
            },
            scrooler: function() {
                var s = t(e).scrollTop();
                this.scroolerImg(s)
            },
            scroolerImg: function(e) {
                var s = this.selector.offset().top,
                    r = this.selector.offset().top + this.selector.height() - this.h;
                e >= s && r > e ? t(this.inner).hasClass("fixed") || t(this.inner).addClass("fixed") : e > r ? t(this.inner).attr({
                    style: "none"
                }).removeClass("fixed").removeClass("top").addClass("bottom") : t(this.inner).attr({
                    style: "none"
                }).removeClass("fixed").removeClass("bottom").addClass(s > e ? "top" : "top")
            },
            resizer: function() {
                this.h = e.innerHeight, this.l = e.innerWidth, this.scrooler()
            }
        }, s
    }(), e.LMDEffetfixedAuto = s
}(window, jQuery);;
! function(r, e) {
    "use strict";
    var t;
    t = function() {
        function t(r) {
            if (r.selector.length > 1) {
                var o = [];
                return e.each(r.selector, function() {
                    o.push(t.creer(e(this)))
                }), o
            }
            this.init(r)
        }
        return t.creer = function(r) {
            return new t({
                selector: r
            })
        }, t.prototype = {
            init: function(t) {
                return this.selector = t.selector, this.resizer(), e.browser.mobile || e(r).on("scroll", e.proxy(this.scrooler, this)), e.browser.mobile && e(r).on("touchmove", e.proxy(this.scrooler, this)), this
            },
            scrooler: function() {
                var t = e(r).scrollTop(),
                    o = (r.innerHeight, r.innerWidth, e(this.selector).height()),
                    i = Math.min(1.2, 1 + t / o / 4);
                i = Math.max(1, i), e(this.selector).css({
                    "background-position": "center center",
                    transform: "scale(" + i + ")"
                })
            },
            resizer: function() {}
        }, t
    }(), r.LMDbgZoomScroll = t
}(window, jQuery);;

function LMDSmartMedia() {
    $(".project-container [data-src]").each(function(e, t) {
        return t = $(t), "external" == t.attr("rel") ? !0 : void t.attr("data-src", ASSET_URL + t.data("src"))
    });
    var e;
    $(".project-container img[data-srcset]").each(function(t, a) {
        e = "", $.each($(a).data("srcset").split(", "), function(t, a) {
            e.length > 0 && (e += ", "), e += ASSET_URL + a
        }), $(a).attr("data-srcset", e)
    }), $(".project-container video").each(function(e, t) {
        $(t).data("poster") && $(t).attr("poster", ASSET_URL + $(t).data("poster"))
    }), $('.project-container [rel="external"]').each(function(e, t) {
        $(t).attr("src", $(t).data("src"))
    })
}

// function LMDCompatibility() {
//     "development" === JS_ENV && ($("html head link[rel=stylesheet]").before('<link rel="stylesheet" href="assets/stylesheets/vendor/lmd/before.css" media="all" />').after('<link rel="stylesheet" href="assets/stylesheets/vendor/lmd/after.css" media="all" />').after('<link rel="stylesheet" type="text/css" href="https://s1.lemde.fr/medias/web/css/fonts.css" />'), $("html body").prepend('         <header class="hors_format" style="z-index: 300;">            <a title="Page d\'accueil du Monde.fr" href="/"><img width="104" height="18" alt="Logo LeMonde.fr" src="//s1.lemde.fr/medias/web/1.2.655/img/elements_lm/lmfr_blanc_gris104x18.png"></a>            <h1 class="tt5_capital">' + $("head title").text() + '</h1>            <p class="partage">               <span class="txt1">Partager</span>               <span class="facebook fb13x13_blanc">facebook</span>               <span class="twitter tw13x13_blanc">twitter</span>               <span class="google-plus google13x13_blanc">google +</span>               <span class="linkedin linkedin13x13_blanc">linkedin</span>               <span class="pinterest pinterest13x13_blanc">pinterest</span>            </p>         </header>'), $("html body .project-container").after('')), $("header.hors_format").css({
//         "z-index": 1e3
//     })
// }
var JS_ENV = "http:" !== document.location.protocol || "localhost" === document.location.hostname || -1 !== document.location.hostname.indexOf("infotrope") || -1 !== document.location.hostname.indexOf("172.") ? "development" : "production",
    ASSET_URL = "development" === JS_ENV ? "" : lmd.conf.hf.src_base_path + "/";;
$.fn.parallaxe = function() {
    return this.each(function() {
        function o() {
            var o = $(window).scrollTop(),
                t = e - (i - o) * s;
            a.css({
                top: t
            })
        }

        function t() {
            a.css({
                top: window.innerHeight - a.height()
            }), e = a.data("top") ? a.data("top") : a.position().top, o()
        } {
            var a = $(this),
                n = a.parent(),
                i = n.position().top,
                e = (i + n.height(), a.data("top") ? a.data("top") : a.position().top),
                s = (a.data("bottom") ? a.data("bottom") : 0, a.data("coef") ? Number(a.data("coef")) : 0);
            a.data("sence") ? Number(a.data("sence")) : 0, a.data("class") ? Number(a.data("class")) : null, window.innerHeight
        }
        return a.css({
            top: e
        }), t(), $.browser.mobile || $(window).on("scroll", o), $.browser.mobile && $(window).on("touchmove", o), $(window).on("resize", t), this
    })
};;
$(function() {
    $("body").css({
        "background-color": "#FFF",
        "overflow-x": "hidden"
    });
    var e, n, o = function() {
        e = window.innerWidth, n = window.innerHeight, $.each($(".inner-titre"), function() {
            var e = $(this).children(".titre").position().top + $(this).children(".titre").height();
            $(this).css({
                height: e
            })
        })
    };
    $(window).on("resize", o);
    var t = function() {
            var e = $(window).scrollTop(),
                n = $(".container-dates").offset().top,
                o = $(".chapo").offset().top;
            e >= o ? $(".container-general header .fond").addClass("relatived") : $(".container-general header .fond").removeClass("relatived"), e >= n ? $(".container-dates .nav-dates").addClass("fixed") : $(".container-dates .nav-dates").removeClass("fixed");
            var t;
            $.each($(".container-dates .container-date"), function() {
                var n = $(this).offset().top - 35,
                    o = n + $(this).height();
                e >= n && o > e && (t = $(this).attr("id"))
            }), $(".container-dates .nav-dates ul li").removeClass("actif"), $('.container-dates .nav-dates ul li[data-id="' + t + '"]').addClass("actif")
        },
        a = function() {
            o()
        },
        i = function() {
            !$.browser.mobile, $.browser.mobile && $("body").on({
                touchmove: function() {
                    t()
                }
            });
            new LMDbgZoomScroll({
                selector: $(".background-zoomer")
            }), new LMDEffetfixedAuto({
                selector: $(".container-date"),
                selector_fixed: "fond"
            });
            $(".parallaxe").parallaxe(), o(), $(window).on("scroll", t)
        };
    $application.on(LMDEvents.applicationWillLaunch, a), $application.on(LMDEvents.applicationDidLaunch, i)
});;
$.extend($.lazyLoadXT, {
    autoInit: !1,
    selector: "*[data-src], *[data-srcset]",
    forceLoad: !0
}), Pace.options = {
    document: !0,
    restartOnPushState: !1,
    restartOnRequestAfter: !1,
    elements: {
        selectors: ["img", "video"]
    }
};;
var navigationTracker, root = $("html,body"),
    $application = $(".project-container"),
    viewport = $(window),
    LMDEvents = {};
! function(i, a) {
    "use strict";

    function n() {
        LMDCompatibility(), LMDSmartMedia(), Pace.start();
        var i = new LMDNavigationTracking.AnalyticsService("UA-57165433-3"),
            n = new LMDNavigationTracking.Trackers.PageTracker({
                services: [i]
            }),
            e = new LMDNavigationTracking.Trackers.ScrollTracker({
                services: [i]
            });
        e.notifyAutomatically(), n.notify(), a(".scroll-to-id").onClickScrollToID()
    }

    function e() {
        l()
    }

    function t() {
        l()
    }

    function l() {
        root.scrollTo({
            position: 0,
            animated: !1
        })
    }
    LMDEvents.applicationWillAppear = "applicationWillAppear", LMDEvents.applicationDidAppear = "applicationDidAppear", LMDEvents.applicationWillLaunch = "applicationWillLaunch", LMDEvents.applicationDidLaunch = "applicationDidLaunch", LMDEvents.applicationWillQuit = "applicationWillQuit", LMDEvents.viewWillAppear = "viewWillAppear", LMDEvents.viewDidAppear = "viewDidAppear", LMDEvents.viewWillLoad = "viewWillLoad", LMDEvents.viewDidLoad = "viewDidLoad", LMDEvents.viewWillDisappear = "viewWillDisappear", LMDEvents.viewDidDisappear = "viewDidDisappear", LMDEvents.viewWillUnload = "viewWillUnload", LMDEvents.viewDidUnload = "viewDidUnload", $application.on(LMDEvents.applicationWillLaunch, n), viewport.unload(function() {
        t()
    }), a("body").imagesLoaded(e), a(document).ready(function() {
        var i = new LMDLoader;
        i.launchApplication()
    })
}(window, jQuery);