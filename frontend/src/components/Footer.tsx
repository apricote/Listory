import React from "react";

const REPO_URL = "https://github.com/apricote/Listory";
const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;

const VERSION = process.env.REACT_APP_VERSION || "Unknown";

export const Footer: React.FC = () => {
  return (
    <div className="flex items-center justify-between flex-wrap bg-green-500 dark:bg-gray-800 p-4 text-green-200 hover:text-white text-xs">
      <div>
        <a
          href={CHANGELOG_URL}
          target="_blank"
          rel="noreferrer"
          title="Listory Changelog"
        >
          v{VERSION}
        </a>{" "}
      </div>
      <div>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          title="Listory GitHub Repository"
        >
          Check out on GitHub
        </a>
      </div>
    </div>
  );
};
