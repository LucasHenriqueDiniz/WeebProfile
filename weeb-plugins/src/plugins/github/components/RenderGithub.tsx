import React from "react"
import { RenderBasedOnStyle } from "../../../templates/RenderBasedOnStyle.js"
import type { GithubConfig, GithubData } from "../types.js"
import { GithubActivity } from "./Activity.js"
import { GithubCalendar } from "./Calendar.js"
import { GithubCodeHabits } from "./CodeHabits.js"
import { FavoriteLanguages } from "./FavoriteLanguages.js"
import { FavoriteLicense } from "./FavoriteLicense.js"
import { GithubFeaturedRepositories } from "./FeaturedRepositories.js"
import { GithubGists } from "./Gists.js"
import { GithubIntroduction } from "./Introduction.js"
import { GithubNotableContributions } from "./NotableContributions.js"
import { GithubPeople } from "./People.js"
import { GithubProfile } from "./Profile.js"
import { GithubRecentActivity } from "./RecentActivity.js"
import { GithubRepositories } from "./Repositories.js"
import { GithubRepositoryContributors } from "./RepositoryContributors.js"
import { GithubSponsors } from "./Sponsors.js"
import { GithubSponsorships } from "./Sponsorships.js"
import { GithubStargazers } from "./Stargazers.js"
import { GithubStarLists } from "./StarLists.js"
import { GithubStarredRepositories } from "./StarredRepositories.js"
import { GithubTopRepositories } from "./TopRepositories.js"

interface RenderGithubProps {
  config: GithubConfig
  data: GithubData
  style?: "default" | "terminal"
  size?: "half" | "full"
}

export function RenderGithub({
  config,
  data,
  style = "default",
  size = "half",
}: RenderGithubProps): React.ReactElement {
  if (!config.enabled || config.sections.length === 0) {
    return <></>
  }

  const sections = config.sections

  // Renderizar cada seção solicitada
  const renderedSections = sections.map((section) => {
    switch (section) {
      case "profile":
        return <GithubProfile key="profile" data={data.user} config={config} style={style} size={size} />
      case "repositories":
        return (
          <GithubRepositories
            key="repositories"
            data={data.repositories}
            totalDiskUsage={data.totalDiskUsage}
            sponsoringCount={data.sponsoringCount}
            favoriteLicense={data.favoriteLicense}
            config={config}
            style={style}
            size={size}
          />
        )
      case "favorite_languages":
        return (
          <FavoriteLanguages
            key="favorite_languages"
            languageData={data.languages}
            config={config}
            style={style}
            size={size}
          />
        )
      case "favorite_license":
        return (
          <FavoriteLicense
            key="favorite_license"
            data={data.favoriteLicense}
            config={config}
            style={style}
            size={size}
          />
        )
      case "activity":
        return <GithubActivity key="activity" data={data.activity} config={config} style={style} size={size} />
      case "calendar":
        return <GithubCalendar key="calendar" data={data.calendar} config={config} style={style} size={size} />
      case "code_habits":
        return <GithubCodeHabits key="code_habits" data={data.codeHabits} config={config} style={style} size={size} />
      case "starred_repositories":
        return (
          <GithubStarredRepositories
            key="starred_repositories"
            data={data.starredRepositories}
            config={config}
            style={style}
            size={size}
          />
        )
      case "gists":
        return <GithubGists key="gists" data={data.gists} config={config} style={style} size={size} />
      case "stargazers":
        return <GithubStargazers key="stargazers" data={data.stargazers} config={config} style={style} size={size} />
      case "top_repositories":
        return (
          <GithubTopRepositories
            key="top_repositories"
            data={data.topRepositories}
            config={config}
            style={style}
            size={size}
          />
        )
      case "introduction":
        return (
          <GithubIntroduction
            key="introduction"
            data={data.introduction}
            config={config}
            style={style}
            size={size}
            activity={data.activity}
          />
        )
      case "recent_activity":
        return (
          <GithubRecentActivity
            key="recent_activity"
            data={data.recentActivity}
            config={config}
            style={style}
            size={size}
          />
        )
      case "sponsorships":
        return (
          <GithubSponsorships key="sponsorships" data={data.sponsorships} config={config} style={style} size={size} />
        )
      case "sponsors":
        return <GithubSponsors key="sponsors" data={data.sponsors} config={config} style={style} size={size} />
      case "star_lists":
        return <GithubStarLists key="star_lists" data={data.starLists} config={config} style={style} size={size} />
      case "notable_contributions":
        return (
          <GithubNotableContributions
            key="notable_contributions"
            data={data.notableContributions}
            config={config}
            style={style}
            size={size}
          />
        )
      case "featured_repositories":
        return (
          <GithubFeaturedRepositories
            key="featured_repositories"
            data={data.featuredRepositories}
            config={config}
            style={style}
            size={size}
          />
        )
      case "people":
        return <GithubPeople key="people" data={data.people} config={config} style={style} size={size} />
      case "repository_contributors":
        return (
          <GithubRepositoryContributors
            key="repository_contributors"
            data={data.repositoryContributors}
            config={config}
            style={style}
            size={size}
          />
        )
      default:
        return (
          <div key={section} className="text-muted">
            Section &quot;{section}&quot; not yet implemented
          </div>
        )
    }
  })

  return (
    <RenderBasedOnStyle
      style={style}
      defaultComponent={<>{renderedSections}</>}
      terminalComponent={<>{renderedSections}</>}
      wrapTerminalBody={true}
    />
  )
}
