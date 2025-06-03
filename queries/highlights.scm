((identifier) @variable
  (#set! priority 95))

((global) @constant
  (#set! priority 95))

((stdlib) @variable @function.builtin
  (#set! priority 95))

(comment) @comment

(auto_statement
  token: "auto" @keyword.type
  variable: [
    (global) @constant
    (stdlib) @variable @function.builtin
    (c_stdlib) @variable @function.builtin
    (identifier) @variable
  ])

(extrn_statement
  token: "extrn" @keyword.type
  variable: [
    (global) @constant
    (stdlib) @variable @function.builtin
    (c_stdlib) @variable @function.builtin
    (identifier) @variable
  ])

(define_array
  name: [
    (global) @constant
    (stdlib) @variable @function.builtin
    (c_stdlib) @variable @function.builtin
    (identifier) @variable
  ])

"return" @keyword.return

"while" @keyword.repeat

(goto_statement
  token: "goto" @keyword
  name: (rvalue) @label)

(label_statement
  name: (_) @label)

[
  "if"
  "else"
  "case"
  "switch"
] @keyword.conditional

[
  (op_binary)
  (op_unary)
  (op_assign)
  (op_incdec)
] @keyword.operator

(rune_literal) @character

(string_literal) @string

(number_literal) @number

(define_function
  name: [
    (stdlib) @variable @function.builtin
    (identifier) @function.method
    (global) @markup.underline @comment.error
    (c_stdlib) @variable @function.builtin
  ])

(call
  name: [
    (identifier) @function.method @function.method.call
    (stdlib) @variable @function.builtin
    (c_stdlib) @variable @function.builtin
    (global) @markup.underline @comment.error
  ])

[
  ","
  ":"
  ";"
] @keyword.delimeter
