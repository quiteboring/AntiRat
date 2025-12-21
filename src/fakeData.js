import http from 'http';
import crypto from 'crypto';

const TARGET_URL = 'http://172.237.133.172:8080/hits';
const SEND_INTERVAL = 5000;
const TOTAL_SENDS = 10000000;

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

function generateEmail() {
  const firstNames = ['james', 'michael', 'robert', 'john', 'david', 'william', 'richard', 'joseph', 'thomas', 'christopher', 'daniel', 'matthew', 'anthony', 'mark', 'donald', 'steven', 'andrew', 'paul', 'joshua', 'kenneth', 'kevin', 'brian', 'george', 'timothy', 'ronald', 'edward', 'jason', 'jeffrey', 'ryan', 'jacob', 'mary', 'patricia', 'jennifer', 'linda', 'barbara', 'elizabeth', 'susan', 'jessica', 'sarah', 'karen', 'lisa', 'nancy', 'betty', 'margaret', 'sandra', 'ashley', 'kimberly', 'emily', 'donna', 'michelle', 'carol', 'amanda', 'melissa', 'deborah', 'stephanie', 'dorothy', 'rebecca', 'sharon', 'laura', 'cynthia'];
  const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis', 'rodriguez', 'martinez', 'hernandez', 'lopez', 'gonzalez', 'wilson', 'anderson', 'thomas', 'taylor', 'moore', 'jackson', 'martin', 'lee', 'thompson', 'white', 'harris', 'clark', 'lewis', 'robinson', 'walker', 'young', 'allen', 'king', 'wright', 'scott', 'torres', 'nguyen', 'hill', 'flores', 'green', 'adams', 'nelson', 'baker', 'hall', 'rivera', 'campbell', 'mitchell', 'carter', 'roberts'];
  
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  
  const patterns = [
    () => `${firstName}.${lastName}`,
    () => `${firstName}_${lastName}`,
    () => `${firstName}${lastName}`,
    () => `${firstName}${lastName}${randomInt(1, 999)}`,
    () => `${firstName}.${lastName}${randomInt(1, 99)}`,
    () => `${firstName[0]}${lastName}`,
    () => `${firstName}${lastName[0]}${randomInt(1, 999)}`,
    () => `${firstName}_${lastName}${randomInt(1, 99)}`
  ];
  
  const email = pick(patterns)();
  return `${email}@outlook.com`;
}

function generateMinecraftSessionToken() {
  return crypto.randomBytes(16).toString('hex') + crypto.randomBytes(16).toString('hex');
}

function generateMinecraftUsername() {
  const adjectives = ['Cool', 'Epic', 'Dark', 'Shadow', 'Night', 'Fire', 'Ice', 'Thunder', 'Storm', 'Dragon', 'Wolf', 'Phantom', 'Ghost', 'Silent', 'Swift', 'Fierce', 'Bold', 'Mystic', 'Cyber', 'Neon', 'Toxic', 'Frost', 'Blaze', 'Nova', 'Apex'];
  const nouns = ['Gamer', 'Warrior', 'Hunter', 'Knight', 'Master', 'Legend', 'King', 'Slayer', 'Ninja', 'Assassin', 'Reaper', 'Demon', 'Angel', 'Striker', 'Ranger', 'Sniper', 'Raider', 'Phantom', 'Viper', 'Beast'];
  const names = ['Alex', 'Steve', 'Tyler', 'Jake', 'Ryan', 'Kyle', 'Blake', 'Chase', 'Cole', 'Luke', 'Max', 'Sam', 'Zack', 'Nick', 'Jack', 'Mason', 'Logan', 'Ethan', 'Noah', 'Liam', 'Owen', 'Kai', 'Dean', 'Ian', 'Leo'];
  
  const patterns = [
    () => `${pick(adjectives)}${pick(nouns)}`,
    () => `${pick(adjectives)}${pick(nouns)}${randomInt(1, 999)}`,
    () => `${pick(names)}${randomInt(100, 9999)}`,
    () => `${pick(names)}_${pick(adjectives)}`,
    () => `${pick(adjectives)}_${pick(names)}`,
    () => `xX_${pick(names)}_Xx`,
    () => `${pick(nouns)}${pick(names)}`,
    () => `${pick(names)}The${pick(nouns)}`,
    () => `I${pick(adjectives)}${pick(nouns)}I`,
    () => `${pick(adjectives)}${randomInt(100, 999)}`
  ];
  
  return pick(patterns)().toLowerCase();
}

function generateFakeData() {
  const fakeUsernames = [
    'michael.roberts',
    'sarah_chen',
    'jdavis2001',
    'emily.martinez',
    'chris_anderson',
    'alexthompson',
    'rachel.kim',
    'davidwilson92',
    'jessica_nguyen',
    'brandon.lee'
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
  const fakeServers = ['mc.hypixel.net', 'play.cubecraft.net', 'play.pvplegacy.net', 'play.blocksmc.com'];
  const fakeGPUs = ['RTX 4070 Ti SUPER', 'RTX 3080', 'RX 6800 XT', 'Arc A770', 'GTX 1660 Super'];
  const fakeRAM = ['8 GB', '16 GB', '32 GB', '64 GB'];
  const fakeAV = ['Defender', 'Kaspersky', 'Bitdefender', 'None (yikes)'];
  const runningApps = ['Discord.exe', 'chrome.exe (27 tabs)', 'Spotify.exe', 'MinecraftLauncher.exe', 'Steam.exe'];

  const randomUsername = pick(fakeUsernames);
  const randomHost = pick(fakeHosts);
  const randomOS = pick(fakeOS);
  const randomIP = pick(fakeIPs);
  const randomLocation = pick(fakeLocations);
  const randomMCUser = generateMinecraftUsername();
  const randomEmail = generateEmail();
  const randomGPU = pick(fakeGPUs);
  const randomRam = pick(fakeRAM);
  const randomAv = pick(fakeAV);
  const randomServer = pick(fakeServers);

  const fakeUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  const fakeSessionToken = generateMinecraftSessionToken();
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
**Session Token:**
\`\`\`
${fakeSessionToken}
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
  sendFakeData();
  sendCount++;
  
  if (sendCount % 100 === 0) {
    console.log(`📊 Sent ${sendCount} fake reports so far...`);
  }
}, SEND_INTERVAL);

process.on('SIGINT', () => {
  console.log('\n⚠️  Interrupted! Stopping...');
  clearInterval(interval);
  process.exit(0);
});