.. raw:: html

   <aside class="about-card">
     <div class="about-card-header">
       <img src="_static/cellestial.svg" alt="" />
       <span>Cellestial</span>
     </div>
     <p class="about-card-body">An interactive and highly customizable single-cell and spatial omics data visualization library in Python.</p>
     <div class="about-card-badges">
       <span>data visualization</span>
       <span>python</span>
       <span>single-cell omics</span>
       <span>ggplot</span>
       <span>spatial omics</span>
       <span>interactive</span>
     </div>
     <a class="about-card-link" href="quickstart.html">
       <i class="fa-solid fa-rocket" aria-hidden="true"></i>
       <span>Go to Quickstart</span>
       <i class="fa-solid fa-arrow-right about-card-link-arrow" aria-hidden="true"></i>
     </a>
     <a class="about-card-link" href="migrating_from_scanpy.html">
       <i class="fa-solid fa-right-left" aria-hidden="true"></i>
       <span>Migrating from Scanpy</span>
       <i class="fa-solid fa-arrow-right about-card-link-arrow" aria-hidden="true"></i>
     </a>
     <a class="about-card-footer" href="https://github.com/datavil/cellestial" target="_blank" rel="noopener">
       <i class="fa-brands fa-github" aria-hidden="true"></i>
       <span>datavil/cellestial</span>
     </a>
   </aside>

   <p class="mobile-experience-notice">
     <strong>For the best experience,</strong><br />
     browse Cellestial website on a computer.
   </p>

Cellestial |version|
====================

|pypi| |license| |polars| |letsplot|

The *grammar of graphics* for single-cell omics.

Installation
--------------
.. tab-set::

   .. tab-item:: pip
      :sync: pip

      .. code-block:: bash

         pip install cellestial

   .. tab-item:: uv
      :sync: uv

      .. code-block:: bash

         uv add cellestial

   .. tab-item:: poetry
      :sync: poetry

      .. code-block:: bash

         poetry add cellestial



Examples
---------------
Hover over the plot '`geoms`' to see tooltips, or use **toolbar** above the plot for **zooming and panning** options.

Spatial
~~~~~~~

Overlay categorical labels or gene expression on tissue coordinates.

.. jupyter-execute::
   :hide-code:

   import scanpy as sc
   import squidpy as sq
   from pathlib import Path
   from lets_plot import *

   import cellestial as cl

   data = cl.datasets.pbmc3k()
   data_spatial = cl.datasets.human_lymph_node()
   data_hne = sq.datasets.visium_hne_adata()
   data_velocity = cl.datasets.pancreas()
   index_mobile_example_dir = Path("sphinx/_static/index-mobile")
   index_mobile_example_dir.mkdir(parents=True, exist_ok=True)

   def save_index_mobile_svg(plot, filename):
       (index_mobile_example_dir / filename).write_text(plot.to_svg(), encoding="utf-8")
       return plot

   s1 = cl.spatial(data_spatial, key="clusters")
   s2 = cl.spatial(data_hne, key="leiden")
   s3 = cl.spatial(data_spatial, key="MS4A1") + scale_color_viridis(option="inferno")
   s4 = cl.spatial(data_hne, key="Mef2c") + scale_color_viridis(option="inferno")

   spatial_categorical = gggrid([s1, s2], ncol=2) + ggsize(1000,400) + ggtb(size_zoomin=-1)
   spatial_numeric = gggrid([s3, s4], ncol=2) + ggsize(1000,400) + ggtb(size_zoomin=-1)

.. tab-set::

   .. tab-item:: Categorical
      :sync: spatial_categorical

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(spatial_categorical, "spatial-categorical.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/spatial-categorical.svg" alt="Spatial categorical example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            import squidpy as sq
            from lets_plot import *

            data_spatial = cl.datasets.human_lymph_node()
            data_hne = sq.datasets.visium_hne_adata()

            s1 = cl.spatial(data_spatial, key="clusters")
            s2 = cl.spatial(data_hne, key="leiden")
            spatial_categorical = gggrid([s1, s2], ncol=2) + ggsize(1000, 400) + ggtb(size_zoomin=-1)

   .. tab-item:: Expression
      :sync: spatial_numeric

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(spatial_numeric, "spatial-expression.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/spatial-expression.svg" alt="Spatial expression example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            import squidpy as sq
            from lets_plot import *

            data_spatial = cl.datasets.human_lymph_node()
            data_hne = sq.datasets.visium_hne_adata()

            s3 = cl.spatial(data_spatial, key="MS4A1") + scale_color_viridis(option="inferno")
            s4 = cl.spatial(data_hne, key="Mef2c") + scale_color_viridis(option="inferno")
            spatial_numeric = gggrid([s3, s4], ncol=2) + ggsize(1000, 400) + ggtb(size_zoomin=-1)

Dimensionality Reduction
~~~~~~~~~~~~~~~~~~~~~~~~

Cellestial offers dimensionality reduction plots such as UMAP and t-SNE,
which accept a key for categorical and numeric columns.

Also, cellestial-specific layers, providing utilities, could be added to dimensionality reduction plots.

.. jupyter-execute::
   :hide-code:

   dims = gggrid(
    [
        cl.umap(data, key="cell_type_lvl1", axis_type="arrow", size=1.5, legend_ondata=True)+scale_color_hue(),
        cl.tsne(
            data,
            key="NEAT1",
            tooltips=["NEAT1","cell_type_lvl1"],
            axis_type="arrow",
            size=2,
            color_high="#219B9D",
            color_low="#f6f6f6",
        ),
    ]
   ) + ggtb(size_zoomin=-1)

   outlined = cl.umap(
       data,
       key="cell_type_lvl1",
       axis_type="arrow",
       size=1.5,
       legend_ondata=True,
   ) + scale_color_hue() + cl.cluster_outlines(
       groups=["Lymphocytes", "B Cells"],
   )

   streamed = cl.umap(
       data_velocity,
       key="clusters_coarse",
       axis_type="arrow",
       size=4,
       alpha=0.4,
       legend_ondata=True,
       ondata_color="black",
   ) + cl.stream()

   layers = gggrid([outlined, streamed]) + ggtb(size_zoomin=-1)

.. tab-set::

   .. tab-item:: Simple
      :sync: umap_tsne

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(dims, "dimensionality-simple.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/dimensionality-simple.svg" alt="Dimensionality reduction example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            dims = gggrid(
                [
                    cl.umap(data, key="cell_type_lvl1", axis_type="arrow", size=1.5, legend_ondata=True)
                    + scale_color_hue(),
                    cl.tsne(
                        data,
                        key="NEAT1",
                        tooltips=["NEAT1", "cell_type_lvl1"],
                        axis_type="arrow",
                        size=2,
                        color_high="#219B9D",
                        color_low="#f6f6f6",
                    ),
                ]
            ) + ggtb(size_zoomin=-1)

   .. tab-item:: Layers
      :sync: layers

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(layers, "dimensionality-layers.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/dimensionality-layers.svg" alt="Dimensionality reduction layers example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()
            data_velocity = cl.datasets.pancreas()

            outlined = (
                cl.umap(data, key="cell_type_lvl1", axis_type="arrow", size=1.5, legend_ondata=True)
                + scale_color_hue()
                + cl.cluster_outlines(groups=["Lymphocytes", "B Cells"])
            )
            streamed = (
                cl.umap(
                    data_velocity,
                    key="clusters_coarse",
                    axis_type="arrow",
                    size=4,
                    alpha=0.4,
                    legend_ondata=True,
                    ondata_color="black",
                )
                + cl.stream()
            )
            layers = gggrid([outlined, streamed]) + ggtb(size_zoomin=-1)

Heatmaps
~~~~~~~~

Cellestial offers heatmap variants, with built-in dendrogram features.

.. jupyter-execute::
   :hide-code:

   markers = [
      # Monocytes
      "PSAP", "LYZ", "CST3",
      # B cells
      "CD79A", "CD79B",
      # T cells (CD4+)
      "IL7R", "CD3D", "CD3E", "CD4",
      # T cells (CD8+)
      "CD8A", "CD8B",
      # NK cells
      "NKG7", "GNLY", "KLRD1",
      # Dendritic cells
      "HLA-DRA", "FCER1A",
   ]
   htmp = cl.heatmap(
      data,
      group_by="cell_type_lvl1",
      keys=markers,
      geom="raster",
      group_lines_size=0.5,
      group_lines_color="white",
      dendrogram=True,
      dendrogram_size=1,
      group_bars_labels=True,
      group_bars=True,
   ) + scale_fill_viridis()


   mtrx = cl.matrixplot(
      data,
      group_by="leiden",
      keys=markers,
      group_lines_size=0.5,
      group_lines_color="white",
      dendrogram=True,
      dendrogram_size=1,
   ) + scale_fill_viridis(option="inferno",begin=0.1)

   stck = cl.stacked_violin(
      data,
      group_by="leiden_res_0.50",
      keys=markers,
      dendrogram=True,
      dendrogram_size=1,
   )
   dtplt = cl.dotplot(
      data,
      group_by="leiden_res_0.50",
      keys=markers,
      dendrogram=True,
      dendrogram_size=1,
   )

.. tab-set::

   .. tab-item:: heatmap
      :sync: heatmap

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(htmp + ggsize(800,600) + ggtb(size_zoomin=-1), "heatmap.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/heatmap.svg" alt="Heatmap example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            markers = [
                "PSAP",
                "LYZ",
                "CST3",
                "CD79A",
                "CD79B",
                "IL7R",
                "CD3D",
                "CD3E",
                "CD4",
                "CD8A",
                "CD8B",
                "NKG7",
                "GNLY",
                "KLRD1",
                "HLA-DRA",
                "FCER1A",
            ]
            htmp = (
                cl.heatmap(
                    data,
                    group_by="cell_type_lvl1",
                    keys=markers,
                    geom="raster",
                    group_lines_size=0.5,
                    group_lines_color="white",
                    dendrogram=True,
                    dendrogram_size=1,
                    group_bars_labels=True,
                    group_bars=True,
                )
                + scale_fill_viridis()
            )

   .. tab-item:: matrixplot
      :sync: matrixplot

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(mtrx + ggsize(800,600) + ggtb(size_zoomin=-1), "matrixplot.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/matrixplot.svg" alt="Matrixplot example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            markers = [
                "PSAP",
                "LYZ",
                "CST3",
                "CD79A",
                "CD79B",
                "IL7R",
                "CD3D",
                "CD3E",
                "CD4",
                "CD8A",
                "CD8B",
                "NKG7",
                "GNLY",
                "KLRD1",
                "HLA-DRA",
                "FCER1A",
            ]
            mtrx = cl.matrixplot(
                data,
                group_by="leiden",
                keys=markers,
                group_lines_size=0.5,
                group_lines_color="white",
                dendrogram=True,
                dendrogram_size=1,
            ) + scale_fill_viridis(option="inferno", begin=0.1)

   .. tab-item:: stacked violin
      :sync: stacked_violin

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(stck + ggsize(800,600) + ggtb(size_zoomin=-1), "stacked-violin.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/stacked-violin.svg" alt="Stacked violin example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            markers = [
                "PSAP",
                "LYZ",
                "CST3",
                "CD79A",
                "CD79B",
                "IL7R",
                "CD3D",
                "CD3E",
                "CD4",
                "CD8A",
                "CD8B",
                "NKG7",
                "GNLY",
                "KLRD1",
                "HLA-DRA",
                "FCER1A",
            ]
            stck = cl.stacked_violin(
                data,
                group_by="leiden_res_0.50",
                keys=markers,
                dendrogram=True,
                dendrogram_size=1,
            )

   .. tab-item:: dotplot
      :sync: dotplot

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(dtplt + ggsize(800,600) + ggtb(size_zoomin=-1), "dotplot.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/dotplot.svg" alt="Dotplot example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            markers = [
                "PSAP",
                "LYZ",
                "CST3",
                "CD79A",
                "CD79B",
                "IL7R",
                "CD3D",
                "CD3E",
                "CD4",
                "CD8A",
                "CD8B",
                "NKG7",
                "GNLY",
                "KLRD1",
                "HLA-DRA",
                "FCER1A",
            ]
            dtplt = cl.dotplot(
                data,
                group_by="leiden_res_0.50",
                keys=markers,
                dendrogram=True,
                dendrogram_size=1,
            )

Distribution
~~~~~~~~~~~~

Cellestial comes with distribution (boxplot and violin) plots with built-in statistical analysis.

.. jupyter-execute::
   :hide-code:

   bx = cl.boxplot(
      data,
      key="CD3D",
      fill="cell_type_lvl1",
      threshold=0.1,
   ) + scale_fill_hue()
   bx_brckt = bx + cl.bracket(
      y_padding=0.2,
      label="pvalue",
      prefix_style="<",
      prefix="p",
      comparisons=[("Lymphocytes","Monocytes"),("Monocytes", "Erythroid"), ("Monocytes", "B Cells")],
   )
   vln = cl.violin(
      data,
      key="CD3D",
      fill="cell_type_lvl1",
      threshold=0.1,
   ) + scale_fill_viridis()
   vln_brckt = vln + cl.bracket(
      y_padding=0.2,
      label="pvalue",
      prefix_style="<",
      prefix="p",
      comparisons=[("Lymphocytes","Monocytes"),("Monocytes", "Erythroid"), ("Monocytes", "B Cells")],
   )

.. tab-set::

   .. tab-item:: boxplot
      :sync: boxplot

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(bx + ggsize(600,400) + ggtb(size_zoomin=-1), "boxplot.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/boxplot.svg" alt="Boxplot example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            bx = (
                cl.boxplot(
                    data,
                    key="CD3D",
                    fill="cell_type_lvl1",
                    threshold=0.1,
                )
                + scale_fill_hue()
            )

   .. tab-item:: boxplot with brackets
      :sync: boxplot_bracket

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(bx_brckt + ggsize(600,400) + ggtb(size_zoomin=-1), "boxplot-bracket.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/boxplot-bracket.svg" alt="Boxplot with brackets example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            bx = (
                cl.boxplot(
                    data,
                    key="CD3D",
                    fill="cell_type_lvl1",
                    threshold=0.1,
                )
                + scale_fill_hue()
            )
            bx_brckt = bx + cl.bracket(
                y_padding=0.2,
                label="pvalue",
                prefix_style="<",
                prefix="p",
                comparisons=[
                    ("Lymphocytes", "Monocytes"),
                    ("Monocytes", "Erythroid"),
                    ("Monocytes", "B Cells"),
                ],
            )

   .. tab-item:: violin
      :sync: violin

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(vln + ggsize(600,400) + ggtb(size_zoomin=-1), "violin.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/violin.svg" alt="Violin example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            vln = (
                cl.violin(
                    data,
                    key="CD3D",
                    fill="cell_type_lvl1",
                    threshold=0.1,
                )
                + scale_fill_viridis()
            )

   .. tab-item:: violin with brackets
      :sync: violin_bracket

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(vln_brckt + ggsize(600,400) + ggtb(size_zoomin=-1), "violin-bracket.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/violin-bracket.svg" alt="Violin with brackets example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            vln = (
                cl.violin(
                    data,
                    key="CD3D",
                    fill="cell_type_lvl1",
                    threshold=0.1,
                )
                + scale_fill_viridis()
            )
            vln_brckt = vln + cl.bracket(
                y_padding=0.2,
                label="pvalue",
                prefix_style="<",
                prefix="p",
                comparisons=[
                    ("Lymphocytes", "Monocytes"),
                    ("Monocytes", "Erythroid"),
                    ("Monocytes", "B Cells"),
                ],
            )

Exploratory
~~~~~~~~~~~

Cellestial ships with quick exploratory plots.

.. jupyter-execute::
   :hide-code:

   rdg = cl.ridge(
      data,
      key="B2M",
      alpha=0.6,
      group_by="cell_type_lvl1",
   ) + scale_fill_hue()

   hexp = cl.highest_expressed_genes(data, n=20) + scale_fill_viridis()

.. tab-set::

   .. tab-item:: ridge
      :sync: ridge

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(rdg + ggsize(600,400) + ggtb(size_zoomin=-1), "ridge.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/ridge.svg" alt="Ridge example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            rdg = (
                cl.ridge(
                    data,
                    key="B2M",
                    alpha=0.6,
                    group_by="cell_type_lvl1",
                )
                + scale_fill_hue()
            )

   .. tab-item:: highest expressed genes
      :sync: highest_expressed_genes

      .. jupyter-execute::
         :hide-code:

         save_index_mobile_svg(hexp + ggsize(600,400) + ggtb(size_zoomin=-1), "highest-expressed-genes.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/index-mobile/highest-expressed-genes.svg" alt="Highest expressed genes example" loading="lazy" />

      .. dropdown:: Show code

         .. code-block:: python

            import cellestial as cl
            from lets_plot import *

            data = cl.datasets.pbmc3k()

            hexp = cl.highest_expressed_genes(data, n=20) + scale_fill_viridis()


Documentation
--------

.. toctree::
   :maxdepth: 1


   API
   features

.. toctree::
   :hidden:

   migrating_from_scanpy
   quickstart
   philosophy
   performance

About Lets-Plot
---------------

Cellestial is built on top of a powerful Python library, Lets-Plot. 
It is the best Python implementation of *ggplot2* with additional features such as **tooltips** and **zooming and panning**.
`Lets-Plot API <https://lets-plot.org/python/pages/api.html>`_

.. |pypi| image:: https://img.shields.io/pypi/v/cellestial?color=377eb8
   :target: https://pypi.org/project/cellestial/
   :alt: PyPI version

.. |license| image:: https://img.shields.io/badge/License-Apache%202.0-ff0000
   :target: https://opensource.org/licenses/Apache-2.0
   :alt: License: Apache 2.0

.. |polars| image:: https://img.shields.io/badge/Powered%20by-Polars-377eb8?logo=polars&logoColor=white
   :target: https://www.pola.rs/
   :alt: Powered by Polars

.. |letsplot| image:: https://img.shields.io/badge/Graphics-Lets--Plot-FF00CC?logo=jetbrains&logoColor=white
   :target: https://lets-plot.org/
   :alt: Built with Lets-Plot
