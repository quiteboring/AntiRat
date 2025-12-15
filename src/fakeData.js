import http from 'http';
import crypto from 'crypto';

const TARGET_URL = 'http://172.237.133.172:8080/hits';
const SEND_INTERVAL = 5000;
const TOTAL_SENDS = 10;

const pick = (items) => items[Math.floor(Math.random() * items.length)];
const base64Url = (input) => Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const randomDigits = (len) => Array(len).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomHex = (len) => crypto.randomBytes(len / 2).toString('hex');

function generateJWT(subId) {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64Url(JSON.stringify({
    sub: subId || randomDigits(9),
    iat: now - randomInt(60, 600),
    exp: now + randomInt(3600, 86400),
    iss: 'auth.service.local',
    sid: randomHex(16)
  }));
  const signature = base64Url(crypto.randomBytes(32));
  return `${header}.${payload}.${signature}`;
}

function generateDiscordToken() {
  const useMfa = Math.random() > 0.4;
  if (useMfa) {
    return `mfa.${base64Url(crypto.randomBytes(64))}`;
  }
  const userId = randomDigits(17);
  const part1 = base64Url(userId);
  const part2 = base64Url(crypto.randomBytes(32));
  const part3 = base64Url(crypto.randomBytes(32)).slice(0, 27);
  return `${part1}.${part2}.${part3}`;
}

function generateFakeData() {
  const fakeUsernames = [
    'TestUser123',
    'LagMaster2000',
    'AltF4Wizard',
    'CoffeeAddict',
    'NightShiftNerd',
    'CaseSensitive',
    'DebuggerDan'
  ];
  const fakeHosts = ['DESKTOP-BREAD', 'LAPTOP-BEANS', 'DESKTOP-RGB', 'NAS-TOASTER', 'NUC-COFFEE'];
  const fakeOS = [
    'Windows 11 Pro 23H2 (22631.3737)',
    'Windows 10 Pro 22H2 (19045.4894)',
    'Arch Linux (6.8.5-zen)',
    'Ubuntu 22.04.4 LTS',
    'macOS 14.4 Sonoma'
  ];
  const fakeIPs = ['45.91.16.42', '172.67.201.13', '104.21.12.77', '95.216.12.44', '37.187.72.19'];
  const fakeLocations = ['Frankfurt, DE', 'Dallas, US', 'Helsinki, FI', 'Paris, FR', 'Ashburn, US'];
  const fakeMCUsernames = ['Steve123', 'Alex456', 'Herobrine789', 'Notch999', 'Creeper001', 'EnderChad', 'VillagerBob'];
  const fakeServers = ['mc.hypixel.net', 'play.cubecraft.net', 'play.pvplegacy.net', 'play.blocksmc.com'];
  const fakeEmails = ['fake@example.com', 'test@test.com', 'dummy@domain.com', 'notreal@email.com', 'spamtrap@mailinator.com'];
  const fakeGPUs = ['RTX 4070 Ti SUPER', 'RTX 3080', 'RX 6800 XT', 'Arc A770', 'GTX 1660 Super'];
  const fakeRAM = ['8 GB', '16 GB', '32 GB', '64 GB'];
  const fakeAV = ['Defender', 'Kaspersky', 'Bitdefender', 'None (yikes)'];
  const runningApps = ['Discord.exe', 'chrome.exe (27 tabs)', 'Spotify.exe', 'MinecraftLauncher.exe', 'Steam.exe'];

  const randomUsername = pick(fakeUsernames);
  const randomHost = pick(fakeHosts);
  const randomOS = pick(fakeOS);
  const randomIP = pick(fakeIPs);
  const randomLocation = pick(fakeLocations);
  const randomMCUser = pick(fakeMCUsernames);
  const randomEmail = pick(fakeEmails);
  const randomGPU = pick(fakeGPUs);
  const randomRam = pick(fakeRAM);
  const randomAv = pick(fakeAV);
  const randomServer = pick(fakeServers);

  const fakeUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  const fakeToken = generateJWT(randomDigits(9));
  const fakeDiscordToken = generateDiscordToken();
  const uptimeHours = randomInt(1, 240);
  const ping = randomInt(5, 120);
  const hwid = `${randomHex(8)}-${randomHex(8)}-${randomHex(8)}`;

  const activeApps = runningApps.filter(() => Math.random() > 0.35);
  const appsDisplay = (activeApps.length ? activeApps : runningApps.slice(0, 3)).join(', ');

  let message = `# 💻 PC Information

**Username:** \`${randomUsername}\`
**Hostname:** \`${randomHost}\`
**OS:** \`${randomOS}\`
**IP Address:** \`${randomIP}\`
**Location:** \`${randomLocation}\`
**HWID:** \`${hwid}\`
**RAM:** \`${randomRam}\`
**GPU:** \`${randomGPU}\`
**AV:** \`${randomAv}\`
**Uptime:** \`${uptimeHours}h\`
**Running:** \`${appsDisplay}\`
**Ping:** \`${ping} ms\`

---

## 🎮 Minecraft Information

**Username:** \`${randomMCUser}\`
**UUID:** \`${fakeUUID}\`
**Last Server:** \`${randomServer}\`
**Launcher:** \`${Math.random() > 0.5 ? 'PrismLauncher' : 'Vanilla'}\`
**Token:**
\`\`\`
${fakeToken}:${fakeUUID}
\`\`\`

---

## 💬 Discord Information

### Discord Account #1

**Username:** \`${randomMCUser}#${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}\`
**E-Mail:** \`${randomEmail}\`
**2FA Enabled:** ${Math.random() > 0.5 ? '✅ Yes' : '❌ No'}
**Phone:** \`${Math.random() > 0.5 ? '+1-555-' + Math.floor(Math.random() * 9000 + 1000) : 'None'}\`
**Nitro:** ${Math.random() > 0.5 ? '✅ Yes' : '❌ No'}
**Payment Methods:** ${Math.random() > 0.5 ? '✅ Yes' : '❌ No'}
**Billing Country:** \`${pick(['US', 'DE', 'FR', 'FI', 'GB'])}\`
**Token:**
\`\`\`
${fakeDiscordToken}
\`\`\``;

  return message;
}

function sendFakeData() {
  const message = generateFakeData();
  const url = new URL(TARGET_URL);
  
  const options = {
    hostname: url.hostname,
    port: url.port || 80,
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'text/markdown; charset=UTF-8',
      'Markdown': 'yes',
      'Title': 'Data Collection Report',
      'Priority': 'default',
      'Content-Length': Buffer.byteLength(message)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`[${new Date().toISOString()}] Response Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('✅ Fake data sent successfully');
      } else {
        console.log('❌ Failed to send fake data');
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error sending fake data:', error.message);
  });

  req.write(message);
  req.end();
}

console.log('🚀 Starting fake data flood...');
console.log(`📡 Target: ${TARGET_URL}`);
console.log(`⏱️  Interval: ${SEND_INTERVAL}ms`);
console.log(`📊 Total sends: ${TOTAL_SENDS}`);
console.log('---');

let sendCount = 0;

sendFakeData();
sendCount++;

const interval = setInterval(() => {
  if (sendCount >= TOTAL_SENDS) {
    clearInterval(interval);
    console.log('---');
    console.log(`✅ Completed! Sent ${TOTAL_SENDS} fake reports.`);
    return;
  }
  
  sendFakeData();
  sendCount++;
}, SEND_INTERVAL);

process.on('SIGINT', () => {
  console.log('\n⚠️  Interrupted! Stopping...');
  clearInterval(interval);
  process.exit(0);
});