import { useState, useEffect, useRef } from "react";

const CACHE_KEY = "github_data_cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds

const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const now = Date.now();

    if (now - parsed.timestamp < CACHE_TTL) {
      return parsed.data;
    }

    // Cache expired
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

const setCachedData = (data) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // localStorage may be full or unavailable
  }
};

const calculateLanguages = (repositories) => {
  const languageCounts = {};
  let total = 0;

  repositories.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      total++;
    }
  });

  if (total === 0) return {};

  const percentages = {};
  Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([lang, count]) => {
      percentages[lang] = Math.round((count / total) * 100);
    });

  return percentages;
};

const useGitHubData = (username = "Playyer96") => {
  const [userData, setUserData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [languages, setLanguages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    // Prevent double-fetch in StrictMode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchData = async () => {
      // Check cache first
      const cached = getCachedData();
      if (cached) {
        setUserData(cached.userData);
        setRepositories(cached.repositories);
        setLanguages(cached.languages);
        setLoading(false);
        return;
      }

      try {
        const [userResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
          ),
        ]);

        // Check for rate limiting
        const remaining = userResponse.headers.get("X-RateLimit-Remaining");
        if (remaining !== null && parseInt(remaining, 10) <= 0) {
          throw new Error(
            "GitHub API rate limit exceeded. Please try again later."
          );
        }

        if (!userResponse.ok) {
          throw new Error(
            `Failed to fetch user data (${userResponse.status})`
          );
        }

        if (!reposResponse.ok) {
          throw new Error(
            `Failed to fetch repositories (${reposResponse.status})`
          );
        }

        const userJson = await userResponse.json();
        const reposJson = await reposResponse.json();

        const parsedUser = {
          login: userJson.login,
          followers: userJson.followers,
          following: userJson.following,
          public_repos: userJson.public_repos,
          avatar_url: userJson.avatar_url,
          bio: userJson.bio,
        };

        const parsedRepos = reposJson.map((repo) => ({
          name: repo.name,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          language: repo.language,
          description: repo.description,
          html_url: repo.html_url,
        }));

        const calculatedLanguages = calculateLanguages(parsedRepos);

        // Cache the results
        const dataToCache = {
          userData: parsedUser,
          repositories: parsedRepos,
          languages: calculatedLanguages,
        };
        setCachedData(dataToCache);

        setUserData(parsedUser);
        setRepositories(parsedRepos);
        setLanguages(calculatedLanguages);
        setError(null);
      } catch (err) {
        console.debug("GitHub API error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return {
    userData,
    repositories,
    languages,
    loading,
    error,
  };
};

export default useGitHubData;
