# Guía de Despliegue en GitHub Pages

Esta guía te ayudará a desplegar PocketCal en GitHub Pages.

## Configuración Inicial

### 1. Crear un repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio
2. Nombra el repositorio (por ejemplo: `pocketcal`)
3. Haz el repositorio público para usar GitHub Pages gratuito
4. No inicialices con README, .gitignore o licencia (ya están configurados)

### 2. Configurar el repositorio local

```bash
# Si aún no has clonado el repositorio
git clone https://github.com/TU_USUARIO/pocketcal.git
cd pocketcal

# Si ya tienes el código local
git remote add origin https://github.com/TU_USUARIO/pocketcal.git
git branch -M main
git push -u origin main
```

### 3. Actualizar la configuración para tu repositorio

Edita `vite.config.ts` y cambia la ruta base:

```typescript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/TU_REPOSITORIO/' : '/',
})
```

Reemplaza `TU_REPOSITORIO` con el nombre de tu repositorio.

## Despliegue Automático con GitHub Actions

### 1. Habilitar GitHub Pages

1. Ve a la configuración de tu repositorio en GitHub
2. Navega a la sección "Pages" en el menú lateral
3. En "Source", selecciona "GitHub Actions"

### 2. Configurar el workflow

El archivo `.github/workflows/deploy.yml` ya está configurado y se ejecutará automáticamente en cada push a la rama `main`.

### 3. Verificar el despliegue

1. Haz push de tus cambios a la rama `main`
2. Ve a la pestaña "Actions" en tu repositorio
3. Verifica que el workflow se ejecute correctamente
4. Tu sitio estará disponible en `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

## Despliegue Manual

Si prefieres desplegar manualmente:

```bash
# Instalar dependencias
npm install

# Construir el proyecto
npm run build

# Desplegar a GitHub Pages
npm run deploy
```

## Configuración de Dominio Personalizado (Opcional)

Si quieres usar un dominio personalizado:

1. Crea un archivo `CNAME` en la carpeta `public/` con tu dominio
2. Configura los registros DNS de tu dominio para apuntar a GitHub Pages
3. Actualiza `vite.config.ts` para usar la ruta base correcta

## Solución de Problemas

### Error de rutas 404

Si las rutas no funcionan correctamente:

1. Verifica que `vite.config.ts` tenga la ruta base correcta
2. Asegúrate de que el archivo `.nojekyll` esté presente
3. Verifica que GitHub Pages esté configurado para usar GitHub Actions

### Error de permisos

Si tienes problemas con los permisos:

1. Verifica que el repositorio sea público
2. Asegúrate de que GitHub Actions esté habilitado
3. Verifica que tengas permisos de escritura en el repositorio

### Error de build

Si el build falla:

1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Ejecuta el build localmente: `npm run build`
3. Revisa los logs en la pestaña "Actions" de GitHub

## URLs de Ejemplo

- **Desarrollo local**: `http://localhost:5173`
- **GitHub Pages**: `https://TU_USUARIO.github.io/TU_REPOSITORIO/`
- **Dominio personalizado**: `https://tu-dominio.com`

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa del build
npm run preview

# Desplegar a GitHub Pages
npm run deploy

# Linting
npm run lint
```

## Estructura de Archivos Importantes

```
pocketcal/
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── .nojekyll                    # Archivo para GitHub Pages
├── public/                      # Archivos estáticos
├── src/                         # Código fuente
├── dist/                        # Build de producción (generado)
├── vite.config.ts              # Configuración de Vite
└── package.json                # Dependencias y scripts
```

¡Tu aplicación PocketCal estará lista para usar en GitHub Pages!
