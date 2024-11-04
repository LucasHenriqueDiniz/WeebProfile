<!-- SETUP:README @TODO UPDATE THIS -->

## ⚙️ Getting Started

Setting up your <b>WeebProfile</b> is easy and can be done in a few steps:

### 1. Create a new GitHub Gist and copy the ID

- Go to your GitHub profile and create a new public Gist
- Copy the Gist ID from the URL (e.g. `https://gist.github.com/username/gist_id`)

![Gist ID example](/src/readme/imgs/gist_id_example.png)

### 2. If you haven't already, create a readme repository

- Create a new repository with your username as the repository name (e.g. `github.com/username/username`)
- Create a new file called `README.md`
- Commit the changes, now in your profile, you should see the repository like this:
  ![Repository example](/src/readme/imgs/create_readme_repo.png)

### 3. Create a new GitHub Token

> 💡 A GitHub personal token is required since this action will fetch data that cannot be accessed through repository-scoped tokens (like [`${{ secrets.GITHUB_TOKEN }}` or `${{ github.token }}`](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#about-the-github_token-secret)) such as users, pull requests, commits, activity, etc.

- Go to [GitHub settings>Developer settings>Personal access tokens>personal access token(classic)](https://github.com/settings/tokens)
- Generate a new token (classic) with the `gist` scope
- Copy the token and save it in a safe place (you won't be able to see it again)

Only the `gist` scope is required for now as it's the only method to save the SVG without being local.

Additional scopes may be required depending on which features will be used. Each plugin documentation enumerates which scopes are required to make it work.

As a general rule, the following scopes may be required:

- `public_repo` for some plugins
  <!-- - `read:org` for all organizations related metrics -->
- `repo` for all private repositories related metrics
  <!-- - `read:user` for some private repositories related metrics -->
  <!-- - `read:packages` for some packages related metrics -->
  <!-- - `read:project` for some projects related metrics -->

> 💡 When a plugin has not enough scopes to operate and error message will be displayed in the action console

### 4. Add the Gist ID and GitHub Token to your repository secrets

- Go to the repository settings and click on the <code>Secrets and Variables</code> tab
- Go to the <code>Actions</code> section <code>https://github.com/username/username/settings/secrets/actions</code>
- Add a new secret called `GIST_ID` with the Gist ID
- Add a new secret called `WEEB_GH_TOKEN` with the GitHub Token
  ![Repository secrets](/src/readme/imgs/add_secrets_repo.png)

### 5. Create a new GitHub Action

- Go to the `.github/workflows` folder in your repository (if it doesn't exist, create it)
- Create a new file called `weeb_profile.yml` and paste the following code:

```yml
name: WeebProfile
on:
# 🦀 Schedule
schedule: [{ cron: "0 0 * * *" }] # Everyday at 00:00 UTC
# 💡 The following line lets you run workflow manually from the action tab!
workflow_dispatch:
# 🚀 Push event
jobs:
  weeb_profile:
    runs-on: ubuntu-latest
    steps:
      - name: 🦀 LastFM & Github 🦀
        uses: LucasHenriqueDiniz/WeebProfile@main
        with:
          FILENAME: LastFM.svg
          GIST_ID: ${{ secrets.GIST_ID }}
          GH_TOKEN: ${{ secrets.WEEB_GH_TOKEN }}
          STORAGE_METHOD: gist
          STYLE: default
          SIZE: half

          PLUGIN_LASTFM: true
          PLUGIN_LASTFM_HIDE_HEADER: true
          PLUGIN_LASTFM_USERNAME: Amayacrab
          PLUGIN_LASTFM_SECTIONS: recent_tracks, top_artists_grid, top_albums_grid

          PLUGIN_GITHUB: true
          PLUGIN_GITHUB_HIDE_HEADER: true
          PLUGIN_GITHUB_USERNAME: LucasHenriqueDiniz
          PLUGIN_GITHUB_SECTIONS: favorite_languages

      - name: 🦀 MyAnimeList 🦀
        uses: LucasHenriqueDiniz/WeebProfile@main
        with:
          FILENAME: MyAnimeList.svg
          GIST_ID: ${{ secrets.GIST_ID }}
          GH_TOKEN: ${{ secrets.WEEB_GH_TOKEN }}
          STORAGE_METHOD: gist
          SIZE: half
          STYLE: default

          PLUGIN_MAL: true
          PLUGIN_MAL_HIDE_HEADER: true
          PLUGIN_MAL_USERNAME: Amayacrab
          PLUGIN_MAL_SECTIONS: statistics_simple, character_simple_favorites, anime_favorites
```

![Repository workflow](/src/readme/imgs/workflow_example.png)

- Commit the changes
- Go to the Actions tab in your repository, you should see the workflow running

> 💡 Now in the `Actions` tab of your repository, you should see the workflow running and generating the SVGs.

> 💡 The SVGs will be saved in the Gist you created in step 1

> 💡 You can run it manually by clicking on the `Run workflow` button

### 6. Add the SVGs to your profile

- Go to your GitHub profile and click on the `Edit profile` button
- In the `About` section, paste the following code:

```md
![LastFM](https://gist.githubusercontent.com/username/gist_id/raw/LastFM.svg)
![MyAnimeList](https://gist.githubusercontent.com/username/gist_id/raw/MyAnimeList.svg)
```

> 💡 Don't forget to replace `username` and `gist_id` with your GitHub username and Gist ID

> 💡 If you used other filename in the action replace in the link ex: LastFM.svg or MyAnimeList.svg

- Replace `username` and `gist_id` with your GitHub username and Gist ID
- Save the changes

### 7. Done!

> 💡 Now in your profile, you should see the SVGs like this

Example:
![Profile example](/src/readme/imgs/profile_example.png)

<!-- CONFIGS -->

## 🛠️ Configuration

The `weeb_profile.yml` file is where you can configure the plugins and the SVGs that will be generated.
Each plugin has its own configuration, and you can enable or disable them by setting the `PLUGIN_ENABLED` to `true` or `false`.
You can see the available configurations for each plugin in the [Available plugins](#-available-plugins) section.

### 🌐 Global configurations

<table>
  <tr>
    <th>Key</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>FILENAME</td>
    <td>MyProfile.svg</td>
    <td>The name of the SVG file that will be generated</td>
  </tr>
  <tr>
    <td>GIST_ID</td>
    <td>''</td>
    <td>The Gist ID where the SVG will be saved</td>
  </tr>
  <tr>
    <td>GH_TOKEN</td>
    <td>''</td>
    <td>The GitHub Token used to save the SVG</td>
  </tr>
  <tr>
    <td>SIZE</td>
    <td>half</td>
    <td>The size of the SVG (half or full)</td>
  </tr>
  <tr>
    <td>STYLE</td>
    <td>default</td>
    <td>The style of the SVG (default or terminal)</td>
  </tr>
  <tr>
    <td>STORAGE_METHOD</td>
    <td>gist</td>
    <td>The storage method of the SVG (gist, local or repository)</td>
  </tr>
  <tr>
    <td>CUSTOM_CSS</td>
    <td>''</td>
    <td>The custom CSS that will be applied to the SVG</td>
  </tr>
  <tr>
    <td>PLUGINS_ORDER</td>
    <td>'github, lastfm, mal'</td>
    <td>The order of the plugins that will be generated</td>
  </tr>
</table>
