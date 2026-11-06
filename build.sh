extra_sphinx_flag=""

if [ "$1" = "-E" ]; then
    extra_sphinx_flag="-E"
fi

# Override with CELLESTIAL_PATH=/path/to/cellestial
local_cellestial="${CELLESTIAL_PATH:-/Volumes/ZKT7/LIFE/dev/datavil/cellestial}"

uv sync --group docs
uv pip install --reinstall --no-deps -e "$local_cellestial"
uv run --no-sync --group docs sphinx-build sphinx/ _build/html/ -a -j auto ${extra_sphinx_flag}

echo "Built at _build/html/index.html"
open _build/html/index.html
