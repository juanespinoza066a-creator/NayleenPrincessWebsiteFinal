export function huntFreePlay(profile) {
    return profile === 'testing' && window.CARNIVAL_CONFIG?.huntFreePlay === true;
}
