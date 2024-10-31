import axios from "axios";

export interface TokenScopes {
  repo: boolean;
  repo_status: boolean;
  repo_deployment: boolean;
  public_repo: boolean;
  repo_invite: boolean;
  read_org: boolean;
  gist: boolean;
  user: boolean;
  user_follow: boolean;
  user_email: boolean;
  user_read: boolean;
  write_discussion: boolean;
  read_audit_log: boolean;
}

async function getTokenScope(token: string) {
  const response = await axios.get("https://api.github.com", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const scopes = response.headers["x-oauth-scopes"].split(", ");

  const scopesResponse = {
    repo: false,
    repo_status: false,
    repo_deployment: false,
    public_repo: false,
    repo_invite: false,
    read_org: false,
    gist: false,
    user: false,
    user_follow: false,
    user_email: false,
    user_read: false,
    write_discussion: false,
    read_audit_log: false,
  } as TokenScopes;

  // if audit_log -> read_audit_log true
  // if repo -> public_repo true
  // if user -> user_follow, read_user, user_email, user_read, user:email true

  scopes.forEach((scope: string) => {
    scopesResponse[scope.replace(":", "_") as keyof TokenScopes] = true;
    if (scope === "audit_log") {
      scopesResponse.read_audit_log = true;
    }
    if (scope === "repo") {
      scopesResponse.public_repo = true;
      scopesResponse.repo_status = true;
      scopesResponse.repo_deployment = true;
      scopesResponse.repo_invite = true;
    }
    if (scope === "user") {
      scopesResponse.user_follow = true;
      scopesResponse.user_email = true;
      scopesResponse.user_read = true;
      scopesResponse.user = true;
    }
  });

  //print only the scopes that are true
  console.log(scopesResponse);
  return scopesResponse;
}

export default getTokenScope;

let cachedTokenScopes: TokenScopes | null = null;

export async function checkIfHasScope(token: string, scope: keyof TokenScopes) {
  if (cachedTokenScopes === null) {
    cachedTokenScopes = await getTokenScope(token);
  }

  if (cachedTokenScopes[scope] === undefined) {
    throw new Error(`Scope ${scope} does not exist`);
  }

  return cachedTokenScopes[scope];
}
