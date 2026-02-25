const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://pyouvhaxtzzztkrtoksu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5b3V2aGF4dHp6enRrcnRva3N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDY3MTYsImV4cCI6MjA4NzUyMjcxNn0.O6RZy7kfXGjN0o2GUkXPkVxzRoHmUkQexHzpvLQJrF8'
);

async function testUpload() {
  console.log('テスト開始...');

  // ダミー画像データ（1KB）
  const dummyData = Buffer.from('test'.repeat(256));

  const timestamp = Date.now();
  const path = `test/${timestamp}-test.jpg`;

  console.log('アップロード中:', path);

  const { data, error } = await supabase.storage
    .from('nail-images')
    .upload(path, dummyData, {
      contentType: 'image/jpeg',
      upsert: false
    });

  if (error) {
    console.error('❌ エラー:');
    console.error('  message:', error.message);
    console.error('  statusCode:', error.statusCode);
    console.error('  full:', JSON.stringify(error, null, 2));
  } else {
    console.log('✅ 成功!');
    console.log('  data:', data);

    const { data: urlData } = supabase.storage
      .from('nail-images')
      .getPublicUrl(path);
    console.log('  URL:', urlData.publicUrl);
  }
}

testUpload();
