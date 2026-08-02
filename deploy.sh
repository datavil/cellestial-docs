extra_sphinx_flag=""

if [ "$1" = "-E" ]; then
    extra_sphinx_flag="-E"
fi

local_cellestial="$HOME/datavil/cellestial"

uv sync --group docs
uv pip install --reinstall --no-deps -e "$local_cellestial"
rm -rf -- _build/html _build/doctrees
uv run --no-sync --group docs sphinx-build sphinx/ _build/html/ -a -j auto -d _build/doctrees ${extra_sphinx_flag}

uv run --no-sync --group docs ghp-import -n -c cellestial.datavil.org -p -f -o -m "Deploy docs from $(git rev-parse --short HEAD)" _build/html/


# Copy the SVGs used by README.md from their sphinx source locations into assets/.
# Run after re-rendering the website to refresh the README figures.

repo_root="."
src_index="$repo_root/sphinx/_static/index-mobile"
src_quickstart="$repo_root/sphinx/_static/mobile/quickstart"
dest="$repo_root/assets"

mkdir -p "$dest"

cp "$src_quickstart/first-umap.svg"          "$dest/first-umap.svg"
cp "$src_index/spatial-categorical.svg"      "$dest/spatial-categorical.svg"
cp "$src_index/dimensionality-layers.svg"    "$dest/dimensionality-layers.svg"
cp "$src_index/heatmap.svg"                  "$dest/heatmap.svg"
cp "$src_index/boxplot-bracket.svg"          "$dest/boxplot-bracket.svg"
cp "$src_index/ridge.svg"                    "$dest/ridge.svg"

echo "Refreshed 6 SVGs in $dest"
