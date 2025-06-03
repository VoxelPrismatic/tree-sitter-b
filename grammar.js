/**
 * @file B grammar for treesitter
 * @author VoxelPrismatic <voxelprismatic@pm.me>
 * @license AGPLv2
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const op_IncDec = [
	"++", "--",
];

const op_Unary = [
	"!",
];

const op_Binary = [
	"|", "&", "==", "!=", "/",
	"<", "<=", ">", ">=", "*",
	"<<", ">>", "-", "+", "%",
];

const op_Assign = op_Binary.map((_, v) => "=" + v);
op_Assign.push("=");

const newline = /\n/;
const terminator = choice(newline, ";", "\0");

const digit = {
	hex: /[0-9a-fA-F]/,
	oct: /[0-7]/,
	dec: /[0-9]/,
	bin: /[01]/,
};

const digits = {
	hex: seq(digit.hex, repeat(seq(optional("_"), digit.hex))),
	oct: seq(digit.oct, repeat(seq(optional("_"), digit.oct))),
	dec: seq(digit.dec, repeat(seq(optional("_"), digit.dec))),
	bin: seq(digit.bin, repeat(seq(optional("_"), digit.bin))),
};

const literals = {
	hex: seq("0", choice("x", "X"), optional("_"), digits.hex),
	oct: seq("0", optional("_"), digits.oct),
	dec: seq(/[1-9]/, optional("_"), digits.dec),
	bin: seq("0", choice("b", "B"), optional("_"), digits.bin),
};

const numLiteral = choice(
	literals.hex, literals.oct, literals.dec, literals.bin,
);

const intLiteral = seq(
	optional(choice("+", "-")), numLiteral,
);

/**
 * @param rule {RuleOrLiteral}
 * @param char {RuleOrLiteral}
 * @returns {SeqRule}
 */
function join(rule, char) {
	return seq(rule, repeat(seq(char, rule)));
}


module.exports = grammar({
	name: "b",

	// word: $ => $.identifier,

	extras: $ => [
		$.comment,
		$.auto,
		$.extrn,
		$.op_assign,
		$.op_incdec,
		$.op_binary,
		$.op_unary,
		/\s/,
	],

	supertypes: $ => [
		$._expression,
	],

	rules: {
		identifier: _ => /[_\p{XID_Start}][_\p{XID_Continue}]*/u,

		// http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
		comment: _ => token(choice(
			seq("//", /.*/),
			seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
		)),

		auto_statement: $ => seq(
			$.auto, join($.identifier, ","), ";",
		),

		auto: _ => "auto",
		extrn: _ => "extrn",

		_expression: $ => choice(
			$.identifier,
			$.auto,
			$.extrn,
		),

		op_binary: _ => choice(...op_Binary),
		op_unary: _ => choice(...op_Unary),
		op_assign: _ => choice(...op_Assign),
		op_incdec: _ => choice(...op_IncDec)
	},
});
