-- RLS Policies para tabela essential_configs
-- Frontend NÃO pode ler valores diretamente do banco
-- Apenas backend (service_role) pode ler para gerar SVGs

-- Habilitar RLS na tabela essential_configs
ALTER TABLE essential_configs ENABLE ROW LEVEL SECURITY;

-- Policy: Bloquear SELECT completamente para usuários autenticados
-- (A API route retorna valores mascarados quando necessário)
CREATE POLICY "No SELECT for authenticated users on essential_configs"
ON essential_configs
FOR SELECT
USING (false); -- Ninguém pode ler via RLS (apenas service_role)

-- Policy: Usuários podem atualizar apenas suas próprias configs
CREATE POLICY "Users can update their own essential_configs"
ON essential_configs
FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Policy: Usuários podem inserir apenas suas próprias configs
CREATE POLICY "Users can insert their own essential_configs"
ON essential_configs
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Policy: Usuários podem deletar apenas suas próprias configs
CREATE POLICY "Users can delete their own essential_configs"
ON essential_configs
FOR DELETE
USING (auth.uid()::text = user_id);

-- Nota: O backend usa service_role_key que bypassa RLS
-- A API route /api/profile/essential-configs retorna valores mascarados
-- A API route /api/profile PUT permite atualizar via setEssentialConfigs (service_role)

