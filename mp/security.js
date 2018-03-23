let t = {};
function e(i) {
    var t = d
      , e = t.biDivideByRadixPower(i, this.k - 1)
      , s = t.biMultiply(e, this.mu)
      , n = t.biDivideByRadixPower(s, this.k + 1)
      , o = t.biModuloByRadixPower(i, this.k + 1)
      , r = t.biMultiply(n, this.modulus)
      , a = t.biModuloByRadixPower(r, this.k + 1)
      , l = t.biSubtract(o, a);
    l.isNeg && (l = t.biAdd(l, this.bkplus1));
    for (var u = t.biCompare(l, this.modulus) >= 0; u; )
        l = t.biSubtract(l, this.modulus),
        u = t.biCompare(l, this.modulus) >= 0;
    return l
}
function s(i, t) {
    var e = d.biMultiply(i, t);
    return this.modulo(e)
}
function n(i, t) {
    var e = new b;
    e.digits[0] = 1;
    for (var s = i, n = t; ; ) {
        if (0 != (1 & n.digits[0]) && (e = this.multiplyMod(e, s)),
        n = d.biShiftRight(n, 1),
        0 == n.digits[0] && 0 == d.biHighIndex(n))
            break;
        s = this.multiplyMod(s, s)
    }
    return e
}
function o(i) {
    for (var t = "", e = 0; e < i; e++)
        t += Math.floor(10 * Math.random());
    return t
}
var r, a, l, u, d = t.RSAUtils || {}, c = 16, g = c, p = 65536, h = p >>> 1, f = p * p, m = p - 1, b = t.BigInt = function(i) {
    "boolean" == typeof i && 1 == i ? this.digits = null : this.digits = a.slice(0),
    this.isNeg = !1
}
;
d.setMaxDigits = function(i) {
    r = i,
    a = new Array(r);
    for (var t = 0; t < a.length; t++)
        a[t] = 0;
    l = new b,
    u = new b,
    u.digits[0] = 1
}
,
d.setMaxDigits(20);
var v = 15;
d.biFromNumber = function(i) {
    var t = new b;
    t.isNeg = i < 0,
    i = Math.abs(i);
    for (var e = 0; i > 0; )
        t.digits[e++] = i & m,
        i = Math.floor(i / p);
    return t
}
;
var _ = d.biFromNumber(1e15);
d.biFromDecimal = function(i) {
    for (var t, e = "-" == i.charAt(0), s = e ? 1 : 0; s < i.length && "0" == i.charAt(s); )
        ++s;
    if (s == i.length)
        t = new b;
    else {
        var n = i.length - s
          , o = n % v;
        for (0 == o && (o = v),
        t = d.biFromNumber(Number(i.substr(s, o))),
        s += o; s < i.length; )
            t = d.biAdd(d.biMultiply(t, _), d.biFromNumber(Number(i.substr(s, v)))),
            s += v;
        t.isNeg = e
    }
    return t
}
,
d.biCopy = function(i) {
    var t = new b((!0));
    return t.digits = i.digits.slice(0),
    t.isNeg = i.isNeg,
    t
}
,
d.reverseStr = function(i) {
    for (var t = "", e = i.length - 1; e > -1; --e)
        t += i.charAt(e);
    return t
}
;
var w = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
d.biToString = function(i, t) {
    var e = new b;
    e.digits[0] = t;
    for (var s = d.biDivideModulo(i, e), n = w[s[1].digits[0]]; 1 == d.biCompare(s[0], l); )
        s = d.biDivideModulo(s[0], e),
        digit = s[1].digits[0],
        n += w[s[1].digits[0]];
    return (i.isNeg ? "-" : "") + d.reverseStr(n)
}
,
d.biToDecimal = function(i) {
    var t = new b;
    t.digits[0] = 10;
    for (var e = d.biDivideModulo(i, t), s = String(e[1].digits[0]); 1 == d.biCompare(e[0], l); )
        e = d.biDivideModulo(e[0], t),
        s += String(e[1].digits[0]);
    return (i.isNeg ? "-" : "") + d.reverseStr(s)
}
;
var y = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
d.digitToHex = function(t) {
    var e = 15
      , s = "";
    for (i = 0; i < 4; ++i)
        s += y[t & e],
        t >>>= 4;
    return d.reverseStr(s)
}
,
d.biToHex = function(i) {
    for (var t = "", e = (d.biHighIndex(i),
    d.biHighIndex(i)); e > -1; --e)
        t += d.digitToHex(i.digits[e]);
    return t
}
,
d.charToHex = function(i) {
    var t, e = 48, s = e + 9, n = 97, o = n + 25, r = 65, a = 90;
    return t = i >= e && i <= s ? i - e : i >= r && i <= a ? 10 + i - r : i >= n && i <= o ? 10 + i - n : 0
}
,
d.hexToDigit = function(i) {
    for (var t = 0, e = Math.min(i.length, 4), s = 0; s < e; ++s)
        t <<= 4,
        t |= d.charToHex(i.charCodeAt(s));
    return t
}
,
d.biFromHex = function(i) {
    for (var t = new b, e = i.length, s = e, n = 0; s > 0; s -= 4,
    ++n)
        t.digits[n] = d.hexToDigit(i.substr(Math.max(s - 4, 0), Math.min(s, 4)));
    return t
}
,
d.biFromString = function(i, t) {
    var e = "-" == i.charAt(0)
      , s = e ? 1 : 0
      , n = new b
      , o = new b;
    o.digits[0] = 1;
    for (var r = i.length - 1; r >= s; r--) {
        var a = i.charCodeAt(r)
          , l = d.charToHex(a)
          , u = d.biMultiplyDigit(o, l);
        n = d.biAdd(n, u),
        o = d.biMultiplyDigit(o, t)
    }
    return n.isNeg = e,
    n
}
,
d.biDump = function(i) {
    return (i.isNeg ? "-" : "") + i.digits.join(" ")
}
,
d.biAdd = function(i, t) {
    var e;
    if (i.isNeg != t.isNeg)
        t.isNeg = !t.isNeg,
        e = d.biSubtract(i, t),
        t.isNeg = !t.isNeg;
    else {
        e = new b;
        for (var s, n = 0, o = 0; o < i.digits.length; ++o)
            s = i.digits[o] + t.digits[o] + n,
            e.digits[o] = s % p,
            n = Number(s >= p);
        e.isNeg = i.isNeg
    }
    return e
}
,
d.biSubtract = function(i, t) {
    var e;
    if (i.isNeg != t.isNeg)
        t.isNeg = !t.isNeg,
        e = d.biAdd(i, t),
        t.isNeg = !t.isNeg;
    else {
        e = new b;
        var s, n;
        n = 0;
        for (var o = 0; o < i.digits.length; ++o)
            s = i.digits[o] - t.digits[o] + n,
            e.digits[o] = s % p,
            e.digits[o] < 0 && (e.digits[o] += p),
            n = 0 - Number(s < 0);
        if (n == -1) {
            n = 0;
            for (var o = 0; o < i.digits.length; ++o)
                s = 0 - e.digits[o] + n,
                e.digits[o] = s % p,
                e.digits[o] < 0 && (e.digits[o] += p),
                n = 0 - Number(s < 0);
            e.isNeg = !i.isNeg
        } else
            e.isNeg = i.isNeg
    }
    return e
}
,
d.biHighIndex = function(i) {
    for (var t = i.digits.length - 1; t > 0 && 0 == i.digits[t]; )
        --t;
    return t
}
,
d.biNumBits = function(i) {
    var t, e = d.biHighIndex(i), s = i.digits[e], n = (e + 1) * g;
    for (t = n; t > n - g && 0 == (32768 & s); --t)
        s <<= 1;
    return t
}
,
d.biMultiply = function(i, t) {
    for (var e, s, n, o = new b, r = d.biHighIndex(i), a = d.biHighIndex(t), l = 0; l <= a; ++l) {
        for (e = 0,
        n = l,
        j = 0; j <= r; ++j,
        ++n)
            s = o.digits[n] + i.digits[j] * t.digits[l] + e,
            o.digits[n] = s & m,
            e = s >>> c;
        o.digits[l + r + 1] = e
    }
    return o.isNeg = i.isNeg != t.isNeg,
    o
}
,
d.biMultiplyDigit = function(i, t) {
    var e, s, n;
    result = new b,
    e = d.biHighIndex(i),
    s = 0;
    for (var o = 0; o <= e; ++o)
        n = result.digits[o] + i.digits[o] * t + s,
        result.digits[o] = n & m,
        s = n >>> c;
    return result.digits[1 + e] = s,
    result
}
,
d.arrayCopy = function(i, t, e, s, n) {
    for (var o = Math.min(t + n, i.length), r = t, a = s; r < o; ++r,
    ++a)
        e[a] = i[r]
}
;
var x = [0, 32768, 49152, 57344, 61440, 63488, 64512, 65024, 65280, 65408, 65472, 65504, 65520, 65528, 65532, 65534, 65535];
d.biShiftLeft = function(i, t) {
    var e = Math.floor(t / g)
      , s = new b;
    d.arrayCopy(i.digits, 0, s.digits, e, s.digits.length - e);
    for (var n = t % g, o = g - n, r = s.digits.length - 1, a = r - 1; r > 0; --r,
    --a)
        s.digits[r] = s.digits[r] << n & m | (s.digits[a] & x[n]) >>> o;
    return s.digits[0] = s.digits[r] << n & m,
    s.isNeg = i.isNeg,
    s
}
;
var S = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535];
d.biShiftRight = function(i, t) {
    var e = Math.floor(t / g)
      , s = new b;
    d.arrayCopy(i.digits, e, s.digits, 0, i.digits.length - e);
    for (var n = t % g, o = g - n, r = 0, a = r + 1; r < s.digits.length - 1; ++r,
    ++a)
        s.digits[r] = s.digits[r] >>> n | (s.digits[a] & S[n]) << o;
    return s.digits[s.digits.length - 1] >>>= n,
    s.isNeg = i.isNeg,
    s
}
,
d.biMultiplyByRadixPower = function(i, t) {
    var e = new b;
    return d.arrayCopy(i.digits, 0, e.digits, t, e.digits.length - t),
    e
}
,
d.biDivideByRadixPower = function(i, t) {
    var e = new b;
    return d.arrayCopy(i.digits, t, e.digits, 0, e.digits.length - t),
    e
}
,
d.biModuloByRadixPower = function(i, t) {
    var e = new b;
    return d.arrayCopy(i.digits, 0, e.digits, 0, t),
    e
}
,
d.biCompare = function(i, t) {
    if (i.isNeg != t.isNeg)
        return 1 - 2 * Number(i.isNeg);
    for (var e = i.digits.length - 1; e >= 0; --e)
        if (i.digits[e] != t.digits[e])
            return i.isNeg ? 1 - 2 * Number(i.digits[e] > t.digits[e]) : 1 - 2 * Number(i.digits[e] < t.digits[e]);
    return 0
}
,
d.biDivideModulo = function(i, t) {
    var e, s, n = d.biNumBits(i), o = d.biNumBits(t), r = t.isNeg;
    if (n < o)
        return i.isNeg ? (e = d.biCopy(u),
        e.isNeg = !t.isNeg,
        i.isNeg = !1,
        t.isNeg = !1,
        s = biSubtract(t, i),
        i.isNeg = !0,
        t.isNeg = r) : (e = new b,
        s = d.biCopy(i)),
        [e, s];
    e = new b,
    s = i;
    for (var a = Math.ceil(o / g) - 1, l = 0; t.digits[a] < h; )
        t = d.biShiftLeft(t, 1),
        ++l,
        ++o,
        a = Math.ceil(o / g) - 1;
    s = d.biShiftLeft(s, l),
    n += l;
    for (var c = Math.ceil(n / g) - 1, v = d.biMultiplyByRadixPower(t, c - a); d.biCompare(s, v) != -1; )
        ++e.digits[c - a],
        s = d.biSubtract(s, v);
    for (var _ = c; _ > a; --_) {
        var w = _ >= s.digits.length ? 0 : s.digits[_]
          , y = _ - 1 >= s.digits.length ? 0 : s.digits[_ - 1]
          , x = _ - 2 >= s.digits.length ? 0 : s.digits[_ - 2]
          , S = a >= t.digits.length ? 0 : t.digits[a]
          , $ = a - 1 >= t.digits.length ? 0 : t.digits[a - 1];
        w == S ? e.digits[_ - a - 1] = m : e.digits[_ - a - 1] = Math.floor((w * p + y) / S);
        for (var C = e.digits[_ - a - 1] * (S * p + $), I = w * f + (y * p + x); C > I; )
            --e.digits[_ - a - 1],
            C = e.digits[_ - a - 1] * (S * p | $),
            I = w * p * p + (y * p + x);
        v = d.biMultiplyByRadixPower(t, _ - a - 1),
        s = d.biSubtract(s, d.biMultiplyDigit(v, e.digits[_ - a - 1])),
        s.isNeg && (s = d.biAdd(s, v),
        --e.digits[_ - a - 1])
    }
    return s = d.biShiftRight(s, l),
    e.isNeg = i.isNeg != r,
    i.isNeg && (e = r ? d.biAdd(e, u) : d.biSubtract(e, u),
    t = d.biShiftRight(t, l),
    s = d.biSubtract(t, s)),
    0 == s.digits[0] && 0 == d.biHighIndex(s) && (s.isNeg = !1),
    [e, s]
}
,
d.biDivide = function(i, t) {
    return d.biDivideModulo(i, t)[0]
}
,
d.biModulo = function(i, t) {
    return d.biDivideModulo(i, t)[1]
}
,
d.biMultiplyMod = function(i, t, e) {
    return d.biModulo(d.biMultiply(i, t), e)
}
,
d.biPow = function(i, t) {
    for (var e = u, s = i; ; ) {
        if (0 != (1 & t) && (e = d.biMultiply(e, s)),
        t >>= 1,
        0 == t)
            break;
        s = d.biMultiply(s, s)
    }
    return e
}
,
d.biPowMod = function(i, t, e) {
    for (var s = u, n = i, o = t; ; ) {
        if (0 != (1 & o.digits[0]) && (s = d.biMultiplyMod(s, n, e)),
        o = d.biShiftRight(o, 1),
        0 == o.digits[0] && 0 == d.biHighIndex(o))
            break;
        n = d.biMultiplyMod(n, n, e)
    }
    return s
}
,
t.BarrettMu = function(i) {
    this.modulus = d.biCopy(i),
    this.k = d.biHighIndex(this.modulus) + 1;
    var t = new b;
    t.digits[2 * this.k] = 1,
    this.mu = d.biDivide(t, this.modulus),
    this.bkplus1 = new b,
    this.bkplus1.digits[this.k + 1] = 1,
    this.modulo = e,
    this.multiplyMod = s,
    this.powMod = n
}
;
var $ = function(i, e, s, n) {
    var o = d;
    this.e = o.biFromHex(i),
    this.d = o.biFromHex(e),
    this.m = o.biFromHex(s),
    this.chunkSize = 2 * o.biHighIndex(this.m),
    this.radix = 16,
    this.barrett = new t.BarrettMu(this.m),
    this.rndLen = n
};
d.getKeyPair = function(i, t, e, s) {
    return new $(i,t,e,s)
}
,
"undefined" == typeof t.twoDigit && (t.twoDigit = function(i) {
    return (i < 10 ? "0" : "") + String(i)
}
);
var C = "00d3e5839928d17df7ad0ae809c772cd07615cc6531e49aaa2331ba80d1308d25a67f055d2e5c2e90871e779e6ac8629de1d9203333e3b3aabdb1c90dea66c23db6d6941ec89bb99a1f8e44e0a4207341a58f5e43e49f9b69bff1f3115dda47a27e67c6d4b81895a39065ca1ae278d0dfca752aac9c8ac9d0b25cdea70e17e39db"
  , I = "010001"
  , k = "7";
d.pwdEncode = function(i) {
    var t = d.getKeyPair(I, "", C, k);
    return d.encryptedString(t, i)
}
,
d.encryptedString = function(i, t) {
    for (var e = o(i.rndLen) + t, s = [], n = e.length, r = 0; r < n; )
        s[r] = e.charCodeAt(r),
        r++;
    for (; s.length % i.chunkSize != 0; )
        s[r++] = 0;
    var a, l, u, c = s.length, g = "";
    for (r = 0; r < c; r += i.chunkSize) {
        for (u = new b,
        a = 0,
        l = r; l < r + i.chunkSize; ++a)
            u.digits[a] = s[l++],
            u.digits[a] += s[l++] << 8;
        var p = i.barrett.powMod(u, i.e)
          , h = 16 == i.radix ? d.biToHex(p) : d.biToString(p, i.radix);
        g += h + " "
    }
    return g.substring(0, g.length - 1)
}
,
d.decryptedString = function(i, t) {
    var e, s, n, o = t.split(" "), r = "";
    for (e = 0; e < o.length; ++e) {
        var a;a
        for (a = 16 == i.radix ? d.biFromHex(o[e]) : d.biFromString(o[e], i.radix),
        n = i.barrett.powMod(a, i.d),
        s = 0; s <= d.biHighIndex(n); ++s)
            r += String.fromCharCode(255 & n.digits[s], n.digits[s] >> 8)
    }
    return 0 == r.charCodeAt(r.length - 1) && (r = r.substring(0, r.length - 1)),
    r
}
,
d.setMaxDigits(130),

t.RSAUtils = d;
module.exports = t;
