// A dry shell fracture: two strong snaps followed by short irregular crumbs.
// Sound starts only from a tap. No recording, network request, or microphone is used.
export function createCrunchBuffer(context, random = Math.random) {
    const sampleRate = context.sampleRate, duration = .26, buffer = context.createBuffer(1, Math.ceil(sampleRate * duration), sampleRate), data = buffer.getChannelData(0);
    const bursts = [{ at: 0, length: .032, gain: 1.05 }, { at: .036, length: .028, gain: .75 }, ...Array.from({ length: 8 }, (_, i) => ({ at: .067 + i * .017 + random() * .008, length: .005 + random() * .008, gain: .12 + random() * .16 }))];
    for (const burst of bursts) {
        let brown = 0, previous = 0;
        const count = Math.ceil(burst.length * sampleRate), start = Math.floor(burst.at * sampleRate);
        for (let i = 0; i < count && start + i < data.length; i++) {
            const white = random() * 2 - 1;
            brown = .72 * brown + .28 * white;
            const bright = white - previous;
            previous = white;
            const envelope = Math.exp(-i / (count * .2)) * Math.min(1, i / 3);
            data[start + i] += (brown * .85 + bright * .32) * envelope * burst.gain;
        }
    }
    for (let i = 0; i < data.length; i++)
        data[i] = Math.tanh(data[i] * 1.7) * .8;
    return buffer;
}
