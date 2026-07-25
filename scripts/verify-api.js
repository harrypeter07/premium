// Automated Verification Script for Media & Collections APIs

async function verify() {
  console.log('=== VERIFYING MEDIA & COLLECTIONS APIs ===');

  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || 'private_QEH6sevZJ316f5zVNCz8HGcWY8k=';
    const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');

    const res = await fetch('https://api.imagekit.io/v1/files?limit=100', {
      headers: { Authorization: authHeader }
    });

    if (!res.ok) {
      console.error('❌ ImageKit API Error:', res.status, res.statusText);
      process.exit(1);
    }

    const files = await res.json();
    console.log(`✅ ImageKit API connected successfully! ${files.length} uploaded files retrieved.`);

    files.forEach((f, i) => {
      console.log(`  [${i + 1}] Name: ${f.name} | Type: ${f.fileType} | FileId: ${f.fileId}`);
      console.log(`      URL: ${f.url}`);
    });

    console.log('\n=== VERIFICATION CLEAN PASS ===');
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  }
}

verify();
