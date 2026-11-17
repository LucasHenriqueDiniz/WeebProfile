interface FieldsMetadata {
  requiredFields?: readonly string[]
  essentialConfigKeysMetadata?: readonly unknown[]
}

/**
 * The required fields the wizard asks for as plain inputs: every required field that is
 * not also a secret. A secret already has its own input (SecretInput), so Last.fm's
 * username, which is both, is asked for once.
 *
 * Until 11/2026 the plain inputs showed only for plugins without any secret, so GitHub's
 * username and Repository's owner and repo had no input at all: a GitHub card could not
 * be finished by anyone whose account had no username.
 */
export function publicRequiredFields(metadata: FieldsMetadata): string[] {
  const secretKeys = (metadata.essentialConfigKeysMetadata ?? []).map((meta) => (meta as { key: string }).key)
  return (metadata.requiredFields ?? []).filter((field) => !secretKeys.includes(field))
}
