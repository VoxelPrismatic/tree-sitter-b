// -*- link: uxn -*-

main() {
	__asm__(
		"#0a DUP ?label INC @label ( 0a )",
		"#0a dup ?label inc @label ( 0a )"
	);
}
