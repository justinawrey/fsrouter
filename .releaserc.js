module.exports = {
  branches: ["main"],
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    [
      "@semantic-release/release-notes-generator",
      { preset: "conventionalcommits" },
    ],
    "@semantic-release/changelog",
    ["@semantic-release/exec", {
      prepareCmd:
        `echo 'export const version = "\${nextRelease.version}";' > cli/version.ts`,
    }],
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "cli/version.ts"],
        message:
          "chore(release): ${nextRelease.gitTag} [skip ci]\\n\\n${nextRelease.notes}",
      },
    ],
  ],
  tagFormat: "${version}",
};
