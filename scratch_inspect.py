import os

base = r'c:\Users\darka\Desktop\obedsilck tech'
dirs = [d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d)) and d not in ['assets', 'css', 'js', '.git']]

for d in dirs:
    d_path = os.path.join(base, d)
    files = sorted([f for f in os.listdir(d_path) if f.lower().endswith(('.jpeg', '.jpg', '.png'))])
    print(f'FOLDER: "{d}" ({len(files)} images)')
    for idx, f in enumerate(files):
        print(f'  [{idx}] {f}')
