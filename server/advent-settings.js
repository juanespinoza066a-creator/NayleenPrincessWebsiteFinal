import settings from './advent-settings.json' with { type: 'json' };

export function adventOptions(profile) {
    return {
        adventEnabled: settings.enabled === true,
        adventPreview: profile === 'testing' && settings.previewForTesting === true
    };
}
