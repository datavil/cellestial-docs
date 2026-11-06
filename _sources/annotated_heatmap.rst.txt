Annotated Heatmap
=================

``cl.annotated_heatmap`` draws a heatmap with annotation tracks along both axes.
It returns one ``PlotSpec``: the tracks are side bands that share the heatmap's
axes, so they zoom and pan with it (``interactive=True``).

The examples mark each gene with the cell type it is a marker of, stored as a
variable column.

.. jupyter-execute::

   import cellestial as cl
   from ggrust import *

   data = cl.datasets.pbmc3k()
   markers = {
       "Lymphocytes": ["CD3E", "IL7R", "NKG7", "GNLY"],
       "B Cells": ["CD79A", "CD79B", "MS4A1"],
       "Monocytes": ["LYZ", "CST3", "S100A9", "FCGR3A"],
       "Erythroid": ["HBB", "HBA1"],
   }
   keys = [gene for genes in markers.values() for gene in genes]
   data.var["Marker of"] = "Other"
   for cell_type, genes in markers.items():
       data.var.loc[genes, "Marker of"] = cell_type
   data.var["Marker of"] = data.var["Marker of"].astype("category")

   options = dict(
       keys=keys,
       group_by="cell_type_lvl1",
       variable_group_by="Marker of",
       column_annotations="Marker of",
       row_annotations=["cell_type_lvl1", "pct_counts_mt"],
       scale_axis=0,
   )
   cl.annotated_heatmap(data, **options)

``variable_group_by`` draws group lines between blocks of keys, as ``group_by``
does for observations.

Track titles
------------

Each track has its own legend, so track titles are hidden by default.
``row_track_titles`` and ``column_track_titles`` name the tracks beside their
band. ``annotation_legends=False`` keeps only the color bar.

.. jupyter-execute::

   cl.annotated_heatmap(
       data,
       **options,
       row_track_titles=True,
       column_track_titles=True,
       annotation_legends=False,
   )

Key labels
----------

With many keys, ``key_labels`` labels only the ones given. Labels are spread
evenly, with a leader line to each key, on the side opposite the column tracks.
They are the key axis labels, so a theme styles them. An empty list labels no key.

.. jupyter-execute::

   cl.annotated_heatmap(
       data,
       **options,
       key_labels=["CD3E", "MS4A1", "LYZ", "HBB"],
       annotation_legends=False,
   )

Group labels
------------

``group_labels`` adds a bracket and text beside each ``variable_group_by`` block,
for example its GO terms. Blocks without an entry get none.
``group_labels_width`` sets the text area relative to the heatmap.

.. jupyter-execute::

   cl.annotated_heatmap(
       data,
       **options,
       transpose=True,
       group_labels={"Lymphocytes": "T and NK", "B Cells": "B", "Monocytes": "Myeloid"},
       group_labels_width=0.3,
   )

See :doc:`publication_figures` for these options combined into a paper figure.
