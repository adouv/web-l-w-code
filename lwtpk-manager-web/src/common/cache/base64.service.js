/**
 * @Author hejialin
 * @Description base64 加密解密
 */
export default class Base64Service{
    
    constructor(){
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        this.lookup = null;
        this.ie = /MSIE /.test(navigator.userAgent);
        this.ieo = /MSIE [67]/.test(navigator.userAgent);
    }
    
    decode(s){
        s = s.replace(/\s/g, '');
        if (s.length % 4)
            throw new Error('InvalidLengthError: decode failed: The string to be decoded is not the correct length for a base64 encoded string.');
        if(/[^A-Za-z0-9+\/=\s]/g.test(s))
            throw new Error('InvalidCharacterError: decode failed: The string contains characters invalid in a base64 encoded string.');

        var buffer = this.fromUtf8(s),
            position = 0,
            result,
            len = buffer.length;

        if (this.ieo) {
            result = [];
            while (position < len) {
                if (buffer[position] < 128)
                    result.push(String.fromCharCode(buffer[position++]));
                else if (buffer[position] > 191 && buffer[position] < 224)
                    result.push(String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63)));
                else
                    result.push(String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63)));
            }
            return result.join('');
        } else {
            result = '';
            while (position < len) {
                if (buffer[position] < 128)
                    result += String.fromCharCode(buffer[position++]);
                else if (buffer[position] > 191 && buffer[position] < 224)
                    result += String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63));
                else
                    result += String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63));
            }
            return result;
        }
    }
    encode(s){
        var buffer = this.toUtf8(s),
            position = -1,
            result,
            len = buffer.length,
            nan0, nan1, nan2, enc = [, , , ];

        if (this.ie) {
            result = [];
            while (++position < len) {
                nan0 = buffer[position];
                nan1 = buffer[++position];
                enc[0] = nan0 >> 2;
                enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
                if (isNaN(nan1))
                    enc[2] = enc[3] = 64;
                else {
                    nan2 = buffer[++position];
                    enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
                    enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
                }
                result.push(this.alphabet.charAt(enc[0]), this.alphabet.charAt(enc[1]), this.alphabet.charAt(enc[2]), this.alphabet.charAt(enc[3]));
            }
            return result.join('');
        } else {
            result = '';
            while (++position < len) {
                nan0 = buffer[position];
                nan1 = buffer[++position];
                enc[0] = nan0 >> 2;
                enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
                if (isNaN(nan1))
                    enc[2] = enc[3] = 64;
                else {
                    nan2 = buffer[++position];
                    enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
                    enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
                }
                result += this.alphabet[enc[0]] + this.alphabet[enc[1]] + this.alphabet[enc[2]] + this.alphabet[enc[3]];
            }
            return result;
        }
    }

    toUtf8 (s) {
        var position = -1,
            len = s.length,
            chr, buffer = [];
        if (/^[\x00-\x7f]*$/.test(s)) while (++position < len)
            buffer.push(s.charCodeAt(position));
        else while (++position < len) {
            chr = s.charCodeAt(position);
            if (chr < 128)
                buffer.push(chr);
            else if (chr < 2048)
                buffer.push((chr >> 6) | 192, (chr & 63) | 128);
            else
                buffer.push((chr >> 12) | 224, ((chr >> 6) & 63) | 128, (chr & 63) | 128);
        }
        return buffer;
    }
    
    fromUtf8 (s) {
        var position = -1,
            len, buffer = [],
            enc = [, , , ];
        if (!this.lookup) {
            len = this.alphabet.length;
            this.lookup = {};
            while (++position < len)
                this.lookup[this.alphabet.charAt(position)] = position;
            position = -1;
        }
        len = s.length;
        while (++position < len) {
            enc[0] = this.lookup[s.charAt(position)];
            enc[1] = this.lookup[s.charAt(++position)];
            buffer.push((enc[0] << 2) | (enc[1] >> 4));
            enc[2] = this.lookup[s.charAt(++position)];
            if (enc[2] === 64)
                break;
            buffer.push(((enc[1] & 15) << 4) | (enc[2] >> 2));
            enc[3] = this.lookup[s.charAt(++position)];
            if (enc[3] === 64)
                break;
            buffer.push(((enc[2] & 3) << 6) | enc[3]);
        }
        return buffer;
    }
    
    urlDecode(input){
        input = input
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        var pad = input.length % 4;
        if(pad) {
            if(pad === 1) {
                throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
            }
            input += new Array(5-pad).join('=');
        }

        return this.decode(input);
    }

    urlEncode(input) {
        var output = this.encode(input);
        return output
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .split('=', 1)[0];
    }
}