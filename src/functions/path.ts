var splitPathRe =
  /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/

var splitPath = function (filename: string): string[] {
  return (splitPathRe.exec(filename) as string[]).slice(1)
};

/** 是否为绝对路径 */
export function isAbsolute(path: string): boolean {
  return path.charAt(0) === '/';
}

/**
 * 把一个路径或路径片段的序列解析为一个绝对路径
 * @param {string} to 初始路径
 * @param {string} from 相对路径
 */
export function resolvePath(...args: string[]): string {
  let resolvedPath = '',
      resolvedAbsolute = false;
  for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? args[i] : '/';
    if (!path) {
      continue;
    }
    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }
  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)
  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p: string) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

/**
 * 返回一个 path 的目录名，类似于 Unix 中的 dirname 命令。
 * @example
 * sdk.dirname('/foo/bar/baz/asdf/quux'); // 返回 /foo/bar/baz/asdf
 * @param {string} path
 */
export function dirname(path: string): string {
  var result = splitPath(path),
    root = result[0],
    dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

/**
 * 返回一个 path 的最后一部分，类似于 Unix 中的 basename 命令
 * @example
 * sdk.basename('/foo/bar/quux.html'); // 返回 'quux.html'
 * @param {string} path 文件路径
 * @param {string} ext 可选的文件扩展名
 */
export function basename(path: string, ext?: string): string {
  var f = splitPath(path)[2];
  // make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}

/**
 * 回 path 的扩展名，即从 path 的最后一部分中的最后一个
 * @example
 * sdk.extname('index.html'); // 返回 .html
 * @param {string} path 
 */
export function extname(path: string): string {
  return splitPath(path)[3];
}

function normalizeArray(parts: any[], allowAboveRoot?: boolean) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

function filter(xs: any[], f: any) {
  if (xs.filter) return xs.filter(f)
  var res: any[] = [];
  for (var i = 0; i < xs.length; i++) {
    if (f(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
}
