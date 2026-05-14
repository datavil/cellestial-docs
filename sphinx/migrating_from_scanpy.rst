Migrating from Scanpy
=====================

Cellestial replaces ``scanpy.pl`` with Lets-Plot-based plotting functions
that return composable plot objects.

.. jupyter-execute::
   :hide-code:

   import scanpy as sc
   from pathlib import Path
   from lets_plot import *

   import cellestial as cl

   sc.settings.verbosity = 0

   data = cl.datasets.pbmc3k(cache_directory="data")
   spatial_data = cl.datasets.human_lymph_node(cache_directory="data")
   migrating_mobile_example_dir = Path("sphinx/_static/mobile/migrating-from-scanpy")
   migrating_mobile_example_dir.mkdir(parents=True, exist_ok=True)

   def save_migrating_mobile_svg(plot, filename):
      (migrating_mobile_example_dir / filename).write_text(plot.to_svg(), encoding="utf-8")
      return plot

   adata = data
   spatial_adata = spatial_data

   markers = [
      "PSAP", "LYZ", "CST3",
      "CD79A", "CD79B",
      "IL7R", "CD3D", "CD3E", "CD4",
      "CD8A", "CD8B",
      "NKG7", "GNLY", "KLRD1",
      "HLA-DRA", "FCER1A",
   ]


Key Differences
---------------

A handful of mental shifts cover most of the migration:

- **Functions return plot objects.** ``cl.umap(...)`` returns a Lets-Plot
  ``PlotSpec``. Add titles, themes, scales and extra layers with ``+``.
  The function returns the plot; display or save it explicitly as needed.
- **One color slot is named** ``key`` **, not** ``color``. The ``key`` can be
  either a metadata column (cluster, cell type) or a gene name; Cellestial
  picks the right scale automatically.
- **Multiple panels use the plural form.** Where ``sc.pl.umap`` accepts a
  list of colors and tiles the result, Cellestial exposes a separate
  ``cl.umaps`` (and ``cl.tsnes``, ``cl.pcas``, ``cl.violins``, ...).
- **Snake case parameters.** ``groupby`` becomes ``group_by``,
  ``var_names`` becomes ``keys``.
- **Saving is a separate call.** Use ``cl.save(plot, "umap.png")`` instead of
  passing ``save=`` to the plotting function.
- **Interactivity is on by default.** Tooltips, zoom and pan ship with every
  plot through the Lets-Plot toolbar.


Function Reference
------------------

.. list-table::
   :header-rows: 1
   :widths: 30 30 40

   * - Scanpy
     - Cellestial
     - Notes
   * - ``sc.pl.umap``
     - ``cl.umap`` / ``cl.umaps``
     - ``color=`` → ``key=``. Use the plural for multi-key panels.
   * - ``sc.pl.tsne``
     - ``cl.tsne`` / ``cl.tsnes``
     -
   * - ``sc.pl.pca``
     - ``cl.pca`` / ``cl.pcas``
     -
   * - ``sc.pl.embedding``
     - ``cl.dimensional`` / ``cl.dimensionals``
     - Pass the embedding name through ``use_key=``.
   * - ``sc.pl.scatter``
     - ``cl.scatter``
     - Takes a Lets-Plot ``aes(x=..., y=..., color=...)`` mapping.
   * - ``sc.pl.dotplot``
     - ``cl.dotplot``
     - ``var_names=`` → ``keys=``, ``groupby=`` → ``group_by=``.
   * - ``sc.pl.heatmap``
     - ``cl.heatmap``
     - Built-in dendrogram via ``dendrogram=True``.
   * - ``sc.pl.matrixplot``
     - ``cl.matrixplot``
     -
   * - ``sc.pl.stacked_violin``
     - ``cl.stacked_violin``
     -
   * - ``sc.pl.violin``
     - ``cl.violin`` / ``cl.violins``
     - ``keys=`` → ``key=``. Pair with ``cl.bracket`` for significance.
   * - ``sc.pl.spatial``
     - ``cl.spatial`` / ``cl.spatials``
     -
   * - ``sc.pl.highest_expr_genes``
     - ``cl.highest_expressed_genes``
     -
   * - ``sc.pl.rank_genes_groups``
     - ``cl.volcano`` / ``cl.volcanos``
     - Use ``cl.volcano`` / ``cl.volcanos`` for differential expression results.


Worked Examples
---------------

UMAP by cluster
~~~~~~~~~~~~~~~

.. tab-set::

   .. tab-item:: Scanpy
      :sync: scanpy

      .. jupyter-execute::

         sc.pl.umap(
             adata,
             color="leiden",
             legend_loc="on data",
         )

   .. tab-item:: Cellestial
      :sync: cellestial

      .. code-block:: python

         cl.umap(
             data,
             key="leiden",
             legend_ondata=True,
         ) + scale_color_hue()

      .. jupyter-execute::
         :hide-code:

         save_migrating_mobile_svg(
             cl.umap(
                 data,
                 key="leiden",
                 legend_ondata=True,
             ) + scale_color_hue(),
             "umap-by-cluster.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/migrating-from-scanpy/umap-by-cluster.svg" alt="Cellestial UMAP by cluster example" loading="lazy" />


UMAP by gene, multi-panel
~~~~~~~~~~~~~~~~~~~~~~~~~

.. tab-set::

   .. tab-item:: Scanpy
      :sync: scanpy

      .. jupyter-execute::

         sc.pl.umap(
             adata,
             color=["MS4A1", "CD3D", "NKG7"],
         )

   .. tab-item:: Cellestial
      :sync: cellestial

      .. code-block:: python

         cl.umaps(
             data,
             keys=["MS4A1", "CD3D", "NKG7"],
         )

      .. jupyter-execute::
         :hide-code:

         save_migrating_mobile_svg(
             cl.umaps(
                 data,
                 keys=["MS4A1", "CD3D", "NKG7"],
             ),
             "umap-by-gene-grid.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/migrating-from-scanpy/umap-by-gene-grid.svg" alt="Cellestial UMAP gene grid example" loading="lazy" />


Dotplot of marker genes
~~~~~~~~~~~~~~~~~~~~~~~

.. tab-set::

   .. tab-item:: Scanpy
      :sync: scanpy

      .. jupyter-execute::

         sc.pl.dotplot(
             adata,
             var_names=markers,
             groupby="cell_type_lvl1",
             dendrogram=True,
         )

   .. tab-item:: Cellestial
      :sync: cellestial

      .. code-block:: python

         cl.dotplot(
             data,
             keys=markers,
             group_by="cell_type_lvl1",
             dendrogram=True,
         )

      .. jupyter-execute::
         :hide-code:

         save_migrating_mobile_svg(
             cl.dotplot(
                 data,
                 keys=markers,
                 group_by="cell_type_lvl1",
                 dendrogram=True,
             ),
             "dotplot-marker-genes.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/migrating-from-scanpy/dotplot-marker-genes.svg" alt="Cellestial marker gene dotplot example" loading="lazy" />


Violin per group
~~~~~~~~~~~~~~~~

.. tab-set::

   .. tab-item:: Scanpy
      :sync: scanpy

      .. jupyter-execute::

         sc.pl.violin(
             adata,
             keys="CD3D",
             groupby="cell_type_lvl1",
         )

   .. tab-item:: Cellestial
      :sync: cellestial

      .. code-block:: python

         cl.violin(
             data,
             key="CD3D",
             fill="cell_type_lvl1",
         ) + scale_fill_hue()

      .. jupyter-execute::
         :hide-code:

         save_migrating_mobile_svg(
             cl.violin(
                 data,
                 key="CD3D",
                 fill="cell_type_lvl1",
             ) + scale_fill_hue(),
             "violin-per-group.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/migrating-from-scanpy/violin-per-group.svg" alt="Cellestial violin per group example" loading="lazy" />

Cellestial adds significance brackets through a separate layer, which has no
direct equivalent in scanpy:

.. code-block:: python

   (
      cl.violin(data, key="CD3D", fill="cell_type_lvl1", threshold=0.1)
      + scale_fill_hue()
      + cl.bracket(
         y_padding=0.2,
         label="pvalue",
         prefix="p",
         prefix_style="<",
         comparisons=[
            ("Lymphocytes", "Monocytes"),
            ("Monocytes", "B Cells"),
         ],
      )
   )

.. jupyter-execute::
   :hide-code:

   save_migrating_mobile_svg(
      (
         cl.violin(data, key="CD3D", fill="cell_type_lvl1", threshold=0.1)
         + scale_fill_hue()
         + cl.bracket(
            y_padding=0.2,
            label="pvalue",
            prefix="p",
            prefix_style="<",
            comparisons=[
               ("Lymphocytes", "Monocytes"),
               ("Monocytes", "B Cells"),
            ],
         )
      ),
      "violin-brackets.svg",
   )

.. raw:: html

   <img class="mobile-plot" src="_static/mobile/migrating-from-scanpy/violin-brackets.svg" alt="Cellestial violin with significance brackets example" loading="lazy" />


Spatial overlay
~~~~~~~~~~~~~~~

.. tab-set::

   .. tab-item:: Scanpy
      :sync: scanpy

      .. jupyter-execute::

         sc.pl.spatial(
             spatial_adata,
             color="clusters",
         )

   .. tab-item:: Cellestial
      :sync: cellestial

      .. code-block:: python

         cl.spatial(
             spatial_data,
             key="clusters",
         )

      .. jupyter-execute::
         :hide-code:

         save_migrating_mobile_svg(
             cl.spatial(
                 spatial_data,
                 key="clusters",
             ),
             "spatial-overlay.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/migrating-from-scanpy/spatial-overlay.svg" alt="Cellestial spatial overlay example" loading="lazy" />


Saving plots
~~~~~~~~~~~~

.. tab-set::

   .. tab-item:: Scanpy
      :sync: scanpy

      .. code-block:: python

         sc.pl.umap(
             adata,
             color="leiden",
             save="_leiden.png",
         )

   .. tab-item:: Cellestial
      :sync: cellestial

      .. code-block:: python

         plot = cl.umap(data, key="leiden")
         cl.save(plot, "umap_leiden.png")


Missing Scanpy Plot Mappings
----------------------------

A few scanpy plotting helpers do not have a one-to-one replacement yet:

- ``sc.pl.tracksplot``
- ``sc.pl.embedding_density``
- ``sc.pl.paga`` and other trajectory-specific helpers

Where To Next
-------------

- :doc:`quickstart` for a guided tour of the API.
- :doc:`API` for the full function reference.
- :doc:`features` for a deeper look at each plot family.
