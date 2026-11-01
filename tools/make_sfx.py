"""Synthesize the video's sound effects and ambient music bed (all original, no samples)."""
import sys, os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
OUT = sys.argv[1]
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a, r, curve=4.0):
    x = np.linspace(0, 1, n)
    e = np.minimum(1, x / max(a, 1e-4))
    return e * np.exp(-curve * np.maximum(0, x - a) / max(r, 1e-4))
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def fade(x, fi=0.005, fo=0.02):
    x = x.copy(); a, b = int(SR*fi), int(SR*fo)
    if a: x[:a] *= np.linspace(0, 1, a)
    if b: x[-b:] *= np.linspace(1, 0, b)
    return x
def save(name, x, peak=0.8):
    x = fade(x); x = x / (np.max(np.abs(x)) + 1e-9) * peak
    if x.ndim == 1: x = np.stack([x, x], 1)
    wavfile.write(os.path.join(OUT, name + '.wav'), SR, (x * 32767).astype(np.int16))

def sweep_noise(d, f0, f1, q=0.6):
    n = rng.standard_normal(int(SR*d)); out = np.zeros_like(n); blk = 512
    for i in range(0, len(n), blk):
        p = i / len(n); f = f0 * (f1/f0) ** p
        out[i:i+blk] = bp(n[max(0,i-2048):i+blk], f*(1-q/2), min(f*(1+q/2), SR/2-100))[-len(n[i:i+blk]):]
    return out

# whoosh: band-passed noise sweeping up then down, bell-shaped envelope
d = 0.7; x = sweep_noise(d, 300, 2400); e = np.sin(np.linspace(0, np.pi, len(x)))**2
save('whoosh', x*e, 0.6)
d = 0.45; x = sweep_noise(d, 600, 3500); e = np.sin(np.linspace(0, np.pi, len(x)))**3
save('swish', x*e, 0.5)
# pop: short pitched blip
tt = t(0.12); f = 900*np.exp(-tt*30)+250
save('pop', np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(tt), 0.003, 0.25, 6), 0.7)
tt = t(0.1); f = 1400*np.exp(-tt*35)+500
save('pop_high', np.sin(2*np.pi*np.cumsum(f)/SR) * env(len(tt), 0.002, 0.25, 7), 0.6)
# click / tick (typewriter-ish)
tt = t(0.05); x = hp(rng.standard_normal(len(tt)), 2000) * env(len(tt), 0.001, 0.08, 9) + 0.4*np.sin(2*np.pi*1800*tt)*env(len(tt),0.001,0.05,12)
save('click', x, 0.6)
# typing: burst of clicks ~1.2s
d = 1.4; out = np.zeros(int(SR*d)); pos = 0.0
while pos < d - 0.06:
    tt = t(0.04); c = hp(rng.standard_normal(len(tt)), 1500+rng.random()*1500) * env(len(tt), 0.001, 0.1, 10)
    i = int(pos*SR); out[i:i+len(c)] += c * (0.6+0.4*rng.random()); pos += 0.06 + rng.random()*0.08
save('typing', out, 0.55)
# thud: low impact
tt = t(0.6); f = 110*np.exp(-tt*6)+45
x = np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(tt), 0.002, 0.5, 5) + 0.3*lp(rng.standard_normal(len(tt)), 400)*env(len(tt),0.001,0.1,10)
save('thud', x, 0.8)
# gavel: woody knock (two hits)
def knock():
    tt = t(0.35)
    modes = [(420,1.0),(1010,0.5),(1730,0.25),(2600,0.12)]
    x = sum(a*np.sin(2*np.pi*f*tt)*np.exp(-tt*(18+f/120)) for f,a in modes)
    x += 0.5*bp(rng.standard_normal(len(tt)), 800, 4000)*np.exp(-tt*120)
    return x
g = np.zeros(int(SR*0.75)); k = knock(); g[:len(k)] += k; g[int(SR*0.28):int(SR*0.28)+len(k)] += 0.8*k
save('gavel', g, 0.8)
# chime/ding: soft bell
tt = t(1.6)
x = sum(a*np.sin(2*np.pi*f*tt)*np.exp(-tt*dcy) for f,a,dcy in [(880,1,3),(1760,0.35,4.5),(2640,0.15,6),(1318.5,0.4,3.5)])
save('ding', x*env(len(tt),0.004,1,0.1), 0.5)
# success: two-note rising chime
a = sum(s*np.sin(2*np.pi*f*t(0.9))*np.exp(-t(0.9)*4) for f,s in [(659.25,1),(1318.5,0.3)])
b = sum(s*np.sin(2*np.pi*f*t(1.4))*np.exp(-t(1.4)*3) for f,s in [(987.77,1),(1975.5,0.3)])
x = np.zeros(int(SR*1.6)); x[:len(a)] += a; x[int(SR*0.16):int(SR*0.16)+len(b)] += b
save('success', x, 0.5)
# negative: two-note falling soft tone
a = np.sin(2*np.pi*392*t(0.5))*np.exp(-t(0.5)*5); b = np.sin(2*np.pi*311*t(0.8))*np.exp(-t(0.8)*4)
x = np.zeros(int(SR*1.0)); x[:len(a)] += a; x[int(SR*0.18):int(SR*0.18)+len(b)] += b
save('negative', lp(x, 2500), 0.5)
# riser: rising filtered noise + tone, 2s
d = 2.0; tt = t(d); x = sweep_noise(d, 200, 5000, 0.4)*(tt/d)**2 + 0.25*np.sin(2*np.pi*np.cumsum(200+600*(tt/d)**2)/SR)*(tt/d)**2
save('riser', x, 0.5)
# impact boom (soft, for big reveals)
tt = t(1.8); f = 70*np.exp(-tt*2)+35
x = np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(tt),0.003,1.2,3.5) + 0.25*lp(rng.standard_normal(len(tt)),1200)*env(len(tt),0.001,0.4,6)
save('boom', x, 0.8)
# paper / page rustle
d = 0.5; tt = t(d); n = bp(rng.standard_normal(len(tt)), 1500, 7000)
am = np.abs(lp(rng.standard_normal(len(tt)), 30)); am /= am.max()
save('paper', n*am*np.sin(np.linspace(0,np.pi,len(tt))), 0.45)
# stamp: thump + paper slap
tt = t(0.4); x = 0.8*np.sin(2*np.pi*np.cumsum(160*np.exp(-tt*20)+60)/SR)*np.exp(-tt*14) + 0.5*bp(rng.standard_normal(len(tt)),500,5000)*np.exp(-tt*50)
save('stamp', x, 0.75)
# cash register-ish coin chime
x = np.zeros(int(SR*1.0))
for k_, f in enumerate([2093, 2637, 3136]):
    tt = t(0.8); s = np.sin(2*np.pi*f*tt)*np.exp(-tt*6)+0.3*np.sin(2*np.pi*f*2.7*tt)*np.exp(-tt*10)
    i = int(SR*0.06*k_); x[i:i+len(s)] += s
save('coin', x, 0.4)
# phone ring (old dual-tone burst, soft)
tt = t(1.0); ring = (np.sin(2*np.pi*440*tt)+np.sin(2*np.pi*480*tt)) * (0.5+0.5*np.sign(np.sin(2*np.pi*20*tt)))
save('ring', lp(ring, 3000)*env(len(tt),0.01,0.9,0.5), 0.35)
# glitch / static blip
tt = t(0.3); x = rng.standard_normal(len(tt)) * (np.sin(2*np.pi*35*tt) > 0) * np.exp(-tt*6)
save('glitch', bp(x, 800, 6000), 0.4)
# tape / mechanical spin
tt = t(0.9); x = np.sin(2*np.pi*np.cumsum(80+200*tt)/SR)*0.5 + 0.3*bp(rng.standard_normal(len(tt)),300,1500)
save('tape', x*np.sin(np.linspace(0,np.pi,len(tt))), 0.4)
# crowd of pops (people flooding in)
x = np.zeros(int(SR*1.6))
for _ in range(22):
    tt = t(0.09); f = (800+rng.random()*900)*np.exp(-tt*30)+300
    p = np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(tt),0.002,0.25,7); i = int(rng.random()*SR*1.45); x[i:i+len(p)] += p*(0.4+0.6*rng.random())
save('pops_many', x, 0.55)
# soft tick (counter)
tt = t(0.03); save('tick', np.sin(2*np.pi*2400*tt)*np.exp(-tt*200), 0.4)

# --- ambient bed: slow evolving pad, full video length ---
dur = float(sys.argv[2]) if len(sys.argv) > 2 else 600
N = int(SR*dur); tt = np.arange(N)/SR
chords = [[110.0,164.81,220.0,277.18],[98.0,146.83,196.0,246.94],[87.31,130.81,174.61,220.0],[103.83,155.56,207.65,261.63]]
seg = 16.0
L = np.zeros(N); R = np.zeros(N)
for ci in range(int(dur/seg)+2):
    ch = chords[ci % len(chords)]
    st = int((ci*seg - 4)*SR); ln = int((seg+8)*SR)
    a, b = max(st,0), min(st+ln, N)
    if a >= b: continue
    lt = (np.arange(a,b)-st)/SR
    w = np.sin(np.pi*np.clip(lt/(seg+8),0,1))**2
    for j, f in enumerate(ch):
        for det, pan in [(-0.6, 0.3), (0.6, 0.7)]:
            s = np.sin(2*np.pi*(f+det)*lt + j) + 0.25*np.sin(2*np.pi*2*(f+det)*lt)
            L[a:b] += s*w*(1-pan)*0.2; R[a:b] += s*w*pan*0.2
lfo = 0.75+0.25*np.sin(2*np.pi*tt/23)
L = lp(L*lfo, 900, 2); R = lp(R*lfo, 900, 2)
air = lp(hp(rng.standard_normal(N), 2000), 6000)*0.004
L += air; R += np.roll(air, 1000)
fi, fo = int(SR*4), int(SR*6)
for ch_ in (L, R):
    ch_[:fi] *= np.linspace(0,1,fi); ch_[-fo:] *= np.linspace(1,0,fo)
pk = max(np.abs(L).max(), np.abs(R).max())
wavfile.write(os.path.join(OUT, '..', 'ambient.wav'), SR, (np.stack([L,R],1)/pk*0.7*32767).astype(np.int16))
print('done')
