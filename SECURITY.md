# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in BrandPlan, please report it by emailing:

**security@brandplan.dev** (or open a private security advisory on GitHub)

Please include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond to security reports within 48 hours and work to address confirmed vulnerabilities promptly.

## Security Considerations

BrandPlan is a build-time tool that processes TypeScript configuration files. When using the CLI:

- Only run `npx brandplan init` or `npx brandplan build` in projects you trust
- Review your `brandplan.config.ts` file - it will be executed during builds
- Do not commit sensitive data to brand token configurations

## Disclosure Policy

- Report security issues privately first
- Allow reasonable time for fixes before public disclosure
- Credit will be given to reporters (unless anonymity is requested)
