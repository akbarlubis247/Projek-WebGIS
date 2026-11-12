import os
import re
import json

# Read indicators from bogorKelurahanData.js
js_file = r"d:\semester 5\Sistem Informasi Geografis\PROJEK\src\data\bogorKelurahanData.js"
with open(js_file, "r", encoding="utf-8") as f:
    text = f.read()

pattern = re.compile(
    r'id:\s*"([^"]+)",\s*nama:\s*"([^"]+)",\s*kecamatan:\s*"([^"]+)",\s*stunting:\s*([0-9.]+),\s*kemiskinan:\s*([0-9.]+),\s*kerentananPangan:\s*([0-9.]+),\s*airBersih:\s*([0-9.]+)'
)

data = {}
for m in pattern.finditer(text):
    k_id, nama, kec, stunting, kemiskinan, kerentanan, air = m.groups()
    data[nama.strip().lower()] = {
        "id": k_id,
        "nama": nama.strip(),
        "kecamatan": kec.strip(),
        "stunting": float(stunting),
        "kemiskinan": float(kemiskinan),
        "kerentanan": float(kerentanan),
        "air_bersih": float(air)
    }

print("Loaded indicators count:", len(data))

from osgeo import ogr, osr

shp_in = r"d:\semester 5\Sistem Informasi Geografis\pertemuan3\KOTA BOGOR\KOTA BOGOR\ADMINISTRASIDESA_AR_25K.shp"
ds_in = ogr.Open(shp_in)
lyr_in = ds_in.GetLayer()
srs = lyr_in.GetSpatialRef()

out_dir = r"d:\semester 5\Sistem Informasi Geografis\PROJEK\qgis_nutrimap"
shp_out = os.path.join(out_dir, "KOTA_BOGOR_KELURAHAN_NUTRIMAP.shp")

driver = ogr.GetDriverByName("ESRI Shapefile")
if os.path.exists(shp_out):
    driver.DeleteDataSource(shp_out)

ds_out = driver.CreateDataSource(shp_out)
lyr_out = ds_out.CreateLayer("KOTA_BOGOR_KELURAHAN_NUTRIMAP", srs, ogr.wkbPolygon)

# Fields to add
fields_def = [
    ("KODEPUM", ogr.OFTString, 20),
    ("KELURAHAN", ogr.OFTString, 50),
    ("KECAMATAN", ogr.OFTString, 50),
    ("KOTA", ogr.OFTString, 50),
    ("STUNTING", ogr.OFTReal, 10),
    ("KEMISKINAN", ogr.OFTReal, 10),
    ("KERENTANAN", ogr.OFTReal, 10),
    ("AIR_BERSIH", ogr.OFTReal, 10),
    ("PRIORITAS", ogr.OFTString, 20)
]

for name, ftype, width in fields_def:
    fld = ogr.FieldDefn(name, ftype)
    if width:
        fld.SetWidth(width)
    if ftype == ogr.OFTReal:
        fld.SetPrecision(2)
    lyr_out.CreateField(fld)

out_defn = lyr_out.GetLayerDefn()

count = 0
unmatched = []
for feat in lyr_in:
    if feat.GetField("WADMKK") != "Kota Bogor":
        continue
    
    count += 1
    raw_name = feat.GetField("NAMOBJ").strip()
    raw_kec = feat.GetField("WADMKC").strip()
    key = raw_name.lower()
    
    # lookup data
    info = data.get(key)
    if not info:
        # fuzzy match or name variations
        for k in data:
            if k in key or key in k:
                info = data[k]
                break
                
    stunting_val = info["stunting"] if info else 12.0
    kemiskinan_val = info["kemiskinan"] if info else 5.0
    kerentanan_val = info["kerentanan"] if info else 30.0
    air_val = info["air_bersih"] if info else 90.0
    
    # Calculate priority
    # stunting > 17 or kerentanan > 45 -> Prioritas 1 (Tinggi / Darurat)
    # stunting > 13 or kerentanan > 30 -> Prioritas 2 (Sedang / Waspada)
    # else -> Prioritas 3 (Rendah / Terkendali)
    if stunting_val >= 17.0 or kerentanan_val >= 45.0:
        prioritas_str = "Prioritas 1 (Tinggi)"
    elif stunting_val >= 12.0 or kerentanan_val >= 30.0:
        prioritas_str = "Prioritas 2 (Sedang)"
    else:
        prioritas_str = "Prioritas 3 (Rendah)"
        
    out_feat = ogr.Feature(out_defn)
    out_feat.SetGeometry(feat.GetGeometryRef())
    out_feat.SetField("KODEPUM", feat.GetField("KDPPUM") or f"32.71.{count:02d}")
    out_feat.SetField("KELURAHAN", raw_name)
    out_feat.SetField("KECAMATAN", raw_kec)
    out_feat.SetField("KOTA", "Kota Bogor")
    out_feat.SetField("STUNTING", stunting_val)
    out_feat.SetField("KEMISKINAN", kemiskinan_val)
    out_feat.SetField("KERENTANAN", kerentanan_val)
    out_feat.SetField("AIR_BERSIH", air_val)
    out_feat.SetField("PRIORITAS", prioritas_str)
    
    lyr_out.CreateFeature(out_feat)

ds_out = None
ds_in = None
print(f"Successfully exported {count} Kota Bogor Kelurahan with NutriMap indicators!")
