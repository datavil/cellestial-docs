Migrating to the v1 API
=======================

The v1 API review renamed several parameters so that each name means one thing
across the library. Old names no longer pass through silently: a renamed or
removed keyword raises :class:`~cellestial.errors.UnknownParameterError` (a
``TypeError``) that names the replacement.


Renamed and Removed Parameters
------------------------------

.. list-table::
   :header-rows: 1
   :widths: 30 35 35

   * - Old
     - New
     - Applies to
   * - ``use_key="X_umap"`` or ``basis="X_umap"``
     - ``embedding_key="X_umap"``
     - ``dimensional``, ``umap``, ``pca``, ``tsne``, ``expression``, their
       plurals, ``embedding_density``, ``blend``
   * - ``variable_keys=["CD14"]``
     - ``add_keys=["CD14"]``
     - the dimensional plots and their plurals, ``spatial``, ``spatials``
   * - ``key="rank_genes_groups"``
     - ``ranking_key="rank_genes_groups"``
     - ``markers``, ``volcano``, ``volcanos``, ``marker_genes``,
       ``marker_genes_dict``
   * - ``markers="rank_genes_groups"``
     - ``markers=True, ranking_key="rank_genes_groups"``
     - ``heatmap``, ``matrixplot``, ``dotplot``, ``stacked_violin``,
       ``tracksplot``
   * - ``markers(data, ["0"])``
     - ``markers(data, groups=["0"])``
     - ``groups`` is keyword-only in ``markers``, ``marker_genes``,
       ``marker_genes_dict``
   * - ``threshold=0.5``
     - ``expression_threshold=0.5``
     - ``dotplot`` (the distribution plots keep ``threshold``)
   * - ``pct_exp`` / ``avg_exp`` columns
     - ``percent_expressed`` / ``mean_expression``
     - ``dotplot`` columns, ``sort_by`` and legend titles
   * - ``greyscale=True``
     - ``grayscale=True``
     - ``spatial``, ``spatials``
   * - ``color="red"`` as a constant
     - ``geom_color="red"``
     - the dimensional plots, ``scatter``, ``bar``, ``xyplot(s)``,
       ``spatial(s)``, ``elbow``, ``highest_expressed_genes``
   * - ``ridge(...)`` filled by ``group_by``
     - ``ridge(..., fill="leiden")``
     - ``ridge``, ``ridges`` (they default to grey)
   * - ``save(plot, "umap.png")`` at 300 dpi
     - ``save(plot, "umap.png", dpi=300, unit="in")``
     - ``save`` forwards to ``ggsave`` and uses its defaults

.. code-block:: python

   # before
   cl.umap(data, "leiden", use_key="X_umap_harmony", variable_keys=["CD14"])
   cl.dotplot(data, markers, "leiden", markers="wilcoxon", threshold=0.5, sort_by="avg_exp")
   cl.volcano(data, "0", key="wilcoxon")

   # after
   cl.umap(data, "leiden", embedding_key="X_umap_harmony", add_keys=["CD14"])
   cl.dotplot(
       data,
       markers,
       "leiden",
       markers=True,
       ranking_key="wilcoxon",
       expression_threshold=0.5,
       sort_by="mean_expression",
   )
   cl.volcano(data, "0", ranking_key="wilcoxon")

To keep the old dotplot column names, pass
``percentage_column="pct_exp", mean_column="avg_exp"``.


Private Helpers
---------------

- ``anndata_observations_frame``, ``anndata_variables_frame`` and
  ``anndata_variable_columns`` are private. Build frames with
  :func:`~cellestial.build_frame`.
- ``DeferredLayer`` is private. Add the layer returned by a layer function
  (``cl.bracket``, ``cl.stream``, ...) to the plot instead of constructing it.
- ``SpatialLibraryError`` is removed; it was never raised. Drop it from imports
  and ``except`` clauses.


Errors
------

Every cellestial error lives in ``cellestial.errors`` (also ``cl.errors``) and
subclasses both :class:`~cellestial.errors.CellestialError` and the builtin it
replaces, so existing ``except KeyError`` or ``except ValueError`` clauses keep
working.

.. code-block:: python

   try:
       cl.umap(data, "leiden", use_key="X_umap")
   except cl.errors.UnknownParameterError as error:
       print(error)  # names embedding_key as the replacement

   try:
       cl.umap(data, "leidn")
   except cl.errors.CellestialError as error:
       print(error)  # suggests 'leiden'

Some failures changed class: unknown keys now raise
:class:`~cellestial.errors.KeyNotFoundError` (a ``KeyError``) instead of
``ValueError``. Catch ``KeyError`` or ``KeyNotFoundError`` for those cases.


Dataset Changes
---------------

The dataset that ``cl.datasets.pbmc3k()`` used to load is renamed to
:func:`~cellestial.datasets.bone_marrow`. It was never the 10x PBMC 3k: it holds
about 17,000 bone marrow mononuclear cells (samples ``s1d1`` and ``s1d3``) from
the scanpy "Preprocessing and clustering" tutorial, with the same
``cell_type_lvl1`` and ``leiden_res_*`` columns. Replace
``cl.datasets.pbmc3k()`` with ``cl.datasets.bone_marrow()`` to keep the old
data. Its ``cell_type_lvl1`` column had "B Cells" and "Erythroid" swapped and
left the erythroblast cluster null; the labels are corrected and the column has
no nulls.

:func:`~cellestial.datasets.pbmc3k` now loads the real 10x Genomics PBMC 3k:
2,638 cells processed as in the scanpy PBMC 3k tutorial, annotated in
``cell_type``. Code written for the old ``pbmc3k`` raises
:class:`~cellestial.errors.KeyNotFoundError` on ``cell_type_lvl1`` or
``leiden_res_0.02``.


New in v1
---------

- ``outline=True`` on the dimensional plots draws a scanpy-style border around
  the point cloud. ``outline_width`` and ``outline_color`` set the border and
  gap.
- ``volcano`` and ``volcanos`` take ``min_fraction_expressed`` (e.g. ``0.1``) to
  drop features detected in too few cells of the group.
- ``build_frame`` returns categorical metadata as ``pl.Enum`` in the source
  category order, so legends list categories as the data defines them.

The full list of changes is in the
`changelog <https://github.com/datavil/cellestial/blob/master/CHANGELOG.md>`_.
