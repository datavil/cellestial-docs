MuData Support
==============

Cellestial plots multimodal ``MuData`` objects as well as ``AnnData``. Joint
embeddings (WNN, MOFA) are plotted directly, and any modality's features can color
them.

The example uses ``cl.datasets.pbmc_cite()``, a small CITE-seq dataset with an
``rna`` and a ``prot`` (surface protein) modality.

.. jupyter-execute::

   import warnings

   import cellestial as cl
   from ggrust import *

   warnings.filterwarnings("ignore", category=FutureWarning, module="mudata")

   data = cl.datasets.pbmc_cite()
   data

Joint embeddings
----------------

Pass the embedding name to ``dimensions``. Any name stored with the data works,
not only ``umap``, ``pca`` and ``tsne``.

.. jupyter-execute::

   cl.dimensional(data, "celltype", dimensions="wnn_umap")

Features from any modality
--------------------------

A bare variable name works when it is unique across modalities. Use
``modality:name`` to pick one explicitly.

.. jupyter-execute::

   cl.dimensionals(
       data,
       ["CD14", "prot:CD14_TotalSeqB"],
       dimensions="wnn_umap",
       ncol=2,
   ) + ggsize(900, 350)

Distributions take the same keys.

.. jupyter-execute::

   cl.violin(data, "prot:CD14_TotalSeqB", group_by="celltype") + ggsize(800, 400)

Stored analysis results
-----------------------

Results such as marker rankings live in one modality. Plots that read them
(``markers``, ``marker_genes``, ``volcano``, ``heatmap``, ``dotplot``,
``stacked_violin``, ``annotated_heatmap`` and others) take ``modality=`` to say which.

.. code-block:: python

   cl.markers(data, modality="rna")
   cl.dotplot(data, group_by="leiden", markers=True, modality="rna")

Notes
-----

- Observations missing from a modality appear as NaN.
- A name found in more than one modality raises ``AmbiguousVariableError``,
  which lists the qualified names to use.
- Only modalities that share observations (``axis=0``) are supported.
- Spatial plots do not take a ``MuData`` object. Pass the modality and a frame:
  ``cl.spatial(data["rna"], key="prot:CD3", frame=cl.build_frame(data, variable_keys=["prot:CD3"]))``.
