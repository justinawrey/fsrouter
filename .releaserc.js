export default {
  branches: ["main"],
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    [
      "@semantic-release/release-notes-generator",
      { preset: "conventionalcommits" },
    ],
    "@semantic-release/changelog",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md"],
        message:
          "chore(release): ${nextRelease.gitTag} [skip ci]\\n\\n${nextRelease.notes}",
      },
    ],
    ["@semantic-release/exec", {
      publishCmd:
        `echo 'export const version = "\${nextRelease.version}'" > version.ts`,
    }],
  ],
  tagFormat: "${version}",
};
