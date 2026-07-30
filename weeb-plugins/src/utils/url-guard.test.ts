import { describe, it, expect } from "vitest"
import { assertSafePublicUrl, isSafePublicUrl, UnsafeUrlError } from "./url-guard"

describe("assertSafePublicUrl", () => {
  it("accepts a plain https URL", () => {
    const url = assertSafePublicUrl("https://example.com/portfolio")
    expect(url.hostname).toBe("example.com")
  })

  it("accepts an explicit :443 port and trims whitespace", () => {
    // URL drops the scheme's default port, so this normalizes back to "".
    expect(assertSafePublicUrl("  https://example.com:443/  ").port).toBe("")
  })

  it.each([
    ["empty string", ""],
    ["malformed", "not a url"],
    ["http", "http://example.com"],
    ["file", "file:///etc/passwd"],
    ["embedded credentials", "https://user:pass@example.com"],
    ["non-443 port", "https://example.com:8080"],
  ])("rejects %s", (_label, raw) => {
    expect(() => assertSafePublicUrl(raw)).toThrow(UnsafeUrlError)
  })

  it.each([
    ["localhost", "https://localhost/x"],
    ["subdomain of localhost", "https://api.localhost/x"],
    ["mDNS .local", "https://printer.local/x"],
    ["cluster .internal", "https://svc.internal/x"],
    ["GCP metadata", "https://metadata.google.internal/x"],
  ])("rejects internal hostname: %s", (_label, raw) => {
    expect(() => assertSafePublicUrl(raw)).toThrow(UnsafeUrlError)
  })

  it.each([
    ["loopback", "https://127.0.0.1/x"],
    ["this network", "https://0.0.0.0/x"],
    ["private 10/8", "https://10.1.2.3/x"],
    ["private 172.16/12", "https://172.20.0.5/x"],
    ["private 192.168/16", "https://192.168.1.1/x"],
    ["link-local metadata", "https://169.254.169.254/latest/meta-data/"],
    ["carrier-grade NAT", "https://100.100.0.1/x"],
    ["multicast", "https://239.0.0.1/x"],
  ])("rejects private IPv4: %s", (_label, raw) => {
    expect(() => assertSafePublicUrl(raw)).toThrow(UnsafeUrlError)
  })

  it.each([
    ["loopback", "https://[::1]/x"],
    ["unspecified", "https://[::]/x"],
    ["unique local", "https://[fd00::1]/x"],
    ["link-local", "https://[fe80::1]/x"],
    ["ipv4-mapped loopback", "https://[::ffff:127.0.0.1]/x"],
  ])("rejects private IPv6: %s", (_label, raw) => {
    expect(() => assertSafePublicUrl(raw)).toThrow(UnsafeUrlError)
  })

  it("allows public IP literals", () => {
    expect(() => assertSafePublicUrl("https://8.8.8.8/x")).not.toThrow()
    expect(() => assertSafePublicUrl("https://172.32.0.1/x")).not.toThrow()
  })

  it("does not reject hostnames that merely contain a blocked label", () => {
    expect(() => assertSafePublicUrl("https://localhost.example.com/x")).not.toThrow()
    expect(() => assertSafePublicUrl("https://mylocal/x")).not.toThrow()
  })
})

describe("isSafePublicUrl", () => {
  it("mirrors assertSafePublicUrl without throwing", () => {
    expect(isSafePublicUrl("https://example.com")).toBe(true)
    expect(isSafePublicUrl("http://example.com")).toBe(false)
    expect(isSafePublicUrl("https://192.168.0.1")).toBe(false)
  })
})
