(identifier) @variable

((identifier) @constant
  (#match? @constant "^[A-Z][A-Z\\d_]*$"))

; Operators
[
  "&"
  "*"
  "++"
  "--"
  "-"
  "!"
  "*"
  "/"
  "%"
  "+"
  "<<"
  ">>"
  "<"
  "<="
  ">"
  ">="
  "=="
  "!"
  "|"
  "?"
  ":"
] @operator

[
  "=|"
  "=&"
  "==="
  "=|="
  "=<"
  "=<="
  "=>"
  "=>="
  "=<<"
  "=>>"
  "=+"
  "=-"
  "=%"
  "=*"
  "=/"
] @operator

; Delimeters
[
  "."
  ";"
] @delimeter

[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
] @punctuation.bracket

; Keywords
"extrn" @keyword.import

[
  "if"
  "else"
  "switch"
  "case"
] @keyword.conditional

"auto" @type.builtin

; Punctuation
[
  "."
  ","
  ":"
  ";"
] @punctuation.delimeter

"while" @keyword.repeat

"return" @keyword.return

"goto" @keyword

(string_literal) @string

(system_lib_string) @string

(null) @constant

(number_literal) @number

(char_literal) @number

(field_identifier) @property

(statement_identifier) @label

(type_identifier) @type

(primitive_type) @type

(sized_type_specifier) @type

(call_expression
  function: (identifier) @function)

(call_expression
  function: (field_expression
    field: (field_identifier) @function))

(function_declarator
  declarator: (identifier) @function)

(preproc_function_def
  name: (identifier) @function.special)

(comment) @comment

((identifier) @function.builtin
  (#any-of? @function.builtin
    "char" "chdir" "chmod" "chown" "creat" "ctime" "execl" "execv" "exit" "fork" "fstat" "getchar"
    "getuid" "gtty" "lchar" "link" "mkdir" "open" "printf" "printn" "putchar" "read" "seek" "setuid"
    "stat" "stty" "time" "unlink" "wait" "write"))
