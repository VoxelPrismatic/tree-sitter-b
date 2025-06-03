#!/bin/bash
cp ../nvim-treesitter/runtime/queries/b/* ./queries/
make -B && nvim "$(find . -name "*.b" | xargs shuf -n1 -e)"
