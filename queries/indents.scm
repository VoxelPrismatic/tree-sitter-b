([
  (block_statement)
  (while_statement)
  (if_statement)
] @indent.begin
  (#set! indent.immediate))

; ((block_statement) @indent.begin
;   (#set! indent.immediate))
; ((while_statement) @indent.begin
;   (#set! indent.immediate))
(while_statement
  (statement
    ";" @indent.end @indent.branch))

(while_statement
  (statement
    (return_statement
      ";" @indent.end @indent.branch)))

(while_statement
  (statement
    (auto_statement
      ";" @indent.end @indent.branch)))

(while_statement
  (statement
    (extrn_statement
      ";" @indent.end @indent.branch)))

; ((if_statement) @indent.begin
;   (#set! indent.immediate))
(if_statement
  (statement
    ";" @indent.end @indent.branch))

(if_statement
  (statement
    (return_statement
      ";" @indent.end @indent.branch)))

(if_statement
  (statement
    (auto_statement
      ";" @indent.end @indent.branch)))

(if_statement
  (statement
    (extrn_statement
      ";" @indent.end @indent.branch)))

[
  ")"
  "}"
] @indent.end @indent.branch
