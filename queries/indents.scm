((block_statement) @indent.begin
  (#set! indent.immediate))

((while_statement) @indent.begin
  (#set! indent.immediate))

((if_statement) @indent.begin
  (#set! indent.immediate))

(while_statement
  (statement
    ";" @indent.end @indent.branch))

(while_statement
  (statement
    (_
      ";" @indent.end @indent.branch)))

(if_statement
  (statement
    ";" @indent.end @indent.branch))

(if_statement
  (statement
    (_
      ";" @indent.end @indent.branch)))

"}" @indent.branch @indent.end
