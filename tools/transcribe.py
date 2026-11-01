"""Word-level transcript of the voiceover -> JSON [{w, s, e}]."""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', sys.argv[1], '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True).stdout
audio = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
m = WhisperModel('small.en', device='cpu', compute_type='int8')
segs, _ = m.transcribe(audio, word_timestamps=True, beam_size=5, vad_filter=False)
out = [{'w': w.word.strip(), 's': round(w.start, 2), 'e': round(w.end, 2)} for s in segs for w in s.words]
json.dump(out, open(sys.argv[2], 'w'), indent=0)
print(len(out), 'words, last end', out[-1]['e'])
