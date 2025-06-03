(auto_statement
  tok: "auto" @keyword.type
  name: (identifier) @variable)

(extrn
  word: "extrn" @keyword.import
  name: (identifier) @variable)

(goto
  word: "goto" @keyword
  name: (identifier) @label)

(jump_label
  name: (identifier) @label)

[
  (op_binary)
  (op_unary)
  (op_incdec)
  (op_assign)
] @operator
