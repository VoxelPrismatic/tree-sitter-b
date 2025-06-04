(assembly
  instruction: (string_literal
    content: [
      (string_content)
      (escape_sequence)
    ] @injection.content
    (#set! injection.language "asm")
    (#not-has-ancestor? @injection.content program_uxn)))

(assembly
  instruction: (string_literal
    content: [
      (string_content)
      (escape_sequence)
    ] @injection.content
    (#set! injection.language "uxntal")
    (#has-ancestor? @injection.content program_uxn)))
