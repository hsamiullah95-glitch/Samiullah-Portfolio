
import { useState } from 'react';
import * as prettier from 'prettier/standalone';
import htmlPlugin from 'prettier/plugins/html';
import postcssPlugin from 'prettier/plugins/postcss';
import babelPlugin from 'prettier/plugins/babel';
import { Link, useLocation } from 'react-router-dom';
import {
  Code2,
  Palette,
  Braces,
  Network,
  ArrowUpRight,
  Copy,
  RotateCcw,
  Sparkles,
  Globe,
  Check,
  Calculator
} from 'lucide-react';

import './Tools.css';

const toolItems = [
  {
    id: 'html',
    title: 'HTML Tools',
    description: 'Format, organize and work with HTML code.',
    icon: Code2,
    color: 'blue',
    features: ['HTML Formatter', 'HTML Code Editor', 'HTML Structure']
  },
  {
    id: 'css',
    title: 'CSS Tools',
    description: 'Format and organize your CSS stylesheets.',
    icon: Palette,
    color: 'purple',
    features: ['CSS Formatter', 'CSS Code Editor', 'CSS Structure']
  },
  {
    id: 'javascript',
    title: 'JavaScript Tools',
    description: 'Work with JavaScript code and formatting.',
    icon: Braces,
    color: 'yellow',
    features: ['JS Formatter', 'Code Editor', 'Code Structure']
  },
  {
    id: 'network',
    title: 'Network Tools',
    description: 'Useful IPv4 and subnet calculation tools.',
    icon: Network,
    color: 'green',
    features: ['IP Validator', 'Subnet Calculator', 'Network Information']
  }
];

function getNetworkInfo(value) {
  const parts = value.trim().split('/');
  const ip = parts[0];
  const cidr = parts.length === 2 ? Number(parts[1]) : 24;

  const octets = ip.split('.').map(Number);

  if (
    octets.length !== 4 ||
    octets.some((n, i) =>
      !Number.isInteger(n) ||
      n < 0 ||
      n > 255 ||
      !/^\d+$/.test(ip.split('.')[i])
    ) ||
    !Number.isInteger(cidr) ||
    cidr < 0 ||
    cidr > 32
  ) {
    return null;
  }

  const number =
    (((octets[0] * 256 + octets[1]) * 256 +
      octets[2]) * 256 + octets[3]) >>> 0;

  const mask = cidr === 0
    ? 0
    : (0xffffffff << (32 - cidr)) >>> 0;

  const network = (number & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;

  const toIP = n => [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255
  ].join('.');

  return {
    ip,
    cidr,
    mask: toIP(mask),
    network: toIP(network),
    broadcast: toIP(broadcast),
    total: cidr === 32 ? 1 : Math.pow(2, 32 - cidr),
    usable: cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.pow(2, 32 - cidr) - 2
  };
}

export default function Tools() {
  const location = useLocation();
  const current = location.pathname.split('/')[2] || '';

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [ip, setIp] = useState('192.168.1.1/24');
  const [network, setNetwork] = useState(null);
  const [networkError, setNetworkError] = useState('');
  const [formatError, setFormatError] = useState('');
  const [copied, setCopied] = useState(false);

  const selected = toolItems.find(item => item.id === current);

  const reset = () => {
    setCode('');
    setOutput('');
    setNetwork(null);
    setNetworkError('');
    setFormatError('');
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert('Copy failed. Please select and copy the text.');
    }
  };

  const runFormatter = async () => {
    if (!code.trim()) {
      setOutput('');
      setFormatError('Please enter some code first.');
      return;
    }

    try {
      setFormatError('');
      const parser = current === 'html'
        ? 'html'
        : current === 'css'
          ? 'css'
          : 'babel';

      const formatted = await prettier.format(code, {
        parser,
        plugins: [htmlPlugin, postcssPlugin, babelPlugin],
        tabWidth: 2,
        semi: true,
        singleQuote: true
      });

      setOutput(formatted);
    } catch (error) {
      setOutput('');
      setFormatError(error.message || 'Unable to format this code.');
    }
  };

  const calculateNetwork = () => {
    const result = getNetworkInfo(ip);
    setNetwork(result);
    setNetworkError(result ? '' : 'Invalid IPv4 address or CIDR prefix. Please check your input.');
  };

  if (!selected) {
    return (
      <main className="tools-page">
        <section className="tools-hero">
          <span className="tools-eyebrow">
            <Sparkles size={16} /> DIGITAL WORKSPACE
          </span>

          <h1>
            Powerful Online <span>Tools.</span>
          </h1>

          <p>
            A collection of useful tools for developers, designers
            and networking enthusiasts. Work smarter and build better.
          </p>

          <div className="tools-hero-stats">
            <div><strong>04</strong><span>Tool Categories</span></div>
            <div><strong>100%</strong><span>Free to Use</span></div>
            <div><strong>24/7</strong><span>Available</span></div>
          </div>
        </section>

        <section className="tools-section">
          <div className="tools-section-heading">
            <div>
              <span className="tools-small-label">EXPLORE MY TOOLS</span>
              <h2>Choose Your Workspace</h2>
              <p>Select a category to start working with its tools.</p>
            </div>
            <Globe size={35} />
          </div>

          <div className="tools-grid">
            {toolItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  className={`tools-card tools-${item.color}`}
                  key={item.id}
                >
                  <div className="tools-card-top">
                    <div className="tools-icon"><Icon size={28} /></div>
                    <span>0{index + 1}</span>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                  <div className="tools-features">
                    {item.features.map(feature => (
                      <span key={feature}>✓ {feature}</span>
                    ))}
                  </div>

                  <Link to={`/tools/${item.id}`} className="tools-card-link">
                    Explore Tools <ArrowUpRight size={18} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="tools-bottom">
          <div className="tools-bottom-icon"><Calculator /></div>
          <div>
            <span>BUILT FOR DEVELOPERS</span>
            <h2>Everything You Need in One Place.</h2>
            <p>Simple, practical and easy-to-use development tools.</p>
          </div>
        </section>
      </main>
    );
  }

  const Icon = selected.icon;
  const isNetwork = current === 'network';

  return (
    <main className="tools-page">
      <section className="tools-detail-hero">
        <Link to="/tools" className="tools-back">← All Online Tools</Link>

        <div className="tools-detail-icon">
          <Icon size={34} />
        </div>

        <span className="tools-eyebrow">ONLINE WORKSPACE</span>
        <h1>{selected.title}</h1>
        <p>{selected.description}</p>
      </section>

      <section className="tools-workspace">
        <div className="workspace-heading">
          <div>
            <span className="tools-small-label">YOUR WORKSPACE</span>
            <h2>{isNetwork ? 'IPv4 Subnet Calculator' : 'Code Formatter'}</h2>
          </div>
          <span className="workspace-status"><span /> Ready to use</span>
        </div>

        {isNetwork ? (
          <div className="network-tool">
            <label htmlFor="ip-address">IPv4 Address / CIDR</label>
            <div className="network-input-row">
              <input
                id="ip-address"
                value={ip}
                onChange={e => { setIp(e.target.value); setNetwork(null); setNetworkError(''); }}
                placeholder="192.168.1.1/24"
              />
              <button
                onClick={calculateNetwork}
                className="tools-primary-button"
              >
                <Calculator size={17} /> Calculate
              </button>
            </div>

            <p className="tools-hint">
              Example: 192.168.1.1/24 — enter an IPv4 address and subnet prefix.
            </p>

            {network && (
              <div className="network-results">
                {[
                  ['IP Address', network.ip],
                  ['CIDR Prefix', `/${network.cidr}`],
                  ['Subnet Mask', network.mask],
                  ['Network Address', network.network],
                  ['Broadcast Address', network.broadcast],
                  ['Total Addresses', network.total.toLocaleString()],
                  ['Usable Addresses', network.usable.toLocaleString()]
                ].map(([label, value]) => (
                  <div className="network-result" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            )}

            {networkError && <p className="tools-error">{networkError}</p>}
          </div>
        ) : (
          <div className="code-tool">
            <div className="code-editor-heading">
              <span>{current.toUpperCase()} EDITOR</span>
              <span>Paste your code below</span>
            </div>

            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={`// Write or paste your ${current} code here...`}
              spellCheck="false"
            />

            <div className="code-actions">
              <button onClick={runFormatter} className="tools-primary-button">
                <Sparkles size={17} /> Format Code
              </button>
              <button onClick={reset} className="tools-secondary-button">
                <RotateCcw size={17} /> Clear
              </button>
            </div>

            {formatError && <p className="tools-error">{formatError}</p>}

            <div className="code-output-heading">
              <strong>Formatted Output</strong>
              <button onClick={copyOutput} disabled={!output}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
            </div>

            <pre className="code-output">
              {output || 'Your formatted code will appear here...'}
            </pre>
          </div>
        )}
      </section>

      <div className="tools-note">
        <Sparkles size={19} />
        <p>
          These tools run in your browser. Your code is not uploaded
          to a server by this page.
        </p>
      </div>
    </main>
  );
}
