
API Reference
=============

.. raw:: html

   <p class="mobile-api-warning">
     API pages include interactive (HTML) plots that would possibly not render correctly on a mobile device.
   </p>

Cellestial is built on `ggrust <https://github.com/datavil/ggrust>`_. Its layers, scales, themes and utilities follow the `lets-plot API <https://lets-plot.org/python/pages/api.html>`_, so that reference covers further customization.

Could not find what you are looking for?

.. button-link:: https://github.com/datavil/cellestial/issues/new
   :color: primary
   :class: api-issue-button sd-mb-4

   Open a Feature Request

Dimensionality Reduction
--------------------------------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.dimensional
   ~cellestial.umap
   ~cellestial.pca
   ~cellestial.tsne
   ~cellestial.expression
   ~cellestial.dimensionals
   ~cellestial.umaps
   ~cellestial.pcas
   ~cellestial.tsnes
   ~cellestial.expressions


Heatmap
-------------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.heatmap
   ~cellestial.matrixplot
   ~cellestial.dotplot
   ~cellestial.stacked_violin
   ~cellestial.annotated_heatmap


Distributions
-------------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.boxplot
   ~cellestial.violin
   ~cellestial.boxplots
   ~cellestial.violins
   ~cellestial.histogram
   ~cellestial.histograms

Basic
-----------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.plot
   ~cellestial.bar
   ~cellestial.scatter

QC
---

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.markers
   ~cellestial.ridge
   ~cellestial.ridges
   ~cellestial.elbow
   ~cellestial.highest_expressed_genes

Common
------------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.xyplot
   ~cellestial.xyplots


Differential Expression
-----------------------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.volcano
   ~cellestial.volcanos


Spatial
-------
.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.spatial
   ~cellestial.spatials


Layers
------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.cluster_outlines
   ~cellestial.ondata_legend
   ~cellestial.arrow_axis
   ~cellestial.stream
   ~cellestial.bracket
   ~cellestial.borders

Data Frames
-----------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.build_frame

Utility
-------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.show_colors
   ~cellestial.get_mapping
   ~cellestial.retrieve
   ~cellestial.get_figure
   ~cellestial.get_figures
   ~cellestial.save
   ~cellestial.marker_genes
   ~cellestial.marker_genes_dict
   ~cellestial.layout

Colors
------

Color constants, shown by ``cl.show_colors()``.

.. py:data:: cellestial.BLUE
   :value: "#377EB8"

.. py:data:: cellestial.CHERRY
   :value: "#AF1740"

.. py:data:: cellestial.LIGHT_GRAY
   :value: "#E6E6E6"

.. py:data:: cellestial.ORANGE
   :value: "#F14A00"

.. py:data:: cellestial.PINK
   :value: "#E73879"

.. py:data:: cellestial.PURPLE
   :value: "#640D5F"

.. py:data:: cellestial.RED
   :value: "#D2042D"

.. py:data:: cellestial.SNOW
   :value: "#F9F9F9"

.. py:data:: cellestial.TEAL
   :value: "#219B9D"

Datasets
--------

.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.datasets.pbmc3k
   ~cellestial.datasets.pbmc_cite
   ~cellestial.datasets.human_lymph_node
   ~cellestial.datasets.pancreas
   ~cellestial.datasets.breast_cancer_atlas
   ~cellestial.datasets.from_url
   ~cellestial.datasets.from_cellxgene

Versions Information
--------------------
.. autosummary::
   :toctree: generated
   :nosignatures:

   ~cellestial.versions

.. py:data:: cellestial.__version__

   The installed cellestial version.
