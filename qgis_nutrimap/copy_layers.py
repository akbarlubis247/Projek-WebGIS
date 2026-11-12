import os
import shutil
import glob

src_dir = r"d:\semester 5\Sistem Informasi Geografis\pertemuan3\KOTA BOGOR\KOTA BOGOR"
dst_dir = r"d:\semester 5\Sistem Informasi Geografis\PROJEK\qgis_nutrimap\satu_peta_layers"
os.makedirs(dst_dir, exist_ok=True)

layers_to_copy = [
    "KESEHATAN_PT_25K",
    "RUMAHSAKIT_PT_25K",
    "NIAGA_PT_25K",
    "SUNGAI_AR_25K",
    "JALAN_LN_25K",
    "PEMERINTAHAN_PT_25K"
]

for lyr in layers_to_copy:
    for f in glob.glob(os.path.join(src_dir, f"{lyr}.*")):
        shutil.copy2(f, dst_dir)

print("Copied Satu Peta layers successfully!")
