Migrating to ggrust
===================

Cellestial now renders with `ggrust <https://github.com/datavil/ggrust>`_ instead of
lets-plot. ggrust keeps the lets-plot API, so most code only needs a new import.
This page lists every breaking change since 0.60.0, each with a before and after.

Backend and setup
-----------------

**Import layers, scales and themes from ggrust.** Cellestial returns ggrust plot
objects, which do not combine with objects made by ``lets_plot``.

.. code-block:: python

   # before
   from lets_plot import *

   # after
   from ggrust import *

**setup_html is removed.** It was a no-op. Choose notebook output with
``ggrust.display``.

.. code-block:: python

   # before
   cl.setup_html()

   # after
   import ggrust
   ggrust.display("html")  # or "svg", "png"

**spatialdata is optional.** It is only needed to plot ``SpatialData`` objects.

.. code-block:: bash

   # before
   pip install cellestial

   # after
   pip install "cellestial[spatial]"

Layers
------

**arrow_axis returns a theme.** ``plot=`` and ``**geom_kwargs`` are gone,
``linetype=`` is a parameter, and arrowhead options go through ``arrow_kwargs``.
``length`` is a fraction of the panel, so arrows start at the panel corner.

.. code-block:: python

   # before
   umap + cl.arrow_axis(plot=umap, linetype="dashed", type="closed", alpha=0.5)

   # after
   umap + cl.arrow_axis(linetype="dashed", arrow_kwargs={"type": "closed"})

**bracket uses ggrust's stat_compare_means.** Groups below 50 tie-free values get
R's exact Wilcoxon test, so their p-values change. Stars use ``<=`` cutoffs and
p-value labels show 2 significant digits. ``test="ttest"`` is Welch's test.
``test="student"``, ``alternative``, ``label="padj"``, label sequences,
``label_format``, ``prefix``, ``prefix_style``, ``separator`` and ``threshold`` are removed.

.. code-block:: python

   # before
   violin + cl.bracket(label="padj", threshold=0.05, prefix="p = ")

   # after
   violin + cl.bracket(label="pvalue")             # shows the adjusted p-value
   violin + cl.bracket(label="stars", hide_ns=True)  # replaces threshold=0.05

Heatmaps
--------

**dendrogram_kwargs is removed** from ``dotplot``, ``stacked_violin``,
``matrixplot`` and ``heatmap``. The tree sits in a fixed band beside the panel and
takes its style from ``axis_ticks_y``.

.. code-block:: python

   # before
   cl.dotplot(data, keys, group_by="leiden", dendrogram=True,
              dendrogram_kwargs={"color": "gray", "size": 1})

   # after
   cl.dotplot(data, keys, group_by="leiden", dendrogram=True,
              dendrogram_color="gray", dendrogram_size=1)
   # or
   cl.dotplot(data, keys, group_by="leiden", dendrogram=True) + theme(
       axis_ticks_y=element_line(color="gray", size=1)
   )

**annotated_heatmap returns one PlotSpec.** Tracks are ggside side bands that zoom
with the heatmap. ``layers_all`` now acts as ``layers``.

.. code-block:: python

   # before
   plot = cl.annotated_heatmap(data, keys, group_by="leiden")
   plot.as_dict()["figures"]

   # after
   plot = cl.annotated_heatmap(data, keys, group_by="leiden")
   plot.as_dict()["layers"]

**stacked_violin renames color_by to fill_statistic.**

.. code-block:: python

   # before
   cl.stacked_violin(data, keys, group_by="leiden", color_by="group")

   # after
   cl.stacked_violin(data, keys, group_by="leiden", fill_statistic="group")

**Output column parameters end in _column** in ``dotplot`` and ``stacked_violin``.

.. code-block:: python

   # before
   cl.dotplot(data, keys, percentage_key="pct", mean_key="avg")
   cl.stacked_violin(data, keys, aggregate_key="agg")

   # after
   cl.dotplot(data, keys, percentage_column="pct", mean_column="avg")
   cl.stacked_violin(data, keys, aggregate_column="agg")

Distributions and volcano
-------------------------

**Toggles drop the show_ prefix.** The old names are passed through to the geom,
so they no longer hide anything.

.. code-block:: python

   # before
   cl.violin(data, "CD3E", group_by="leiden", show_points=False)
   cl.volcano(data, show_threshold_lines=False)

   # after
   cl.violin(data, "CD3E", group_by="leiden", points=False)
   cl.volcano(data, threshold_lines=False)

**volcano names its p-value column after its values.** With the default
``use_adjusted_pvalue=True`` the column is ``pvalue_adj``. The negative log
p-value parameter and column are spelled out.

.. code-block:: python

   # before
   cl.volcano(data, neg_log_pvalue_column="neg_log_pvalue")

   # after
   cl.volcano(data, negative_log_pvalue_column="negative_log_pvalue")
   cl.volcano(data, pvalue_column="pvalue")  # keep the old p-value column name

Frames and filters
------------------

**observations_name and variables_name are renamed** to ``observation_id_column``
and ``variable_id_column`` in ``build_frame``, the frame helpers and every plot.

.. code-block:: python

   # before
   cl.build_frame(data, observations_name="Cell")

   # after
   cl.build_frame(data, observation_id_column="Cell")

**groups and drop raise on unknown categories** with ``KeyNotFoundError`` instead of
filtering to nothing.

.. code-block:: python

   # before: a typo gave a blank panel
   cl.violin(data, "CD3E", group_by="leiden", groups=["0", "1", "99"])

   # after: keep only categories the column has
   available = set(data.obs["leiden"].cat.categories)
   cl.violin(data, "CD3E", group_by="leiden",
             groups=[g for g in ["0", "1", "99"] if g in available])

**spatial and spatials drop scale_axis.** It never changed the rendered plot.

.. code-block:: python

   # before
   cl.spatial(data, key="MS4A1", scale_axis=0)

   # after
   cl.spatial(data, key="MS4A1")
