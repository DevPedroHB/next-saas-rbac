import axios from "axios";

export const github = axios.create({
  baseURL: "https://github.com",
});

export const githubApi = axios.create({
  baseURL: "https://api.github.com",
});
