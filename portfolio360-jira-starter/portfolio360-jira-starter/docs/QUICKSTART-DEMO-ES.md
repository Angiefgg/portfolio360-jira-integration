# Guía rápida: ejecutar Portfolio360 en modo demo

Esta guía explica cómo iniciar Portfolio360 con datos de ejemplo, sin conectarlo a Jira.

## ¿Qué necesitas?

- Una computadora con Windows, macOS o Linux.
- [Node.js 18 o superior](https://nodejs.org/) instalado. La instalación incluye npm.
- El archivo ZIP del proyecto descomprimido en una carpeta local.
- Una terminal: Terminal en macOS/Linux o PowerShell en Windows.

No necesitas una cuenta de Jira ni un API Token para usar el modo demo.

## 1. Verifica Node.js y npm

Abre una terminal y ejecuta:

```bash
node -v
npm -v
```

El primer comando debe mostrar la versión de Node.js (18 o superior) y el segundo la versión de npm. Si el sistema indica que el comando no existe, instala Node.js desde [nodejs.org](https://nodejs.org/) y vuelve a abrir la terminal.

## 2. Abre la carpeta del proyecto

Descomprime `portfolio360-jira-starter.zip`. En la terminal, cambia a la carpeta `portfolio360-jira-starter`, que contiene `package.json` y `server.js`.

Ejemplo en macOS/Linux:

```bash
cd ruta/a/portfolio360-jira-starter
```

Ejemplo en Windows PowerShell:

```powershell
cd "C:\ruta\a\portfolio360-jira-starter"
```

## 3. Instala las dependencias

Ejecuta una sola vez:

```bash
npm install
```

Esto descarga las librerías que necesita la aplicación.

## 4. Crea tu configuración local

Crea el archivo `.env` a partir de `.env.example`.

macOS/Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Abre `.env` con un editor de texto y confirma que tenga:

```env
PORT=3000
JIRA_MODE=mock
```

`JIRA_MODE=mock` activa el modo demo. No agregues credenciales de Jira para esta prueba.

## 5. Inicia Portfolio360

En la misma carpeta, ejecuta:

```bash
npm start
```

La terminal debe mostrar un mensaje indicando que Portfolio360 está disponible en el puerto 3000.

## 6. Abre el dashboard

Abre tu navegador y visita:

**http://localhost:3000**

El dashboard se ejecuta localmente en tu computadora. Mantén abierta la terminal mientras lo utilizas.

## 7. Detén la aplicación

Cuando termines, vuelve a la terminal y presiona `Ctrl + C`.

Para volver a utilizarla otro día, abre la carpeta del proyecto y ejecuta `npm start` de nuevo. No necesitas repetir `npm install` salvo que cambien las dependencias.

## ¿Qué contiene el modo demo?

El modo demo utiliza datos ficticios incluidos en el código para mostrar el dashboard y sus indicadores. Sirve para revisar la interfaz y el flujo general. No consulta Jira ni representa información real de una empresa.

## Solución de problemas frecuentes

| Problema | Qué hacer |
|---|---|
| `node` o `npm` no se reconoce | Instala Node.js 18 o superior y vuelve a abrir la terminal. |
| `Cannot find package` o faltan dependencias | Confirma que estás en la carpeta que contiene `package.json` y ejecuta `npm install`. |
| El puerto 3000 está ocupado | Cierra la otra aplicación que lo usa o cambia `PORT=3000` por `PORT=3001` en `.env`; después inicia de nuevo y abre `http://localhost:3001`. |
| El navegador no abre el dashboard | Confirma que `npm start` sigue ejecutándose y que estás usando la dirección `http://localhost:3000`. |

## Seguridad

- El archivo `.env` contiene configuración local y está excluido del repositorio mediante `.gitignore`.
- Nunca publiques `.env`, contraseñas ni API Tokens en GitHub.
- Para la prueba demo no se requiere ningún secreto ni credencial.

## ¿Cuándo conectar Jira?

Cuando hayas validado que el modo demo funciona, sigue la sección **Connect your own Jira Cloud** del archivo [`README.md`](../README.md). La conexión requiere Jira Cloud, correo de Atlassian y un API Token, configurados únicamente en el backend.
