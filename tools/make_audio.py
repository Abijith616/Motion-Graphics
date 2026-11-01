"""Synthesize every sound effect and the full-length music score (all original, no samples).

usage: python tools/make_audio.py <public dir> <cues.json> <voiceover.mp3>
 - public/sfx/*.wav      sound effects (peak-normalised; levels are set per use in the scenes)
 - public/music.wav      score, sectioned by chapter, ducked under the voice-over
"""
import json, os, subprocess, sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, sosfiltfilt

SR = 44100
PUB, CUES, VO = sys.argv[1], sys.argv[2], sys.argv[3]
SFX = os.path.join(PUB, 'sfx'); os.makedirs(SFX, exist_ok=True)
Q = json.load(open(CUES))
rng = np.random.default_rng(11)

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a, r, curve=4.0):
    x = np.linspace(0, 1, n); e = np.minimum(1, x / max(a, 1e-4))
    return e * np.exp(-curve * np.maximum(0, x - a) / max(r, 1e-4))
def lp(x, f, o=2): return sosfilt(butter(o, min(f, SR / 2 - 100), 'low', fs=SR, output='sos'), x, axis=0)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x, axis=0)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, min(hi, SR / 2 - 100)], 'band', fs=SR, output='sos'), x, axis=0)
def noise(d): return rng.standard_normal(int(SR * d))
def fade(x, fi=0.004, fo=0.03):
    x = x.copy(); a, b = int(SR * fi), int(SR * fo)
    if a: x[:a] *= np.linspace(0, 1, a)[:, None] if x.ndim > 1 else np.linspace(0, 1, a)
    if b: x[-b:] *= np.linspace(1, 0, b)[:, None] if x.ndim > 1 else np.linspace(1, 0, b)
    return x
def save(name, x, peak=0.8):
    x = np.nan_to_num(x); x = fade(x); x = x / (np.max(np.abs(x)) + 1e-9) * peak
    if x.ndim == 1: x = np.stack([x, x], 1)
    wavfile.write(os.path.join(SFX, name + '.wav'), SR, (x * 32767).astype(np.int16))
def pan(x, p):  # p: 0 left .. 1 right (array or scalar)
    return np.stack([x * np.cos(p * np.pi / 2), x * np.sin(p * np.pi / 2)], 1)
def osc(freq):  # freq array -> phase-accumulated sine phase
    return 2 * np.pi * np.cumsum(freq) / SR
def sweep_noise(d, f0, f1, q=0.6):
    n = noise(d); out = np.zeros_like(n); blk = 512
    for i in range(0, len(n), blk):
        p = i / len(n); f = f0 * (f1 / f0) ** p
        out[i:i + blk] = bp(n[max(0, i - 2048):i + blk], f * (1 - q / 2), f * (1 + q / 2))[-len(n[i:i + blk]):]
    return out

def engine(freq, harmonics=14, grit=0.5, bright=3500):
    ph = osc(freq); x = np.zeros_like(ph)
    for h in range(1, harmonics + 1):
        x += np.sin(h * ph + rng.random() * 6) / h ** 0.9 * (1 + 0.3 * (h % 2))
    x += grit * bp(rng.standard_normal(len(ph)), 80, 900) * (0.4 + 0.6 * np.abs(np.sin(ph / 2)))
    return lp(np.tanh(x * 1.6), bright, 4)

# ------------------------------------------------------------------ basic UI sounds
d = 0.7; x = sweep_noise(d, 300, 2400); save('whoosh', x * np.sin(np.linspace(0, np.pi, len(x))) ** 2, 0.6)
d = 0.45; x = sweep_noise(d, 600, 3500); save('swish', x * np.sin(np.linspace(0, np.pi, len(x))) ** 3, 0.5)
d = 1.2; x = sweep_noise(d, 120, 900, 0.8); e = np.sin(np.linspace(0, np.pi, len(x))) ** 2
save('whoosh_deep', x * e + 0.4 * np.sin(osc(60 + 40 * np.linspace(0, 1, len(x)))) * e, 0.7)
d = 0.35; x = sweep_noise(d, 1500, 300, 0.7); save('whip', x * np.sin(np.linspace(0, np.pi, len(x))) ** 2, 0.6)
tt = t(0.12); save('pop', np.sin(osc(900 * np.exp(-tt * 30) + 250)) * env(len(tt), 0.003, 0.25, 6), 0.7)
tt = t(0.1); save('pop_high', np.sin(osc(1400 * np.exp(-tt * 35) + 500)) * env(len(tt), 0.002, 0.25, 7), 0.6)
tt = t(0.05); save('click', hp(noise(0.05), 2000) * env(len(tt), 0.001, 0.08, 9) + 0.4 * np.sin(2 * np.pi * 1800 * tt) * env(len(tt), 0.001, 0.05, 12), 0.6)
tt = t(0.03); save('tick', np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 200), 0.4)
d = 1.8; out = np.zeros(int(SR * d)); pos = 0.0
while pos < d - 0.06:
    c = hp(noise(0.04), 1500 + rng.random() * 1500) * env(int(SR * 0.04), 0.001, 0.1, 10)
    i = int(pos * SR); out[i:i + len(c)] += c * (0.6 + 0.4 * rng.random()); pos += 0.07 + rng.random() * 0.07
save('typing', out, 0.55)
tt = t(0.6); save('thud', np.sin(osc(110 * np.exp(-tt * 6) + 45)) * env(len(tt), 0.002, 0.5, 5) + 0.3 * lp(noise(0.6), 400) * env(len(tt), 0.001, 0.1, 10), 0.8)
tt = t(1.6); save('ding', sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * dc) for f, a, dc in [(880, 1, 3), (1760, .35, 4.5), (2640, .15, 6), (1318.5, .4, 3.5)]), 0.5)
a = sum(s * np.sin(2 * np.pi * f * t(0.9)) * np.exp(-t(0.9) * 4) for f, s in [(659.25, 1), (1318.5, .3)])
b = sum(s * np.sin(2 * np.pi * f * t(1.4)) * np.exp(-t(1.4) * 3) for f, s in [(987.77, 1), (1975.5, .3)])
x = np.zeros(int(SR * 1.6)); x[:len(a)] += a; x[int(SR * .16):int(SR * .16) + len(b)] += b; save('success', x, 0.5)
a = np.sin(2 * np.pi * 392 * t(.5)) * np.exp(-t(.5) * 5); b = np.sin(2 * np.pi * 311 * t(.8)) * np.exp(-t(.8) * 4)
x = np.zeros(int(SR * 1.0)); x[:len(a)] += a; x[int(SR * .18):int(SR * .18) + len(b)] += b; save('negative', lp(x, 2500), 0.5)
d = 2.0; tt = t(d); save('riser', sweep_noise(d, 200, 5000, .4) * (tt / d) ** 2 + .25 * np.sin(osc(200 + 600 * (tt / d) ** 2)) * (tt / d) ** 2, 0.5)
d = 1.0; tt = t(d); save('riser_short', sweep_noise(d, 400, 6000, .4) * (tt / d) ** 2 + .2 * np.sin(osc(300 + 900 * (tt / d) ** 2)) * (tt / d) ** 2, 0.5)
tt = t(1.8); save('boom', np.sin(osc(70 * np.exp(-tt * 2) + 35)) * env(len(tt), .003, 1.2, 3.5) + .25 * lp(noise(1.8), 1200) * env(len(tt), .001, .4, 6), 0.8)
d = 0.5; n = bp(noise(d), 1500, 7000); am = np.abs(lp(noise(d), 30)); am /= am.max(); save('paper', n * am * np.sin(np.linspace(0, np.pi, len(n))), 0.45)
tt = t(.4); save('stamp', .8 * np.sin(osc(160 * np.exp(-tt * 20) + 60)) * np.exp(-tt * 14) + .5 * bp(noise(.4), 500, 5000) * np.exp(-tt * 50), 0.75)
x = np.zeros(int(SR * 1.0))
for k_, f in enumerate([2093, 2637, 3136]):
    tt = t(.8); s = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 6) + .3 * np.sin(2 * np.pi * f * 2.7 * tt) * np.exp(-tt * 10); i = int(SR * .06 * k_); x[i:i + len(s)] += s
save('coin', x, 0.4)
tt = t(.9); save('tape', (np.sin(osc(80 + 200 * tt)) * .5 + .3 * bp(noise(.9), 300, 1500)) * np.sin(np.linspace(0, np.pi, len(tt))), 0.45)
x = np.zeros(int(SR * 1.6))
for _ in range(22):
    tt = t(.09); p = np.sin(osc((800 + rng.random() * 900) * np.exp(-tt * 30) + 300)) * env(len(tt), .002, .25, 7); i = int(rng.random() * SR * 1.45); x[i:i + len(p)] += p * (.4 + .6 * rng.random())
save('pops_many', x, 0.55)

# ------------------------------------------------------------------ cinematic
tt = t(2.5)
x = sum(np.sin(2 * np.pi * f * tt + rng.random() * 6) * np.exp(-tt * (1.2 + i * 0.3)) * (1 + .3 * np.sin(2 * np.pi * 5 * tt)) for i, f in enumerate([1046.5, 1318.5, 1568, 2093, 2637, 3136]))
save('shimmer', hp(x, 600) * env(len(tt), .05, 2, .8), 0.45)
tt = t(3.0)  # sting: warm major chord bloom + sub
x = sum(np.sin(2 * np.pi * f * tt) * (1 / (i + 1)) for i, f in enumerate([174.61, 220, 261.63, 349.23, 440, 523.25, 659.25]))
x = x * env(len(tt), .02, 2.6, 2.2) + .6 * np.sin(osc(55 * np.exp(-tt * .5) + 30)) * env(len(tt), .005, 1.5, 3)
save('sting', np.tanh(x * .8), 0.7)
d = 1.0; tt = t(d); x = sweep_noise(d, 300, 1800, .5) * np.sin(np.linspace(0, np.pi, len(tt))) + .3 * np.sin(osc(220 + 300 * np.sin(np.linspace(0, np.pi, len(tt))))) * np.sin(np.linspace(0, np.pi, len(tt)))
save('morph', x, 0.5)
tt = t(.9); x = np.sin(osc(2600 + 300 * np.sin(2 * np.pi * 9 * tt))) * .4 + bp(noise(.9), 1800, 5000)
save('screech', x * env(len(tt), .02, .8, 2.5), 0.5)

# ------------------------------------------------------------------ engines
d = 3.0; tt = t(d); u = (tt - d * 0.45) / 0.5
dop = 1 + 0.22 * (-np.tanh(u))  # pitch drops as it passes
amp = 1 / (1 + u ** 2 * 1.4); pp = 0.5 + 0.5 * np.tanh(u)
save('engine_by', pan(engine(95 * dop * (1 + .02 * np.sin(2 * np.pi * 7 * tt)), 16, .5, 5000) * amp, pp), 0.8)
x = engine(62 * dop, 10, .9, 2600) * amp; x = x + .4 * bp(noise(d), 60, 400) * amp
save('vintage_by', pan(x, pp), 0.8)
d = 2.2; tt = t(d); f0 = 55 + 120 * np.clip(np.sin(np.pi * np.clip(tt / 1.4, 0, 1)) ** 0.7, 0, 1) * (tt < 1.4) + 55 * (tt >= 1.4)
save('engine_rev', engine(f0, 14, .6, 4500) * env(len(tt), .05, 2.0, 1.2), 0.75)
d = 3.0; tt = t(d); save('engine_idle', engine(42 + 2 * np.sin(2 * np.pi * 1.3 * tt), 10, .9, 1800) * env(len(tt), .2, 2.6, .6), 0.6)
d = 3.5; tt = t(d); u = (tt - d / 2) / 0.9; dop = 1 + 0.08 * -np.tanh(u)
pl = np.sin(osc(48 * dop)); plane = engine(48 * dop, 8, .3, 1500) * (0.6 + 0.4 * (np.sin(osc(24 * dop)) > 0))
save('plane', pan(plane / (1 + u ** 2 * .5), .5 + .5 * np.tanh(u)), 0.7)

# ------------------------------------------------------------------ crowd / world
def crowd(d, swell=False):
    tt = t(d); x = np.zeros(len(tt))
    for k in range(30):
        f = 180 + rng.random() * 500
        vib = np.sin(osc(f * (1 + .02 * np.sin(2 * np.pi * (3 + rng.random() * 4) * tt))))
        am = np.abs(lp(noise(d), 4)); am /= am.max() + 1e-9
        x += bp(vib + .5 * noise(d), f * .7, f * 3) * am
    x += .5 * bp(noise(d), 300, 3000)
    e = np.sin(np.linspace(0, np.pi, len(tt))) ** (1 if swell else .3)
    return x * e
save('crowd', crowd(3.5), 0.45)
save('cheer', hp(crowd(2.8, True), 400) * 1.0, 0.55)
tt = t(3.0); x = np.zeros(len(tt))
for k in range(5):
    ch = np.sin(2 * np.pi * (4200 + k * 300) * tt) * (np.sin(2 * np.pi * (14 + k) * tt) > .6) * (np.sin(2 * np.pi * (.9 + k * .2) * tt + k) > 0)
    x += ch * (0.5 + 0.5 * rng.random())
save('crickets', lp(x, 6000) * env(len(tt), .3, 2.6, .8), 0.25)
tt = t(2.0); save('buzz', np.sin(osc(560 + 40 * np.sin(2 * np.pi * 3 * tt))) * (.5 + .5 * np.sin(2 * np.pi * .7 * tt)) * .6 + .1 * noise(2.0), 0.2)
tt = t(.2); save('slap', bp(noise(.2), 600, 5000) * np.exp(-tt * 40) + .5 * np.sin(osc(180 * np.exp(-tt * 20) + 80)) * np.exp(-tt * 25), 0.7)
tt = t(.25); x = hp(noise(.25), 2500) * np.exp(-tt * 60); x[int(SR * .06):] += .7 * hp(noise(.25), 2000)[:len(x) - int(SR * .06)] * np.exp(-tt[:len(x) - int(SR * .06)] * 50)
save('shutter', x, 0.6)
d = 1.0; tt = t(d); am = np.abs(lp(noise(d), 12)); am /= am.max(); save('brush', bp(noise(d), 1200, 6000) * am * np.sin(np.linspace(0, np.pi, len(tt))), 0.4)
d = 3.0; save('wind', sweep_noise(d, 300, 900, 1.0) * np.sin(np.linspace(0, np.pi, int(SR * d))) ** 1.5, 0.4)
tt = t(1.5); save('clink', sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * (5 + i * 2)) for i, f in enumerate([2350, 3510, 4730, 6120])) + np.concatenate([np.zeros(int(SR * .12)), sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * (5 + i * 2)) for i, f in enumerate([2480, 3700, 5010]))[:-int(SR * .12)]]), 0.4)
d = 1.6; out = np.zeros(int(SR * d)); pos = 0.0
while pos < d - .1:
    ln = .05 + rng.random() * .1; c = bp(noise(ln), 2500, 8000) * np.sin(np.linspace(0, np.pi, int(SR * ln)))
    i = int(pos * SR); out[i:i + len(c)] += c[:len(out) - i]; pos += ln + rng.random() * .03
save('scribble', out, 0.4)
tt = t(.7); save('door', .9 * np.sin(osc(90 * np.exp(-tt * 8) + 40)) * np.exp(-tt * 9) + .5 * bp(noise(.7), 200, 2500) * np.exp(-tt * 25), 0.8)
tt = t(1.4); save('gate', np.sin(osc(300 + 80 * np.sin(2 * np.pi * 1.5 * tt))) * .3 * bp(noise(1.4), 400, 3000) * 3 + .2 * np.sin(osc(900 + 200 * tt)), 0.4)
tt = t(2.0); save('descend', np.sin(osc(600 * np.exp(-tt * 1.2) + 80)) * env(len(tt), .02, 1.8, 1.5) + .2 * sweep_noise(2.0, 3000, 200, .5), 0.5)
tt = t(3.0); save('thunder', lp(noise(3.0), 300, 3) * env(len(tt), .02, 2.6, 2) + .3 * lp(noise(3.0), 1200) * env(len(tt), .005, .2, 8), 0.7)
d = 3.0; tt = t(d); x = .3 * lp(noise(d), 800)
for _ in range(60):
    i = int(rng.random() * (len(tt) - 2000)); c = hp(noise(.02), 1500) * np.exp(-t(.02) * 200); x[i:i + len(c)] += c * rng.random()
save('fire', x * env(len(tt), .2, 2.6, .8), 0.5)
d = 1.6; out = np.zeros(int(SR * d))
for _ in range(40):
    i = int(rng.random() * SR * 1.4); c = bp(noise(.05), 300 + rng.random() * 2000, 5000) * np.exp(-t(.05) * 80); out[i:i + len(c)] += c * rng.random()
save('crumble', out + .3 * lp(noise(d), 200) * env(len(out), .01, 1.4, 3), 0.6)
tt = t(.3); save('crack', hp(noise(.3), 1500) * np.exp(-tt * 30) + .4 * np.sin(osc(2000 * np.exp(-tt * 40) + 300)) * np.exp(-tt * 30), 0.6)
x = np.zeros(int(SR * 1.2))
for k in range(6):
    tt = t(.15); c = sum(np.sin(2 * np.pi * f * tt) for f in [3100, 4400, 5900]) * np.exp(-tt * 40) + bp(noise(.15), 2000, 8000) * np.exp(-tt * 60); i = int(SR * (.05 + k * .12 + rng.random() * .04)); x[i:i + len(c)] += c
save('chain', x, 0.5)
tt = t(1.2); save('scan', np.sin(osc(800 + 1200 * tt / 1.2)) * .3 * (np.sin(2 * np.pi * 30 * tt) > 0) + .1 * hp(noise(1.2), 4000), 0.3)
tt = t(2.0); save('machine', (np.sin(osc(120)) * .4 + bp(noise(2.0), 400, 2000) * .5) * (.5 + .5 * (np.sin(2 * np.pi * 6 * tt) > 0)) * env(len(tt), .1, 1.8, .8), 0.45)
tt = t(4.0); save('drone_dark', (np.sin(2 * np.pi * 55 * tt) + .5 * np.sin(2 * np.pi * 82.4 * tt + 1) + .3 * lp(noise(4.0), 200)) * env(len(tt), .5, 3.4, 1.0), 0.6)
tt = t(1.0); save('bomb', np.sin(osc(1800 - 1300 * tt)) * .4 * np.minimum(1, tt * 3), 0.4)
tt = t(3.0); save('explosion', np.tanh(3 * (lp(noise(3.0), 500, 3) * env(len(tt), .005, 2.6, 2.5) + .8 * np.sin(osc(50 * np.exp(-tt * 2) + 28)) * env(len(tt), .002, 1.5, 3) + .4 * bp(noise(3.0), 800, 5000) * env(len(tt), .001, .3, 8))), 0.85)
x = np.zeros(int(SR * 1.4)); tt = t(.06); ch = hp(noise(.06), 2000) * np.exp(-tt * 80)
for k in range(4): x[int(SR * k * .07):int(SR * k * .07) + len(ch)] += ch
tt = t(1.0); bell = sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 4) for f in [2637, 3951]); x[int(SR * .35):int(SR * .35) + len(bell)] += bell * .6
save('register', x, 0.5)
tt = t(1.8); save('bell', sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * dc) for f, a, dc in [(1318.5, 1, 2.5), (1975.5, .5, 3), (2637, .3, 4)]) * (1 + .3 * np.sin(2 * np.pi * 7 * tt)), 0.45)
tt = t(2.2); tk = np.zeros(len(tt))
for k in range(8):
    c = np.sin(2 * np.pi * (3200 if k % 2 else 2600) * t(.02)) * np.exp(-t(.02) * 250); i = int(SR * k * .25); tk[i:i + len(c)] += c
save('clock', tk, 0.4)
tt = t(5.0)  # low, respectful bell toll (memorial moment)
x = sum(a_ * np.sin(2 * np.pi * f * tt) * np.exp(-tt * d_) for f, a_, d_ in [(196, 1, .7), (392, .5, 1.0), (466, .35, 1.3), (588, .25, 1.6), (784, .15, 2.2), (98, .4, .6)])
save('toll', x * np.minimum(1, tt / 0.01), 0.7)
print('sfx done:', len(os.listdir(SFX)))

# ================================================================== MUSIC
END = Q['_end'] + 4.5
N = int(SR * END)
L = np.zeros(N); R = np.zeros(N)
BPM = 84; BEAT = 60 / BPM; BAR = BEAT * 4
NOTE = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
def chord(name):
    minor = name.endswith('m'); root = NOTE[name[:-1] if minor else name]
    return root, [0, 3, 7] if minor else [0, 4, 7]
def hz(semi, octave): return 440 * 2 ** ((semi - 9) / 12 + (octave - 4))

def add(sig, start, gainL=1.0, gainR=1.0):
    i = int(start * SR)
    if i >= N or i + len(sig) <= 0: return
    a, b = max(i, 0), min(i + len(sig), N); s = sig[a - i:b - i]
    L[a:b] += s * gainL; R[a:b] += s * gainR

def pad_note(f, d, bright=1.0):
    tt = t(d); x = np.zeros(len(tt))
    for det in (-0.12, 0.0, 0.13):
        ph = 2 * np.pi * f * (1 + det / 100) * tt + rng.random() * 6
        x += sum(np.sin(k * ph) / k * (bright if k > 2 else 1) for k in range(1, 6))
    a = min(1.2, d * 0.3)
    e = np.minimum(1, tt / a) * np.minimum(1, (d - tt) / a)
    return x * e / 6

def pluck(f, d=1.2, bright=1.0):
    tt = t(d)
    x = sum(np.sin(2 * np.pi * f * k * tt) * np.exp(-tt * (3 + k * 1.6)) / k ** (1.3 / bright) for k in range(1, 9))
    return x * np.minimum(1, tt / 0.003)

def kick():
    tt = t(.4); return np.sin(osc(110 * np.exp(-tt * 25) + 45)) * np.exp(-tt * 9)
def hat():
    tt = t(.06); return hp(noise(.06), 7000) * np.exp(-tt * 70)
def bassnote(f, d):
    tt = t(d); return (np.sin(2 * np.pi * f * tt) + .25 * np.sin(4 * np.pi * f * tt)) * np.minimum(1, tt / .01) * np.exp(-tt * 1.2)

# sections: (start, end, chords, settings)
S = [
    (0.0, Q['why'], ['Dm', 'Bb', 'F', 'C'], dict(pad=.5, arp=.55, bass=.6, kick=.35, hat=.0, kick_from=Q['backwards'], bright=1.0, oct=4)),
    (Q['welcome'] + 0.2, Q['goback'], ['F', 'F'], dict(pad=.9, arp=.0, bass=.4, kick=0, hat=0, bright=1.3, oct=4, swell=True)),
    (Q['goback'], Q['by1929'], ['F', 'C', 'Dm', 'Bb'], dict(pad=.45, arp=.45, bass=.4, kick=0, hat=0, bright=.9, oct=5)),
    (Q['by1929'], Q['runsout'], ['C', 'Am', 'F', 'G'], dict(pad=.4, arp=.5, bass=.55, kick=.28, hat=.12, bright=1.0, oct=4)),
    (Q['runsout'], Q['last'], ['Am', 'F', 'Dm', 'E'], dict(pad=.5, arp=.0, bass=.6, pulse=.5, kick=.2, hat=0, bright=.7, oct=4)),
    (Q['last'], Q['whatdo'], ['Dm', 'Bb', 'Gm', 'A'], dict(pad=.55, arp=.25, bass=.6, pulse=.5, kick=.3, hat=.08, bright=.8, oct=4)),
    (Q['whatdo'], Q['mar12'], ['Em', 'C', 'Am', 'B'], dict(pad=.5, arp=.2, bass=.5, kick=0, hat=0, bright=.6, oct=4, sparse=True)),
    (Q['mar12'], Q['roadq'], ['D', 'A', 'Bm', 'G'], dict(pad=.55, arp=.55, bass=.65, kick=.35, hat=.14, bright=1.2, oct=5)),
    (Q['roadq'], Q['but1908'], ['G', 'D', 'Em', 'C'], dict(pad=.4, arp=.45, bass=.5, kick=.25, hat=.1, bright=1.0, oct=4)),
    (Q['but1908'], END, ['F', 'C', 'Dm', 'Bb'], dict(pad=.6, arp=.35, bass=.45, kick=0, hat=0, bright=1.1, oct=5, swell=True)),
]
XF = 1.6  # crossfade between sections
for si, (a, b, chords, st) in enumerate(S):
    secL = np.zeros(N); secR = np.zeros(N)
    Lb, Rb = L.copy(), R.copy(); L[:] = 0; R[:] = 0
    t0 = a - XF; tcur = t0; ci = 0; step = 0
    chord_len = BAR * 2
    while tcur < b + XF:
        root, iv = chord(chords[ci % len(chords)])
        o = st['oct']
        # pad
        for k, semi in enumerate(iv):
            n = pad_note(hz(root + semi, 3 if k == 0 else 4), chord_len + 1.0, st['bright'])
            add(n * st['pad'] * .5, tcur - .5, .6 + .2 * (k - 1), .6 - .2 * (k - 1))
        # bass
        if st['bass']:
            if st.get('pulse'):
                for k in range(16):
                    add(bassnote(hz(root, 2), BEAT / 2 * .9) * st['bass'] * .55 * (1 if k % 2 == 0 else .6), tcur + k * BEAT / 2)
            else:
                for k in range(2):
                    add(bassnote(hz(root, 2), BAR) * st['bass'] * .6, tcur + k * BAR)
        # arpeggio (plucked, mandolin-like)
        if st['arp']:
            pattern = [0, 1, 2, 1, 0, 2, 1, 2] if not st.get('sparse') else [0, -1, 2, -1, -1, 1, -1, -1]
            notes = [hz(root + iv[0], o), hz(root + iv[1], o), hz(root + iv[2], o), hz(root + 12, o)]
            for k in range(16):
                p = pattern[k % 8]
                if p < 0: continue
                f = notes[p if k % 16 < 8 else min(3, p + 1)]
                pl = pluck(f, 1.0, st['bright']) * st['arp'] * .35
                pn = .3 + .4 * ((k * 3) % 5) / 4
                add(pl, tcur + k * BEAT / 2, 1 - pn, pn)
                if st['arp'] > .4:  # tremolo double for an Italian mandolin flavour
                    add(pluck(f * 2, .4, st['bright']) * st['arp'] * .08, tcur + k * BEAT / 2 + BEAT / 4, pn, 1 - pn)
        # drums
        kf = st.get('kick_from', a)
        for k in range(8):
            tb = tcur + k * BEAT
            if st['kick'] and tb >= kf:
                if k % 4 in (0, 2): add(kick() * st['kick'], tb)
            if st['hat'] and tb >= kf:
                add(hat() * st['hat'], tb + BEAT / 2, .4, .6)
        tcur += chord_len; ci += 1
    # section envelope with crossfades
    tt = np.arange(N) / SR
    e = np.clip((tt - (a - XF)) / XF, 0, 1) * np.clip(((b + XF) - tt) / XF, 0, 1)
    if st.get('swell'):
        e *= np.clip((tt - a) / 3.0 + .35, 0, 1)
    # cold open builds over its length
    if si == 0:
        e *= .55 + .45 * np.clip(tt / Q['why'], 0, 1)
    L[:] = Lb + L * e; R[:] = Rb + R * e

# drop out before "Why is that?" and slam back on the logo
tt = np.arange(N) / SR
gap = 1 - np.clip((tt - (Q['why'] - .4)) / .4, 0, 1) * np.clip((Q['welcome'] + .25 - tt) / .1, 0, 1)
L *= gap; R *= gap

# gentle stereo reverb (multi-tap)
def verb(x):
    y = x.copy()
    for dly, g in [(.031, .35), (.047, .3), (.073, .25), (.113, .2), (.167, .15), (.241, .1)]:
        d = int(SR * dly); y[d:] += g * x[:-d]
    return lp(y, 7000)
L, R = verb(L), verb(R[::1])

# ---- ducking under the voice-over
raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', VO, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
vo = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
vo = np.pad(vo, (0, max(0, N - len(vo))))[:N]
win = int(SR * .05)
rms = np.sqrt(np.convolve(vo ** 2, np.ones(win) / win, mode='same'))
speech = (rms > 0.02).astype(float)
# attack 60ms / release 500ms smoothing
sm = np.zeros(N); a_c = np.exp(-1 / (SR * .06)); r_c = np.exp(-1 / (SR * .5))
blk = 64
v = 0.0
for i in range(0, N, blk):
    target = speech[i:i + blk].max()
    c = a_c ** blk if target > v else r_c ** blk
    v = target + (v - target) * c
    sm[i:i + blk] = v
duck = 1 - 0.42 * sm  # about -4.7 dB under speech
L *= duck; R *= duck

mix = np.stack([L, R], 1)
mix = fade(mix, 0.3, 4.0)
# loudness: music bed sits ~12 LU under the voice
try:
    import pyloudnorm as pyln
    meter = pyln.Meter(SR); lufs = meter.integrated_loudness(mix)
    mix = mix * 10 ** ((-27.0 - lufs) / 20)
    print('music LUFS', lufs, '-> -27')
except Exception as ex:
    print('pyloudnorm failed', ex); mix = mix / np.abs(mix).max() * .25
mix = np.clip(mix, -0.98, 0.98)
wav = os.path.join(PUB, 'music.wav')
wavfile.write(wav, SR, (mix * 32767).astype(np.int16))
# lossless FLAC keeps the repo small (WAV is ~94 MB, near GitHub's 100 MB file limit)
subprocess.run(['ffmpeg', '-v', 'quiet', '-y', '-i', wav, '-c:a', 'flac', '-compression_level', '8', os.path.join(PUB, 'music.flac')], check=True)
os.remove(wav)
print('music done', END, 's')
