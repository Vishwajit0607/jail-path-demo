import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jailPath, safeRelative, PathTraversalError, InvalidPathError } from 'jail-path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/resolve', (req, res) => {
  const {
    rootDir = '/var/app/uploads',
    userPath = '',
    allowRootAccess = false,
    windowsDeviceCheck = true,
  } = req.body;

  if (typeof userPath !== 'string') {
    return res.status(400).json({
      safe: false,
      status: 'error',
      errorType: 'InvalidInput',
      message: 'userPath must be a string',
    });
  }

  try {
    const resolvedPath = jailPath(rootDir, userPath, {
      allowRootAccess: Boolean(allowRootAccess),
      windowsDeviceCheck: Boolean(windowsDeviceCheck),
    });

    const relative = safeRelative(rootDir, userPath, {
      allowRootAccess: Boolean(allowRootAccess),
      windowsDeviceCheck: Boolean(windowsDeviceCheck),
    });

    return res.json({
      safe: true,
      status: 'allowed',
      input: {
        rootDir,
        userPath,
        allowRootAccess,
        windowsDeviceCheck,
      },
      result: {
        resolvedPath,
        relativePath: relative,
      },
      message: 'Path safely resolved and confined within root boundary.',
    });
  } catch (err) {
    if (err instanceof PathTraversalError) {
      return res.status(403).json({
        safe: false,
        status: 'blocked',
        errorType: 'PathTraversalError',
        code: err.code,
        userPath: err.userPath,
        rootDir: err.rootDir,
        message: err.message,
        details: 'The supplied path resolves outside the designated root directory boundary.',
      });
    }

    if (err instanceof InvalidPathError) {
      return res.status(400).json({
        safe: false,
        status: 'blocked',
        errorType: 'InvalidPathError',
        code: err.code,
        userPath: err.userPath,
        message: err.message,
        details: 'The input contains malformed or hazardous characters (such as null bytes or reserved device identifiers).',
      });
    }

    return res.status(500).json({
      safe: false,
      status: 'error',
      errorType: 'UnknownError',
      message: err.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', package: 'jail-path', version: '1.0.0' });
});

if (process.env.NODE_ENV !== 'production' || process.env.RENDER || process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`jail-path demo running at http://localhost:${PORT}`);
  });
}

export default app;
