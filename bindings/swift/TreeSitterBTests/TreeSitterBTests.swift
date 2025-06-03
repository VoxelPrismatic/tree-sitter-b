import XCTest
import SwiftTreeSitter
import TreeSitterB

final class TreeSitterBTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_b())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading B grammar")
    }
}
