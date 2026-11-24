import versions from './artwork-versions.js';

export function thumbnail(path) {
    if (!path.endsWith('.webp')) return path;
    const preview = path.replace('assets/images/', 'assets/images/thumbs/');
    return versions[preview] || preview;
}
