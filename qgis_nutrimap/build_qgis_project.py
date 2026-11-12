import os
import sys

from qgis.core import (
    QgsApplication,
    QgsProject,
    QgsVectorLayer,
    QgsGraduatedSymbolRenderer,
    QgsRendererRange,
    QgsFillSymbol,
    QgsMarkerSymbol,
    QgsLineSymbol,
    QgsPalLayerSettings,
    QgsVectorLayerSimpleLabeling,
    QgsTextFormat,
    QgsTextBufferSettings,
    QgsCoordinateReferenceSystem,
    QgsMapSettings,
    QgsMapRendererParallelJob,
    QgsRectangle,
    QgsUnitTypes
)
from PyQt5.QtGui import QColor, QFont, QImage, QPainter
from PyQt5.QtCore import QSize

qgs = QgsApplication([], False)
qgs.initQgis()

project = QgsProject.instance()
project.clear()
project.setTitle("NutriMap Kota Bogor - Pemetaan Stunting & Ketahanan Pangan")

base_dir = r"d:\semester 5\Sistem Informasi Geografis\PROJEK\qgis_nutrimap"
layers_dir = os.path.join(base_dir, "satu_peta_layers")

# 1. Main Polygon: Kelurahan Kota Bogor
kelurahan_path = os.path.join(base_dir, "KOTA_BOGOR_KELURAHAN_NUTRIMAP.shp")
vlayer_kelurahan = QgsVectorLayer(kelurahan_path, "Pemetaan Prevalensi Stunting & Ketahanan Pangan (68 Kelurahan)", "ogr")

if not vlayer_kelurahan.isValid():
    print("Failed to load Kelurahan layer!")
    sys.exit(1)

# Style Kelurahan with Graduated Renderer on STUNTING
# 4 Classes:
# < 10.0% : Sangat Rendah (Hijau)
# 10.0 - 14.0% : Rendah/Sedang (Kuning)
# 14.0 - 18.0% : Waspada (Oranye)
# >= 18.0% : Prioritas Tinggi / Kritis (Merah)

ranges = []

# Class 1: < 10.0%
sym1 = QgsFillSymbol.createSimple({'color': '#2ecc71', 'outline_color': '#27ae60', 'outline_width': '0.3'})
ranges.append(QgsRendererRange(0.0, 10.0, sym1, '< 10.0% (Aman / Rendah)'))

# Class 2: 10.0 - 14.0%
sym2 = QgsFillSymbol.createSimple({'color': '#f1c40f', 'outline_color': '#d4ac0d', 'outline_width': '0.3'})
ranges.append(QgsRendererRange(10.0, 14.0, sym2, '10.0% - 14.0% (Sedang)'))

# Class 3: 14.0 - 18.0%
sym3 = QgsFillSymbol.createSimple({'color': '#e67e22', 'outline_color': '#d35400', 'outline_width': '0.3'})
ranges.append(QgsRendererRange(14.0, 18.0, sym3, '14.0% - 18.0% (Waspada)'))

# Class 4: >= 18.0%
sym4 = QgsFillSymbol.createSimple({'color': '#e74c3c', 'outline_color': '#c0392b', 'outline_width': '0.3'})
ranges.append(QgsRendererRange(18.0, 50.0, sym4, '> 18.0% (Prioritas Intervensi)'))

renderer = QgsGraduatedSymbolRenderer('STUNTING', ranges)
vlayer_kelurahan.setRenderer(renderer)

# Labeling for Kelurahan
label_settings = QgsPalLayerSettings()
label_settings.fieldName = "KELURAHAN"
text_format = QgsTextFormat()
font = QFont("Arial", 7)
font.setBold(True)
text_format.setFont(font)
text_format.setColor(QColor("#1e272e"))

buffer_settings = QgsTextBufferSettings()
buffer_settings.setEnabled(True)
buffer_settings.setSize(0.8)
buffer_settings.setColor(QColor("#ffffff"))
text_format.setBuffer(buffer_settings)

label_settings.setFormat(text_format)
label_settings.placement = QgsPalLayerSettings.AroundPoint
vlayer_kelurahan.setLabeling(QgsVectorLayerSimpleLabeling(label_settings))
vlayer_kelurahan.setLabelsEnabled(True)

# 2. Sungai Layer
sungai_path = os.path.join(layers_dir, "SUNGAI_AR_25K.shp")
vlayer_sungai = QgsVectorLayer(sungai_path, "Jaringan Hidrografi & Sungai", "ogr")
if vlayer_sungai.isValid():
    sym_sungai = QgsFillSymbol.createSimple({'color': '#74b9ff', 'outline_color': '#0984e3', 'outline_width': '0.2'})
    vlayer_sungai.renderer().setSymbol(sym_sungai)

# 3. Jalan Layer
jalan_path = os.path.join(layers_dir, "JALAN_LN_25K.shp")
vlayer_jalan = QgsVectorLayer(jalan_path, "Jaringan Jalan Kota Bogor", "ogr")
if vlayer_jalan.isValid():
    sym_jalan = QgsLineSymbol.createSimple({'color': '#b2bec3', 'width': '0.25'})
    vlayer_jalan.renderer().setSymbol(sym_jalan)

# 4. Niaga / Pasar Tradisional
niaga_path = os.path.join(layers_dir, "NIAGA_PT_25K.shp")
vlayer_niaga = QgsVectorLayer(niaga_path, "Pasar Rakyat & Sentra Pangan (Satu Peta)", "ogr")
if vlayer_niaga.isValid():
    sym_niaga = QgsMarkerSymbol.createSimple({'name': 'diamond', 'color': '#d35400', 'outline_color': '#ffffff', 'size': '2.6', 'outline_width': '0.4'})
    vlayer_niaga.renderer().setSymbol(sym_niaga)

# 5. Fasilitas Kesehatan
kesehatan_path = os.path.join(layers_dir, "KESEHATAN_PT_25K.shp")
vlayer_kesehatan = QgsVectorLayer(kesehatan_path, "Fasilitas Kesehatan & Posyandu (Satu Peta)", "ogr")
if vlayer_kesehatan.isValid():
    sym_kes = QgsMarkerSymbol.createSimple({'name': 'cross', 'color': '#8e44ad', 'outline_color': '#8e44ad', 'size': '2.8', 'outline_width': '0.6'})
    vlayer_kesehatan.renderer().setSymbol(sym_kes)

# Add layers to project in correct draw order (Points on top, Lines middle, Polygons bottom)
project.addMapLayer(vlayer_kesehatan)
project.addMapLayer(vlayer_niaga)
project.addMapLayer(vlayer_jalan)
project.addMapLayer(vlayer_sungai)
project.addMapLayer(vlayer_kelurahan)

qgz_path = os.path.join(base_dir, "NutriMap_Kota_Bogor.qgz")
project.write(qgz_path)
print(f"Saved QGIS project to: {qgz_path}")

# Render map canvas image
map_settings = QgsMapSettings()
map_settings.setLayers([vlayer_kesehatan, vlayer_niaga, vlayer_jalan, vlayer_sungai, vlayer_kelurahan])
extent = vlayer_kelurahan.extent()
extent.scale(1.05)
map_settings.setExtent(extent)
map_settings.setOutputSize(QSize(1600, 1200))
map_settings.setBackgroundColor(QColor("#f8f9fa"))
map_settings.setDestinationCrs(vlayer_kelurahan.crs())

render_job = QgsMapRendererParallelJob(map_settings)
render_job.start()
render_job.waitForFinished()

img = render_job.renderedImage()
canvas_out = os.path.join(base_dir, "map_canvas.png")
img.save(canvas_out, "PNG")
print(f"Rendered map canvas image: {canvas_out}")

qgs.exitQgis()
