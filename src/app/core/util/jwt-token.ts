/**
 * Replicate https://github.com/auth0/angular2-jwt/blob/main/projects/angular-jwt/src/lib/jwthelper.service.ts
 */
function urlBase64Decode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: {
      break;
    }
    case 2: {
      output += '==';
      break;
    }
    case 3: {
      output += '=';
      break;
    }
    default: {
      throw new Error('Illegal base64url string!');
    }
  }
  return b64DecodeUnicode(output);
}

// credits for decoder goes to https://github.com/atk
function b64decode(str: string): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';

  str = String(str).replace(/=+$/, '');

  if (str.length % 4 === 1) {
    throw new Error(
      `'atob' failed: The string to be decoded is not correctly encoded.`
    );
  }

  for (
    // initialize result and counters
    let bc = 0, bs: any, buffer: any, idx = 0;
    // get next character
    (buffer = str.charAt(idx++));
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer &&
    ((bs = bc % 4 ? bs * 64 + buffer : buffer),
    // and if not first of each 4 characters,
    // convert the first 8 bits to one ascii character
    bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}

function b64DecodeUnicode(str: string) {
  return decodeURIComponent(
    Array.prototype.map
      .call(b64decode(str), (c: string) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

function _decodeToken<T = any>(token: string): null | T {
  if (!token || token === '') {
    return null;
  }

  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error(
      `The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.`
    );
  }

  const decoded = urlBase64Decode(parts[1]);
  if (!decoded) {
    throw new Error('Cannot decode the token.');
  }

  return JSON.parse(decoded);
}

export function decodeToken<T = any>(
  token: string | Promise<string>
): null | T | Promise<T | null> {
  if (token instanceof Promise) {
    return token.then((t) => _decodeToken(t));
  }

  return _decodeToken(token);
}

export function getTokenExpirationDate(
  token: string | Promise<string>
): Date | null | Promise<Date | null> {
  if (token instanceof Promise) {
    return token.then((t) => _getTokenExpirationDate(t));
  }

  return _getTokenExpirationDate(token);
}

function _getTokenExpirationDate(token: string): Date | null {
  const decoded = decodeToken(token);

  if (!decoded || !Object.prototype.hasOwnProperty.call(decoded, 'exp')) {
    return null;
  }

  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);

  return date;
}

export function isTokenExpired(
  token: null | string | Promise<string>,
  offsetSeconds?: number
): boolean | Promise<boolean> {
  if (token instanceof Promise) {
    return token.then((t) => _isTokenExpired(t, offsetSeconds));
  }

  return _isTokenExpired(token, offsetSeconds);
}

function _isTokenExpired(
  token: string | null,
  offsetSeconds?: number
): boolean {
  if (!token || token === '') {
    return true;
  }
  const date = _getTokenExpirationDate(token);
  offsetSeconds = offsetSeconds || 0;

  if (date === null) {
    return false;
  }

  return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
}
