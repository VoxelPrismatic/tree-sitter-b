package tree_sitter_b_test

import (
	"testing"

	tree_sitter_b "github.com/VoxelPrismatic/tree-sitter-b/bindings/go"
	tree_sitter "github.com/tree-sitter/go-tree-sitter"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_b.Language())
	if language == nil {
		t.Errorf("Error loading B grammar")
	}
}
