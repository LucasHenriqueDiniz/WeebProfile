-- One-off data fix: the three public templates were written to D1 by hand with their
-- descriptions missing accents ("calendario", "repositorios", "estatisticas"), and the
-- gallery, the template page and the landing show them as is.
--
-- Each UPDATE matches the old text too, so running it again, or after someone edited a
-- description, changes nothing.
--
-- Run from weeb-dashboard/:
--   pnpm exec wrangler d1 execute weebprofile-db --remote --file scripts/sql/2026-11-16-template-description-accents.sql

UPDATE templates
SET description = 'Perfil de desenvolvedor com atividade, calendário e repositórios em destaque do GitHub.'
WHERE id = '24631805e9b581180f00b670638a0fe3'
  AND description = 'Perfil de desenvolvedor com atividade, calendario e repositorios em destaque do GitHub.';

UPDATE templates
SET description = 'Combine estatísticas de anime do MyAnimeList com as faixas mais ouvidas no Last.fm.'
WHERE id = 'eac59bb5481ce60dc57bf2090ef24c3b'
  AND description = 'Combine estatisticas de anime do MyAnimeList com as faixas mais ouvidas no Last.fm.';

UPDATE templates
SET description = 'Estatísticas da Steam e desafios completados no Codewars.'
WHERE id = 'd7ed90cfffbbd466cec24ff05ba3abb9'
  AND description = 'Estatisticas da Steam e desafios completados no Codewars.';
