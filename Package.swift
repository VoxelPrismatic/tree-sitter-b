// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterB",
    products: [
        .library(name: "TreeSitterB", targets: ["TreeSitterB"]),
    ],
    dependencies: [
        .package(url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterB",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterBTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterB",
            ],
            path: "bindings/swift/TreeSitterCTests"
        )
    ],
    cLanguageStandard: .c11
)
