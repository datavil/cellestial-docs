{{ name | escape | underline }}

.. raw:: html

   <p class="mobile-api-warning">
     API pages include interactive (HTML) plots that would possibly not render correctly on a mobile device.
   </p>

.. currentmodule:: {{ module }}

{% if objname in ["spatial", "spatials"] %}

.. jupyter-execute::
   :hide-code:

   from pathlib import Path

   import scanpy as sc

   sc.settings.datasetdir = Path.home() / ".cache" / "cellestial" / "datasets"

{% endif %}
.. autofunction:: {{ objname }}
