import { URL } from 'url';
import dns from 'dns/promises';
import net from 'net';

/**
 * Checks if an IPv4 address is in a private, loopback, or link-local range.
 */
function isPrivateIPv4(ip) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return true;

  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;
  // 10.0.0.0/8 (Private network)
  if (parts[0] === 10) return true;
  // 172.16.0.0/12 (Private network: 172.16.0.0 - 172.31.255.255)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16 (Private network)
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 169.254.0.0/16 (Link-local / Cloud metadata: 169.254.169.254)
  if (parts[0] === 169 && parts[1] === 254) return true;
  // 0.0.0.0/8 (Current network)
  if (parts[0] === 0) return true;
  // 224.0.0.0/4 (Multicast)
  if (parts[0] >= 224) return true;

  return false;
}

/**
 * Checks if an IPv6 address is loopback, link-local, or private.
 */
function isPrivateIPv6(ip) {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // Unique local (fc00::/7)
  if (normalized.startsWith('fe80')) return true; // Link-local
  return false;
}

/**
 * Validates a target URL against SSRF attacks.
 * @param {string} urlString 
 * @returns {Promise<{ valid: boolean, reason?: string, parsedUrl?: URL, resolvedIp?: string }>}
 */
export async function validateUrlForSsrf(urlString) {
  try {
    if (!urlString || typeof urlString !== 'string') {
      return { valid: false, reason: 'URL must be a non-empty string' };
    }

    const trimmed = urlString.trim();
    const parsed = new URL(trimmed);

    // Protocol check: only http and https allowed
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, reason: `Disallowed protocol: ${parsed.protocol}. Only http and https are allowed.` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block common localhost and internal hostnames directly
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname === 'metadata.google.internal' ||
      hostname === '169.254.169.254'
    ) {
      return { valid: false, reason: `Access to local/metadata host '${hostname}' is blocked.` };
    }

    // If hostname is already an IP address
    if (net.isIP(hostname)) {
      if (net.isIPv4(hostname) && isPrivateIPv4(hostname)) {
        return { valid: false, reason: `Access to private IPv4 address '${hostname}' is prohibited.` };
      }
      if (net.isIPv6(hostname) && isPrivateIPv6(hostname)) {
        return { valid: false, reason: `Access to private IPv6 address '${hostname}' is prohibited.` };
      }
      return { valid: true, parsedUrl: parsed, resolvedIp: hostname };
    }

    // Resolve domain to IP to prevent DNS rebinding
    try {
      const records = await dns.lookup(hostname, { all: true });
      if (!records || records.length === 0) {
        return { valid: false, reason: `Could not resolve hostname '${hostname}'.` };
      }

      for (const record of records) {
        if (record.family === 4 && isPrivateIPv4(record.address)) {
          return { valid: false, reason: `Resolved IP '${record.address}' is within a private network range.` };
        }
        if (record.family === 6 && isPrivateIPv6(record.address)) {
          return { valid: false, reason: `Resolved IP '${record.address}' is within a private IPv6 range.` };
        }
      }

      return { valid: true, parsedUrl: parsed, resolvedIp: records[0].address };
    } catch (dnsErr) {
      return { valid: false, reason: `DNS resolution failed: ${dnsErr.message}` };
    }
  } catch (err) {
    return { valid: false, reason: `Invalid URL format: ${err.message}` };
  }
}
