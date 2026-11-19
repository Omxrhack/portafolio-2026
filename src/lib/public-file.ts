import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Truena el build si un archivo de public/ que el sitio enlaza no existe: un
 * icono o un PDF faltante saldría roto en producción sin que nadie lo note.
 * Astro toma public/ de la raíz del proyecto, que es el cwd de `npm run build`.
 */
export function assertPublicFile(publicPath: string, owner: string): void {
  const file = join(process.cwd(), 'public', publicPath);
  if (!existsSync(file)) throw new Error(`Falta ${publicPath} (${owner}): ${file}`);
}
