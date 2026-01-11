export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, '')
    };
  } catch {
    return null;
  }
}

export async function getLatestCommitDate(repository: string): Promise<string | null> {
  try {
    const parsed = parseGitHubUrl(repository);
    if (!parsed) return null;

    const response = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=1`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    return data[0].commit.committer.date;
  } catch {
    return null;
  }
}
