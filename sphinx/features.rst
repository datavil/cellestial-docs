Features
========

**Cellestial** is built on the layered principles of the grammar of graphics,
inheriting the full composability of `Lets-Plot <https://lets-plot.org>`_.
Below is an overview of key features with examples.

.. jupyter-execute::
    :hide-code:

    import scanpy as sc
    from pathlib import Path
    from lets_plot import *

    import cellestial as cl

    data = sc.read_h5ad("data/pbmc3k_pped.h5ad")
    features_mobile_example_dir = Path("sphinx/_static/mobile/features")
    features_mobile_example_dir.mkdir(parents=True, exist_ok=True)

    def save_features_mobile_svg(plot, filename):
        (features_mobile_example_dir / filename).write_text(plot.to_svg(), encoding="utf-8")
        return plot

Tooltips
--------

When hovering over data points, plots show contextual information as a tooltip.
Cellestial's ``tooltips`` parameter controls what is displayed.
The parameter accepts Sequence of keys, a ``layer_tooltips()`` object.
Provide ``"none"`` to turn off tooltips entirely.

See more on `layer_tooltips() <https://lets-plot.org/python/pages/api/lets_plot.layer_tooltips.html>`_.

.. tab-set::

   .. tab-item:: Default

      ``tooltips=None`` (the default) auto-generates tooltips.

      .. code-block:: python

         cl.umap(data, "leiden")

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(cl.umap(data, "leiden"), "tooltips-default.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/tooltips-default.svg" alt="Default tooltip UMAP example" loading="lazy" />

   .. tab-item:: Disabled

      Pass ``tooltips="none"`` to turn off tooltips entirely.

      .. code-block:: python

         cl.umap(data, "leiden", tooltips="none")

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(cl.umap(data, "leiden", tooltips="none"), "tooltips-disabled.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/tooltips-disabled.svg" alt="Disabled tooltip UMAP example" loading="lazy" />

   .. tab-item:: Sequence of keys

      Pass a list of observation or variable column names to show exactly those fields.

      .. code-block:: python

         cl.umap(data, "leiden", tooltips=["leiden", "cell_type_lvl1", "n_genes_by_counts"])

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(
             cl.umap(data, "leiden", tooltips=["leiden", "cell_type_lvl1", "n_genes_by_counts"]),
             "tooltips-sequence.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/tooltips-sequence.svg" alt="Tooltip sequence UMAP example" loading="lazy" />

   .. tab-item:: Custom

      For full control, pass a ``layer_tooltips()`` object from Lets-Plot.
      This lets you rename labels, format values, and add fixed lines.

      .. code-block:: python

         cl.umap(
             data,
             "leiden",
             tooltips=(
                 layer_tooltips(["leiden"])
                 .line("Cell type|@cell_type_lvl1")
                 .line("Genes|@n_genes_by_counts")
             ),
         )

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(
             cl.umap(
                 data,
                 "leiden",
                 tooltips=(
                     layer_tooltips(["leiden"])
                     .line("Cell type|@cell_type_lvl1")
                     .line("Genes|@n_genes_by_counts")
                 ),
             ),
             "tooltips-custom.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/tooltips-custom.svg" alt="Custom tooltip UMAP example" loading="lazy" />

Interactivity
-------------

Lets-Plot provides a toolbar (``ggtb``) that enables zooming and panning. 
Cellestial exposes this through the ``interactive`` parameter on every
plot function, or you can append ``+ ggtb()`` yourself for full control.

.. tab-set::

   .. tab-item:: via interactive=True

      The simplest way is setting ``interactive=True``.

      .. code-block:: python

         cl.umap(data, "leiden", interactive=True)

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(cl.umap(data, "leiden", interactive=True), "interactive-umap.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/interactive-umap.svg" alt="Interactive UMAP example" loading="lazy" />

      .. code-block:: python

         cl.violin(data, "CD14", fill="cell_type_lvl1", interactive=True)

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(
             cl.violin(data, "CD14", fill="cell_type_lvl1", interactive=True),
             "interactive-violin.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/interactive-violin.svg" alt="Interactive violin example" loading="lazy" />

   .. tab-item:: via ggtb()

      Appending ``+ ggtb()`` yourself gives you the same result and keeps the call explicit,
      which is consistent with Cellestial's philosophy of modularity over abstraction.

      .. code-block:: python

         cl.umap(data, "leiden") + ggtb()

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(cl.umap(data, "leiden") + ggtb(), "ggtb-umap.svg")

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/ggtb-umap.svg" alt="UMAP with Lets-Plot toolbar example" loading="lazy" />

      This also works on grids.

      .. code-block:: python

         cl.umaps(data, ["leiden", "cell_type_lvl1"]) + ggtb()

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(
             cl.umaps(data, ["leiden", "cell_type_lvl1"]) + ggtb(),
             "ggtb-umaps.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/ggtb-umaps.svg" alt="UMAP grid with Lets-Plot toolbar example" loading="lazy" />

The toolbar appears above the plot and provides:

- **Zoom in / Zoom out** - magnifier buttons or scroll wheel
- **Pan** - click and drag to move around
- **Reset** - return to the original view

Check Lets-Plot's `Interactivity demo <https://lets-plot.org/examples/demo/interact_pan_zoom.html>`_.


Saving and Exporting
--------------------

Cellestial plots are standard Lets-Plot objects which support two approaches to exporting:
``ggsave()`` function and ``to_*``methods. 


.. tab-set::

   .. tab-item:: via ggsave

      .. jupyter-execute::

         umap = cl.umap(data, "cell_type_lvl1")

      Exports plot to a file. The format is inferred from the file extension.

      .. jupyter-execute::
         :hide-output:

         ggsave(umap, "umap.png", path="figures")
         ggsave(umap, "umap.svg", path="figures")
         ggsave(umap, "umap.pdf", path="figures")
         ggsave(umap, "umap.html", path="figures")

      Use ``w``, ``h``, ``unit``, and ``dpi`` for explicit dimensions, or ``scale`` as a resolution multiplier.

      .. jupyter-execute::

         umap = cl.umap(data, "cell_type_lvl1")

      .. jupyter-execute::
         :hide-output:

         ggsave(umap, "umap.png", w=8, h=6, unit="in", dpi=300, path="figures")
         ggsave(umap, "umap.png", scale=2, path="figures")

   .. tab-item:: via the built-in methods

      The ``to_*`` methods save directly to a path. They also accept ``w``, ``h``, and ``unit``
      for explicit dimensions, a more concise alternative to ``ggsave`` when you don't
      need the ``scale`` shorthand.

      .. jupyter-execute::
         :hide-output:

         umap.to_png("figures/umap.png")
         umap.to_svg("figures/umap.svg")
         umap.to_pdf("figures/umap.pdf")
         umap.to_html("figures/umap.html")

      Set output dimensions explicitly:

      .. jupyter-execute::
         :hide-output:

         umap.to_png("figures/umap.png", w=8, h=6, unit="in", dpi=300)
         umap.to_svg("figures/umap.svg", w=200, h=150, unit="mm")

Check Lets-Plot's `Cookbook for exporting plots <https://lets-plot.org/examples/cookbook/export.html>`_.

Facets
------

Faceting splits a single plot into a grid of panels, one per category.
Cellestial plots are standard Lets-Plot ``PlotSpec`` objects, so ``facet_wrap()``
and ``facet_grid()`` compose with any plot function using ``+``.

.. tab-set::

   .. tab-item:: facet_wrap

      Wraps panels for a single variable into a row or grid layout.

      .. code-block:: python

         (
            cl.umap(data, key="cell_type_lvl1")
            + facet_wrap("cell_type_lvl1")
         )

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(
            (
               cl.umap(data, key="cell_type_lvl1")
                + facet_wrap("cell_type_lvl1")
            ),
            "facets-wrap.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/facets-wrap.svg" alt="Facet wrap UMAP example" loading="lazy" />

   .. tab-item:: facet_grid

      Arranges panels in a two-dimensional grid defined by row (y) and column (x) variables.

      .. code-block:: python

         (
            cl.umap(data, key="cell_type_lvl1")
            + facet_grid(x="sample",y="cell_type_lvl1")
         )

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(
            (
               cl.umap(data, key="cell_type_lvl1")
                + facet_grid(x="sample",y="cell_type_lvl1")
            ),
            "facets-grid.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/facets-grid.svg" alt="Facet grid UMAP example" loading="lazy" />


Colors
------

Any argument related to color accepts HEX, RGB, or named colors.

- HEX - e.g. ``"#1f1f1f"``
- RGB/RGBA - e.g. ``"rgb(0, 0, 255)"``, ``"rgba(0, 0, 255, 0.5)"``.
- Named colors, see `Lets-Plot Named Colors <https://lets-plot.org/python/pages/named_colors.html>`_.

.. dropdown:: Built-in constants

   .. code-block:: python

      cl.show_colors()

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(cl.show_colors(), "colors-built-in.svg")

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/colors-built-in.svg" alt="Built-in color constants example" loading="lazy" />

   The constants are available directly on the ``cellestial`` namespace:
   ``cl.TEAL``, ``cl.BLUE``, ``cl.RED``, ``cl.CHERRY``, ``cl.PURPLE``,
   ``cl.PINK``, ``cl.ORANGE``, ``cl.LIGHT_GRAY``, ``cl.SNOW``.

   .. code-block:: python

      cl.tsne(data, key="leiden",color=cl.TEAL)

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(cl.tsne(data, key="leiden",color=cl.TEAL), "colors-constant.svg")

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/colors-constant.svg" alt="Color constant t-SNE example" loading="lazy" />

.. dropdown:: Hex, RGB, and named colors

   Any color Lets-Plot accepts works in cellestial parameters.

   .. code-block:: python

      cl.violin(
         data,
         "CD14",
         fill="cell_type_lvl1",
         point_color="darkblue",
         point_size=2,
         threshold=0.1,
         scale="width",
      )

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(
         cl.violin(
            data,
            "CD14",
            fill="cell_type_lvl1",
            point_color="darkblue",
            point_size=2,
            threshold=0.1,
            scale="width",
         ),
         "colors-named.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/colors-named.svg" alt="Named color violin example" loading="lazy" />

   .. code-block:: python

      cl.umap(data, color="blue")

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(cl.umap(data, color="blue"), "colors-blue.svg")

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/colors-blue.svg" alt="Named color UMAP example" loading="lazy" />

.. dropdown:: Continuous color gradients

   Expression plots and any continuous key use a gradient scale.
   Use ``color_low``, ``color_high``, and optionally ``color_mid`` with ``mid_point``.

   .. code-block:: python

      cl.expression(
         data,
         key="MT-ND2",
         color_low=cl.LIGHT_GRAY,
         color_high=cl.RED
      )

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(
         cl.expression(
            data, 
            key="MT-ND2", 
            color_low=cl.LIGHT_GRAY, 
            color_high=cl.RED
         ),
         "colors-gradient-two.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/colors-gradient-two.svg" alt="Two-color gradient expression example" loading="lazy" />

   Three-color gradient with a midpoint:

   .. code-block:: python

      cl.expression(
         data,
         key="MT-ND2",
         color_low=cl.BLUE,
         color_mid=cl.SNOW,
         color_high=cl.RED,
         mid_point="mid"
      )

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(
         cl.expression(
            data,
            key="MT-ND2",
            color_low=cl.BLUE,
            color_mid=cl.SNOW,
            color_high=cl.RED,
            mid_point="mid"
         ),
         "colors-gradient-three.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/colors-gradient-three.svg" alt="Three-color gradient expression example" loading="lazy" />

.. dropdown:: Overriding the discrete palette

   For categorical keys, cellestial defaults to ``scale_color_brewer(palette="Set2")``. 
   Override it by adding a different color palette.

   .. code-block:: python

      cl.umap(data, "cell_type_lvl1") + scale_color_viridis()

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(
         cl.umap(data, "cell_type_lvl1") + scale_color_viridis(),
         "colors-viridis.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/colors-viridis.svg" alt="Viridis palette UMAP example" loading="lazy" />

Layers
------

Cellestial layers return a ``DeferredLayer`` that can be added to an existing plot with
the ``+`` operator. The receiving plot is handed to the layer at ``+`` time, so there is
no need to pass it explicitly — the layer introspects the plot's data and aesthetics
itself.

.. dropdown:: arrow_axis

   Replaces the standard Cartesian axes with directional arrows.

   .. code-block:: python

      umap = cl.umap(data, "leiden")
      umap + cl.arrow_axis()

   .. jupyter-execute::
      :hide-code:

      umap = cl.umap(data, "leiden")
      save_features_mobile_svg(umap + cl.arrow_axis(), "layers-arrow-axis.svg")

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/layers-arrow-axis.svg" alt="Arrow axis layer example" loading="lazy" />

   Adjust the arrow ``length``, ``size``, and ``color``:

   .. code-block:: python

      umap = cl.umap(data, "leiden")
      umap + cl.arrow_axis(length=0.20, color="dark_violet")

   .. jupyter-execute::
      :hide-code:

      umap = cl.umap(data, "leiden")
      save_features_mobile_svg(
         umap + cl.arrow_axis(length=0.20, color="dark_violet"),
         "layers-arrow-axis-custom.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/layers-arrow-axis-custom.svg" alt="Customized arrow axis layer example" loading="lazy" />

.. dropdown:: cluster_outlines

   Draws density-based contour outlines around specific cluster groups.

   Outline a single group:

   .. code-block:: python

      umap = cl.umap(data, "cell_type_lvl1", axis_type="arrow", legend_ondata=True)
      umap + cl.cluster_outlines(groups="Lymphocytes")

   .. jupyter-execute::
      :hide-code:

      umap = cl.umap(data, "cell_type_lvl1", axis_type="arrow", legend_ondata=True)
      save_features_mobile_svg(
         umap + cl.cluster_outlines(groups="Lymphocytes"),
         "layers-outline-single.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/layers-outline-single.svg" alt="Single cluster outline example" loading="lazy" />

   Outline multiple groups:

   .. code-block:: python

      umap = cl.umap(data, "cell_type_lvl1", axis_type="arrow", legend_ondata=True)
      umap + cl.cluster_outlines(groups=["Lymphocytes", "Monocytes"])

   .. jupyter-execute::
      :hide-code:

      umap = cl.umap(data, "cell_type_lvl1", axis_type="arrow", legend_ondata=True)
      save_features_mobile_svg(
         umap + cl.cluster_outlines(groups=["Lymphocytes", "Monocytes"]),
         "layers-outline-multiple.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/layers-outline-multiple.svg" alt="Multiple cluster outlines example" loading="lazy" />

   Merge multiple clusters into one combined outline with a nested list:

   .. code-block:: python

      umap = cl.umap(data, "cell_type_lvl1", axis_type="arrow", legend_ondata=True)
      umap + cl.cluster_outlines(groups=[["Lymphocytes", "Monocytes"], "Erythroid"])

   .. jupyter-execute::
      :hide-code:

      umap = cl.umap(data, "cell_type_lvl1", axis_type="arrow", legend_ondata=True)
      save_features_mobile_svg(
         umap + cl.cluster_outlines(groups=[["Lymphocytes", "Monocytes"], "Erythroid"]),
         "layers-outline-merged.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/layers-outline-merged.svg" alt="Merged cluster outline example" loading="lazy" />

   Layers can be combined:

   .. code-block:: python

      umap = cl.umap(data, "cell_type_lvl1", legend_ondata=True)
      umap + cl.cluster_outlines(groups=["Lymphocytes", "Monocytes"]) + cl.arrow_axis()

   .. jupyter-execute::
      :hide-code:

      umap = cl.umap(data, "cell_type_lvl1", legend_ondata=True)
      save_features_mobile_svg(
         umap + cl.cluster_outlines(groups=["Lymphocytes", "Monocytes"]) + cl.arrow_axis(),
         "layers-combined.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/layers-combined.svg" alt="Combined layers example" loading="lazy" />

.. dropdown:: stream

   Overlays an RNA velocity stream field on a dimensionality reduction plot.
   Requires `scVelo <https://scvelo.readthedocs.io>`_ and an ``AnnData`` object
   with pre-computed velocity columns.

   .. jupyter-execute::

      velocity_data = cl.datasets.pancreas(cache_directory="data")

   .. code-block:: python

      plot = cl.umap(
         velocity_data,
         key="clusters_coarse",
         axis_type="arrow",
         size=4,
         alpha=0.4,
         legend_ondata=True,
         ondata_color="black",
      )
      plot + cl.stream()

   .. jupyter-execute::
      :hide-code:

      plot = cl.umap(
         velocity_data,
         key="clusters_coarse",
         axis_type="arrow",
         size=4,
         alpha=0.4,
         legend_ondata=True,
         ondata_color="black",
      )
      save_features_mobile_svg(plot + cl.stream(), "layers-stream.svg")

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/layers-stream.svg" alt="RNA velocity stream layer example" loading="lazy" />

Grids
-----

Plural plot functions return a ``SupPlotsSpec`` grid, one plot per key, laid out
in a configurable grid. For custom grids from arbitrary plots, use Lets-Plot's
``gggrid()`` directly.

.. dropdown:: Plural functions

   Every singular plot function has a plural counterpart that accepts ``Sequence[str]``
   and returns a ``SupPlotsSpec``.

   .. code-block:: python

      cl.umaps(data, ["leiden", "cell_type_lvl1"])

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(
         cl.umaps(data, ["leiden", "cell_type_lvl1"]),
         "grids-umaps.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/grids-umaps.svg" alt="UMAP grid example" loading="lazy" />

   .. code-block:: python

      cl.violins(data, ["CD14", "MS4A1"], fill="cell_type_lvl1")

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(
         cl.violins(data, ["CD14", "MS4A1"], fill="cell_type_lvl1"),
         "grids-violins.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/grids-violins.svg" alt="Violin grid example" loading="lazy" />

   .. code-block:: python

      cl.expressions(data, ["CD14", "MS4A1"])

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(
         cl.expressions(data, ["CD14", "MS4A1"]),
         "grids-expressions.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/grids-expressions.svg" alt="Expression grid example" loading="lazy" />

.. dropdown:: Columns and layout

   Control the number of columns with ``ncol``.

   .. code-block:: python

      cl.expressions(data, ["CD14", "MS4A1", "NKG7", "LYZ"], ncol=2)

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(
         cl.expressions(data, ["CD14", "MS4A1", "NKG7", "LYZ"], ncol=2),
         "grids-columns.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/grids-columns.svg" alt="Expression grid with two columns example" loading="lazy" />


.. dropdown:: Custom grids with gggrid

   Mix and match different plot types in a single grid using Lets-Plot's ``gggrid()``.

   .. code-block:: python

      p1 = cl.umap(data, "leiden")
      p2 = cl.violin(data, "CD14",fill="cell_type_lvl1")
      gggrid([p1, p2])

   .. jupyter-execute::
      :hide-code:

      p1 = cl.umap(data, "leiden")
      p2 = cl.violin(data, "CD14",fill="cell_type_lvl1")
      save_features_mobile_svg(gggrid([p1, p2]), "grids-custom.svg")

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/grids-custom.svg" alt="Custom Lets-Plot grid example" loading="lazy" />

   Set unequal column widths with ``widths``:

   .. code-block:: python

      gggrid([p1, p2], widths=[2, 1])

   .. jupyter-execute::
      :hide-code:

      save_features_mobile_svg(
         gggrid([p1, p2], widths=[2, 1]),
         "grids-widths.svg",
      )

   .. raw:: html

      <img class="mobile-plot" src="_static/mobile/features/grids-widths.svg" alt="Custom grid with unequal widths example" loading="lazy" />


Mapping
-------

The ``mapping`` parameter accepts a ``aes()`` object 
for further plot customization.

.. tab-set::

   .. tab-item:: Modifying aesthetics

      Map cell size to continuous values:

      .. code-block:: python

         cl.umap(data, "cell_type_lvl1", mapping=aes(size="CD14"),variable_keys="CD14")

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(
            cl.umap(data, "cell_type_lvl1", mapping=aes(size="CD14"),variable_keys="CD14"),
            "mapping-size.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/mapping-size.svg" alt="UMAP with size aesthetic mapping example" loading="lazy" />

      Map point shape to a categorical variable:

      .. code-block:: python

         cl.umap(data, "cell_type_lvl1", mapping=aes(shape="sample"),size=3)

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(
            cl.umap(data, "cell_type_lvl1", mapping=aes(shape="sample"),size=3),
            "mapping-shape.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/mapping-shape.svg" alt="UMAP with shape aesthetic mapping example" loading="lazy" />

   .. tab-item:: Extensive customization

      A plot's aesthetics can be overwritten by providing a mapping.

      .. code-block:: python

         (
            cl.umap(
               data,
               mapping=aes(size="CD14", fill="cell_type_lvl1"),
               shape=21,
               variable_keys="CD14",
               color="black",
               stroke=0.3,
            )
            + scale_fill_viridis()
         )

      .. jupyter-execute::
         :hide-code:

         save_features_mobile_svg(
            (
               cl.umap(
                  data,
                  mapping=aes(size="CD14", fill="cell_type_lvl1"),
                  shape=21,
                  variable_keys="CD14",
                  color="black",
                  stroke=0.3,
               )
               + scale_fill_viridis()
            ),
            "mapping-custom.svg",
         )

      .. raw:: html

         <img class="mobile-plot" src="_static/mobile/features/mapping-custom.svg" alt="Customized aesthetic mapping example" loading="lazy" />
